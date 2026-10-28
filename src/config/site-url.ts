/**
 * Resolución de la URL canónica del sitio.
 *
 * Orden de prioridad:
 *
 *  1. `SITE_URL` — variable propia. Es la forma de fijar el dominio definitivo.
 *  2. `PUBLIC_URL` — la usan algunos alojamientos (por ejemplo Netlify).
 *  3. `RENDER_EXTERNAL_URL` — la inyecta Render con la URL pública del
 *     servicio (`https://mi-servicio.onrender.com`).
 *  4. `VERCEL_PROJECT_PRODUCTION_URL` — la inyecta Vercel automáticamente con el
 *     dominio de producción del proyecto.
 *  5. `SITE_URL_FALLBACK` — respaldo para desarrollo local sin `.env`.
 *
 * Nunca se inventa un dominio: o viene de la configuración, o es el que la
 * plataforma asigna, o es el respaldo comprobado.
 */

export interface SiteUrlEnv {
  SITE_URL?: string | undefined;
  PUBLIC_URL?: string | undefined;
  RENDER_EXTERNAL_URL?: string | undefined;
  VERCEL_PROJECT_PRODUCTION_URL?: string | undefined;
}

/**
 * Respaldo: URL pública del Worker de Cloudflare «vibegrab» en la cuenta
 * `jackae598`. Es el dominio definitivo del sitio (no hay dominio propio), así
 * que aunque el build llegue sin `SITE_URL` —p. ej. porque la variable del
 * panel se olvidó— canónicas, sitemaps y robots apuntan al dominio real y no a
 * un alojamiento muerto.
 */
export const SITE_URL_FALLBACK = 'https://vibegrab.jackae598.workers.dev';

/** Quita barras finales para no generar URLs con `//`. */
export function stripTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, '');
}

/** `dominio.tld` -> `https://dominio.tld`; deja intacto lo que ya trae esquema. */
function withScheme(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

/** Resuelve la URL canónica a partir de las variables disponibles. */
export function resolveSiteUrl(env: SiteUrlEnv): string {
  const explicit = env.SITE_URL?.trim();
  if (explicit) return stripTrailingSlashes(explicit);

  const publicUrl = env.PUBLIC_URL?.trim();
  if (publicUrl) return stripTrailingSlashes(withScheme(publicUrl));

  // Render publica la URL del servicio durante la compilación.
  const renderUrl = env.RENDER_EXTERNAL_URL?.trim();
  if (renderUrl) return stripTrailingSlashes(withScheme(renderUrl));

  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return stripTrailingSlashes(withScheme(vercel));

  return SITE_URL_FALLBACK;
}

/**
 * Aviso en la compilación cuando el alojamiento no inyecta el dominio y no hay
 * `SITE_URL` definida: en ese caso las URL canónicas quedarían apuntando al
 * respaldo, que no es el dominio real.
 */
export function warnIfSiteUrlMissing(env: SiteUrlEnv, target: string): void {
  if (env.SITE_URL?.trim() || env.PUBLIC_URL?.trim()) return;
  if (env.RENDER_EXTERNAL_URL?.trim()) return;
  if (env.VERCEL_PROJECT_PRODUCTION_URL?.trim()) return;

  // eslint-disable-next-line no-console
  console.warn(
    [
      `[VibeGrab] No se ha definido SITE_URL para el despliegue «${target}».`,
      'Las URL canónicas, los sitemaps y el archivo de verificación se publicarán',
      'con el dominio de respaldo. Define SITE_URL con el dominio real del servicio.',
    ].join(' '),
  );
}
