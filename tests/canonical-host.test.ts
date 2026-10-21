/**
 * Pruebas del dominio canónico.
 *
 * Comprueban que un despliegue espejo redirija al host canónico conservando la
 * ruta, y que las previsualizaciones (sin `SITE_URL`) no se redirijan.
 */
import { describe, expect, it } from 'vitest';
import { canonicalRedirectTarget } from '@/lib/canonical-host';

const CANONICAL = 'https://vibegrab-website.onrender.com';

describe('dominio canónico', () => {
  it('redirige un host distinto al canónico conservando la ruta', () => {
    const target = canonicalRedirectTarget({
      requestHost: 'vibegrab-website.vercel.app',
      explicitSiteUrl: CANONICAL,
      canonicalBase: CANONICAL,
      pathname: '/versiones/',
    });

    expect(target).toBe('https://vibegrab-website.onrender.com/versiones/');
  });

  it('conserva los parámetros de la consulta', () => {
    const target = canonicalRedirectTarget({
      requestHost: 'vibegrab-website.vercel.app',
      explicitSiteUrl: CANONICAL,
      canonicalBase: CANONICAL,
      pathname: '/descargar/?estado=retirada',
    });

    expect(target).toBe('https://vibegrab-website.onrender.com/descargar/?estado=retirada');
  });

  it('no redirige si la petición ya va al host canónico', () => {
    const target = canonicalRedirectTarget({
      requestHost: 'vibegrab-website.onrender.com',
      explicitSiteUrl: CANONICAL,
      canonicalBase: CANONICAL,
      pathname: '/',
    });

    expect(target).toBeNull();
  });

  it('no redirige sin SITE_URL explícito (previsualizaciones)', () => {
    const target = canonicalRedirectTarget({
      requestHost: 'vibegrab-website-abc123.vercel.app',
      explicitSiteUrl: undefined,
      canonicalBase: CANONICAL,
      pathname: '/',
    });

    expect(target).toBeNull();
  });

  it('no redirige si SITE_URL está vacío', () => {
    const target = canonicalRedirectTarget({
      requestHost: 'vibegrab-website.vercel.app',
      explicitSiteUrl: '   ',
      canonicalBase: CANONICAL,
      pathname: '/',
    });

    expect(target).toBeNull();
  });

  it('no rompe con una URL canónica inválida', () => {
    const target = canonicalRedirectTarget({
      requestHost: 'otro.example',
      explicitSiteUrl: CANONICAL,
      canonicalBase: 'no-es-una-url',
      pathname: '/',
    });

    expect(target).toBeNull();
  });
});
