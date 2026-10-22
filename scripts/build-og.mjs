/**
 * Genera public/og.jpg (imagen para compartir) y public/apple-touch-icon.png.
 * Requiere Playwright con Chromium (no es dependencia del proyecto):
 *   npm i --no-save playwright && npx playwright install chromium
 *   node scripts/build-og.mjs
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(path.join(root, 'images/brand/og.html')).href);
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ type: 'png' });
await browser.close();
await sharp(png).jpeg({ quality: 85, mozjpeg: true }).toFile(path.join(root, 'public/og.jpg'));

await sharp(path.join(root, 'public/favicon.svg'), { density: 600 })
  .resize(180, 180)
  .png()
  .toFile(path.join(root, 'public/apple-touch-icon.png'));
console.log('✓ og.jpg y apple-touch-icon.png');
