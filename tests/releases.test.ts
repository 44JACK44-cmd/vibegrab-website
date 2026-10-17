/**
 * Pruebas de la integración con GitHub Releases.
 *
 * No llaman a GitHub de verdad: se sustituye `fetch` por respuestas
 * controladas. Cubren selección de la versión estable, exclusión de
 * borradores/preliminares, validación de assets, caché, respaldo y errores.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getReleases,
  isRepoAssetUrl,
  parseReleaseNotes,
  parseTag,
  resetReleasesCache,
  compareVersions,
} from '@/lib/releases';

const REPO = '44JACK44-cmd/vibeGrab';
const API = `https://api.github.com/repos/${REPO}/releases?per_page=100`;

type RawAsset = {
  name: string;
  size: number;
  browser_download_url: string;
  digest?: string | null;
  state?: string;
};

type RawRelease = {
  tag_name: string;
  name?: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
  published_at?: string;
  created_at?: string;
  html_url?: string;
  assets?: RawAsset[];
};

function apk(tag: string, overrides: Partial<RawAsset> = {}): RawAsset {
  return {
    name: 'VibeGrab.apk',
    size: 12345678,
    digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    browser_download_url: `https://github.com/${REPO}/releases/download/${tag}/VibeGrab.apk`,
    state: 'uploaded',
    ...overrides,
  };
}

function release(tag: string, publishedAt: string, extra: Partial<RawRelease> = {}): RawRelease {
  return {
    tag_name: tag,
    name: tag,
    body: '## Mejoras\n- Algo mejorado',
    published_at: publishedAt,
    html_url: `https://github.com/${REPO}/releases/tag/${tag}`,
    assets: [apk(tag)],
    ...extra,
  };
}

function jsonResponse(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    ...init,
  });
}

function stubFetch(handler: (url: string, init?: RequestInit) => Promise<Response>) {
  const spy = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    return handler(url, init);
  });
  vi.stubGlobal('fetch', spy);
  return spy;
}

beforeEach(() => {
  resetReleasesCache();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-18T00:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  resetReleasesCache();
});

describe('utilidades de versión', () => {
  it('acepta solo el formato de etiqueta de la app', () => {
    expect(parseTag('v1.1.35-40')).toEqual({ version: '1.1.35', build: 40 });
    expect(parseTag('1.1.35-40')).toBeNull();
    expect(parseTag('v1.1-3')).toBeNull();
    expect(parseTag('v1.1.35')).toBeNull();
  });

  it('compara números de versión sin ordenar por cadena', () => {
    expect(compareVersions('1.1.35', '1.2.0')).toBe(-1);
    expect(compareVersions('1.10.0', '1.9.0')).toBe(1);
    expect(compareVersions('1.1.35', '1.1.35')).toBe(0);
  });
});

describe('validación de enlaces de descarga', () => {
  const valid = `https://github.com/${REPO}/releases/download/v1.1.35-40/VibeGrab.apk`;

  it('acepta un asset del repositorio configurado', () => {
    expect(isRepoAssetUrl(valid)).toBe(true);
  });

  it('rechaza otros dominios, otros repos y rutas que no son de descarga', () => {
    expect(isRepoAssetUrl('https://evil.example/vibegrab.apk')).toBe(false);
    expect(isRepoAssetUrl(valid.replace('https://', 'http://'))).toBe(false);
    expect(isRepoAssetUrl(valid.replace(REPO, 'otro/repo'))).toBe(false);
    expect(isRepoAssetUrl(`https://github.com/${REPO}/releases/tag/v1.1.35-40`)).toBe(false);
    expect(isRepoAssetUrl(`https://github.com/${REPO}/archive/refs/heads/main.zip`)).toBe(false);
  });
});

describe('notas de versión', () => {
  it('agrupa encabezados reconocidos y conserva el texto', () => {
    const parsed = parseReleaseNotes(
      ['## Nuevas funciones', '- Descarga en segundo plano', '', '**Correcciones**', '- Fallo al reanudar'].join(
        '\n',
      ),
    );
    expect(parsed.structured).toBe(true);
    expect(parsed.sections.map((section) => section.category)).toEqual(['features', 'fixes']);
    expect(parsed.sections[0].items[0].text.es).toBe('Descarga en segundo plano');
    expect(parsed.sections[1].items[0].text.es).toBe('Fallo al reanudar');
  });

  it('no pierde texto sin estructura y lo marca como no estructurado', () => {
    const parsed = parseReleaseNotes('- fix: algo interno\n- otra línea');
    expect(parsed.structured).toBe(false);
    expect(parsed.sections).toHaveLength(1);
    expect(parsed.sections[0].category).toBe('changes');
    expect(parsed.sections[0].items).toHaveLength(2);
  });
});

describe('selección de la versión estable', () => {
  it('elige por fecha y no por número: 1.2.0 es más antigua que 1.1.35', async () => {
    const data = [
      release('v1.1.35-40', '2026-10-17T22:01:51Z'),
      release('v1.2.0-3', '2026-10-02T10:00:00Z'),
    ];
    stubFetch(async () => jsonResponse(data));

    const payload = await getReleases();

    expect(payload.latest?.tag).toBe('v1.1.35-40');
    expect(payload.source).toBe('github');
    expect(payload.releases[0].tag).toBe('v1.1.35-40');
    const older = payload.releases.find((item) => item.tag === 'v1.2.0-3');
    expect(older?.higherSemverThanStable).toBe(true);
  });

  it('excluye borradores de la lista y reserva los preliminares a su sección', async () => {
    stubFetch(async () =>
      jsonResponse([
        release('v1.3.0-50', '2026-10-20T10:00:00Z', { draft: true }),
        release('v1.3.0-49', '2026-10-19T10:00:00Z', { prerelease: true }),
        release('v1.1.35-40', '2026-10-17T22:01:51Z'),
      ]),
    );

    const payload = await getReleases();

    expect(payload.latest?.tag).toBe('v1.1.35-40');
    expect(payload.releases.map((item) => item.tag)).toEqual(['v1.3.0-49', 'v1.1.35-40']);
    expect(payload.releases[0].prerelease).toBe(true);
  });

  it('nunca ofrece como disponible una release sin APK', async () => {
    stubFetch(async () =>
      jsonResponse([
        release('v1.3.0-50', '2026-10-20T10:00:00Z', { assets: [] }),
        release('v1.1.35-40', '2026-10-17T22:01:51Z'),
      ]),
    );

    const payload = await getReleases();

    expect(payload.latest?.tag).toBe('v1.1.35-40');
    expect(payload.releases.find((item) => item.tag === 'v1.3.0-50')?.apk).toBeNull();
  });

  it('descarta un APK cuyo enlace no pertenece al repositorio', async () => {
    stubFetch(async () =>
      jsonResponse([
        release('v1.3.0-50', '2026-10-20T10:00:00Z', {
          assets: [apk('v1.3.0-50', { browser_download_url: 'https://evil.example/VibeGrab.apk' })],
        }),
        release('v1.1.35-40', '2026-10-17T22:01:51Z'),
      ]),
    );

    const payload = await getReleases();

    expect(payload.latest?.tag).toBe('v1.1.35-40');
    expect(payload.releases.find((item) => item.tag === 'v1.3.0-50')?.apk).toBeNull();
  });

  it('descarta un APK que pertenece a otra etiqueta del mismo repositorio', async () => {
    stubFetch(async () =>
      jsonResponse([
        release('v1.3.0-50', '2026-10-20T10:00:00Z', {
          assets: [apk('v1.1.35-40')],
        }),
        release('v1.1.35-40', '2026-10-17T22:01:51Z'),
      ]),
    );

    const payload = await getReleases();

    expect(payload.latest?.tag).toBe('v1.1.35-40');
    expect(payload.releases.find((item) => item.tag === 'v1.3.0-50')?.apk).toBeNull();
  });

  it('ignora assets que GitHub aún no ha terminado de subir', async () => {
    stubFetch(async () =>
      jsonResponse([
        release('v1.3.0-50', '2026-10-20T10:00:00Z', {
          assets: [apk('v1.3.0-50', { state: 'starter' })],
        }),
        release('v1.1.35-40', '2026-10-17T22:01:51Z'),
      ]),
    );

    const payload = await getReleases();

    expect(payload.latest?.tag).toBe('v1.1.35-40');
  });
});

describe('caché y tolerancia a fallos', () => {
  it('reutiliza la respuesta dentro del intervalo y no vuelve a llamar a GitHub', async () => {
    const spy = stubFetch(async () => jsonResponse([release('v1.1.35-40', '2026-10-17T22:01:51Z')]));

    await getReleases();
    await getReleases();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('si GitHub falla tras caducar la caché, sirve los últimos datos válidos y avisa', async () => {
    stubFetch(async () => jsonResponse([release('v1.1.35-40', '2026-10-17T22:01:51Z')]));
    const first = await getReleases();

    vi.advanceTimersByTime(11 * 60 * 1000);
    stubFetch(async () => new Response('boom', { status: 500 }));

    const second = await getReleases();

    expect(second.stale).toBe(true);
    expect(second.source).toBe('cache');
    expect(second.latest?.tag).toBe(first.latest?.tag);
    expect(second.fetchedAt).toBe(first.fetchedAt);
    expect(second.error).toContain('500');
  });

  it('sin caché previa, el fallo usa el snapshot incluido en el build', async () => {
    stubFetch(async () => {
      throw new Error('network down');
    });

    const payload = await getReleases();

    expect(payload.source).toBe('snapshot');
    expect(payload.stale).toBe(true);
    expect(payload.releases.length).toBeGreaterThan(0);
    expect(payload.latest?.tag).toBe('v1.1.35-40');
  });

  it('tras un fallo no insiste en cada petición (espera de reintento)', async () => {
    stubFetch(async () => new Response('nope', { status: 429 }));
    await getReleases();

    const spy = stubFetch(async () => jsonResponse([]));
    const second = await getReleases();

    expect(spy).not.toHaveBeenCalled();
    expect(second.stale).toBe(true);
  });

  it('gestiona una lista vacía sin inventar versiones', async () => {
    stubFetch(async () => jsonResponse([]));

    const payload = await getReleases();

    expect(payload.ok).toBe(false);
    expect(payload.latest).toBeNull();
    expect(payload.releases).toEqual([]);
  });

  it('una release nueva aparece sola al caducar la caché, sin tocar código', async () => {
    stubFetch(async () => jsonResponse([release('v1.1.35-40', '2026-10-17T22:01:51Z')]));
    const first = await getReleases();
    expect(first.latest?.tag).toBe('v1.1.35-40');

    vi.advanceTimersByTime(11 * 60 * 1000);
    stubFetch(async () =>
      jsonResponse([
        release('v1.1.36-41', '2026-10-19T09:00:00Z'),
        release('v1.1.35-40', '2026-10-17T22:01:51Z'),
      ]),
    );

    const second = await getReleases();

    expect(second.latest?.tag).toBe('v1.1.36-41');
    expect(second.releases[0].tag).toBe('v1.1.36-41');
    expect(second.stale).toBe(false);
  });

  it('revalida con ETag y reutiliza los datos cuando GitHub responde 304', async () => {
    const spy = stubFetch(async (_url, init) => {
      const headers = new Headers(init?.headers);
      if (headers.get('if-none-match') === '"etag-1"') {
        return new Response(null, { status: 304 });
      }
      return jsonResponse([release('v1.1.35-40', '2026-10-17T22:01:51Z')], {
        headers: { ETag: '"etag-1"' },
      });
    });

    const first = await getReleases();
    vi.advanceTimersByTime(11 * 60 * 1000);

    const second = await getReleases();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(second.stale).toBe(false);
    expect(second.source).toBe('cache');
    expect(second.releases).toEqual(first.releases);
    expect(API).toContain('releases?per_page=100');
  });
});
