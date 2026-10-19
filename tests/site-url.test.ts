/**
 * Pruebas de la resolución de la URL canónica del sitio.
 *
 * Garantizan que el sitio nunca publique URLs de un dominio ajeno: se prefiere
 * `SITE_URL`, después el dominio de producción que Vercel inyecta por su cuenta
 * y, por último, el respaldo comprobado.
 */
import { describe, expect, it } from 'vitest';
import { SITE_URL_FALLBACK, resolveSiteUrl } from '@/config/site-url';

describe('resolveSiteUrl', () => {
  it('prefiere SITE_URL cuando está definida', () => {
    expect(
      resolveSiteUrl({
        SITE_URL: 'https://ejemplo.test',
        VERCEL_PROJECT_PRODUCTION_URL: 'vibegrab-website.vercel.app',
      }),
    ).toBe('https://ejemplo.test');
  });

  it('usa el dominio de producción de Vercel y le añade el esquema', () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'vibegrab-website.vercel.app' })).toBe(
      'https://vibegrab-website.vercel.app',
    );
  });

  it('respeta el esquema cuando la variable de Vercel ya lo incluye', () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'http://interno.test' })).toBe(
      'http://interno.test',
    );
  });

  it('quita las barras finales para no generar URLs con doble barra', () => {
    expect(resolveSiteUrl({ SITE_URL: 'https://ejemplo.test//' })).toBe('https://ejemplo.test');
  });

  it('ignora valores vacíos o compuestos solo por espacios', () => {
    expect(resolveSiteUrl({ SITE_URL: '   ', VERCEL_PROJECT_PRODUCTION_URL: '' })).toBe(
      SITE_URL_FALLBACK,
    );
  });

  it('cae en el respaldo cuando no hay nada configurado', () => {
    expect(resolveSiteUrl({})).toBe(SITE_URL_FALLBACK);
  });

  it('el respaldo es la URL real del proyecto, no un dominio de terceros', () => {
    expect(SITE_URL_FALLBACK).not.toContain('vibegrab.com');
    expect(SITE_URL_FALLBACK.startsWith('https://')).toBe(true);
  });
});
