/**
 * Características reales de VibeGrab.
 *
 * Cada entrada corresponde a un módulo existente en el proyecto Flutter
 * (`mobile/lib/features/*`) o a una función confirmada en el catálogo de
 * novedades que la propia app muestra al usuario. No se incluye nada que
 * esté solo planificado, ni funciones que el código declare sin usar.
 *
 * Los iconos y el comportamiento se comprobaron en el código de la app:
 * pantallas (explore, browser, analyzer, downloads, library, settings),
 * servicios (media_engine, equalizer, lyrics, pip, vault, trash, update) y
 * canalizaciones nativas (MethodChannel `share`, `pip`, `equalizer`).
 */
import type { LocalizedText } from '@/lib/releases';
import type { FeatureVisualKind } from '@/components/FeatureVisual.astro';

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
  | 'sliders'
  | 'waveform'
  | 'lyrics'
  | 'pip'
  | 'queue'
  | 'activity'
  | 'palette'
  | 'translate'
  | 'image'
  | 'bell'
  | 'link'
  | 'message'
  | 'sparkles'
  | 'hard-drive';

export type FeatureGroup = 'download' | 'play' | 'organise' | 'discover' | 'tools';

/** Variante de composición: evita repetir siempre la misma tarjeta. */
export type FeatureLayout = 'standard' | 'wide';

export interface Feature {
  id: string;
  icon: FeatureIcon;
  group: FeatureGroup;
  /** Aparece también en la portada. */
  featured?: boolean;
  /** Se destaca con una composición horizontal grande en la portada. */
  spotlight?: boolean;
  title: LocalizedText;
  text: LocalizedText;
  /** Qué gana el usuario con esta función, en una frase. */
  benefit: LocalizedText;
  /**
   * Clave de la captura real que ilustra la función. Solo se rellena si la
   * captura existe: la web nunca inventa pantallas.
   */
  media?: string;
  /** Diagrama que explica la función cuando no hay captura real. */
  visual?: FeatureVisualKind;
}

export const featureGroupLabels: Record<FeatureGroup, LocalizedText> = {
  download: { es: 'Descargar', en: 'Download' },
  play: { es: 'Reproducir', en: 'Play' },
  organise: { es: 'Organizar', en: 'Organise' },
  discover: { es: 'Descubrir', en: 'Discover' },
  tools: { es: 'Utilidades', en: 'Tools' },
};

