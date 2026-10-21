/**
 * GET /api/download?tag=vX.Y.Z-B&lang=es
 *
 * Resuelve la versión solicitada (por defecto, la última estable) y redirige
 * al archivo APK publicado. Antes comprueba que el archivo responde, para no
 * mandar al usuario a un enlace roto: si no está disponible, vuelve a la
 * página de descarga con un aviso comprensible.
 *
 * El botón visible apunta a este dominio, no al repositorio de desarrollo.
 */
import type { APIRoute } from 'astro';
import { checkAssetAvailability, getReleases, isDownloadable } from '@/lib/releases';

export const GET: APIRoute = async ({ url }) => {
  const tag = url.searchParams.get('tag');
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'es';
  const downloadPage = lang === 'en' ? '/en/download/' : '/descargar/';

  const payload = await getReleases();
  const release = tag ? payload.releases.find((item) => item.tag === tag) : payload.latest;

  const failureUrl = new URL(downloadPage, url.origin);

  // El tag solicitado debe existir, estar publicado y tener un APK cuyo enlace
  // pertenezca a los assets de este repositorio. Nada de URLs externas.
  if (!release || !isDownloadable(release) || !release.apk) {
    // La versión no existe o se retiró: no es un problema temporal.
    failureUrl.searchParams.set('estado', 'retirada');
    return Response.redirect(failureUrl.href, 302);
  }

  const check = await checkAssetAvailability(release.apk.downloadUrl);
  if (!check.available) {
    // Si el archivo ya no existe, la versión está retirada; si solo falló la
    // comprobación, puede volver a funcionar en unos minutos.
    failureUrl.searchParams.set(
      'estado',
      check.reason === 'not-found' ? 'retirada' : 'no-disponible',
    );
    return Response.redirect(failureUrl.href, 302);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: release.apk.downloadUrl,
      // Nunca se cachea: cada clic vuelve a verificar el archivo.
      'Cache-Control': 'no-store, max-age=0',
      'X-VibeGrab-Version': release.tag,
    },
  });
};
