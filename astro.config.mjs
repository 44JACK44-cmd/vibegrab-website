// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { resolveSiteUrl } from './src/config/site-url.ts';

/**
 * Dominio canónico del sitio.
 *
 * Se resuelve en `src/config/site-url.ts`: `SITE_URL` si está definida, si no
 * el dominio de producción que Vercel inyecta automáticamente
 * (`VERCEL_PROJECT_PRODUCTION_URL`) y, en último caso, el respaldo comprobado.
 * Así el sitio no publica URLs de un dominio que no sea suyo.
 */
const SITE = resolveSiteUrl(process.env);

// https://astro.build/config
export default defineConfig({
  site: SITE,

  // Renderizado en servidor: la ficha de descarga y el historial de versiones
  // se generan al vuelo desde GitHub Releases (con caché). Las páginas que no
  // dependen de la API se prerenderizan para servirse como HTML estático.
  output: 'server',
  adapter: vercel({
    maxDuration: 20,
  }),

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    // Routing manual: las rutas y el `hreflang` los controlamos nosotros en
    // `src/config/routes.ts` para poder usar slugs legibles por idioma
    // (/descargar vs /en/download).
    routing: 'manual',
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es',
          en: 'en',
        },
      },
      // Las rutas de API no son contenido indexable.
      filter: (page) => !page.includes('/api/'),
    }),
  ],

  // Precarga de enlaces al pasar el cursor / entrar en viewport.
  prefetch: { prefetchAll: true },

  // La barra de desarrollo no debe aparecer en capturas ni confundirse con UI.
  devToolbar: { enabled: false },

  build: {
    inlineStylesheets: 'auto',
  },
});
