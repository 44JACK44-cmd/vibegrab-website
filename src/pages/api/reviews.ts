/**
 * GET /api/reviews
 *
 * Devuelve las opiniones de la comunidad leídas de los issues públicos del
 * repositorio del proyecto. Solo se aceptan los issues que llevan la marca
 * `vibegrab-review` y que superan las validaciones.
 *
 * No expone ningún token: usa la API pública de GitHub. Si GitHub no
 * responde, la respuesta indica `ok: false` y la interfaz lo muestra como un
 * estado honesto, sin inventar datos.
 */
import { getReviews } from '@/lib/reviews-server';
import { releasesCacheHeaders } from '@/lib/releases';

export const prerender = false;

export async function GET(): Promise<Response> {
  const payload = await getReviews();

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...releasesCacheHeaders(300),
    },
  });
}
