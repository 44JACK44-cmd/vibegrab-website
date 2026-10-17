/**
 * GET /sitemap-versions.xml
 *
 * Sitemap de las fichas de versión. Son páginas dinámicas (se generan desde
 * GitHub Releases), así que no pueden entrar en el sitemap estático del build.
 * Incluye los enlaces alternativos de idioma para cada versión.
 */
import type { APIRoute } from 'astro';
import { getReleases, isDownloadable } from '@/lib/releases';
import { versionAbsoluteUrl } from '@/config/routes';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const payload = await getReleases();
  const releases = payload.releases.filter(isDownloadable);

  const urls = releases
    .map((release) => {
      const es = versionAbsoluteUrl(release.tag, 'es');
      const en = versionAbsoluteUrl(release.tag, 'en');
      return [
        '<url>',
        `<loc>${escapeXml(es)}</loc>`,
        `<lastmod>${escapeXml(release.publishedAt)}</lastmod>`,
        `<xhtml:link rel="alternate" hreflang="es" href="${escapeXml(es)}"/>`,
        `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(en)}"/>`,
        '</url>',
        '<url>',
        `<loc>${escapeXml(en)}</loc>`,
        `<lastmod>${escapeXml(release.publishedAt)}</lastmod>`,
        `<xhtml:link rel="alternate" hreflang="es" href="${escapeXml(es)}"/>`,
        `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(en)}"/>`,
        '</url>',
      ].join('');
    })
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};
