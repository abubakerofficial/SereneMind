import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const iconSvg = fs.readFileSync('public/icon.svg');
const iconMaskableSvg = fs.readFileSync('public/icon-maskable.svg');

async function generate() {
  await sharp(iconSvg)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');

  await sharp(iconSvg)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');

  await sharp(iconMaskableSvg)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-maskable-512x512.png');

  await sharp(iconSvg)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');

  await sharp(iconSvg)
    .resize(64, 64)
    .png()
    .toFile('public/favicon.ico');

  console.log('PWA PNG and favicon assets generated successfully!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
