// lib/getBrowser.ts
import type { Browser } from 'puppeteer-core';

export async function getBrowser(): Promise<Browser> {
  const isProd = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

  if (isProd) {
    const chromium = (await import('@sparticuz/chromium')).default;
    const puppeteer = await import('puppeteer-core');

    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    }) as unknown as Browser;
  } else {
    // Local dev: use full puppeteer with its own bundled Chromium
    const puppeteer = await import('puppeteer');
    return puppeteer.launch({
      headless: true,
    }) as unknown as Browser;
  }
}