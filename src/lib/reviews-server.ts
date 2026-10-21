/**
 * Lectura de las opiniones desde GitHub.
 *
 * Va en un módulo aparte de `lib/reviews.ts` porque ese módulo se envía
 * también al navegador (el formulario lo usa), y aquí solo se ejecuta en el
 * servidor.
 */
import {
  averageRating,
  buildReviewBody,
  buildReviewTitle,
  parseReviewIssue,
  ratingBreakdown,
  reviewsConfig,
  type Review,
  type ReviewSubmission,
} from '@/lib/reviews';
import { serverEnv, serverEnvBool, serverEnvNumber } from '@/lib/env';

export interface ReviewsPayload {
  ok: boolean;
  reviews: Review[];
  average: number | null;
  count: number;
  breakdown: Array<{ rating: number; count: number }>;
  source: 'github-issues' | 'none';
  error?: string;
}

const EMPTY: ReviewsPayload = {
  ok: false,
  reviews: [],
  average: null,
  count: 0,
  breakdown: [],
  source: 'none',
};

/**
 * Caché en memoria.
 *
 * La API de GitHub sin token permite unas 60 peticiones por hora y por IP, y
 * la web ya la usa para las versiones. Como la portada se genera en cada
 * visita, sin este límite cada carga consumiría una petición más.
 */
const CACHE_MINUTES = Math.min(Math.max(serverEnvNumber('REVIEWS_CACHE_MINUTES', 10), 1), 1440);
const CACHE_TTL_MS = CACHE_MINUTES * 60 * 1000;

let memo: { payload: ReviewsPayload; expiresAt: number } | null = null;
let inFlight: Promise<ReviewsPayload> | null = null;
/** Tras un fallo no se insiste durante un rato. */
let backoffUntil = 0;
const BACKOFF_MS = 5 * 60 * 1000;
/**
 * Ventana en la que se ignora la copia cacheada. Tras publicar una opinión
 * hay que releerla de GitHub: si no, la lista seguiría mostrando el estado
 * anterior durante toda la caducidad de la caché.
 */
let freshUntil = 0;

/** Solo para pruebas: descarta el estado en memoria del módulo. */
export function resetReviewsCache(): void {
  memo = null;
  inFlight = null;
  backoffUntil = 0;
  submissions.clear();
}

/* ------------------------------------------------------- Envío de opiniones */

/**
 * El canal de envío necesita un token con permiso de escritura (`public_repo`
 * o `repo`). Sin él, el formulario no se muestra: es preferible no ofrecer un
 * botón que no puede funcionar.
 */
export function reviewsChannelAvailable(): boolean {
  return Boolean(serverEnv('GITHUB_TOKEN'));
}

/** Si es `true`, las opiniones se crean cerradas y hay que abrirlas para publicarlas. */
function requiresModeration(): boolean {
  return serverEnvBool('REVIEWS_REQUIRE_MODERATION', false);
}

/** Máximo de opiniones enviadas por la misma IP en una hora. */
const MAX_SUBMISSIONS_PER_HOUR = Number(serverEnvNumber('REVIEWS_MAX_PER_HOUR', 5));

/** Historial de envíos recientes, para el límite y los duplicados. */
const submissions = new Map<string, number[]>();

/** Clave de un envío: IP + huella del texto, para detectar duplicados. */
function submissionKeys(ip: string, text: string): { ipKey: string; textKey: string } {
  const normalized = text.trim().toLowerCase().replace(/\s+/g, ' ');
  // Hash simple y no reversible: no guardamos el texto ni la IP en claro más
  // tiempo del necesario.
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash * 31 + normalized.charCodeAt(i)) | 0;
  }
  return {
    ipKey: `ip:${ip}`,
    textKey: `text:${hash}`,
  };
}

/** ¿Se ha superado el límite de envíos de esta IP? */
function isRateLimited(ipKey: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ipKey) ?? []).filter((at) => now - at < 60 * 60 * 1000);
  submissions.set(ipKey, recent);
  return recent.length >= MAX_SUBMISSIONS_PER_HOUR;
}

/** ¿Se ha enviado ya este texto hace poco? */
function isDuplicate(textKey: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(textKey) ?? []).filter((at) => now - at < 60 * 60 * 1000);
  return recent.length > 0;
}

function recordSubmission(key: string): void {
  const recent = submissions.get(key) ?? [];
  recent.push(Date.now());
  submissions.set(key, recent);
}

