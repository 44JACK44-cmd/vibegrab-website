/**
 * Seguridad, procedencia y uso responsable.
 *
 * Todo lo que se afirma aquí procede de la API pública de GitHub Releases, del
 * código de la aplicación y del funcionamiento real de esta web. No se
 * afirma que VibeGrab esté auditado, certificado ni libre de riesgos, porque
 * no existe ninguna prueba de eso.
 */
import type { LocalizedText } from '@/lib/releases';

export interface SecurityPoint {
  id: string;
  icon: string;
  title: LocalizedText;
  text: LocalizedText;
  /** Enlace interno relacionado. */
  link?: { key: 'privacy' | 'terms' | 'download' | 'versions' | 'contact'; label: LocalizedText };
}

export const securityPoints: SecurityPoint[] = [
  {
    id: 'source',
    icon: 'shield',
    title: { es: 'Una única fuente oficial', en: 'A single official source' },
    text: {
      es: 'Los APK se publican como archivos adjuntos de las versiones oficiales de GitHub y esta web los enlaza sin intermediarios. Cada botón apunta al archivo real, no a una copia.',
      en: 'The APKs are published as assets of the official GitHub releases and this site links to them without intermediaries. Every button points at the real file, not at a copy.',
    },
    link: { key: 'download', label: { es: 'Ver la descarga', en: 'See the download' } },
  },
  {
    id: 'integrity',
    icon: 'file-text',
    title: { es: 'Integridad comprobable', en: 'Verifiable integrity' },
    text: {
      es: 'Cada versión publica el tamaño exacto del archivo y su huella SHA-256. Puedes compararla con la del APK descargado para comprobar que no se ha modificado.',
      en: 'Every version publishes the exact file size and its SHA-256 fingerprint. You can compare it with the downloaded APK to check that it has not been altered.',
    },
    link: { key: 'versions', label: { es: 'Ver las versiones', en: 'See the versions' } },
  },
  {
    id: 'no-trackers',
    icon: 'shield',
    title: { es: 'Sin rastreadores ni publicidad', en: 'No trackers or advertising' },
    text: {
      es: 'La aplicación no incorpora SDK de analítica, publicidad ni informes de fallos de terceros. Tu biblioteca, tus ajustes y tu historial se quedan en el teléfono.',
      en: 'The app includes no third-party analytics, advertising or crash-reporting SDKs. Your library, settings and history stay on the phone.',
    },
    link: { key: 'privacy', label: { es: 'Leer la política', en: 'Read the policy' } },
  },
  {
    id: 'responsible',
    icon: 'lifebuoy',
    title: { es: 'Uso responsable', en: 'Responsible use' },
    text: {
      es: 'VibeGrab es una herramienta técnica. La responsabilidad de lo que descargas es tuya: respeta los derechos de autor y las condiciones de uso de cada plataforma.',
      en: 'VibeGrab is a technical tool. Responsibility for what you download is yours: respect copyright and each platform’s terms of use.',
    },
    link: { key: 'terms', label: { es: 'Términos de uso', en: 'Terms of use' } },
  },
];

/**
 * Limitaciones reales del producto. Se muestran para no prometer más de lo
 * que la aplicación hace.
 */
export const limitations: LocalizedText[] = [
  {
    es: 'Solo Android: la aplicación no tiene versión para iOS ni para ordenador.',
    en: 'Android only: the app has no iOS or desktop version.',
  },
  {
    es: 'Requiere Android 7.0 o superior y conexión a internet para analizar enlaces y descargar.',
    en: 'It requires Android 7.0 or newer and an internet connection to analyse links and download.',
  },
  {
    es: 'Se distribuye como APK fuera de Google Play, así que Android muestra el aviso de origen externo al instalar.',
    en: 'It is distributed as an APK outside Google Play, so Android shows the external-source warning when you install it.',
  },
  {
    es: 'El ecualizador depende del dispositivo: si Android no lo expone, el control aparece desactivado.',
    en: 'The equaliser depends on the device: if Android does not expose it, the control appears disabled.',
  },
  {
    es: 'La letra sincronizada solo aparece cuando la fuente de letras tiene esa canción.',
    en: 'Synced lyrics only appear when the lyrics source has that song.',
  },
];
