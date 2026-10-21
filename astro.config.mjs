// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { resolveSiteUrl, warnIfSiteUrlMissing } from './src/config/site-url.ts';

/**
 * Objetivo del despliegue.
 *
 * El proyecto se construye para las dos plataformas desde el mismo
 * repositorio, porque solo cambia el adaptador:
 *
 *  · `vercel` (por defecto): functions serverless de Vercel.
 *  · `render`: servidor Node autónomo (`node ./dist/server/entry.mjs`), que es
 *    lo que usa Render.
 *
 * Se elige con la variable de entorno `DEPLOY_TARGET`.
 */
const DEPLOY_TARGET = (process.env.DEPLOY_TARGET ?? 'vercel').toLowerCase();
const IS_RENDER = DEPLOY_TARGET === 'render' || DEPLOY_TARGET === 'node';

const adapter = IS_RENDER
  ? node({ mode: 'standalone' })
  : vercel({
      maxDuration: 20,
    });

/**
 * Dominio canónico del sitio.
 *
 * Se resuelve en `src/config/site-url.ts`: `SITE_URL` si está definida, si no
 * el dominio de producción que Vercel inyecta automáticamente
 * (`VERCEL_PROJECT_PRODUCTION_URL`) y, en último caso, el respaldo comprobado.
 * Así el sitio no publica URLs de un dominio que no sea suyo.
 */
const SITE = resolveSiteUrl(process.env);

warnIfSiteUrlMissing(process.env, DEPLOY_TARGET);

// https://astro.build/config
export default defineConfig({
  site: SITE,

  // Renderizado en servidor: la ficha de descarga y el historial de versiones
  // se generan al vuelo desde GitHub Releases (con caché). Las páginas que no
  // dependen de la API se prerenderizan para servirse como HTML estático.
  output: 'server',
  adapter,

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
