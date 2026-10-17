/**
 * Middleware de internacionalización.
 *
 * Con `i18n.routing: 'manual'` Astro delega el enrutado de idiomas en el
 * proyecto. Aquí solo deducimos el idioma de la URL y lo dejamos disponible
 * en `Astro.locals`, sin redirecciones automáticas: las rutas y el `hreflang`
 * se controlan explícitamente en `src/config/routes.ts`.
 */
import { defineMiddleware } from 'astro:middleware';
import { localeFromPathname } from '@/config/routes';

export const onRequest = defineMiddleware((context, next) => {
  context.locals.locale = localeFromPathname(context.url.pathname);
  return next();
});
