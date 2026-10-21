/**
 * /api/reviews
 *
 * GET  → devuelve las opiniones de la comunidad leídas de los issues del
 *         repositorio del proyecto. Solo se aceptan los issues que llevan la
 *         marca `vibegrab-review` y que superan las validaciones.
 *
 * POST → publica una opinión nueva. Lo hace el servidor con su propio token,
 *         así que la persona no necesita ninguna cuenta y el token nunca sale
 *         del servidor.
 *
 * Si GitHub no responde, la respuesta indica `ok: false` y la interfaz lo
 * muestra como un estado honesto, sin inventar datos.
 */
import { getReviews, submitReview } from '@/lib/reviews-server';
import { releasesCacheHeaders } from '@/lib/releases';

export const prerender = false;

function json(payload: unknown, status = 200, seconds = 300): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...releasesCacheHeaders(seconds),
    },
  });
}

export async function GET(): Promise<Response> {
  const payload = await getReviews();

  // La respuesta pública no incluye el enlace al issue de origen ni el nombre
  // de la plataforma: la web no expone sus repositorios.
  const reviews = payload.reviews.map(({ sourceUrl, source, ...review }) => review);

  return json({ ...payload, reviews });
}

export async function POST({ request }: { request: Request }): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, reason: 'invalid' }, 400);
  }

  const forwarded = request.headers.get('x-forwarded-for') ?? '';
  const ip = forwarded.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'desconocido';

  const result = await submitReview({
    text: typeof body.text === 'string' ? body.text : '',
    rating: Number(body.rating),
    version: typeof body.version === 'string' ? body.version : undefined,
    alias: typeof body.alias === 'string' ? body.alias : undefined,
    lang: body.lang === 'en' ? 'en' : 'es',
    ip,
  });

  if (result.ok) {
    return json({ ok: true, number: result.number, pending: result.pending });
  }

  const status = result.reason === 'invalid' ? 400 : result.reason === 'unavailable' ? 503 : 429;
  return json({ ok: false, reason: result.reason }, status);
}
