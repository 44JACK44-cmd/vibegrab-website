/**
 * Lectura de las opiniones desde GitHub.
 *
 * Va en un módulo aparte de `lib/reviews.ts` porque ese módulo se envía
 * también al navegador (el formulario lo usa), y aquí solo se ejecuta en el
 * servidor.
 */
import {
  averageRating,
  parseReviewIssue,
  ratingBreakdown,
  reviewsConfig,
  type Review,
} from '@/lib/reviews';
import { serverEnvNumber } from '@/lib/env';

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

/** Solo para pruebas: descarta el estado en memoria del módulo. */
export function resetReviewsCache(): void {
  memo = null;
  inFlight = null;
  backoffUntil = 0;
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

  if (!options.force && memo && now < memo.expiresAt) {
    return memo.payload;
  }

  if (!options.force && now < backoffUntil && memo) {
    return { ...memo.payload, ok: false };
  }

  if (inFlight) return inFlight;

  inFlight = (async () => {
    const payload = await fetchReviews();
    if (payload.ok) {
      memo = { payload, expiresAt: Date.now() + CACHE_TTL_MS };
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
