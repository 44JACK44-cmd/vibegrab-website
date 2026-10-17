/**
 * Características reales de VibeGrab.
 *
 * Cada entrada corresponde a un módulo existente en el proyecto Flutter
 * (`mobile/lib/features/*`) o a una función confirmada en el catálogo de
 * novedades que la propia app muestra al usuario. No se incluye nada que
 * esté solo planificado.
 */
import type { LocalizedText } from '@/lib/releases';

export type FeatureIcon =
  | 'download'
  | 'video'
  | 'music'
  | 'library'
  | 'heart'
  | 'history'
  | 'lock'
  | 'trash'
  | 'background'
  | 'share'
  | 'browser'
  | 'compass'
  | 'refresh'
  | 'sliders';

export type FeatureGroup = 'download' | 'play' | 'organise' | 'discover';

export interface Feature {
  id: string;
  icon: FeatureIcon;
  group: FeatureGroup;
  /** Aparece también en la portada. */
  featured?: boolean;
  title: LocalizedText;
  text: LocalizedText;
}

export const featureGroupLabels: Record<FeatureGroup, LocalizedText> = {
  download: { es: 'Descargar', en: 'Download' },
  play: { es: 'Reproducir', en: 'Play' },
  organise: { es: 'Organizar', en: 'Organise' },
  discover: { es: 'Descubrir y mantener', en: 'Discover & maintain' },
};

export const features: Feature[] = [
  {
    id: 'video-audio',
    icon: 'download',
    group: 'download',
    featured: true,
    title: { es: 'Descarga de vídeo y audio', en: 'Video and audio downloading' },
    text: {
      es: 'Pega un enlace, analízalo y elige el formato y la calidad que quieras guardar. El vídeo y el audio se combinan en un único archivo.',
      en: 'Paste a link, analyse it and pick the format and quality you want to keep. Video and audio are combined into a single file.',
    },
  },
  {
    id: 'background-downloads',
    icon: 'background',
    group: 'download',
    featured: true,
    title: { es: 'Descargas en segundo plano', en: 'Background downloads' },
    text: {
      es: 'Las descargas continúan mientras usas otras apps, con progreso real en la notificación. Si algo se interrumpe, la tarea se reanuda al volver a abrir VibeGrab.',
      en: 'Downloads keep running while you use other apps, with real progress in the notification. If something is interrupted, the task resumes when you reopen VibeGrab.',
    },
  },
  {
    id: 'share',
    icon: 'share',
    group: 'download',
    featured: true,
    title: { es: 'Comparte y descarga al momento', en: 'Share and download instantly' },
    text: {
      es: 'Comparte un enlace desde TikTok, Instagram, Kwai u otra app y VibeGrab abre una hoja flotante para elegir el formato y descargar sin entrar en la aplicación.',
      en: 'Share a link from TikTok, Instagram, Kwai or another app and VibeGrab opens a floating sheet to choose the format and download without opening the app.',
    },
  },
  {
    id: 'local-library',
    icon: 'library',
    group: 'organise',
    featured: true,
    title: { es: 'Biblioteca en tu teléfono', en: 'Library on your phone' },
    text: {
      es: 'Los vídeos se guardan en Movies/VibeGrab, visibles desde la galería del sistema. Tu biblioteca es tuya: no depende de ningún servicio en la nube.',
      en: 'Videos are saved to Movies/VibeGrab, visible from your system gallery. Your library is yours: it does not depend on any cloud service.',
    },
  },
  {
    id: 'player',
    icon: 'video',
    group: 'play',
    featured: true,
    title: { es: 'Reproductor de vídeo completo', en: 'Full video player' },
    text: {
      es: 'Reproduce tus descargas dentro de la app con controles de avance, cola de reproducción y ventana flotante (Picture-in-Picture) para seguir viendo mientras haces otras cosas.',
      en: 'Play your downloads inside the app with seeking controls, a playback queue and Picture-in-Picture to keep watching while you do something else.',
    },
  },
  {
    id: 'audio',
    icon: 'music',
    group: 'play',
    featured: true,
    title: { es: 'Música en segundo plano', en: 'Background music' },
    text: {
      es: 'Reproducción de audio en segundo plano con los controles en la notificación del sistema, ecualizador con preajustes y letra sincronizada cuando está disponible.',
      en: 'Background audio playback with controls in the system notification, an equalizer with presets and synced lyrics when available.',
    },
  },
  {
    id: 'favourites',
    icon: 'heart',
    group: 'organise',
    title: { es: 'Favoritos', en: 'Favourites' },
    text: {
      es: 'Marca lo que quieres volver a encontrar y tenlo a un toque, separado del resto de la biblioteca.',
      en: 'Mark what you want to find again and keep it one tap away, separate from the rest of the library.',
    },
  },
  {
    id: 'history',
    icon: 'history',
    group: 'organise',
    title: { es: 'Historial', en: 'History' },
    text: {
      es: 'Consulta lo que has reproducido y descargado para retomarlo sin buscarlo otra vez.',
      en: 'Check what you have played and downloaded so you can pick it up again without searching.',
    },
  },
  {
    id: 'vault',
    icon: 'lock',
    group: 'organise',
    title: { es: 'Bóveda privada', en: 'Private vault' },
    text: {
      es: 'Mueve archivos a una sección protegida con PIN, fuera de la vista de la biblioteca normal.',
      en: 'Move files to a PIN-protected section, out of sight from the regular library.',
    },
  },
  {
    id: 'trash',
    icon: 'trash',
    group: 'organise',
    title: { es: 'Papelera con margen de error', en: 'Trash with a safety net' },
    text: {
      es: 'Lo que borras pasa a la papelera y se elimina definitivamente a los 7 días, así que un toque equivocado no cuesta el archivo.',
      en: 'Deleted items go to the trash and are removed permanently after 7 days, so a wrong tap does not cost you the file.',
    },
  },
  {
    id: 'browser',
    icon: 'browser',
    group: 'discover',
    title: { es: 'Navegador integrado', en: 'Built-in browser' },
    text: {
      es: 'Abre cualquier web dentro de VibeGrab, con accesos rápidos a los sitios más usados, y descarga lo que estás viendo en un toque.',
      en: 'Open any website inside VibeGrab, with quick shortcuts to popular sites, and download what you are watching in one tap.',
    },
  },
  {
    id: 'explore',
    icon: 'compass',
    group: 'discover',
    title: { es: 'Explorar', en: 'Explore' },
    text: {
      es: 'Busca contenido para reproducir o descargar sin salir de la app, con sugerencias adaptadas a tu región e idioma.',
      en: 'Search for content to play or download without leaving the app, with suggestions tailored to your region and language.',
    },
  },
  {
    id: 'updater',
    icon: 'refresh',
    group: 'discover',
    title: { es: 'Actualizaciones desde la app', en: 'In-app updates' },
    text: {
      es: 'VibeGrab avisa cuando hay una versión nueva, resume los cambios y permite descargarla e instalarla. Incluye una pantalla de novedades por versión.',
      en: 'VibeGrab tells you when a new version is out, summarises the changes and lets you download and install it. It includes a per-version what\u2019s-new screen.',
    },
  },
  {
    id: 'settings',
    icon: 'sliders',
    group: 'discover',
    title: { es: 'Ajustes y dos idiomas', en: 'Settings and two languages' },
    text: {
      es: 'Tema, opciones de reproducción y descarga, y la interfaz en español o inglés.',
      en: 'Theme, playback and download options, and the interface in Spanish or English.',
    },
  },
];
