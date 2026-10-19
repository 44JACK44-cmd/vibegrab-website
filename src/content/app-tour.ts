/**
 * Pantallas reales de la aplicación VibeGrab.
 *
 * Los nombres, las ubicaciones y el comportamiento están tomados del código
 * Flutter del propio proyecto (`mobile/lib/main.dart` y `mobile/lib/features/*`).
 * No se inventa ninguna pantalla: si algo no existe en el código, no aparece
 * aquí.
 *
 * Este contenido alimenta la sección de demostración de la web. Cuando existan
 * capturas reales, se añaden en `src/config/screenshots.ts` usando el mismo
 * identificador de pantalla.
 */
import type { LocalizedText } from '@/lib/releases';
import type { FeatureIcon } from '@/content/features';

export interface AppScreen {
  /** Identificador estable; es también la clave de la captura real, si existe. */
  id: string;
  /** Nombre de la pantalla tal como aparece en la app. */
  name: LocalizedText;
  /** Dónde se encuentra dentro de la aplicación. */
  location: LocalizedText;
  icon: FeatureIcon;
  /** Qué hace, en una frase. */
  summary: LocalizedText;
  /** Detalles concretos que la pantalla ofrece. */
  highlights: LocalizedText[];
  /** `true` si es una de las seis pestañas principales. */
  tab?: boolean;
}

/** Las seis pestañas de la barra inferior (`main.dart`, `IndexedStack`). */
export const appTabs: AppScreen[] = [
  {
    id: 'explore',
    name: { es: 'Explorar', en: 'Explore' },
    location: { es: 'Primera pestaña', en: 'First tab' },
    icon: 'compass',
    tab: true,
    summary: {
      es: 'El punto de partida: tendencias, categorías y un feed «para ti» para buscar contenido sin salir de la app.',
      en: 'The starting point: trending, categories and a “for you” feed to search for content without leaving the app.',
    },
    highlights: [
      { es: 'Tendencias y categorías con búsqueda', en: 'Trending and categories with search' },
      { es: 'Feed «para ti» y carruseles de contenido', en: '“For you” feed and content rails' },
      { es: 'Continuar viendo y recomendados', en: 'Continue watching and recommended' },
      { es: 'Sección de Shorts', en: 'Shorts section' },
    ],
  },
  {
    id: 'browser',
    name: { es: 'Navegador', en: 'Browser' },
    location: { es: 'Segunda pestaña', en: 'Second tab' },
    icon: 'browser',
    tab: true,
    summary: {
      es: 'Un navegador dentro de la app, con accesos directos a las plataformas más usadas y descarga directa de lo que estás viendo.',
      en: 'A browser inside the app, with shortcuts to the most used platforms and direct download of what you are watching.',
    },
    highlights: [
      { es: 'Página de inicio con accesos a plataformas', en: 'Home page with platform shortcuts' },
      { es: 'Detección de páginas de medios', en: 'Media page detection' },
      { es: 'Descarga de lo que estás viendo en un toque', en: 'Download what you are watching in one tap' },
    ],
  },
  {
    id: 'analyzer',
    name: { es: 'Analizar', en: 'Analyse' },
    location: { es: 'Tercera pestaña', en: 'Third tab' },
    icon: 'link',
    tab: true,
    summary: {
      es: 'Pega una dirección y VibeGrab te dice en qué formatos y calidades está disponible antes de descargar.',
      en: 'Paste an address and VibeGrab tells you which formats and qualities are available before you download.',
    },
    highlights: [
      { es: 'Selector de formatos de descarga', en: 'Download format picker' },
      { es: 'Historial de los últimos enlaces analizados', en: 'History of recently analysed links' },
    ],
  },
  {
    id: 'downloads',
    name: { es: 'Descargas', en: 'Downloads' },
    location: { es: 'Cuarta pestaña', en: 'Fourth tab' },
    icon: 'download',
    tab: true,
    summary: {
      es: 'Las tareas en curso y las terminadas, con progreso real, reintento, cancelación y acceso rápido al archivo.',
      en: 'Running and finished tasks, with real progress, retry, cancellation and quick access to the file.',
    },
    highlights: [
      { es: 'Cola con progreso en vivo', en: 'Queue with live progress' },
      { es: 'Reintentar, cancelar y reabrir', en: 'Retry, cancel and reopen' },
      { es: 'Notificación con acciones de cancelar y abrir', en: 'Notification with cancel and open actions' },
    ],
  },
  {
    id: 'library',
    name: { es: 'Biblioteca', en: 'Library' },
    location: { es: 'Quinta pestaña', en: 'Fifth tab' },
    icon: 'library',
    tab: true,
    summary: {
      es: 'Todo lo que has guardado, más los vídeos y audios que ya tenías en el teléfono, con buscador, filtros y orden.',
      en: 'Everything you saved, plus the videos and audio already on your phone, with search, filters and sorting.',
    },
    highlights: [
      { es: 'Filtros: todos, vídeos, audio, favoritos e historial', en: 'Filters: all, videos, audio, favourites and history' },
      { es: 'Vista de rejilla o de lista', en: 'Grid or list view' },
      { es: 'Reanudar la reproducción desde la biblioteca', en: 'Resume playback from the library' },
    ],
  },
  {
    id: 'settings',
    name: { es: 'Configuración', en: 'Settings' },
    location: { es: 'Sexta pestaña', en: 'Sixth tab' },
    icon: 'sliders',
    tab: true,
    summary: {
      es: 'Todo lo que se puede ajustar: descargas, comportamiento, notificaciones, apariencia, servidor y herramientas.',
      en: 'Everything you can adjust: downloads, behaviour, notifications, appearance, server and tools.',
    },
    highlights: [
      { es: 'Calidad por defecto y descargas simultáneas', en: 'Default quality and simultaneous downloads' },
      { es: 'Tema, acento e idioma', en: 'Theme, accent and language' },
      { es: 'Diagnóstico de red y estado del servidor', en: 'Network diagnostics and server status' },
      { es: 'Leer las novedades de cada versión', en: 'Read the changes in every version' },
    ],
  },
];