export type SubmitResult =
  | { ok: true; number: number; pending: boolean }
  | { ok: false; reason: 'unavailable' | 'invalid' | 'rate' | 'duplicate' | 'server'; detail?: string };

/**
 * Publica una opinión creando un issue en el repositorio del proyecto.
 *
 * Solo se ejecuta en el servidor y el token nunca sale de aquí.
 */
export async function submitReview(
  input: ReviewSubmission & { ip: string },
): Promise<SubmitResult> {
  // Primero se valida el contenido: un envío inválido se rechaza siempre,
  // tenga o no el canal configurado.
  const text = input.text.trim();
  if (text.length < 20 || text.length > 800) return { ok: false, reason: 'invalid' };
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    return { ok: false, reason: 'invalid' };
  }

  const token = serverEnv('GITHUB_TOKEN');
  if (!token) return { ok: false, reason: 'unavailable' };

  const { ipKey, textKey } = submissionKeys(input.ip, text);
  if (isRateLimited(ipKey)) return { ok: false, reason: 'rate' };
  if (isDuplicate(textKey)) return { ok: false, reason: 'duplicate' };

  const pending = requiresModeration();
  const body = buildReviewBody({ ...input, text, via: 'form' });
  const title = buildReviewTitle(input);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`https://api.github.com/repos/${reviewsConfig.repo}/issues`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'VibeGrab-Website',
        'Content-Type': 'application/json',
        // El token solo se usa aquí, en el servidor. Nunca llega al navegador.
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        body,
        state: pending ? 'closed' : 'open',
      }),
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      return { ok: false, reason: 'server', detail: `HTTP ${response.status} ${detail.slice(0, 200)}` };
    }

    const created = (await response.json()) as { number?: number };

    recordSubmission(ipKey);
    recordSubmission(textKey);

    // La lista cacheada ya no vale: la opinión nueva debe verse enseguida.
    memo = null;
    freshUntil = Date.now() + 2 * 60 * 1000;

    return { ok: true, number: created.number ?? 0, pending };
  } catch (error) {
    return {
      ok: false,
      reason: 'server',
      detail: error instanceof Error ? error.message : 'Error desconocido',
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Lee los issues públicos del repositorio y devuelve solo los que son
 * opiniones válidas. Si GitHub no responde, se devuelve un estado vacío y
 * honesto: nunca se inventan opiniones.
 *
 * El resultado se cachea en memoria para no gastar la cuota de la API de
 * GitHub en cada visita.
 */
export async function getReviews(options: { force?: boolean } = {}): Promise<ReviewsPayload> {
  const now = Date.now();

  if (!options.force && memo && now < memo.expiresAt && now > freshUntil) {
    return memo.payload;
  }

  if (!options.force && now < backoffUntil && memo) {
    return { ...memo.payload, ok: false };
  }

  if (inFlight) return inFlight;

  inFlight = (async () => {
    const payload = await fetchReviews();
    if (payload.ok) {
      // Tras un envío la lista puede tardar unos segundos en reflejar la
      // opinión nueva, así que la copia se caduca antes.
      const ttl = Date.now() < freshUntil ? 15_000 : CACHE_TTL_MS;
      memo = { payload, expiresAt: Date.now() + ttl };
      backoffUntil = 0;
    } else {
      backoffUntil = Date.now() + BACKOFF_MS;
      // Si ya había una respuesta válida, se conserva: las opiniones no
      // cambian cada minuto.
      if (memo) return { ...memo.payload, ok: false, error: payload.error };
    }
    return payload;
  })().finally(() => {
    inFlight = null;
  });

  return inFlight;
}

async function fetchReviews(): Promise<ReviewsPayload> {
  const url = `https://api.github.com/repos/${reviewsConfig.repo}/issues?state=open&per_page=100`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'VibeGrab-Website',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      return { ...EMPTY, error: `GitHub respondió ${response.status}` };
    }

    const issues = (await response.json()) as unknown[];
    const reviews = Array.isArray(issues)
      ? issues
          .map((issue) => parseReviewIssue(issue))
          .filter((review): review is Review => review !== null)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      : [];

    return {
      ok: true,
      reviews,
      average: averageRating(reviews),
      count: reviews.length,
      breakdown: ratingBreakdown(reviews),
      source: 'github-issues',
    };
  } catch (error) {
    return {
      ...EMPTY,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  } finally {
    clearTimeout(timeout);
  }
}
