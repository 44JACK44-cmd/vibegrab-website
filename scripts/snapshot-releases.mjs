/**
 * Genera el respaldo estático de publicaciones.
 *
 * Se ejecuta a mano antes de desplegar (`npm run snapshot`) o desde CI. Guarda
 * una copia mínima de las publicaciones de GitHub en
 * `src/data/releases.snapshot.json`, que la web usa como respaldo cuando la API
 * no está disponible (límite de peticiones, caída puntual...).
 *
 * No usa credenciales obligatorias: si existe `GITHUB_TOKEN` sube el límite.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const target = resolve(root, 'src/data/releases.snapshot.json');

/** Lee `.env` sin dependencias externas. */
function loadDotEnv() {
  const out = {};
  for (const file of ['.env', '.env.local']) {
    let content;
    try {
      content = readFileSync(resolve(root, file), 'utf8');
    } catch {
      continue;
    }
    for (const line of content.split(/\r?\n/)) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (!match) continue;
      const value = match[2].replace(/^["']|["']$/g, '').trim();
      if (value) out[match[1]] = value;
    }
  }
  return out;
}

const dotenv = loadDotEnv();
const repo = process.env.GITHUB_REPO || dotenv.GITHUB_REPO || '44JACK44-cmd/vibeGrab';
const token = process.env.GITHUB_TOKEN || dotenv.GITHUB_TOKEN || '';

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'VibeGrab-Website-Snapshot',
};
if (token) headers.Authorization = `Bearer ${token}`;

const url = `https://api.github.com/repos/${repo}/releases?per_page=100`;
console.log(`Descargando publicaciones de ${repo}...${token ? '' : ' (sin token)'}`);

const response = await fetch(url, { headers });
if (!response.ok) {
  console.error(`La API de GitHub respondió ${response.status}. No se actualiza el snapshot.`);
  process.exit(1);
}

const data = await response.json();
if (!Array.isArray(data)) {
  console.error('Respuesta inesperada de la API de GitHub.');
  process.exit(1);
}

/** Solo se guarda lo que la web utiliza. */
const releases = data.map((release) => ({
  tag_name: release.tag_name,
  name: release.name,
  body: release.body ?? '',
  draft: Boolean(release.draft),
  prerelease: Boolean(release.prerelease),
  published_at: release.published_at,
  created_at: release.created_at,
  html_url: release.html_url,
  assets: (release.assets ?? []).map((asset) => ({
    name: asset.name,
    size: asset.size,
    digest: asset.digest ?? null,
    browser_download_url: asset.browser_download_url,
    download_count: asset.download_count ?? 0,
  })),
}));

const output = {
  fetchedAt: new Date().toISOString(),
  repo,
  releases,
};

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

const withApk = releases.filter((release) => release.assets.some((a) => a.name?.endsWith('.apk'))).length;
console.log(`Guardadas ${releases.length} publicaciones (${withApk} con APK) en src/data/releases.snapshot.json`);
