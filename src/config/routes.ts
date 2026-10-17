/**
 * Rutas del sitio y utilidades de idioma.
 *
 * El español es el idioma por defecto y vive en la raíz (`/`); el inglés
 * cuelga de `/en/`. Cada idioma tiene slugs legibles en su propio idioma.
 */
import { siteConfig } from '@/config/site';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export type RouteKey =
  | 'home'
  | 'features'
  | 'download'
  | 'versions'
  | 'about'
  | 'help'
  | 'contact'
  | 'privacy'
  | 'terms';

export const routes: Record<RouteKey, Record<Locale, string>> = {
  home: { es: '/', en: '/en/' },
  features: { es: '/caracteristicas/', en: '/en/features/' },
  download: { es: '/descargar/', en: '/en/download/' },
  versions: { es: '/versiones/', en: '/en/versions/' },
  about: { es: '/sobre/', en: '/en/about/' },
  help: { es: '/ayuda/', en: '/en/help/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
  privacy: { es: '/privacidad/', en: '/en/privacy/' },
  terms: { es: '/terminos/', en: '/en/terms/' },
};

/** Ruta relativa de una página en un idioma. */
export function path(key: RouteKey, locale: Locale = defaultLocale): string {
  return routes[key][locale];
}

/** URL absoluta de una página (para canonical, Open Graph y sitemap). */
export function absoluteUrl(key: RouteKey, locale: Locale = defaultLocale): string {
  return new URL(path(key, locale), siteConfig.url).href;
}

/** Ficha de una versión concreta: `/versiones/<tag>/` y `/en/versions/<tag>/`. */
export function versionPath(tag: string, locale: Locale = defaultLocale): string {
  const base = locale === 'es' ? '/versiones/' : '/en/versions/';
  return `${base}${encodeURIComponent(tag)}/`;
}

export function versionAbsoluteUrl(tag: string, locale: Locale = defaultLocale): string {
  return new URL(versionPath(tag, locale), siteConfig.url).href;
}

/** Enlaces alternativos por idioma, para `<link rel="alternate" hreflang>`. */
export function alternates(key: RouteKey): Array<{ locale: Locale; href: string }> {
  return locales.map((locale) => ({ locale, href: absoluteUrl(key, locale) }));
}

/** Dado un pathname, deduce el idioma activo. */
export function localeFromPathname(pathname: string): Locale {
  return /^\/en(\/|$)/.test(pathname) ? 'en' : 'es';
}

/** `hreflang` compatible con el estándar (`es`, `en` y `x-default`). */
export function hreflangOf(locale: Locale): string {
  return locale === 'es' ? 'es' : 'en';
}

/** Rutas de contenido que aparecen en el sitemap y en la navegación. */
export const navigableRoutes: RouteKey[] = [
  'home',
  'features',
  'download',
  'versions',
  'about',
  'help',
];
