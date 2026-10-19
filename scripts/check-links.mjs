/**
 * Comprobador de enlaces internos.
 *
 * Rastrea un conjunto de rutas públicas, extrae todos los enlaces y recursos
 * internos y verifica que ninguno devuelva un error. Se usa contra el servidor
 * de desarrollo (`npm run dev`) o contra un despliegue.
 *
 *   node scripts/check-links.mjs [http://127.0.0.1:4321]
 */
import process from 'node:process';

const base = (process.argv[2] ?? 'http://127.0.0.1:4321').replace(/\/+$/, '');

const ROUTES = [
  '/',
  '/en/',
  '/caracteristicas/',
  '/en/features/',
  '/descargar/',
  '/en/download/',
  '/versiones/',
  '/en/versions/',
  '/ayuda/',
  '/en/help/',
  '/sobre/',
  '/en/about/',
  '/contacto/',
  '/en/contact/',
  '/privacidad/',
  '/en/privacy/',
  '/terminos/',
  '/en/terms/',
];

/**
 * Rutas que solo existen en la compilación (las genera la integración de
 * sitemap de Astro al construir, no durante el desarrollo).
 */
const IGNORE = new Set(['/sitemap-index.xml']);

const HREF = /(?:href|src)="([^"]+)"/g;

function isInternal(url) {
  if (!url || url.startsWith('#')) return false;
  if (/^(mailto:|tel:|data:|javascript:)/i.test(url)) return false;
  if (/^https?:\/\//i.test(url)) return false;
  return true;
}

async function fetchText(path) {
  const response = await fetch(new URL(path, base), { redirect: 'follow' });
  return { status: response.status, body: await response.text() };
}

const found = new Map();
const failures = [];
const pageStatuses = [];

for (const route of ROUTES) {
  let status = 0;
  let body = '';
  try {
    const result = await fetchText(route);
    status = result.status;
    body = result.body;
  } catch (error) {
    failures.push({ url: route, reason: error.message });
    continue;
  }

  pageStatuses.push({ route, status });
  if (status >= 400) {
    failures.push({ url: route, reason: `HTTP ${status}` });
    continue;
  }

  for (const match of body.matchAll(HREF)) {
    const raw = match[1];
    if (!isInternal(raw)) continue;
    const clean = raw.split('#')[0].split('?')[0];
    if (!clean) continue;
    if (!found.has(clean)) found.set(clean, route);
  }
}

// Enlaces a secciones: el ancla se busca en la página a la que apunta el
// enlace (puede ser otra distinta de la actual).
const anchors = new Map();
for (const route of ROUTES) {
  const body = (await fetchText(route)).body;
  for (const match of body.matchAll(/href="([^"]*#[^"]+)"/g)) {
    const href = match[1];
    const [pathPart, target] = href.split('#');
    if (!target) continue;
    const page = pathPart === '' ? route : pathPart;
    anchors.set(`${page}::${target}`, true);
  }
}

const anchorErrors = [];
const bodies = new Map();
for (const key of anchors.keys()) {
  const [page, target] = key.split('::');
  if (!bodies.has(page)) {
    try {
      bodies.set(page, (await fetchText(page)).body);
    } catch {
      bodies.set(page, '');
    }
  }
  const body = bodies.get(page);
  if (!body.includes(`id="${target}"`)) {
    anchorErrors.push(`${page} -> #${target}`);
  }
}

for (const [link, from] of found) {
  if (IGNORE.has(link)) continue;
  try {
    const response = await fetch(new URL(link, base), { redirect: 'follow' });
    if (response.status >= 400) failures.push({ url: link, reason: `HTTP ${response.status}`, from });
  } catch (error) {
    failures.push({ url: link, reason: error.message, from });
  }
}

console.log(`Base: ${base}`);
console.log(`Páginas comprobadas: ${pageStatuses.length}`);
console.log(`Enlaces internos únicos: ${found.size}`);
console.log(`Anclas comprobadas: ${anchors.size}`);

const badPages = pageStatuses.filter((page) => page.status >= 400);
if (badPages.length > 0) {
  console.log('\nPáginas con error:');
  badPages.forEach((page) => console.log(`  ${page.route} -> ${page.status}`));
}

if (anchorErrors.length > 0) {
  console.log('\nAnclas inexistentes:');
  anchorErrors.forEach((entry) => console.log(`  ${entry}`));
}

if (failures.length > 0) {
  console.log('\nEnlaces rotos:');
  failures.forEach((failure) =>
    console.log(`  ${failure.url} (${failure.reason})${failure.from ? ` desde ${failure.from}` : ''}`),
  );
}

if (failures.length === 0 && anchorErrors.length === 0 && badPages.length === 0) {
  console.log('\nTodo correcto: sin enlaces rotos ni anclas rotas.');
  process.exit(0);
}

process.exit(1);
