#!/usr/bin/env node
//
// Turn the second campaign drop (WhatsApp JPEGs, ~110-320 KB) into web-ready
// responsive assets — same pipeline as scripts/build-brand-assets.sh, but via
// sharp so it runs on the Windows box without ffmpeg.
//
//   BlessedStreetsResource/campaign-flatlay.jpg
//     → public/brand/campaign-flatlay-640.webp
//     → public/brand/campaign-flatlay-1080.webp
//     → public/brand/campaign-flatlay-1600.webp
//     → public/brand/campaign-flatlay-blur.webp   (24 px LQIP placeholder)
//
// Requires: sharp (devDependency).
// Run from the shop root:  node scripts/optimize-campaign.mjs

import { readdir, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'BlessedStreetsResource';
const OUT = 'public/brand';
const WIDTHS = [640, 1080, 1600];
const QUALITY = 80; // libwebp: visually lossless for this shoot
const BLUR_WIDTH = 24; // tiny blurred placeholder so the layout never jumps

// Original → Motiv. Derived from the contact sheet of the second shoot:
//   flatlay      Hoodie auf Perserteppich, Vinyl + Kassetten
//   recordstore  Model im Plattenladen
//   tunnel       zwei Models im Graffiti-Tunnel
//   trunk        zwei Models am Kofferraum, offener Himmel
const NAMES = [
  'campaign-flatlay',
  'campaign-recordstore',
  'campaign-tunnel',
  'campaign-trunk',
];

const kb = (bytes) => Math.round(bytes / 1024);

await mkdir(OUT, { recursive: true });

const files = await readdir(SRC);
let totalIn = 0;
let totalOut = 0;

for (const name of NAMES) {
  const file = files.find((f) => f.replace(/\.(jpe?g|png)$/i, '') === name);
  if (!file) {
    console.log(`  skip   ${name} (nicht gefunden in ${SRC}/)`);
    continue;
  }

  const src = path.join(SRC, file);
  const inKb = kb((await stat(src)).size);
  totalIn += inKb;
  let outKb = 0;

  for (const w of WIDTHS) {
    const dst = path.join(OUT, `${name}-${w}.webp`);
    const { size } = await sharp(src)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(dst);
    outKb += kb(size);
  }

  // Tiny blurred placeholder (LQIP).
  const { size: blurSize } = await sharp(src)
    .resize({ width: BLUR_WIDTH })
    .webp({ quality: 60 })
    .toFile(path.join(OUT, `${name}-blur.webp`));
  outKb += kb(blurSize);

  totalOut += outKb;
  console.log(`  ${name.padEnd(24)} ${String(inKb).padStart(5)} KB  →  ${String(outKb).padStart(4)} KB`);
}

console.log('');
console.log('  ------------------------------------------');
// Die WhatsApp-Quellen sind bereits komprimiert — über drei Breiten summiert
// kann das Gesamtvolumen wachsen; entscheidend ist die Größe pro Breite.
const delta = Math.round((totalOut * 100) / totalIn) - 100;
console.log(
  `  gesamt${' '.repeat(19)}${String(totalIn).padStart(5)} KB  →  ${String(totalOut).padStart(4)} KB   (${delta >= 0 ? '+' : ''}${delta}%)`,
);