/** Pantallas a las que se entra desde dentro de la aplicación. */
export const appSecondaryScreens: AppScreen[] = [
  {
    id: 'shorts',
    name: { es: 'Shorts', en: 'Shorts' },
    location: { es: 'Desde Explorar', en: 'From Explore' },
    icon: 'video',
    summary: {
      es: 'Feed vertical de vídeos cortos con reproducción encadenada y controles multimedia del sistema sincronizados.',
      en: 'A vertical feed of short videos with chained playback and system media controls in sync.',
    },
    highlights: [
      { es: 'Auto-avance entre vídeos', en: 'Auto-advance between videos' },
      { es: 'Notificación y sesión multimedia al día', en: 'Notification and media session up to date' },
    ],
  },
  {
    id: 'video-detail',
    name: { es: 'Detalle de vídeo', en: 'Video detail' },
    location: { es: 'Desde Explorar o el navegador', en: 'From Explore or the browser' },
    icon: 'message',
    summary: {
      es: 'La ficha completa de un vídeo: descripción, comentarios, relacionados y las opciones de descarga.',
      en: 'The full page for a video: description, comments, related videos and the download options.',
    },
    highlights: [
      { es: 'Descargar como vídeo, como audio o guardar la imagen', en: 'Download as video, as audio or save the image' },
      { es: 'Comentarios y vídeos relacionados', en: 'Comments and related videos' },
      { es: 'Picture-in-Picture desde los controles', en: 'Picture-in-Picture from the controls' },
    ],
  },
  {
    id: 'media-player',
    name: { es: 'Reproductor', en: 'Player' },
    location: { es: 'Desde la biblioteca', en: 'From the library' },
    icon: 'video',
    summary: {
      es: 'Reproductor de vídeo y de audio a pantalla completa, con cola, ecualizador, letra sincronizada y gestures de brillo y volumen.',
      en: 'Full-screen video and audio playback, with the queue, equaliser, synced lyrics and brightness and volume gestures.',
    },
    highlights: [
      { es: 'Controles de reproducción y cola', en: 'Playback controls and queue' },
      { es: 'Ecualizador y letra sincronizada', en: 'Equaliser and synced lyrics' },
      { es: 'Gestos de brillo y volumen', en: 'Brightness and volume gestures' },
    ],
  },
  {
    id: 'vault',
    name: { es: 'Bóveda privada', en: 'Private vault' },
    location: { es: 'Desde Configuración', en: 'From Settings' },
    icon: 'lock',
    summary: {
      es: 'Una sección separada, protegida con PIN, para los archivos que no quieres tener a la vista.',
      en: 'A separate, PIN-protected section for the files you would rather not have on display.',
    },
    highlights: [
      { es: 'PIN de cuatro dígitos con hash y sal', en: 'Four-digit PIN stored hashed and salted' },
      { es: 'Bloqueo tras varios intentos fallidos', en: 'Lockout after several failed attempts' },
    ],
  },
  {
    id: 'trash',
    name: { es: 'Papelera', en: 'Trash' },
    location: { es: 'Desde Configuración', en: 'From Settings' },
    icon: 'trash',
    summary: {
      es: 'Lo que borras no desaparece al instante: se puede restaurar durante siete días.',
      en: 'What you delete does not vanish at once: it can be restored for seven days.',
    },
    highlights: [
      { es: 'Restaurar o eliminar definitivamente', en: 'Restore or delete permanently' },
      { es: 'Vaciado automático a los 7 días', en: 'Automatic purge after 7 days' },
    ],
  },
];

/** Todas las pantallas, pestañas primero. */
export const appScreens: AppScreen[] = [...appTabs, ...appSecondaryScreens];
