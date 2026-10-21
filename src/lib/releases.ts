/**
 * Integración con GitHub Releases.
 *
 * Fuente de datos: API pública de GitHub. Se usa para la ficha de descarga y
 * el historial de versiones, de modo que la web se actualiza sola al publicar
 * una versión nueva, sin tocar el código.
 *
 * Reglas que implementa este módulo:
 *  1. La versión estable es la publicación **más reciente por fecha** que no
 *     sea borrador ni preliminar y que **tenga un APK adjunto**. Nunca se elige
 *     por tener el número más alto.
 *  2. Una publicación sin APK jamás se ofrece como descargable.
 *  3. Caché en memoria con caducidad + respaldo estático (snapshot). Si GitHub
 *     falla, se sirve la última información válida y se indica de cuándo es.
 *  4. El token de GitHub (si existe) se usa solo en el servidor.
 */
import rawSnapshot from '@/data/releases.snapshot.json';
import { curatedNotes } from '@/content/curated-notes';
import { siteConfig } from '@/config/site';
import { serverEnv, serverEnvNumber } from '@/lib/env';
import { normalizeHash } from '@/lib/format';

/* ------------------------------------------------------------------ Tipos */

export type NoteCategory =
  | 'features'
  | 'improvements'
  | 'fixes'
  | 'stability'
  | 'important'
  | 'changes';

export interface LocalizedText {
  es: string;
  en: string;
}

export interface NoteItem {
  text: LocalizedText;
  detail?: LocalizedText;
}

export interface NoteSection {
  category: NoteCategory;
  items: NoteItem[];
  /**
   * Idioma de la sección, cuando la publicación separa el texto español y el
   * inglés con marcas `<!-- es -->` / `<!-- en -->`. Si no hay marcas, la
   * sección vale para los dos idiomas.
   */
  lang?: 'es' | 'en';
}

export interface ApkAsset {
  name: string;
  sizeBytes: number;
  sha256: string | null;
  downloadUrl: string;
  downloadCount: number;
}

export interface Release {
  tag: string;
  version: string;
  build: number | null;
  title: string;
  publishedAt: string;
  prerelease: boolean;
  draft: boolean;
  htmlUrl: string;
  apk: ApkAsset | null;
  notes: NoteSection[];
  notesSource: 'curated' | 'release-notes';
  rawBody: string;
  isLatestStable: boolean;
  /** Tiene un número mayor que la estable actual pero se publicó antes. */
  higherSemverThanStable: boolean;
}

export interface ReleasesPayload {
  ok: boolean;
  stale: boolean;
  source: 'releases' | 'cache' | 'snapshot';
  fetchedAt: string;
  lastSuccessfulAt: string | null;
  latest: Release | null;
  releases: Release[];
  error?: string;
}

interface RawAsset {
  name?: string;
  size?: number;
  digest?: string | null;
  browser_download_url?: string;
  download_count?: number;
  /** GitHub marca como `uploaded` los archivos ya disponibles. */
  state?: string;
}

interface RawRelease {
  tag_name?: string;
  name?: string | null;
  body?: string | null;
  draft?: boolean;
  prerelease?: boolean;
  published_at?: string | null;
  created_at?: string | null;
  html_url?: string;
  assets?: RawAsset[];
}

interface Snapshot {
  fetchedAt: string;
  releases: RawRelease[];
}

const snapshot = rawSnapshot as unknown as Snapshot;

/* --------------------------------------------------------------- Utilidades */

const TAG_PATTERN = /^v(\d+)\.(\d+)\.(\d+)(?:\.(\d+))?-(\d+)$/;

/**
 * Comprueba que un enlace es realmente un asset de una release del repositorio
 * configurado, para que la web nunca descargue desde un dominio o ruta ajenos
 * aunque la API devolviera un dato manipulado.
 */
export function isRepoAssetUrl(candidate: string, repo: string = siteConfig.repo): boolean {
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:') return false;
  if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') return false;
  const prefix = `/${repo.toLowerCase()}/releases/download/`;
  return url.pathname.toLowerCase().startsWith(prefix) && url.pathname.length > prefix.length;
}

/** Una release solo se puede descargar si está publicada y tiene APK válido. */
export function isDownloadable(release: Release): boolean {
  return !release.draft && release.apk !== null && isRepoAssetUrl(release.apk.downloadUrl);
}


