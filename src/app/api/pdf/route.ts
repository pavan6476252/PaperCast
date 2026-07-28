import { getBrowser } from '@/libs/getBrowser';
import { NextResponse } from 'next/server';
import type { PaperFormat } from 'puppeteer-core';

export const runtime = 'nodejs';   // must NOT be 'edge'
export const maxDuration = 60;     // Vercel default is 10s on Hobby — PDF gen often needs more

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const jsonString = typeof body === 'string' ? body : JSON.stringify(body);

    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.evaluateOnNewDocument((data) => {
      (window as any).__PRINT_DATA__ = data;
    }, jsonString);

    const url = new URL(req.url);
    // Vercel/proxies might route internally via http, force https in production
    const isLocal = url.host.includes('localhost') || url.host.includes('127.0.0.1');
    const protocol = isLocal ? url.protocol : 'https:';
    const printUrl = `${protocol}//${url.host}/print`;

    console.log(`Generating PDF. Navigation target: ${printUrl}`);

    await page.goto(printUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForSelector('.print-page', { timeout: 15000 });

    const parsed = JSON.parse(jsonString);
    const pageSize = parsed.meta?.pageSize;
    const format = typeof pageSize === 'string' && pageSize !== 'custom'
      ? (pageSize as PaperFormat)
      : undefined;
    const landscape = parsed.meta?.orientation === 'landscape';

    const pdf = await page.pdf({ printBackground: true, format: format ?? 'A4', landscape });
    await browser.close();

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF in API route:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: errorMessage, stack: errorStack },
      { status: 500 }
    );
  }
}