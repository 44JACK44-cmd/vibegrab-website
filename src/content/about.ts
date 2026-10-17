/**
 * Historia del proyecto.
 *
 * Todo lo que aparece aquí es verificable: fechas del repositorio git, de la
 * API de GitHub y de la configuración del propio proyecto. No hay empresa,
 * equipo ni trayectoria inventados.
 */
import type { LocalizedText } from '@/lib/releases';

export interface TimelineItem {
  /** Fecha ISO. Se muestra formateada según el idioma. */
  date: string;
  title: LocalizedText;
  text: LocalizedText;
}

export const aboutIntro: LocalizedText[] = [
  {
    es: 'VibeGrab es una aplicación de Android para descargar, organizar y reproducir contenido multimedia. Nació de una molestia muy concreta: guardar un vídeo o una canción solía obligar a saltar entre varias apps, dejar archivos sueltos por el teléfono y perder de vista lo que ya habías descargado.',
    en: 'VibeGrab is an Android app for downloading, organising and playing media. It was born out of a very specific annoyance: saving a video or a song usually meant jumping between several apps, leaving loose files around your phone and losing track of what you had already saved.',
  },
  {
    es: 'La idea del proyecto es sencilla: que descargar y reproducir ocurra en el mismo sitio. Analizas un enlace, eliges la calidad, la descarga sigue en segundo plano y el archivo aparece en tu biblioteca, listo para reproducir sin conexión. Todo se queda en tu teléfono.',
    en: 'The idea is simple: downloading and playing should happen in the same place. You analyse a link, pick the quality, the download continues in the background and the file lands in your library, ready to play offline. Everything stays on your phone.',
  },
  {
    es: 'VibeGrab lo desarrolla una sola persona de forma independiente, con dos reglas claras: no publicar una actualización que no funcione y no describir una función que todavía no exista.',
    en: 'VibeGrab is built by a single person, independently, with two clear rules: never publish an update that does not work, and never describe a feature that does not exist yet.',
  },
];

export const aboutGoals: LocalizedText[] = [
  {
    es: 'Que descargar y reproducir sea una sola tarea, sin cambiar de aplicación.',
    en: 'Make downloading and playing a single task, without switching apps.',
  },
  {
    es: 'Que tus archivos sean tuyos: en tu teléfono, sin cuentas y sin depender de un servicio externo.',
    en: 'Keep your files yours: on your phone, with no accounts and no dependency on an external service.',
  },
  {
    es: 'Que la interfaz esté en condiciones de usarse a diario: rápida, ordenada y en tu idioma.',
    en: 'Keep the interface good enough for daily use: fast, tidy and in your language.',
  },
  {
    es: 'Que cada novedad que se anuncie se pueda comprobar en la propia aplicación.',
    en: 'Make every announced change verifiable inside the app itself.',
  },
];

export const aboutPrinciples: LocalizedText[] = [
  {
    es: 'Solo se publica lo que está probado: si falla el análisis, los tests o la firma del APK, la versión no se libera.',
    en: 'Only tested work ships: if analysis, tests or APK signing fail, the release does not go out.',
  },
  {
    es: 'Sin rastreadores: la aplicación no incorpora analítica, publicidad ni informes de fallos de terceros.',
    en: 'No trackers: the app carries no third-party analytics, advertising or crash reporting.',
  },
  {
    es: 'Las novedades se cuentan en el idioma del usuario, no en mensajes técnicos de control de versiones.',
    en: 'Release notes are written for the user, not as technical version-control messages.',
  },
  {
    es: 'Transparencia en la distribución: se publica el tamaño y la huella de cada APK para que puedas verificarlo.',
    en: 'Transparent distribution: the size and fingerprint of every APK are published so you can verify them.',
  },
];

/**
 * Hitos verificables.
 *
 * - 2026-09-23 y 2026-09-24: primer commit y creación del repositorio
 *   (`git log` e información pública de GitHub).
 * - El resto: fechas de publicación reales de cada versión en GitHub Releases.
 */
export const timeline: TimelineItem[] = [
  {
    date: '2026-09-23',
    title: { es: 'Primer commit', en: 'First commit' },
    text: {
      es: 'Arranca el proyecto con el primer commit de VibeGrab. Es la fecha de creación verificable más antigua del desarrollo.',
      en: 'The project starts with VibeGrab\u2019s first commit. This is the oldest verifiable creation date of the development.',
    },
  },
  {
    date: '2026-09-24',
    title: { es: 'Repositorio publicado', en: 'Repository published' },
    text: {
      es: 'Se crea el repositorio en GitHub, que desde entonces centraliza el desarrollo y la publicación de versiones.',
      en: 'The GitHub repository is created, and from then on centralises development and release publishing.',
    },
  },
  {
    date: '2026-10-02',
    title: { es: 'Primeras versiones descargables', en: 'First downloadable versions' },
    text: {
      es: 'Se publican los primeros APK con actualizador integrado y soporte para más plataformas de vídeo.',
      en: 'The first APKs are published, with an in-app updater and support for more video platforms.',
    },
  },
  {
    date: '2026-10-03',
    title: { es: 'Se estabiliza la descarga', en: 'Downloading gets stable' },
    text: {
      es: 'Las tareas se reanudan solas al abrir la app, la descarga continúa en segundo plano con notificación y los vídeos pasan a Movies/VibeGrab, visibles en la galería.',
      en: 'Tasks resume automatically when the app opens, downloads continue in the background with a notification, and videos move to Movies/VibeGrab, visible in the gallery.',
    },
  },
  {
    date: '2026-10-07',
    title: { es: 'Reproducción dentro de la app', en: 'In-app playback' },
    text: {
      es: 'Se puede reproducir lo descargado sin salir de VibeGrab, con resolución en paralelo y análisis más robusto.',
      en: 'Downloads can be played without leaving VibeGrab, with parallel resolution and more robust analysis.',
    },
  },
  {
    date: '2026-10-12',
    title: { es: 'Interfaz más pulida', en: 'A more polished interface' },
    text: {
      es: 'Se corrigen los solapamientos con la barra de estado y el área de notificaciones.',
      en: 'Overlaps with the status bar and the notification area are fixed.',
    },
  },
  {
    date: '2026-10-17',
    title: { es: 'Novedades dentro de la app', en: 'Release notes inside the app' },
    text: {
      es: 'Llega la pantalla de novedades por versión y el aviso de actualización con resumen de cambios. Además, el APK pasa a firmarse con una clave nueva, lo que exige una reinstalación única desde versiones anteriores.',
      en: 'The per-version what\u2019s-new screen and the update prompt with a change summary arrive. The APK also moves to a new signing key, which requires a one-time reinstall from earlier versions.',
    },
  },
];