/** Acepta `vX.Y.Z-B` y, por compatibilidad, `vX.Y.Z.P-B`. */
export function parseTag(tag: string): { version: string; build: number } | null {
  const match = TAG_PATTERN.exec(tag.trim());
  if (!match) return null;
  const patch = match[4] ? `.${match[4]}` : '';
  return {
    version: `${match[1]}.${match[2]}.${match[3]}${patch}`,
    build: Number(match[5]),
  };
}

function semverParts(version: string): number[] {
  return version.split('.').map((part) => Number.parseInt(part, 10) || 0);
}

/** -1 si `a` < `b`, 0 si son iguales, 1 si `a` > `b`. */
export function compareVersions(a: string, b: string): number {
  const left = semverParts(a);
  const right = semverParts(b);
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i += 1) {
    const x = left[i] ?? 0;
    const y = right[i] ?? 0;
    if (x !== y) return x > y ? 1 : -1;
  }
  return 0;
}

function parseTimestamp(value: string | null | undefined): number {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

/** Cabeceras de caché para las respuestas que dependen de releases. */
export function releasesCacheHeaders(seconds = 900): Record<string, string> {
  return {
    'Cache-Control': `public, max-age=0, s-maxage=${seconds}, stale-while-revalidate=86400, stale-if-error=604800`,
  };
}

/**
 * Versión sin los datos internos del repositorio: ni enlace a la publicación
 * ni URL directa del archivo. Es lo que se publica en la API: la web no expone
 * sus repositorios. Para descargar, el usuario pasa por `/api/download`.
 */
export function toPublicRelease(release: Release) {
  const { htmlUrl, rawBody, apk, ...rest } = release;
  return {
    ...rest,
    apk: apk
      ? {
          name: apk.name,
          sizeBytes: apk.sizeBytes,
          sha256: apk.sha256,
          downloadCount: apk.downloadCount,
        }
      : null,
  };
}

/* ------------------------------------------------------- Notas de la versión */

const CATEGORY_KEYWORDS: Array<[NoteCategory, RegExp]> = [
  ['important', /importante|important|atenci[oó]n|aviso|antes de (instalar|actualizar)/i],
  ['features', /nuevas?\s+funciones?|novedades|new\s+features?|a[nñ]adido|nuevo\b|features?/i],
  ['improvements', /mejoras?|improvements?|optimiza|rendimiento/i],
  ['fixes', /correcciones?|arreglos?|fix(es)?\b|solucionado|error(es)?\s+corregidos?/i],
  ['stability', /estabilidad|stability|robustez|fiabilidad/i],
];

function classifyHeading(text: string): NoteCategory | null {
  for (const [category, pattern] of CATEGORY_KEYWORDS) {
    if (pattern.test(text)) return category;
  }
  return null;
}

function stripMarkdownHeading(line: string): { heading: string; recognized: boolean } | null {
  const trimmed = line.trim();

  const hash = /^(#{1,6})\s+(.*)$/.exec(trimmed);
  if (hash) {
    const heading = hash[2].replace(/\*\*/g, '').replace(/:$/, '').trim();
    return { heading, recognized: classifyHeading(heading) !== null };
  }

  const bold = /^\*\*(.+?)\*\*:?$/.exec(trimmed);
  if (bold) {
    const heading = bold[1].replace(/:$/, '').trim();
    return { heading, recognized: classifyHeading(heading) !== null };
  }

  return null;
}

function cleanupInline(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^\s*[-*+]\s+/, '')
    .replace(/\s+$/, '')
    .trim();
}

/**
 * Convierte el cuerpo Markdown de una publicación en secciones con categoría.
 * El texto se conserva tal cual (solo se quitan viñetas y separadores).
 *
 * Las publicaciones del proyecto pueden traer el texto en dos idiomas
 * separados por las marcas `<!-- es -->` y `<!-- en -->`. En ese caso cada
 * sección queda etiquetada con su idioma y la web muestra solo el que
 * corresponde a la página.
 */
export function parseReleaseNotes(body: string | null | undefined): {
  sections: NoteSection[];
  structured: boolean;
} {
  const text = (body ?? '').replace(/\r\n/g, '\n').trim();
  if (!text) return { sections: [], structured: false };

  const sections: NoteSection[] = [];
  let current: NoteSection | null = null;
  let sawRecognizedHeading = false;
  let currentLang: 'es' | 'en' | undefined;

  const pushItem = (raw: string) => {
    const item = cleanupInline(raw);
    if (!item || /^-{3,}$/.test(item)) return;
    if (!current) {
      current = { category: 'changes', items: [], lang: currentLang };
      sections.push(current);
    }
    current.items.push({ text: { es: item, en: item } });
  };

  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || /^-{3,}$/.test(trimmed)) continue;

    // Marca de idioma: `<!-- es -->` o `<!-- en -->`.
    const langMarker = /^<!--\s*(es|en)\s*-->$/i.exec(trimmed);
    if (langMarker) {
      currentLang = langMarker[1].toLowerCase() as 'es' | 'en';
      continue;
    }

    const heading = stripMarkdownHeading(trimmed);
    if (heading) {
      const category = classifyHeading(heading.heading) ?? 'changes';
      if (category !== 'changes') sawRecognizedHeading = true;
      current = { category, items: [], lang: currentLang };
      sections.push(current);
      continue;
    }

    pushItem(trimmed);
  }

  const cleaned = sections.filter((section) => section.items.length > 0);
  return { sections: cleaned, structured: sawRecognizedHeading };
}

