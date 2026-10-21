/**
 * Middleware de internacionalización, cabeceras de seguridad y dominio canónico.
 *
 * Con `i18n.routing: 'manual'` Astro delega el enrutado de idiomas en el
 * proyecto. Aquí solo deducimos el idioma de la URL y lo dejamos disponible
 * en `Astro.locals`, sin redirecciones automáticas: las rutas y el `hreflang`
 * se controlan explícitamente en `src/config/routes.ts`.
 *
 * Las cabeceras de seguridad se aplican aquí y no solo en `vercel.json`, para
 * que funcionen igual en cualquier alojamiento (Render, Node, etc.).
 *
 * También se resuelve el **dominio canónico**: si `SITE_URL` está definida
 * de forma explícita y la petición llega a otro host, se redirige (301) al
 * host canónico conservando la ruta y los parámetros. Así un despliegue
 * espejo no compite con el sitio oficial: Google solo ve una versión.
 */
import { defineMiddleware } from 'astro:middleware';
import { localeFromPathname } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { serverEnv } from '@/lib/env';
import { canonicalRedirectTarget } from '@/lib/canonical-host';

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

  // Redirección al host canónico (301). Solo cuando `SITE_URL` está definida
  // a mano: las previsualizaciones, que no la tienen, siguen funcionando.
  const target = canonicalRedirectTarget({
    requestHost: context.url.host,
    explicitSiteUrl: serverEnv('SITE_URL'),
    canonicalBase: siteConfig.url,
    pathname: context.url.pathname + context.url.search,
  });
  if (target) {
    return Response.redirect(target, 301);
  }

  const response = await next();

  try {
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      response.headers.set(key, value);
    }
  } catch {
    // Las respuestas de redirección (302) tienen las cabeceras inmutables a
    // partir de Node 24. Se devuelven tal cual: no son páginas y no necesitan
    // estas cabeceras. Si se modificaran a la fuerza, se rompería la descarga.
  }

  return response;
});
