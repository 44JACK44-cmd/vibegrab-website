/**
 * Notas de versión curadas y traducidas.
 *
 * Fuente: `mobile/lib/features/whats_new/data/whats_new_catalog.dart` del
 * proyecto Flutter, que es el catálogo de novedades que el propio autor
 * muestra dentro de la app. Se reutiliza aquí tal cual (texto orientado al
 * usuario, nunca commits ni nombres internos).
 *
 * - Las versiones con entrada aquí se muestran con estas notas.
 * - Las que no la tengan usan el texto original de la publicación de GitHub,
 *   etiquetado como tal, sin inventar nada.
 */
import type { NoteSection } from '@/lib/releases';

export const curatedNotes: Record<string, NoteSection[]> = {
  '1.1.38': [
    {
      category: 'features',
      items: [
        {
          text: {
            es: 'Tus audios ahora son MP3 de verdad',
            en: 'Your audio downloads are real MP3 files now',
          },
          detail: {
            es: 'Al descargar solo el audio, el archivo sale en MP3 reproducible en cualquier reproductor, con el título, el artista y la carátula dentro del propio archivo.',
            en: 'When you download only the audio, the file comes out as a playable MP3 in any player, with the title, the artist and the cover inside the file itself.',
          },
        },
        {
          text: {
            es: 'Los posts de fotos de TikTok ya se descargan',
            en: 'TikTok photo posts can be downloaded now',
          },
          detail: {
            es: 'Los enlaces de fotos con música ofrecen lo que de verdad tienen: la música para guardarla como MP3 y la imagen del post. Ya no aparece una opción de vídeo que no existe.',
            en: 'Photo links with music offer what they really have: the music to save as an MP3 and the image of the post. A video option that does not exist no longer shows up.',
          },
        },
      ],
    },
    {
      category: 'improvements',
      items: [
        {
          text: {
            es: 'La reproducción en Explorer empieza antes',
            en: 'Explorer playback starts sooner',
          },
          detail: {
            es: 'La dirección del vídeo que vas a reproducir se busca mientras se cierra el anterior, así el primer fotograma llega antes y se evita tocar Play dos veces.',
            en: 'The address of the video you are about to play is looked up while the previous one is closing, so the first frame arrives sooner and there is no need to tap Play twice.',
          },
        },
        {
          text: {
            es: 'Análisis de enlaces más completo y más rápido',
            en: 'Link analysis is more complete and faster',
          },
          detail: {
            es: 'El análisis devuelve todas las calidades y pistas de audio disponibles (en algunos vídeos solo aparecía una) y responde antes; repetir el mismo enlace es instantáneo.',
            en: 'The analysis returns every available quality and audio track (on some videos only one used to show up) and answers sooner; repeating the same link is instant.',
          },
        },
        {
          text: {
            es: 'El reproductor enseña la carátula del archivo',
            en: 'The player shows the cover inside the file',
          },
          detail: {
            es: 'Al reproducir una descarga, el reproductor y la notificación muestran el título, el artista y la carátula que lleva dentro el propio archivo, aunque falten los datos de la descarga.',
            en: 'When you play a download, the player and the notification show the title, the artist and the cover the file itself carries, even if the download details are missing.',
          },
        },
        {
          text: {
            es: 'Ajustes, ordenado por bloques',
            en: 'Settings, ordered in blocks',
          },
          detail: {
            es: 'Los ajustes están agrupados en bloques con las descargas primero y cada grupo con su título, para encontrar cada opción de un vistazo.',
            en: 'Settings are grouped in blocks with downloads first and a title for each group, so every option is easy to find at a glance.',
          },
        },
      ],
    },
    {
      category: 'fixes',
      items: [
        {
          text: {
            es: 'Los vídeos sin audio ya se descargan con sonido',
            en: 'Videos without audio download with sound now',
          },
          detail: {
            es: 'Las calidades que venían sin pista de audio se unen con la mejor pista disponible antes de guardarse, así el archivo nunca acaba mudo.',
            en: 'Qualities that came without an audio track are joined with the best available track before saving, so the file never ends up muted.',
          },
        },
        {
          text: {
            es: 'Se acabó el destello blanco al minimizar el vídeo',
            en: 'No more white flash when minimising the video',
          },
          detail: {
            es: 'Al minimizar el vídeo o redimensionar la ventana flotante ya no aparece un fogonazo blanco: la ventana se pinta en negro mientras se recoloca.',
            en: 'Minimising the video or resizing the floating window no longer shows a white flash: the window is painted black while it is being resized.',
          },
        },
      ],
    },
  ],
  '1.1.37': [
    {
      category: 'improvements',
      items: [
        {
          text: {
            es: 'Las actualizaciones llegan explicadas',
            en: 'Updates arrive explained',
          },
          detail: {
            es: 'A partir de esta versión, cuando salga una nueva, el aviso te cuenta qué cambia con el mismo formato de novedades en lugar de una lista técnica de cambios.',
            en: 'From this version on, when a new one comes out, the prompt tells you what changed in the same what\u2019s-new format instead of a technical change list.',
          },
        },
      ],
    },
  ],
  '1.1.36': [
    {
      category: 'features',
      items: [
        {
          text: {
            es: 'Sigue tus descargas sin salir de donde estás',
            en: 'Track your downloads without leaving what you are doing',
          },
          detail: {
            es: 'Un panel compacto con el progreso de las descargas en curso, visible desde cualquier pantalla, con acceso directo a la lista de descargas.',
            en: 'A compact panel with the progress of the ongoing downloads, visible from any screen, with a shortcut to the download list.',
          },
        },
      ],
    },
    {
      category: 'improvements',
      items: [
        {
          text: {
            es: 'Explorer, Shorts y Descargas abren antes',
            en: 'Explorer, Shorts and Downloads open sooner',
          },
          detail: {
            es: 'La portada ya no espera a tener la lista entera para empezar a reproducir, el feed de Shorts aparece casi al instante y el análisis de un enlace se reutiliza en lugar de repetirse.',
            en: 'The home screen no longer waits for the whole list before it can play, the Shorts feed appears almost instantly and analysing a link is reused instead of repeated.',
          },
        },
        {
          text: {
            es: 'El sonido no se corta al apagar la pantalla ni al minimizar',
            en: 'The sound no longer cuts out when the screen turns off or you minimise',
          },
          detail: {
            es: 'El relevo al audio de fondo se prepara antes de parar el vídeo, así la música sigue sin saltos. Y al volver a la app el vídeo se recupera mientras el audio sigue sonando.',
            en: 'The handoff to background audio is prepared before the video stops, so the music continues without gaps. Coming back to the app, the video is restored while the audio keeps playing.',
          },
        },
        {
          text: {
            es: 'Guarda la miniatura o la imagen del vídeo',
            en: 'Save the cover or the image of a video',
          },
          detail: {
            es: 'La acción de imagen aparece solo cuando el vídeo la tiene, se guarda con su formato real (PNG o WebP) y acaba en tu galería.',
            en: 'The image action shows up only when the video has one; it is saved in its real format (PNG or WebP) and ends up in your gallery.',
          },
        },
      ],
    },
    {
      category: 'fixes',
      items: [
        {
          text: {
            es: 'Un toque en reproducir ya basta',
            en: 'One tap on play is enough now',
          },
          detail: {
            es: 'El botón de reproducción ya no se queda mudo si lo pulsas mientras el vídeo todavía se está cargando.',
            en: 'The play button no longer goes mute if you tap it while the video is still loading.',
          },
        },
        {
          text: {
            es: 'Shorts: la pantalla sigue al reproductor',
            en: 'Shorts: the feed follows the player',
          },
          detail: {
            es: 'Cuando un short termina solo o usas los controles de la notificación, el feed se mueve con él en lugar de quedarse en el anterior.',
            en: 'When a short ends by itself or you use the notification controls, the feed moves along with it instead of staying on the previous one.',
          },
        },
      ],
    },
  ],
  '1.1.35': [
    {
      category: 'important',
      items: [
        {
          text: {
            es: 'Esta versión usa una clave de firma nueva',
            en: 'This version uses a new signing key',
          },
          detail: {
            es: 'Si tienes instalada la 1.1.34 o una anterior, Android no permitirá instalar encima por seguridad de firma: desinstala una vez e instala este APK. Tus descargas en Movies/VibeGrab no se borran y los ajustes pueden restaurarse automáticamente. A partir de esta versión, las actualizaciones vuelven a ser normales.',
            en: 'If you have 1.1.34 or earlier installed, Android will not install over it because of the signing key: uninstall once and install this APK. Your downloads in Movies/VibeGrab are not deleted and your settings can be restored automatically. From this version on, updates work normally again.',
          },
        },
      ],
    },
    {
      category: 'features',
      items: [
        {
          text: {
            es: 'Descubre qué cambió en cada versión',
            en: 'See what changed in every version',
          },
          detail: {
            es: 'Al actualizar verás una pantalla de novedades clara y ordenada, con las funciones, mejoras y correcciones de cada versión.',
            en: 'After updating you will see a clear, tidy what\u2019s-new screen with the features, improvements and fixes of each version.',
          },
        },
      ],
    },
    {
      category: 'improvements',
      items: [
        {
          text: {
            es: 'Sabes qué cambia antes de actualizar',
            en: 'Know what changes before updating',
          },
          detail: {
            es: 'El aviso de nueva versión resume los cambios principales y puedes abrir el detalle completo.',
            en: 'The new-version prompt summarises the main changes and lets you open the full detail.',
          },
        },
      ],
    },
  ],

  '1.1.34': [
    {
      category: 'fixes',
      items: [
        {
          text: { es: 'Sin solapamientos arriba', en: 'No more overlap at the top' },
          detail: {
            es: 'La barra de estado y el área de notificaciones ya no tapan el contenido de la parte superior.',
            en: 'The status bar and the notification area no longer cover the content at the top.',
          },
        },
      ],
    },
  ],

  '1.1.33': [
    {
      category: 'features',
      items: [
        {
          text: {
            es: 'Navegador con su propia página de inicio',
            en: 'Browser with its own start page',
          },
          detail: {
            es: 'Abre cualquier página web dentro de VibeGrab, con accesos rápidos a los sitios más usados.',
            en: 'Open any website inside VibeGrab, with quick shortcuts to popular sites.',
          },
        },
      ],
    },
    {
      category: 'fixes',
      items: [
        {
          text: { es: 'Tiempo y cola más fiables', en: 'More reliable time and queue' },
          detail: {
            es: 'Se corrigió el tiempo de reproducción y el manejo de la cola al avanzar o cambiar de contenido.',
            en: 'Fixed the playback time and the queue when seeking or switching content.',
          },
        },
      ],
    },
  ],

  '1.1.32': [
    {
      category: 'features',
      items: [
        {
          text: {
            es: 'Descarga en un toque desde el navegador',
            en: 'One-tap download from the browser',
          },
          detail: {
            es: 'Descarga lo que estás viendo en el navegador integrado sin salir de la app.',
            en: 'Download what you are watching in the built-in browser without leaving the app.',
          },
        },
      ],
    },
  ],

  '1.1.31': [
    {
      category: 'improvements',
      items: [
        {
          text: {
            es: 'Descarga en un toque más fluida',
            en: 'Smoother one-tap download',
          },
          detail: {
            es: 'Mejoras en el flujo de descarga con un solo toque.',
            en: 'Improvements to the single-tap download flow.',
          },
        },
      ],
    },
    {
      category: 'fixes',
      items: [
        {
          text: {
            es: 'El reproductor ya no se reinicia',
            en: 'The player no longer restarts',
          },
          detail: {
            es: 'Correcciones que evitaban que el contenido volviera a empezar al iniciar la reproducción.',
            en: 'Fixes that stopped content from starting over when playback began.',
          },
        },
      ],
    },
  ],

  '1.1.30': [
    {
      category: 'features',
      items: [
        {
          text: { es: 'Una experiencia más familiar', en: 'A more familiar experience' },
          detail: {
            es: 'Inicio primero, sección de vídeos cortos, elección de calidad y velocidad, y navegación con gestos.',
            en: 'Home first, a section for short videos, quality and speed selection, and gesture navigation.',
          },
        },
      ],
    },
  ],

  '1.1.29': [
    {
      category: 'features',
      items: [
        {
          text: {
            es: 'Contenido de tu región e idioma',
            en: 'Content for your region and language',
          },
          detail: {
            es: 'Las recomendaciones se adaptan a tu país e idioma.',
            en: 'Recommendations adapt to your country and language.',
          },
        },
        {
          text: { es: '«Para ti» más personalizado', en: 'A more personal «For you»' },
          detail: {
            es: 'Recomendaciones basadas en tus intereses y en tu historial.',
            en: 'Recommendations based on your interests and your history.',
          },
        },
      ],
    },
  ],

  '1.1.28': [
    {
      category: 'fixes',
      items: [
        {
          text: {
            es: 'Reproducción más estable en segundo plano',
            en: 'More stable background playback',
          },
          detail: {
            es: 'Correcciones en duración, avance, reproducción en segundo plano y controles de la notificación.',
            en: 'Fixes for duration, seeking, background playback and the notification controls.',
          },
        },
      ],
    },
  ],

  '1.1.27': [
    {
      category: 'features',
      items: [
        {
          text: {
            es: 'Enlaces externos en el reproductor',
            en: 'External links in the player',
          },
          detail: {
            es: 'Abre enlaces compartidos desde otras apps dentro de VibeGrab.',
            en: 'Open links shared from other apps right inside VibeGrab.',
          },
        },
      ],
    },
    {
      category: 'improvements',
      items: [
        {
          text: { es: 'Inicio más rápido', en: 'Faster home' },
          detail: {
            es: 'El contenido aparece antes al abrir la app.',
            en: 'Content appears sooner when you open the app.',
          },
        },
      ],
    },
  ],

  '1.1.26': [
    {
      category: 'fixes',
      items: [
        {
          text: { es: 'Like sin parpadeo', en: 'No more flicker when liking' },
          detail: {
            es: 'El botón de «me gusta» ya no parpadea al pulsarlo.',
            en: 'The like button no longer flickers when you tap it.',
          },
        },
        {
          text: { es: 'Sin contenido duplicado', en: 'No duplicate content' },
          detail: {
            es: 'Se eliminaron los vídeos repetidos en el feed de Explorar.',
            en: 'Repeated videos were removed from the Explorer feed.',
          },
        },
      ],
    },
    {
      category: 'stability',
      items: [
        {
          text: {
            es: 'Más compatible con distintas fuentes',
            en: 'More compatible with different sources',
          },
          detail: {
            es: 'Si una fuente de audio no responde, la app prueba otra automáticamente.',
            en: 'If one audio source does not respond, the app automatically tries another.',
          },
        },
      ],
    },
  ],
};
