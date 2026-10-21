/**
 * Configuración central del proyecto.
 *
 * Todo lo que es "dato del negocio" vive aquí. Si algo no es verificable
 * todavía, se deja vacío y la interfaz lo indica en lugar de inventarlo.
 */
import { resolveSiteUrl } from '@/config/site-url';
import { publicEnv, serverEnv } from '@/lib/env';

const REPO_FALLBACK = '44JACK44-cmd/vibeGrab';

/**
 * Canales de contacto publicados por el responsable del proyecto.
 *
 * Son datos reales facilitados por el desarrollador. Se pueden sobrescribir
 * con variables de entorno (`CONTACT_PHONE`, `CONTACT_PHONE_E164`,
 * `CONTACT_FACEBOOK`, `CONTACT_TIKTOK`) sin tocar el código.
 */
const CONTACT_FALLBACK = {
  /** Teléfono tal como se publica. */
  phone: '944 834 202',
  /**
   * Formato internacional para el enlace `tel:`. Permite marcar el número con
   * un clic desde el móvil.
   */
  phoneE164: '+51944834202',
  facebook: 'https://www.facebook.com/amilcar.aymaraenciso.1',
  tiktok: 'https://www.tiktok.com/@4_jck_6',
} as const;

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
  /**
   * Descripción de la marca. Es la que se usa en el nodo `WebSite` del
   * JSON-LD y como base de las descripciones de las páginas.
   */
  description: {
    es: 'VibeGrab es un descargador y reproductor multimedia para Android: descarga vídeo y audio, reproduce con ecualizador y letra sincronizada, y organiza tu biblioteca en el propio teléfono, sin cuentas ni nube.',
    en: 'VibeGrab is a media downloader and player for Android: download video and audio, play with equalizer and synced lyrics, and keep your library on your own phone, with no accounts and no cloud.',
  },
  /** Claim principal, el que identifica la app junto a su nombre. */
  claim: {
    es: 'Descargador y reproductor multimedia para Android',
    en: 'Media downloader and player for Android',
  },
} as const;

export const siteConfig = {
  product,
  android,

  /**
   * URL canónica. Se resuelve en `@/config/site-url`: primero `SITE_URL`, luego
   * el dominio que inyecta la plataforma (Render o Vercel) y, por último, el
   * respaldo.
   */
  url: resolveSiteUrl({
    SITE_URL: publicEnv('SITE_URL') ?? serverEnv('SITE_URL'),
    PUBLIC_URL: publicEnv('PUBLIC_URL') ?? serverEnv('PUBLIC_URL'),
    RENDER_EXTERNAL_URL:
      publicEnv('RENDER_EXTERNAL_URL') ?? serverEnv('RENDER_EXTERNAL_URL'),
    VERCEL_PROJECT_PRODUCTION_URL: serverEnv('VERCEL_PROJECT_PRODUCTION_URL'),
  }),

  /** Repositorio de publicación de releases. Configurable con `GITHUB_REPO`. */
  repo: serverEnv('GITHUB_REPO') ?? REPO_FALLBACK,

  /**
   * Canales de contacto. El correo sigue vacío porque no hay ninguna
   * dirección de correo publicada: no se inventa ninguna.
   */
  contact: {
    email: publicEnv('CONTACT_EMAIL') ?? serverEnv('CONTACT_EMAIL') ?? '',
    supportUrl: publicEnv('SUPPORT_URL') ?? serverEnv('SUPPORT_URL') ?? '',
    phone:
      publicEnv('CONTACT_PHONE') ?? serverEnv('CONTACT_PHONE') ?? CONTACT_FALLBACK.phone,
    phoneE164:
      publicEnv('CONTACT_PHONE_E164') ??
      serverEnv('CONTACT_PHONE_E164') ??
      CONTACT_FALLBACK.phoneE164,
    facebook:
      publicEnv('CONTACT_FACEBOOK') ??
      serverEnv('CONTACT_FACEBOOK') ??
      CONTACT_FALLBACK.facebook,
    tiktok:
      publicEnv('CONTACT_TIKTOK') ??
      serverEnv('CONTACT_TIKTOK') ??
      CONTACT_FALLBACK.tiktok,
  },

  /**
   * Redes sociales oficiales del proyecto. Solo se publica lo que está
   * configurado de verdad.
   */
  social: [
    {
      id: 'facebook',
      label: { es: 'Facebook', en: 'Facebook' },
      url:
        publicEnv('CONTACT_FACEBOOK') ??
        serverEnv('CONTACT_FACEBOOK') ??
        CONTACT_FALLBACK.facebook,
      icon: 'globe',
    },
    {
      id: 'tiktok',
      label: { es: 'TikTok', en: 'TikTok' },
      url:
        publicEnv('CONTACT_TIKTOK') ??
        serverEnv('CONTACT_TIKTOK') ??
        CONTACT_FALLBACK.tiktok,
      icon: 'music',
    },
  ].filter((link) => link.url !== ''),

  /** Metadatos SEO por defecto. */
  seo: {
    twitterCard: 'summary_large_image',
    ogImage: '/og-image.png',
    ogImageEn: '/og-image-en.png',
    themeColor: '#05070B',
  },
} as const;

export const isContactConfigured = (): boolean =>
  siteConfig.contact.email !== '' ||
  siteConfig.contact.supportUrl !== '' ||
  siteConfig.contact.phone !== '' ||
  siteConfig.social.length > 0;

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
