/**
 * Middleware de internacionalización y cabeceras de seguridad.
 *
 * Con `i18n.routing: 'manual'` Astro delega el enrutado de idiomas en el
 * proyecto. Aquí solo deducimos el idioma de la URL y lo dejamos disponible
 * en `Astro.locals`, sin redirecciones automáticas: las rutas y el `hreflang`
 * se controlan explícitamente en `src/config/routes.ts`.
 *
 * Las cabeceras de seguridad se aplican aquí y no solo en `vercel.json`, para
 * que funcionen igual en cualquier alojamiento (Render, Node, etc.).
 */
import { defineMiddleware } from 'astro:middleware';
import { localeFromPathname } from '@/config/routes';

/** Cabeceras aplicadas a todas las respuestas generadas en el servidor. */
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.locale = localeFromPathname(context.url.pathname);

  const response = await next();

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  return response;
});
