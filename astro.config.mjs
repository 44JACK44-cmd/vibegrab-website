// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

/**
 * Dominio canónico del sitio.
 *
 * NO se asume que el dominio esté comprado: se lee de `SITE_URL` y, si no se
 * define, se usa `https://vibegrab.com` como valor previsto para producción.
 * En Vercel puedes desplegar primero en el subdominio `*.vercel.app` y añadir
 * el dominio propio más adelante (ver DEPLOY.md).
 */
const SITE = process.env.SITE_URL || 'https://vibegrab.com';

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
