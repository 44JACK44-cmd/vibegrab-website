/**
 * Genera los recursos de marca derivados: imagen Open Graph y favicons PNG.
 *
 * Se ejecuta a mano (`npm run assets`) cuando cambia el logotipo o el texto
 * de la portada. Los PNG resultantes se versionan en el repositorio, así que
 * el despliegue no depende de este script.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const publicDir = resolve(root, 'public');

const logoSource = resolve(publicDir, 'brand/vibegrab-logo-source.png');
const logoPath = resolve(publicDir, 'brand/vibegrab-logo.png');

/* El logotipo original trae esquinas blancas: se recorta en círculo para
   que se integre en cualquier fondo. */
const sourceMeta = await sharp(logoSource).metadata();
const sourceWidth = sourceMeta.width ?? 424;
const sourceHeight = sourceMeta.height ?? 429;
const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sourceWidth}" height="${sourceHeight}"><circle cx="${sourceWidth / 2}" cy="${sourceHeight / 2}" r="${Math.min(sourceWidth, sourceHeight) / 2}" fill="#ffffff"/></svg>`;

await sharp(logoSource)
  .ensureAlpha()
  .composite([{ input: Buffer.from(maskSvg, 'utf8'), blend: 'dest-in' }])
  .png({ compressionLevel: 9 })
  .toFile(logoPath);

const logo = readFileSync(logoPath);
const logoB64 = logo.toString('base64');

const SANS = "'Segoe UI Semibold', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const SANS_REGULAR = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const MONO = "'Cascadia Mono', Consolas, 'DejaVu Sans Mono', monospace";

/* ----------------------------------------------------------- Open Graph */
function makeOgSvg({ tagline, badge, footer, footerLeft, footerRight }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="50%" cy="0%" r="70%">
      <stop offset="0%" stop-color="#3EC5F2" stop-opacity="0.28"/>
      <stop offset="60%" stop-color="#3EC5F2" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#3EC5F2" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="vgrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E9EFF7"/>
      <stop offset="100%" stop-color="#B9C7D8"/>
    </linearGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0H0V64" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <mask id="gridmask">
      <rect width="1200" height="630" fill="url(#fade)"/>
    </mask>
  </defs>

  <rect width="1200" height="630" fill="#05070B"/>
  <rect width="1200" height="630" fill="url(#grid)" mask="url(#gridmask)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Logotipo real -->
  <image href="data:image/png;base64,${logoB64}" x="86" y="196" width="210" height="212"/>
  <circle cx="191" cy="302" r="112" fill="none" stroke="#3EC5F2" stroke-opacity="0.22" stroke-width="1"/>

  <text x="344" y="292" font-family="${SANS}" font-size="92" font-weight="600" fill="url(#vgrad)" letter-spacing="-3">VibeGrab</text>
  <text x="348" y="348" font-family="${SANS_REGULAR}" font-size="31" fill="#3EC5F2" font-style="italic">${tagline}</text>

  <rect x="344" y="392" width="470" height="46" rx="23" fill="#3EC5F2" fill-opacity="0.12" stroke="#3EC5F2" stroke-opacity="0.35"/>
  <text x="372" y="423" font-family="${SANS_REGULAR}" font-size="20" font-weight="600" fill="#6FD4F6">${badge}</text>

  <text x="348" y="500" font-family="${SANS_REGULAR}" font-size="21" fill="#8D9CB0">${footer}</text>

  <!-- Detalle inferior -->
  <line x1="86" y1="560" x2="1114" y2="560" stroke="#ffffff" stroke-opacity="0.09"/>
  <text x="86" y="596" font-family="${MONO}" font-size="18" fill="#5D6B7C">${footerLeft}</text>
  <text x="1114" y="596" text-anchor="end" font-family="${MONO}" font-size="18" fill="#5D6B7C">${footerRight}</text>
</svg>`;
}

const ogImages = [
  {
    file: 'og-image.png',
    svg: makeOgSvg({
      tagline: 'Tu contenido. Tu experiencia multimedia.',
      badge: 'App oficial para Android · Descarga directa',
      footer: 'Descarga · Reproduce · Organiza',
      footerLeft: 'VibeGrab para Android',
      footerRight: 'APK oficial · Descarga directa',
    }),
  },
  {
    file: 'og-image-en.png',
    svg: makeOgSvg({
      tagline: 'Your content. Your media experience.',
      badge: 'Official Android app · Direct download',
      footer: 'Download · Play · Organize',
      footerLeft: 'VibeGrab for Android',
      footerRight: 'Official APK · Direct download',
    }),
  },
];

/* --------------------------------------------------------------- Favicon */
const markSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="m" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7FDBFA"/>
      <stop offset="100%" stop-color="#1FA3DC"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="116" fill="#05070B"/>
  <circle cx="256" cy="256" r="196" fill="none" stroke="#3EC5F2" stroke-opacity="0.18" stroke-width="6"/>
  <path d="M158 186 L256 348 L354 186" fill="none" stroke="url(#m)" stroke-width="54" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="256" cy="392" r="16" fill="#3EC5F2"/>
</svg>`;

mkdirSync(publicDir, { recursive: true });

writeFileSync(resolve(publicDir, 'favicon.svg'), markSvg, 'utf8');

for (const image of ogImages) {
  await sharp(Buffer.from(image.svg, 'utf8'))
    .png({ compressionLevel: 9 })
    .toFile(resolve(publicDir, image.file));
}

for (const size of [32, 48, 180, 192, 512]) {
  const name =
    size === 180 ? 'apple-touch-icon.png' : size === 32 ? 'favicon-32.png' : `icon-${size}.png`;
  await sharp(Buffer.from(markSvg, 'utf8'))
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(resolve(publicDir, name));
}

console.log(
  'Recursos generados: favicon.svg, og-image.png, og-image-en.png, favicon-32.png, apple-touch-icon.png e icon-*.png',
);
