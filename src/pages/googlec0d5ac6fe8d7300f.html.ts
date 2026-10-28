/**
 * Verificación de Google Search Console.
 *
 * Google exige el contenido exacto en la URL **con** `.html`. El enrutador de
 * assets estáticos de Cloudflare Workers redirige por defecto los `.html` a
 * rutas sin extensión (307), así que este fichero no puede ser un asset: se
 * sirve desde el servidor, igual en Vercel, Render y Cloudflare.
 */
export const prerender = false;

export const GET = () =>
  new Response('google-site-verification: googlec0d5ac6fe8d7300f.html', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