/* ------------------------------------------------------------- Normalización */

/** El enlace debe apuntar a los assets de esta etiqueta concreta. */
function isAssetOfTag(candidate: string, tag: string): boolean {
  try {
    const url = new URL(candidate);
    const prefix = `/${siteConfig.repo.toLowerCase()}/releases/download/${tag.toLowerCase()}/`;
    return url.pathname.toLowerCase().startsWith(prefix) && url.pathname.length > prefix.length;
  } catch {
    return false;
  }
}

function pickApk(assets: RawAsset[] | undefined, tag: string): ApkAsset | null {
  const candidates = (assets ?? []).filter((asset) => {
    const name = (asset.name ?? '').toLowerCase();
    const state = asset.state ?? 'uploaded';
    const url = asset.browser_download_url ?? '';
    return (
      state === 'uploaded' &&
      name.endsWith('.apk') &&
      isRepoAssetUrl(url) &&
      isAssetOfTag(url, tag) &&
      typeof asset.size === 'number' &&
      asset.size > 0
    );
  });

  if (candidates.length === 0) return null;

  // Preferimos el APK universal publicado por la app; si hubiera varios
  // (por ejemplo, APKs por arquitectura), se usa el primero que haya pasado
  // las comprobaciones y nunca se inventa un nombre.
  const apk =
    candidates.find((asset) => (asset.name ?? '').toLowerCase() === 'vibegrab.apk') ??
    candidates[0];

  return {
    name: apk.name ?? 'VibeGrab.apk',
    sizeBytes: apk.size ?? 0,
    sha256: normalizeHash(apk.digest ?? null),
    downloadUrl: apk.browser_download_url as string,
    downloadCount: typeof apk.download_count === 'number' ? apk.download_count : 0,
  };
}

/**
 * Determina «la última versión estable»: la más reciente por **fecha de
 * publicación** entre las que no son borrador ni preliminares y tienen APK.
 */
export function pickLatestStable(releases: Release[]): Release | null {
  const eligible = releases.filter(
    (release) => !release.prerelease && isDownloadable(release),
  );
  if (eligible.length === 0) return null;
  return eligible.reduce((newest, candidate) =>
    parseTimestamp(candidate.publishedAt) > parseTimestamp(newest.publishedAt)
      ? candidate
      : newest,
  );
}

