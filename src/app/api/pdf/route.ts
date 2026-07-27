import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const jsonString = typeof body === 'string' ? body : JSON.stringify(body);
    
    // Launch puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Evaluate on new document to inject data before React loads
    await page.evaluateOnNewDocument((data) => {
      (window as any).__PRINT_DATA__ = data;
    }, jsonString);

    // Get the base URL from the request
    const url = new URL(req.url);
    const printUrl = `${url.protocol}//${url.host}/print`;

    await page.goto(printUrl, { waitUntil: 'networkidle0' });

    // Wait for the container to render
    await page.waitForSelector('.print-page', { timeout: 10000 });
    
    // Get PDF size from the JSON meta if possible, or default to A4
    const parsed = JSON.parse(jsonString);
    let format = parsed.meta?.pageSize || 'A4';
    let landscape = parsed.meta?.orientation === 'landscape';

    const pdf = await page.pdf({
      printBackground: true,
      format: typeof format === 'string' && format !== 'custom' ? format : 'A4',
      landscape: landscape
    });

    await browser.close();

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"'
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
