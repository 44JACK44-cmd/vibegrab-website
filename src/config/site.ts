/**
 * Configuración central del proyecto.
 *
 * Todo lo que es "dato del negocio" vive aquí. Si algo no es verificable
 * todavía, se deja vacío y la interfaz lo indica en lugar de inventarlo.
 */
import { publicEnv, serverEnv } from '@/lib/env';

const REPO_FALLBACK = '44JACK44-cmd/vibeGrab';
const SITE_URL_FALLBACK = 'https://vibegrab.com';

/** Datos técnicos comprobados en el propio proyecto Flutter. */
export const android = {
  /** `android:minSdkVersion` del manifiesto combinado del APK. */
  minSdk: 24,
  /** `android:targetSdkVersion` del manifiesto combinado del APK. */
  targetSdk: 36,
  /** Etiqueta legible equivalente a `minSdk` 24. */
  minVersionLabel: { es: 'Android 7.0', en: 'Android 7.0' },
} as const;

/** Identidad del producto. */
export const product = {
  name: 'VibeGrab',
  /** Descripción real declarada en `mobile/pubspec.yaml`. */
  shortDescription: {
    es: 'Descargador y reproductor multimedia para Android',
    en: 'Media downloader and player for Android',
  },
  tagline: {
    es: 'Tu contenido. Tu experiencia multimedia.',
    en: 'Your content. Your media experience.',
  },
} as const;

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export const siteConfig = {
  product,
  android,

  /** URL canónica. Configurable con `SITE_URL`. */
  url: normalizeUrl(publicEnv('SITE_URL') ?? serverEnv('SITE_URL') ?? SITE_URL_FALLBACK),

  /** Repositorio de publicación de releases. Configurable con `GITHUB_REPO`. */
  repo: serverEnv('GITHUB_REPO') ?? REPO_FALLBACK,

  /**
   * Canales de contacto. Vacíos a propósito: no inventamos correos ni foros.
   * Rellena `CONTACT_EMAIL` / `SUPPORT_URL` cuando existan de verdad.
   */
  contact: {
    email: publicEnv('CONTACT_EMAIL') ?? serverEnv('CONTACT_EMAIL') ?? '',
    supportUrl: publicEnv('SUPPORT_URL') ?? serverEnv('SUPPORT_URL') ?? '',
  },

  /** Metadatos SEO por defecto. */
  seo: {
    twitterCard: 'summary_large_image',
    ogImage: '/og-image.png',
    ogImageEn: '/og-image-en.png',
    themeColor: '#05070B',
  },
} as const;

export const isContactConfigured = (): boolean =>
  siteConfig.contact.email !== '' || siteConfig.contact.supportUrl !== '';

/** Aviso en consola durante el desarrollo si falta configuración de negocio. */
let warnedAboutPendingConfig = false;

export function warnAboutPendingConfig(): void {
  if (warnedAboutPendingConfig || isContactConfigured()) return;
  warnedAboutPendingConfig = true;
  const message = [
    '[VibeGrab] Falta configurar el canal de soporte.',
    'Define CONTACT_EMAIL y/o SUPPORT_URL en .env para que /contacto y /ayuda',
    'muestren vías reales de contacto. Ahora mismo la web lo indica como pendiente.',
  ].join(' ');
  // eslint-disable-next-line no-console
  console.warn(message);
}