function normalizeRelease(raw: RawRelease): Release | null {
  const tag = (raw.tag_name ?? '').trim();
  const parsed = parseTag(tag);
  if (!tag || !parsed) return null;

  const body = raw.body ?? '';
  const parsedNotes = parseReleaseNotes(body);
  const curated = curatedNotes[parsed.version];

  let notes: NoteSection[];
  let notesSource: Release['notesSource'];

  if (curated) {
    // Notas revisadas y bilingües, tomadas del catálogo de novedades que la
    // propia app muestra al usuario. Tienen prioridad sobre el texto técnico
    // de la publicación.
    notes = curated;
    notesSource = 'curated';
  } else {
    // Sin notas curadas: se conserva el texto original de GitHub tal cual y la
    // interfaz lo etiqueta como texto original, sin presentarlo como una
    // lista de novedades verificadas.
    notes = parsedNotes.sections;
    notesSource = 'release-notes';
  }

  return {
    tag,
    version: parsed.version,
    build: parsed.build,
    title: (raw.name ?? '').trim() || tag,
    publishedAt: raw.published_at ?? raw.created_at ?? '',
    prerelease: Boolean(raw.prerelease),
    draft: Boolean(raw.draft),
    htmlUrl: raw.html_url ?? '',
    apk: pickApk(raw.assets, tag),
    notes,
    notesSource,
    rawBody: body.trim(),
    isLatestStable: false,
    higherSemverThanStable: false,
  };
}

function normalizeAll(rawReleases: RawRelease[]): Release[] {
  const releases = rawReleases
    // Un borrador no está publicado: nunca debe llegar a la web.
    .filter((raw) => !raw.draft)
    .map(normalizeRelease)
    .filter((release): release is Release => release !== null)
    // Orden cronológico real, de más reciente a más antigua.
    .sort((a, b) => parseTimestamp(b.publishedAt) - parseTimestamp(a.publishedAt));

  const latest = pickLatestStable(releases);
  if (latest) {
    latest.isLatestStable = true;
    for (const release of releases) {
      if (
        release !== latest &&
        !release.prerelease &&
        isDownloadable(release) &&
        compareVersions(release.version, latest.version) > 0
      ) {
        // Tiene un número mayor pero se publicó antes: se marca para poder
        // explicarlo y evitar que alguien descargue algo más antiguo por error.
        release.higherSemverThanStable = true;
      }
    }
  }

  return releases;
}

/* ------------------------------------------------------------------ Caché */

const CACHE_MINUTES = Math.min(Math.max(serverEnvNumber('RELEASES_CACHE_MINUTES', 10), 1), 1440);
const CACHE_TTL_MS = CACHE_MINUTES * 60 * 1000;
/** Tras un fallo no se insiste a GitHub durante este tiempo. */
const RETRY_SECONDS = Math.min(Math.max(serverEnvNumber('RELEASES_RETRY_SECONDS', 60), 10), 3600);
const RETRY_BACKOFF_MS = RETRY_SECONDS * 1000;

let memo: { payload: ReleasesPayload; expiresAt: number } | null = null;
let inFlight: Promise<ReleasesPayload> | null = null;
let backoffUntil = 0;
/** ETag de la última respuesta válida, para revalidar sin gastar cuota. */
let etag: string | null = null;

/** Solo para pruebas: descarta el estado en memoria del módulo. */
export function resetReleasesCache(): void {
  memo = null;
  inFlight = null;
  backoffUntil = 0;
  etag = null;
}

function payloadFromSnapshot(reason: string): ReleasesPayload {
  const releases = normalizeAll(snapshot.releases ?? []);
  return {
    ok: releases.length > 0,
    stale: true,
    source: 'snapshot',
    fetchedAt: snapshot.fetchedAt ?? '',
    lastSuccessfulAt: snapshot.fetchedAt ?? null,
    latest: releases.find((release) => release.isLatestStable) ?? null,
    releases,
    error: reason,
  };
}

type FetchResult = { notModified: true } | { notModified: false; payload: ReleasesPayload };

