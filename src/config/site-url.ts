/**
 * Resolución de la URL canónica del sitio.
 *
 * Orden de prioridad:
 *
 *  1. `SITE_URL` — variable propia. Es la forma de fijar el dominio definitivo
 *     cuando ya se ha registrado.
 *  2. `VERCEL_PROJECT_PRODUCTION_URL` — la inyecta Vercel automáticamente en
 *     cada build y en cada función, con el dominio de producción del proyecto
 *     (por ejemplo `vibegrab-website.vercel.app`). Permite desplegar sin
 *     configurar nada a mano y que `canonical`, Open Graph, `robots.txt` y los
 *     sitemaps apunten al sitio correcto.
 *  3. `SITE_URL_FALLBACK` — respaldo para desarrollo local sin `.env`.
 *
 * Nunca se inventa un dominio: o viene de `SITE_URL`, o es el que Vercel
 * asigna al proyecto, o es el respaldo comprobado.
 */

/** Respaldo: URL real del proyecto en Vercel mientras no haya dominio propio. */
export const SITE_URL_FALLBACK = 'https://vibegrab-website.vercel.app';

/** Quita barras finales para no generar URLs con `//`. */
export function stripTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, '');
}

/** `dominio.tld` -> `https://dominio.tld`; deja intacto lo que ya trae esquema. */
function withScheme(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export interface SiteUrlEnv {
  SITE_URL?: string | undefined;
  VERCEL_PROJECT_PRODUCTION_URL?: string | undefined;
}

export function resolveSiteUrl(env: SiteUrlEnv): string {
  const explicit = env.SITE_URL?.trim();
  if (explicit) return stripTrailingSlashes(explicit);

  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return stripTrailingSlashes(withScheme(vercel));

  return SITE_URL_FALLBACK;
}
