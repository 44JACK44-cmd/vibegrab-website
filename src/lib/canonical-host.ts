/**
 * Dominio canónico de la web.
 *
 * El sitio puede estar desplegado en más de un sitio (por ejemplo, un
 * dominio propio y una URL de despliegue). Google debe ver una sola versión:
 * todas las URLs canónicas, los sitemaps y los datos estructurados apuntan al
 * dominio canónico, y cualquier otro host redirige allí con un 301.
 *
 * La regla es deliberadamente conservadora: solo se redirige cuando `SITE_URL`
 * está definida **a mano**. Las previsualizaciones, que no la definen,
 * siguen funcionando con normalidad.
 */

/** Hosts locales: nunca se redirigen, para que el preview funcione. */
function isLocalHost(host: string): boolean {
  const bare = host.replace(/:\d+$/, '').toLowerCase();
  return bare === 'localhost' || bare === '127.0.0.1' || bare === '[::1]' || bare === '::1';
}

/**
 * Calcula a dónde debe redirigir una petición que llega a un host distinto
 * del canónico.
 *
 * @param requestHost Host de la petición (por ejemplo `vibegrab-website.vercel.app`).
 * @param explicitSiteUrl Valor de `SITE_URL` tal y como está configurado, o
 *   `undefined` si no se ha definido a mano.
 * @param canonicalBase URL canónica resuelta (con `SITE_URL`, la de la
 *   plataforma o el respaldo).
 * @param pathname Ruta con su cadena de consulta, o `null` si no hay.
 * @returns La URL de destino, o `null` si la petición ya va al host canónico.
 */
export function canonicalRedirectTarget(options: {
  requestHost: string;
  explicitSiteUrl?: string | undefined;
  canonicalBase: string;
  pathname: string;
}): string | null {
  const { requestHost, explicitSiteUrl, canonicalBase, pathname } = options;

  // Sin `SITE_URL` explícito no se redirige: las previsualizaciones y los
  // despliegues de prueba deben seguir siendo accesibles en su propio host.
  if (!explicitSiteUrl?.trim()) return null;

  // El preview local (`astro preview`, `wrangler dev`) se sirve en
  // localhost: redirigirlo al dominio de producción lo rompería.
  if (isLocalHost(requestHost)) return null;

  let canonicalHost: string;
  try {
    canonicalHost = new URL(canonicalBase).host;
  } catch {
    return null;
  }

  if (requestHost === canonicalHost) return null;

  try {
    return new URL(pathname, canonicalBase).href;
  } catch {
    return null;
  }
}
