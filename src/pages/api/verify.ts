/**
 * GET /api/verify?tag=vX.Y.Z-B
 *
 * Comprueba que el APK de una versión está realmente disponible para
 * descargar (petición de 1 byte al archivo, sin consumir cuota de la API de
 * GitHub). Lo usa la ficha de descarga para informar al usuario.
 */
import type { APIRoute } from 'astro';
import { checkAssetAvailability, getReleases, isDownloadable } from '@/lib/releases';

export const GET: APIRoute = async ({ url }) => {
  const tag = url.searchParams.get('tag');
  const payload = await getReleases();

  const release = tag
    ? payload.releases.find((item) => item.tag === tag)
    : payload.latest;

  if (!release || !isDownloadable(release) || !release.apk) {
    // La versión no existe o ya no tiene archivo: está retirada, no es un fallo
    // temporal de comprobación.
    return new Response(
      JSON.stringify({ available: false, reason: 'not-found', tag: tag ?? null }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
      },
    );
  }

  const check = await checkAssetAvailability(release.apk.downloadUrl);

  return new Response(JSON.stringify({ tag: release.tag, ...check }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=120, stale-while-revalidate=600',
    },
  });
};
