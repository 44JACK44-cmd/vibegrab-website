/**
 * Métricas verificables del producto.
 *
 * Todas las cifras de aquí proceden de dos fuentes comprobables: la API
 * pública de GitHub Releases y el propio código del proyecto. No seEstimate
 * ningún dato: si un valor no existe, se devuelve `null` y la interfaz lo
 * omite en lugar de rellenarlo.
 *
 * Sobre las descargas: el contador `download_count` de GitHub indica **cuántas
 * veces se ha descargado el archivo**, no cuántas personas lo han hecho ni
 * cuántas instalaciones hay. Un mismo usuario puede descargar el APK varias
 * veces y una misma descarga puede venir de un enlace compartido. Por eso la
 * web lo etiqueta siempre como "descargas del archivo" y nunca como usuarios.
 */
import type { ReleasesPayload } from '@/lib/releases';

export interface ProductStats {
  /** Versión estable actual, por ejemplo `1.1.35`. */
  latestVersion: string | null;
  /** Compilación de la versión estable actual. */
  latestBuild: number | null;
  /** Fecha real de publicación de la versión estable. */
  latestPublishedAt: string | null;
  /** Número de publicaciones no preliminares con APK. */
  stableReleaseCount: number;
  /** Número total de publicaciones (incluye preliminares). */
  releaseCount: number;
  /** Número de versiones preliminares. */
  prereleaseCount: number;
  /** Tamaño en bytes del APK de la versión estable. */
  apkSizeBytes: number | null;
  /** Huella SHA-256 del APK de la versión estable. */
  sha256: string | null;
  /** Descargas del archivo APK de la versión estable, según GitHub. */
  apkDownloadCount: number | null;
  /** Suma de las descargas de todos los APK publicados, según GitHub. */
  totalDownloadCount: number;
}

/** Recoge las métricas verificables de un payload de releases. */
export function collectStats(payload: ReleasesPayload): ProductStats {
  const latest = payload.latest;
  const downloadable = payload.releases.filter((release) => release.apk !== null);

  const totalDownloadCount = downloadable.reduce(
    (total, release) => total + (release.apk?.downloadCount ?? 0),
    0,
  );

  return {
    latestVersion: latest?.version ?? null,
    latestBuild: latest?.build ?? null,
    latestPublishedAt: latest?.publishedAt ?? null,
    stableReleaseCount: payload.releases.filter(
      (release) => !release.prerelease && release.apk !== null,
    ).length,
    releaseCount: payload.releases.length,
    prereleaseCount: payload.releases.filter((release) => release.prerelease).length,
    apkSizeBytes: latest?.apk?.sizeBytes ?? null,
    sha256: latest?.apk?.sha256 ?? null,
    apkDownloadCount: latest?.apk ? latest.apk.downloadCount : null,
    totalDownloadCount,
  };
}

/**
 * Explica qué significa (y qué no) el contador de descargas del archivo.
 * Se muestra junto a la cifra para que nadie lo lea como número de usuarios.
 * No se menciona dónde se alojan los archivos: la web no expone sus
 * repositories.
 */
export const downloadCountCaveat = {
  es: 'Suma de todas las versiones publicadas. No equivalen a usuarios: una misma persona puede descargar el APK más de una vez.',
  en: 'Sum of every published version. They are not users: the same person can download the APK more than once.',
} as const;
