/**
 * Pruebas de las rutas de descarga y verificación.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET as downloadRoute } from '@/pages/api/download';
import { GET as verifyRoute } from '@/pages/api/verify';
import { resetReleasesCache } from '@/lib/releases';

const REPO = '44JACK44-cmd/vibeGrab';
const TAG = 'v1.1.35-40';
const ASSET = `https://github.com/${REPO}/releases/download/${TAG}/VibeGrab.apk`;

const release = {
  tag_name: TAG,
  name: TAG,
  body: '- Cambios',
  published_at: '2026-10-17T22:01:51Z',
  html_url: `https://github.com/${REPO}/releases/tag/${TAG}`,
  assets: [
    {
      name: 'VibeGrab.apk',
      size: 66642111,
      digest: 'sha256:a6489f5e44dee1e5c76e026661a8674d421e9cbb0cff6c877f12ff2d4396debd',
      browser_download_url: ASSET,
      state: 'uploaded',
    },
  ],
};

function apiResponse(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function stubFetch(options: { assetStatus?: number } = {}) {
  const spy = vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (url.startsWith('https://api.github.com/')) return apiResponse([release]);
    if (url === ASSET) {
      const status = options.assetStatus ?? 206;
      return new Response(null, {
        status,
        headers: status === 206 ? { 'Content-Range': 'bytes 0-0/66642111' } : {},
      });
    }
    return new Response('not found', { status: 404 });
  });
  globalThis.fetch = spy as unknown as typeof fetch;
  return spy;
}

const realFetch = globalThis.fetch;

function routeContext(url: string) {
  return { url: new URL(url) } as unknown as Parameters<typeof downloadRoute>[0];
}

beforeEach(() => {
  resetReleasesCache();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-18T00:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
  globalThis.fetch = realFetch;
  vi.unstubAllGlobals();
  resetReleasesCache();
});

describe('/api/download', () => {
  it('redirige al APK real de la última estable', async () => {
    stubFetch();

    const response = await downloadRoute(routeContext('https://vibegrab.example/api/download'));
    const location = response.headers.get('location');

    expect(response.status).toBe(302);
    expect(location).toBe(ASSET);
    expect(response.headers.get('x-vibegrab-version')).toBe(TAG);
    expect(response.headers.get('cache-control')).toContain('no-store');
  });

  it('redirige al APK de una etiqueta concreta', async () => {
    stubFetch();

    const response = await downloadRoute(
      routeContext(`https://vibegrab.example/api/download?tag=${TAG}&lang=en`),
    );

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe(ASSET);
  });

  it('vuelve a la página indicando que la versión se retiró si la etiqueta no existe', async () => {
    stubFetch();

    const response = await downloadRoute(
      routeContext('https://vibegrab.example/api/download?tag=v9.9.9-99'),
    );
    const location = new URL(response.headers.get('location') ?? '');

    expect(response.status).toBe(302);
    expect(location.pathname).toBe('/descargar/');
    expect(location.searchParams.get('estado')).toBe('retirada');
  });

  it('indica que se retiró si el archivo ya no existe', async () => {
    stubFetch({ assetStatus: 404 });

    const response = await downloadRoute(
      routeContext('https://vibegrab.example/api/download?tag=' + TAG),
    );
    const location = new URL(response.headers.get('location') ?? '');

    expect(location.pathname).toBe('/descargar/');
    expect(location.searchParams.get('estado')).toBe('retirada');
  });

  it('indica un fallo temporal si la comprobación no se puede hacer', async () => {
    stubFetch({ assetStatus: 500 });

    const response = await downloadRoute(
      routeContext('https://vibegrab.example/api/download?tag=' + TAG),
    );
    const location = new URL(response.headers.get('location') ?? '');

    expect(location.searchParams.get('estado')).toBe('no-disponible');
  });

  it('redirige al dominio público del sitio, no al host interno', async () => {
    stubFetch();

    const response = await downloadRoute(
      routeContext('https://vibegrab.example/api/download?tag=v9.9.9-99'),
    );
    const location = new URL(response.headers.get('location') ?? '');

    // El host interno (por ejemplo `localhost:10000` detrás de un proxy)
    // nunca debe aparecer en una redirección para el usuario.
    expect(location.hostname).not.toBe('localhost');
    expect(location.hostname).toBe('vibegrab.jackae598.workers.dev');
  });

  it('usa la ruta inglesa cuando lang=en', async () => {
    stubFetch();

    const response = await downloadRoute(
      routeContext('https://vibegrab.example/api/download?tag=v9.9.9-99&lang=en'),
    );
    const location = new URL(response.headers.get('location') ?? '');

    expect(location.pathname).toBe('/en/download/');
  });
});

describe('/api/verify', () => {
  it('informa de que el APK está disponible', async () => {
    stubFetch();

    const response = await verifyRoute(routeContext(`https://vibegrab.example/api/verify?tag=${TAG}`));
    const data = (await response.json()) as { available: boolean; sizeBytes: number; tag: string };

    expect(data.available).toBe(true);
    expect(data.tag).toBe(TAG);
    expect(data.sizeBytes).toBe(66642111);
  });

  it('distingue una versión retirada de un fallo de comprobación', async () => {
    stubFetch();

    const response = await verifyRoute(
      routeContext('https://vibegrab.example/api/verify?tag=v9.9.9-99'),
    );
    const data = (await response.json()) as { available: boolean; reason: string };

    expect(data.available).toBe(false);
    expect(data.reason).toBe('not-found');
  });

  it('informa "not-found" cuando el archivo ya no existe', async () => {
    stubFetch({ assetStatus: 404 });

    const response = await verifyRoute(
      routeContext(`https://vibegrab.example/api/verify?tag=${TAG}`),
    );
    const data = (await response.json()) as { available: boolean; reason: string };

    expect(data.available).toBe(false);
    expect(data.reason).toBe('not-found');
  });

  it('informa "error" cuando la comprobación falla por red', async () => {
    stubFetch();
    globalThis.fetch = vi.fn(async () => {
      throw new Error('network down');
    }) as unknown as typeof fetch;

    const response = await verifyRoute(
      routeContext(`https://vibegrab.example/api/verify?tag=${TAG}`),
    );
    const data = (await response.json()) as { available: boolean; reason: string };

    expect(data.available).toBe(false);
    expect(data.reason).toBe('error');
  });
});
