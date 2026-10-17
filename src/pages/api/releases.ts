/**
 * GET /api/releases
 *
 * Devuelve la lista normalizada de publicaciones en JSON. Pensado para
 * integraciones y para depurar. La respuesta va cacheada en el CDN, de modo
 * que la API de GitHub no se consulta en cada visita.
 */
import type { APIRoute } from 'astro';
import { getReleases, releasesCacheHeaders } from '@/lib/releases';

export const GET: APIRoute = async () => {
  const payload = await getReleases();

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...releasesCacheHeaders(600),
    },
  });
};
