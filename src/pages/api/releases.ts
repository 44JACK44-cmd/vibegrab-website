/**
 * GET /api/releases
 *
 * Devuelve la lista normalizada de publicaciones en JSON. Pensado para
 * integraciones y para depurar. La respuesta va cacheada en el CDN, de modo
 * que la API de GitHub no se consulta en cada visita.
 *
 * No se incluyen los enlaces al repositorio ni la URL directa del archivo:
 * la web no expone sus repositorios. Para descargar, usa `/api/download`.
 */
import type { APIRoute } from 'astro';
import { getReleases, releasesCacheHeaders, toPublicRelease } from '@/lib/releases';

export const GET: APIRoute = async () => {
  const payload = await getReleases();

  const body = {
    ...payload,
    latest: payload.latest ? toPublicRelease(payload.latest) : null,
    releases: payload.releases.map(toPublicRelease),
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...releasesCacheHeaders(600),
    },
  });
};
