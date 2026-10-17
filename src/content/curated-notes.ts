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
