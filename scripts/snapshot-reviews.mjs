/**
 * Genera `src/data/reviews-snapshot.json` a partir de los issues públicos.
 *
 * Ese archivo es el respaldo que usan la web cuando la API de GitHub no
 * responde (límite de peticiones, red, token caducado…): así la sección de
 * comunidad nunca aparece vacía por un fallo puntual.
 *
 * Uso local:
 *   node scripts/snapshot-reviews.mjs
 *
 * En GitHub Actions se ejecuta a diario; el token lo pone el propio workflow.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = process.env.REVIEWS_REPO || '44JACK44-cmd/vibegrab-website';
const OUTPUT = join(root, 'src', 'data', 'reviews-snapshot.json');

const MARKER = /<!--\s*vibegrab-review\s*(\{[^>]*?\})\s*-->/i;
const MIN = 20;
const MAX = 800;
const ALIAS_MAX = 40;

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN.trim();
  try {
    const vars = readFileSync(join(root, '.dev.vars'), 'utf8');
    const line = vars.split(/\r?\n/).find((l) => l.trim().startsWith('GITHUB_TOKEN='));
    return line ? line.slice(line.indexOf('=') + 1).trim() : '';
  } catch {
    return '';
  }
}

function parseIssue(issue) {
  if (!issue || typeof issue !== 'object' || issue.pull_request) return null;

  const body = typeof issue.body === 'string' ? issue.body : '';
  const match = MARKER.exec(body);
  if (!match) return null;

  let marker;
  try {
    marker = JSON.parse(match[1]);
  } catch {
    return null;
  }

  const rating = Number(marker.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return null;

  const text = body.replace(match[0], '').trim();
  if (text.length < MIN || text.length > MAX) return null;

  const version =
    typeof marker.version === 'string' && /^v?\d+\.\d+\.\d+/.test(marker.version)
      ? marker.version.replace(/^v/, '')
      : undefined;

  const login = typeof issue.user?.login === 'string' ? issue.user.login : '';
  const alias =
    typeof marker.alias === 'string' && marker.alias.trim() !== ''
      ? marker.alias.trim().slice(0, ALIAS_MAX)
      : '';
  const fromForm = marker.via === 'form';

  return {
    id: `gh-${issue.id ?? issue.number}`,
    number: Number(issue.number) || 0,
    author: alias || (fromForm ? '' : login),
    authorUrl: !fromForm && typeof issue.user?.html_url === 'string' ? issue.user.html_url : '',
    verified: !fromForm && Boolean(login),
    date: typeof issue.created_at === 'string' ? issue.created_at : '',
    rating,
    version,
    lang: marker.lang === 'en' ? 'en' : 'es',
    text,
    source: 'GitHub',
    sourceUrl: typeof issue.html_url === 'string' ? issue.html_url : '',
  };
}

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'VibeGrab-Website-Snapshot',
};
const auth = token();
if (auth) headers.Authorization = `Bearer ${auth}`;

const response = await fetch(
  `https://api.github.com/repos/${REPO}/issues?state=open&per_page=100`,
  { headers },
);

if (!response.ok) {
  console.error(`GitHub respondió ${response.status}; no se toca el snapshot.`);
  process.exit(1);
}

const issues = await response.json();
const reviews = (Array.isArray(issues) ? issues : [])
  .map(parseIssue)
  .filter(Boolean)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

writeFileSync(
  OUTPUT,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), repo: REPO, reviews }, null, 2)}\n`,
  'utf8',
);

console.log(`Snapshot escrito: ${reviews.length} opinion(es) en ${OUTPUT}`);