export const features: Feature[] = [
  /* ------------------------------------------------------------ Descargar */
  {
    id: 'video-audio',
    icon: 'download',
    group: 'download',
    featured: true,
    spotlight: true,
    visual: 'formats',
    title: { es: 'Descarga de vídeo y audio', en: 'Video and audio downloading' },
    text: {
      es: 'Pega un enlace, analízalo y elige el formato y la calidad que quieras guardar. El vídeo y el audio se combinan en un único archivo.',
      en: 'Paste a link, analyse it and pick the format and quality you want to keep. Video and audio are combined into a single file.',
    },
    benefit: {
      es: 'Guardas la calidad que quieres, no la que te imponen.',
      en: 'You keep the quality you want, not the one you are handed.',
    },
  },
  {
    id: 'background-downloads',
    icon: 'background',
    group: 'download',
    featured: true,
    spotlight: true,
    visual: 'queue',
    title: { es: 'Descargas en segundo plano', en: 'Background downloads' },
    text: {
      es: 'Las descargas continúan mientras usas otras apps, con progreso real en la notificación. Si algo se interrumpe, la tarea se reanuda al volver a abrir VibeGrab.',
      en: 'Downloads keep running while you use other apps, with real progress in the notification. If something is interrupted, the task resumes when you reopen VibeGrab.',
    },
    benefit: {
      es: 'Puedes dejar el móvil en la mesa y seguir con lo tuyo.',
      en: 'You can leave the phone on the table and carry on with your day.',
    },
  },
  {
    id: 'share',
    icon: 'share',
    group: 'download',
    featured: true,
    spotlight: true,
    visual: 'share',
    title: { es: 'Comparte y descarga al momento', en: 'Share and download instantly' },
    text: {
      es: 'Comparte un enlace desde TikTok, Instagram, Kwai u otra app y VibeGrab abre una hoja flotante para elegir el formato y descargar sin entrar en la aplicación.',
      en: 'Share a link from TikTok, Instagram, Kwai or another app and VibeGrab opens a floating sheet to choose the format and download without opening the app.',
    },
    benefit: {
      es: 'Del enlace compartido al archivo guardado, sin abrir la app.',
      en: 'From the shared link to the saved file, without opening the app.',
    },
  },
  {
    id: 'images',
    icon: 'image',
    group: 'download',
    title: { es: 'Guardar imágenes', en: 'Save images' },
    text: {
      es: 'Además del vídeo y el audio, la app permite guardar las imágenes de una publicación en la galería del teléfono.',
      en: 'Besides video and audio, the app can save the images of a post to the phone gallery.',
    },
    benefit: {
      es: 'Las fotos de una publicación también se quedan contigo.',
      en: 'The photos in a post stay with you too.',
    },
  },
  {
    id: 'mp3-tags',
    icon: 'music',
    group: 'download',
    title: { es: 'MP3 de verdad, con etiquetas y carátula', en: 'Real MP3 files, with tags and cover art' },
    text: {
      es: 'Los audios guardados se leen como MP3 reales: la app interpreta las etiquetas ID3 del dispositivo, con su título, su artista y su carátula.',
      en: 'Saved audio files are read as real MP3s: the app parses the device ID3 tags, including title, artist and cover art.',
    },
    benefit: {
      es: 'El archivo se reconoce en cualquier reproductor, con su portada.',
      en: 'The file is recognised by any player, cover art included.',
    },
  },

  /* ------------------------------------------------------------- Reproducir */
  {
    id: 'player',
    icon: 'video',
    group: 'play',
    featured: true,
    spotlight: true,
    visual: 'player',
    title: { es: 'Reproductor de vídeo completo', en: 'Full video player' },
    text: {
      es: 'Reproduce tus descargas dentro de la app con controles de avance, cola de reproducción y ventana flotante (Picture-in-Picture) para seguir viendo mientras haces otras cosas.',
      en: 'Play your downloads inside the app with seeking controls, a playback queue and Picture-in-Picture to keep watching while you do something else.',
    },
    benefit: {
      es: 'Lo que descargas se reproduce sin cambiar de aplicación.',
      en: 'What you download plays without switching apps.',
    },
  },
  {
    id: 'pip',
    icon: 'pip',
    group: 'play',
    title: { es: 'Picture-in-Picture', en: 'Picture-in-Picture' },
    text: {
      es: 'El vídeo puede continuar en una ventana flotante sobre el resto de aplicaciones, con el tamaño y la relación de aspecto correctos.',
      en: 'Video can continue in a floating window on top of other apps, with the correct size and aspect ratio.',
    },
    benefit: {
      es: 'Sigues viendo mientras escribes, hablas o buscas.',
      en: 'You keep watching while you type, talk or search.',
    },
  },
  {
    id: 'audio',
    icon: 'music',
    group: 'play',
    featured: true,
    title: { es: 'Música en segundo plano', en: 'Background music' },
    text: {
      es: 'Reproducción de audio que no se corta al apagar la pantalla ni al minimizar la app, con la sesión multimedia activa en el sistema.',
      en: 'Audio playback that does not stop when the screen goes off or the app is minimised, with the system media session active.',
    },
    benefit: {
      es: 'La música sigue aunque bloquees el móvil.',
      en: 'The music keeps going even if you lock the phone.',
    },
  },
  {
    id: 'equalizer',
    icon: 'waveform',
    group: 'play',
    title: { es: 'Ecualizador', en: 'Equalizer' },
    text: {
      es: 'Ajuste de graves, agudos y sonoridad con preajustes del sistema. Si el dispositivo no expone ecualizador, el control se desactiva en lugar de fingir que funciona.',
      en: 'Bass, treble and loudness adjustment with the system presets. If the device exposes no equaliser, the control is disabled instead of pretending to work.',
    },
    benefit: {
      es: 'Adapta el sonido a tu oído y a tus auriculares.',
      en: 'Tune the sound to your ears and your headphones.',
    },
  },
  {
    id: 'lyrics',
    icon: 'lyrics',
    group: 'play',
    title: { es: 'Letra sincronizada', en: 'Synced lyrics' },
    text: {
      es: 'Cuando la letra está disponible, se muestra dentro de la app y va marcando la línea que suena en ese momento.',
      en: 'When lyrics are available, they are shown inside the app and follow the line that is playing.',
    },
    benefit: {
      es: 'Canta con la letra, sin buscar en otro sitio.',
      en: 'Sing along without looking anywhere else.',
    },
  },
  {
    id: 'queue',
    icon: 'queue',
    group: 'play',
    title: { es: 'Cola y modos de reproducción', en: 'Queue and playback modes' },
    text: {
      es: 'Encadena lo que sigue, activa la repetición o el modo aleatorio, y manage la cola desde la barra del reproductor.',
      en: 'Queue what comes next, switch on repeat or shuffle, and manage the queue from the player bar.',
    },
    benefit: {
      es: 'Preparas la lista y no vuelves a tocar el móvil.',
      en: 'Set the list up and stop touching the phone.',
    },
  },
  {
    id: 'media-notifications',
    icon: 'bell',
    group: 'play',
    title: { es: 'Controles en la notificación', en: 'Controls in the notification' },
    text: {
      es: 'La notificación del sistema incluye anterior, reproducir, pausar, siguiente, el modo de repetición y el botón de «me gusta».',
      en: 'The system notification includes previous, play, pause, next, the repeat mode and the “like” button.',
    },
    benefit: {
      es: 'Pausas o saltas de pista sin desbloquear el móvil.',
      en: 'Pause or skip a track without unlocking the phone.',
    },
  },

  /* -------------------------------------------------------------- Organizar */
  {
    id: 'local-library',
    icon: 'library',
    group: 'organise',
    featured: true,
    spotlight: true,
    visual: 'library',
    title: { es: 'Biblioteca en tu teléfono', en: 'Library on your phone' },
    text: {
      es: 'Los vídeos se guardan en Movies/VibeGrab, visibles desde la galería del sistema. Tu biblioteca es tuya: no depende de ningún servicio en la nube.',
      en: 'Videos are saved to Movies/VibeGrab, visible from the system gallery. Your library is yours: it does not depend on any cloud service.',
    },
    benefit: {
      es: 'Tus archivos están en tu teléfono, no en un servidor ajeno.',
      en: 'Your files live on your phone, not on someone else’s server.',
    },
  },
  {
    id: 'favourites',
    icon: 'heart',
    group: 'organise',
    title: { es: 'Favoritos', en: 'Favourites' },
    text: {
      es: 'Marca los archivos que quieres volver a encontrar y separa los vídeos que te han gustado del resto de tu biblioteca.',
      en: 'Mark the files you want to find again and keep the videos you liked separate from the rest of your library.',
    },
    benefit: {
      es: 'Lo que te gusta, a un toque y sin buscarlo.',
      en: 'What you like, one tap away and easy to find.',
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
    benefit: {
      es: 'Retomas justo donde lo dejaste.',
      en: 'Pick up exactly where you left off.',
    },
  },
  {
    id: 'device-media',
    icon: 'hard-drive',
    group: 'organise',
    title: { es: 'También tus archivos del dispositivo', en: 'Your device media too' },
    text: {
      es: 'La biblioteca no solo muestra lo descargado con VibeGrab: incluye los vídeos y audios que ya tienes en el teléfono, con buscador y filtros.',
      en: 'The library does not only show what VibeGrab downloaded: it includes the videos and audio already on your phone, with search and filters.',
    },
    benefit: {
      es: 'Un único sitio para todo tu multimedia.',
      en: 'One place for all your media.',
    },
  },
  {
    id: 'vault',
    icon: 'lock',
    group: 'organise',
    title: { es: 'Bóveda privada', en: 'Private vault' },
    text: {
      es: 'Mueve archivos a una sección protegida con un PIN de cuatro dígitos, con bloqueo automático tras varios intentos fallidos.',
      en: 'Move files to a section protected by a four-digit PIN, with automatic lockout after several failed attempts.',
    },
    benefit: {
      es: 'Lo que no quieres a la vista, queda protegido.',
      en: 'What you would rather keep out of sight is protected.',
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
    benefit: {
      es: 'Puedes rectify a borrado sin miedo.',
      en: 'You can undo a deletion without worry.',
    },
  },

  /* --------------------------------------------------------------- Descubrir */
  {
    id: 'explore',
    icon: 'compass',
    group: 'discover',
    featured: true,
    spotlight: true,
    visual: 'explore',
    title: { es: 'Explorar', en: 'Explore' },
    text: {
      es: 'Busca contenido para reproducir o descargar sin salir de la app, con tendencias, categorías, recomendaciones y un feed «para ti».',
      en: 'Search for content to play or download without leaving the app, with trending, categories, recommendations and a “for you” feed.',
    },
    benefit: {
      es: 'Descubre sin salir de la app ni copiar enlaces.',
      en: 'Discover without leaving the app or copying links.',
    },
  },
  {
    id: 'shorts',
    icon: 'video',
    group: 'discover',
    title: { es: 'Shorts', en: 'Shorts' },
    text: {
      es: 'Feed vertical de vídeos cortos que encadena la reproducción y mantiene el control multimedia del sistema sincronizado.',
      en: 'A vertical feed of short videos that chains playback and keeps the system media controls in sync.',
    },
    benefit: {
      es: 'Ves un vídeo detrás de otro sin tocar nada.',
      en: 'Watch one video after another without touching anything.',
    },
  },
  {
    id: 'browser',
    icon: 'browser',
    group: 'discover',
    title: { es: 'Navegador integrado', en: 'Built-in browser' },
    text: {
      es: 'Abre cualquier web dentro de VibeGrab, con una página de inicio de accesos a YouTube, TikTok, Instagram, Facebook, X, SoundCloud, Vimeo y Dailymotion, y descarga lo que estás viendo.',
      en: 'Open any website inside VibeGrab, with a home page of shortcuts to YouTube, TikTok, Instagram, Facebook, X, SoundCloud, Vimeo and Dailymotion, and download what you are watching.',
    },
    benefit: {
      es: 'Descargas desde la web sin copiar el enlace.',
      en: 'Download from the web without copying the link.',
    },
  },
  {
    id: 'analyzer',
    icon: 'link',
    group: 'discover',
    title: { es: 'Analizador de enlaces', en: 'Link analyser' },
    text: {
      es: 'Pega una dirección y la app te muestra los formatos y calidades disponibles, con un historial de los últimos enlaces analizados.',
      en: 'Paste an address and the app shows the available formats and qualities, with a history of the last links you analysed.',
    },
    benefit: {
      es: 'Decides el formato antes de descargar nada.',
      en: 'You choose the format before downloading anything.',
    },
  },
  {
    id: 'comments',
    icon: 'message',
    group: 'discover',
    title: { es: 'Detalle con comentarios y relacionados', en: 'Detail with comments and related videos' },
    text: {
      es: 'La ficha de un vídeo muestra la descripción, los comentarios y los vídeos relacionados, para decidir con más contexto antes de guardarlo.',
      en: 'A video page shows the description, the comments and related videos, so you can decide with more context before saving it.',
    },
    benefit: {
      es: 'Decides con más información, no a ciegas.',
      en: 'You decide with more information, not blind.',
    },
  },

  /* --------------------------------------------------------------- Utilidades */
  {
    id: 'updater',
    icon: 'refresh',
    group: 'tools',
    title: { es: 'Actualizaciones desde la app', en: 'In-app updates' },
    text: {
      es: 'VibeGrab avisa cuando hay una versión nueva, resume los cambios y permite descargarla e instalarla sin salir de la aplicación.',
      en: 'VibeGrab tells you when a new version is out, summarises the changes and lets you download and install it from inside the app.',
    },
    benefit: {
      es: 'Te enteras de la versión nueva sin buscar nada.',
      en: 'You find out about the new version without looking for it.',
    },
  },
  {
    id: 'whats-new',
    icon: 'sparkles',
    group: 'tools',
    title: { es: 'Novedades en pantalla', en: 'What’s new on screen' },
    text: {
      es: 'Al abrir una versión nueva, la app muestra qué ha cambiado: funciones nuevas, mejoras y correcciones, ordenadas y en tu idioma.',
      en: 'When you open a new version, the app shows what changed: new features, improvements and fixes, tidied up and in your language.',
    },
    benefit: {
      es: 'Sabes qué ha cambiado sin leer el historial de versiones.',
      en: 'You know what changed without reading the version history.',
    },
  },
  {
    id: 'network-diagnostics',
    icon: 'activity',
    group: 'tools',
    title: { es: 'Diagnóstico de red', en: 'Network diagnostics' },
    text: {
      es: 'Una comprobación integrada que apunta al servidor configurado y explica si el problema es de conexión o de la sesión multimedia.',
      en: 'A built-in check that points at the configured server and explains whether the problem is the connection or the media session.',
    },
    benefit: {
      es: 'Si algo falla, la app te dice dónde está el fallo.',
      en: 'If something fails, the app tells you where the fault is.',
    },
  },
  {
    id: 'themes',
    icon: 'palette',
    group: 'tools',
    title: { es: 'Temas y colores de acento', en: 'Themes and accent colours' },
    text: {
      es: 'Modo claro, oscuro o según el sistema, con seis combinaciones de color de acento para la interfaz.',
      en: 'Light, dark or system mode, with six accent-colour combinations for the interface.',
    },
    benefit: {
      es: 'La app se ve como tú quieres, no como viene por defecto.',
      en: 'The app looks the way you want, not the way it ships.',
    },
  },
  {
    id: 'languages',
    icon: 'translate',
    group: 'tools',
    title: { es: 'Interfaz en español o inglés', en: 'Interface in Spanish or English' },
    text: {
      es: 'La app viene con los dos idiomas completos y un selector para cambiar entre ellos o dejar que los siga el sistema.',
      en: 'The app ships with both languages complete and a selector to switch between them or follow the system.',
    },
    benefit: {
      es: 'La lees en tu idioma, no en el de otro.',
      en: 'You read it in your language, not someone else’s.',
    },
  },
];

/** Funciones destacadas en la portada, en orden de lectura. */
export const spotlightFeatures: Feature[] = features.filter((feature) => feature.spotlight);
