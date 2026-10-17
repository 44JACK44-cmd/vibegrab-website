/**
 * GET /robots.txt
 *
 * Generado en tiempo de build con la URL canónica configurada.
 */
import type { APIRoute } from 'astro';
import { siteConfig } from '@/config/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Disallow: /api/

Sitemap: ${siteConfig.url}/sitemap-index.xml
Sitemap: ${siteConfig.url}/sitemap-versions.xml
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
