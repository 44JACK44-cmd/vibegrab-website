/**
 * Genera los derivados optimizados del logotipo.
 *
 * El original (`public/brand/vibegrab-logo.png`, 424×429) se usa como fuente
 * para las imágenes sociales. En la web, en cambio, el logotipo se muestra a
 * 26–62 px: cargar 48 KB para eso es un desperdicio en cada página.
 *
 * Este script crea las versiones que realmente se muestran:
 *
 *  · `vibegrab-logo-192.png`  — cabecera, pie y ficha de descarga (2x de 62 px).
 *  · `vibegrab-logo-192.webp` — lo mismo, con menos peso.
 *  · `vibegrab-logo-64.png`   — el icono pequeño del marco del teléfono.
 *
 *   node scripts/optimize-logo.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const brandDir = resolve(root, 'public/brand');
const source = resolve(brandDir, 'vibegrab-logo.png');

if (!existsSync(source)) {
  console.error('No se encuentra public/brand/vibegrab-logo.png');
  process.exit(1);
}

const targets = [
  { file: 'vibegrab-logo-192.png', size: 192, format: 'png' },
  { file: 'vibegrab-logo-192.webp', size: 192, format: 'webp' },
  { file: 'vibegrab-logo-64.png', size: 64, format: 'png' },
];

const originalSize = readFileSync(source).length;

for (const target of targets) {
  const destination = resolve(brandDir, target.file);
  const pipeline = sharp(source).resize(target.size, target.size, {
    fit: 'cover',
    position: 'center',
  });

  if (target.format === 'webp') {
    await pipeline.webp({ quality: 88, alphaQuality: 100 }).toFile(destination);
  } else {
    await pipeline.png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(destination);
  }

  const size = readFileSync(destination).length;
  console.log(
    `${target.file.padEnd(26)} ${target.size}×${target.size}  ${(size / 1024).toFixed(1)} KB`,
  );
}

console.log(
  `Original ${(originalSize / 1024).toFixed(1)} KB  ->  derivados listos en public/brand/`,
);