async function fetchFromGitHub(): Promise<FetchResult> {
  const token = serverEnv('GITHUB_TOKEN');
  const url = `https://api.github.com/repos/${siteConfig.repo}/releases?per_page=100`;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'VibeGrab-Website',
  };
  // El token solo se usa aquí, en el servidor. Nunca llega al navegador.
  if (token) headers.Authorization = `Bearer ${token}`;
  // Revalidación condicional: si nada cambió, GitHub responde 304 y la
  // petición no consume cuota.
  if (etag) headers['If-None-Match'] = etag;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      headers,
      signal: controller.signal,
      cache: 'no-store',
    });

    if (response.status === 304) {
      return { notModified: true };
    }

    if (!response.ok) {
      const remaining = response.headers.get('x-ratelimit-remaining');
      const reset = response.headers.get('x-ratelimit-reset');
      const retryAfter = response.headers.get('retry-after');
      const detail = [
        remaining !== null ? `peticiones restantes: ${remaining}` : null,
        reset !== null ? `se restablece en ${reset}` : null,
        retryAfter !== null ? `reintentar en ${retryAfter}s` : null,
      ]
        .filter(Boolean)
        .join(', ');
      throw new Error(`GitHub respondió ${response.status}${detail ? ` (${detail})` : ''}`);
    }

    const data = (await response.json()) as RawRelease[];
    const releases = normalizeAll(Array.isArray(data) ? data : []);
    const now = new Date().toISOString();
    etag = response.headers.get('etag');
    return {
      notModified: false,
      payload: {
        ok: releases.length > 0,
        stale: false,
        source: 'releases',
        fetchedAt: now,
        lastSuccessfulAt: now,
        latest: releases.find((release) => release.isLatestStable) ?? null,
        releases,
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Devuelve las publicaciones con caché. Si GitHub falla, sirve la última
 * información válida (memoria o snapshot del build) marcándola como antigua.
 */
export async function getReleases(options: { force?: boolean } = {}): Promise<ReleasesPayload> {
  const now = Date.now();

  if (!options.force && memo && now < memo.expiresAt) {
    return memo.payload;
  }

  // Tras un fallo reciente se devuelve lo que haya sin volver a llamar a
  // GitHub en cada visita.
  if (!options.force && now < backoffUntil) {
    if (memo) return { ...memo.payload, stale: true, source: 'cache' };
    return payloadFromSnapshot('GitHub no está disponible; se reintentará en breve.');
  }

  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const result = await fetchFromGitHub();

      if (result.notModified) {
        // El ETag confirma que la lista no cambió: se reutiliza tal cual y se
        // amplía la caducidad de la caché.
        const payload: ReleasesPayload = memo
          ? { ...memo.payload, stale: false, source: 'cache' }
          : payloadFromSnapshot('GitHub confirmó que no hubo cambios.');
        memo = { payload, expiresAt: Date.now() + CACHE_TTL_MS };
        backoffUntil = 0;
        return payload;
      }

      memo = { payload: result.payload, expiresAt: Date.now() + CACHE_TTL_MS };
      backoffUntil = 0;
      return result.payload;
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Error desconocido';
      backoffUntil = Date.now() + RETRY_BACKOFF_MS;

      if (memo) {
        // Se conserva la última información válida y se avisa de que es antigua.
        return { ...memo.payload, stale: true, source: 'cache', error: reason };
      }
      return payloadFromSnapshot(reason);
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

export async function getLatestStable(): Promise<Release | null> {
  const payload = await getReleases();
  return payload.latest;
}

export async function getReleaseByTag(tag: string): Promise<Release | null> {
  const payload = await getReleases();
  return payload.releases.find((release) => release.tag === tag) ?? null;
}

export async function getReleaseTimeline(): Promise<ReleasesPayload> {
  return getReleases();
}

/* ------------------------------------------------ Verificación de descarga */

export interface AssetCheck {
  available: boolean;
  sizeBytes: number | null;
  checkedAt: string;
  reason?: string;
}

/**
 * Comprueba que el APK publicado se puede descargar de verdad, sin descargarlo
 * entero (petición de 1 byte). No consume cuota de la API de GitHub.
 */
export async function checkAssetAvailability(url: string): Promise<AssetCheck> {
  const checkedAt = new Date().toISOString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-0', 'User-Agent': 'VibeGrab-Website' },
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!response.ok && response.status !== 206) {
      return {
        available: false,
        sizeBytes: null,
        checkedAt,
        reason: `HTTP ${response.status}`,
      };
    }

    const contentRange = response.headers.get('content-range');
    const total = contentRange ? Number.parseInt(contentRange.split('/')[1] ?? '', 10) : NaN;

    // Se descarta el byte recibido sin guardarlo.
    await response.body?.cancel().catch(() => undefined);

    return {
      available: true,
      sizeBytes: Number.isFinite(total) ? total : null,
      checkedAt,
    };
  } catch (error) {
    return {
      available: false,
      sizeBytes: null,
      checkedAt,
      reason: error instanceof Error ? error.message : 'Error desconocido',
    };
  } finally {
    clearTimeout(timeout);
  }
}
