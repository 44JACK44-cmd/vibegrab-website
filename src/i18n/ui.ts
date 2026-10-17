/**
 * Diccionario de la interfaz (español / inglés).
 *
 * Solo cadenas de interfaz. El contenido largo (características, FAQ, textos
 * legales) vive en `src/content/*` para mantener esto legible.
 */
import type { Locale } from '@/config/routes';

const dict = {
  /* ----------------------------------------------------------- Navegación */
  'nav.primary': { es: 'Navegación principal', en: 'Main navigation' },
  'nav.home': { es: 'Inicio', en: 'Home' },
  'nav.features': { es: 'Características', en: 'Features' },
  'nav.download': { es: 'Descargar', en: 'Download' },
  'nav.versions': { es: 'Versiones', en: 'Versions' },
  'nav.about': { es: 'Sobre nosotros', en: 'About' },
  'nav.help': { es: 'Ayuda', en: 'Help' },

  'header.download': { es: 'Descargar', en: 'Download' },
  'header.menu.open': { es: 'Abrir menú', en: 'Open menu' },
  'header.menu.close': { es: 'Cerrar menú', en: 'Close menu' },
  'header.theme': { es: 'Cambiar tema', en: 'Toggle theme' },
  'header.lang': { es: 'Cambiar idioma', en: 'Change language' },
  'header.brandSub': { es: 'App de descargas', en: 'Media app' },
  'a11y.skip': { es: 'Saltar al contenido', en: 'Skip to content' },

  /* ---------------------------------------------------------------- Pie */
  'footer.tagline': {
    es: 'Descargador y reproductor multimedia para Android. Descarga, organiza y reproduce tu contenido en un solo lugar.',
    en: 'Media downloader and player for Android. Download, organise and play your content in one place.',
  },
  'footer.product': { es: 'Producto', en: 'Product' },
  'footer.resources': { es: 'Recursos', en: 'Resources' },
  'footer.legal': { es: 'Legal', en: 'Legal' },
  'footer.install': { es: 'Guía de instalación', en: 'Install guide' },
  'footer.faq': { es: 'Preguntas frecuentes', en: 'FAQ' },
  'footer.contact': { es: 'Contacto y soporte', en: 'Contact & support' },
  'footer.disclaimer': {
    es: 'VibeGrab es una aplicación independiente. No está afiliada, asociada ni patrocinada por las plataformas cuyo contenido puedes descargar. Respeta los derechos de autor y las condiciones de uso de cada plataforma.',
    en: 'VibeGrab is an independent application. It is not affiliated with, associated with, or sponsored by any of the platforms whose content you can download. Please respect copyright and each platform\u2019s terms of service.',
  },
  'footer.rights': {
    es: 'Todos los derechos reservados.',
    en: 'All rights reserved.',
  },
  'footer.updated': { es: 'Sitio actualizado', en: 'Site updated' },

  /* -------------------------------------------------------------- Portada */
  'home.hero.tagline': {
    es: 'Tu contenido. Tu experiencia multimedia.',
    en: 'Your content. Your media experience.',
  },
  'home.hero.desc': {
    es: 'VibeGrab reúne en una sola app de Android la descarga de vídeo y audio, un reproductor completo y una biblioteca que no depende de la nube. Descarga lo que quieras guardar y reprodúcelo cuando quieras, incluso sin conexión.',
    en: 'VibeGrab brings video and audio downloading, a full-featured player and a library that does not depend on the cloud into one Android app. Save what you want to keep and play it whenever you like, even offline.',
  },
  'home.hero.cta.download': { es: 'Descargar para Android', en: 'Download for Android' },
  'home.hero.cta.discover': { es: 'Descubrir VibeGrab', en: 'Discover VibeGrab' },
  'home.hero.meta.android': { es: 'Android 7.0 o superior', en: 'Android 7.0 or newer' },
  'home.hero.meta.free': { es: 'Gratis y sin cuenta', en: 'Free, no account needed' },
  'home.hero.mockup.downloads': { es: 'Descargas', en: 'Downloads' },
  'home.hero.mockup.player': { es: 'Reproductor', en: 'Player' },
  'home.hero.mockup.library': { es: 'Biblioteca', en: 'Library' },

  'home.features.eyebrow': { es: 'Características', en: 'Features' },
  'home.features.title': {
    es: 'Todo lo que necesitas, en una sola app',
    en: 'Everything you need, in a single app',
  },
  'home.features.desc': {
    es: 'Cada función de esta lista corresponde a algo que ya existe en la aplicación. Nada de promesas.',
    en: 'Every feature listed here corresponds to something already present in the application. No promises.',
  },

  'home.whatsnew.eyebrow': { es: 'Novedades', en: "What's new" },
  'home.whatsnew.title': {
    es: 'Qué cambia en la última versión',
    en: 'What changed in the latest version',
  },
  'home.whatsnew.viewAll': { es: 'Ver todo el historial', en: 'See full history' },
  'home.whatsnew.curatedNote': {
    es: 'Resumen de las novedades de esta versión.',
    en: 'Summary of what is new in this version.',
  },
  'home.whatsnew.rawNote': {
    es: 'Notas de la versión tal y como las publicó el desarrollador.',
    en: 'Release notes exactly as published by the developer.',
  },

  'home.gallery.eyebrow': { es: 'La aplicación', en: 'The app' },
  'home.gallery.title': { es: 'Así se ve VibeGrab', en: 'This is what VibeGrab looks like' },
  'home.gallery.pending': {
    es: 'Todavía no hay capturas de pantalla publicadas.',
    en: 'No screenshots have been published yet.',
  },
  'home.gallery.pendingHint': {
    es: 'Cuando estén listas, se mostrarán aquí como imágenes reales de la aplicación.',
    en: 'Once available, they will appear here as real images from the application.',
  },

  'home.install.eyebrow': { es: 'Instalación', en: 'Installation' },
  'home.install.title': { es: 'Listo en menos de un minuto', en: 'Ready in under a minute' },
  'home.install.cta': { es: 'Ver la guía completa', en: 'Read the full guide' },

  'home.cta.title': { es: 'Prueba VibeGrab en tu Android', en: 'Try VibeGrab on your Android' },
  'home.cta.desc': {
    es: 'Descarga el APK oficial, instálalo y empieza a guardar y reproducir tu contenido.',
    en: 'Download the official APK, install it and start saving and playing your content.',
  },

  'home.faq.eyebrow': { es: 'Dudas', en: 'Questions' },
  'home.faq.title': { es: 'Preguntas frecuentes', en: 'Frequently asked questions' },
  'home.faq.cta': { es: 'Ir al centro de ayuda', en: 'Go to the help centre' },

  /* -------------------------------------------------------------- Descarga */
  'download.eyebrow': { es: 'Descarga oficial', en: 'Official download' },
  'download.title': { es: 'Descarga VibeGrab', en: 'Download VibeGrab' },
  'download.desc': {
    es: 'Siempre la última versión estable publicada. El botón descarga directamente el archivo APK, sin pasos intermedios.',
    en: 'Always the latest published stable version. The button downloads the APK file directly, with no intermediate steps.',
  },
  'download.spec.version': { es: 'Versión', en: 'Version' },
  'download.spec.build': { es: 'Compilación', en: 'Build' },
  'download.spec.published': { es: 'Publicada', en: 'Published' },
  'download.spec.size': { es: 'Tamaño', en: 'Size' },
  'download.spec.android': { es: 'Requiere', en: 'Requires' },
  'download.spec.file': { es: 'Archivo', en: 'File' },
  'download.spec.sha': { es: 'SHA-256', en: 'SHA-256' },
  'download.button': { es: 'Descargar APK', en: 'Download APK' },
  'download.button.size': { es: 'Descargar APK ({size})', en: 'Download APK ({size})' },
  'download.button.unavailable': { es: 'Descarga no disponible', en: 'Download unavailable' },
  'download.button.downloads': {
    es: '{count} descargas registradas',
    en: '{count} downloads recorded',
  },
  'download.copy': { es: 'Copiar', en: 'Copy' },
  'download.copied': { es: 'Copiado', en: 'Copied' },
  'download.copyHash': { es: 'Copiar huella SHA-256', en: 'Copy SHA-256 fingerprint' },
  'download.hashHelp': {
    es: 'Puedes comprobar la integridad del archivo con esta huella. Compárala con la del APK que descargues.',
    en: 'You can verify the integrity of the file with this fingerprint. Compare it with the APK you download.',
  },
  'download.availability.checking': { es: 'Comprobando el archivo…', en: 'Checking the file…' },
  'download.availability.available': {
    es: 'Archivo disponible para descargar',
    en: 'File available for download',
  },
  'download.availability.unavailable': {
    es: 'No se ha podido confirmar la disponibilidad del archivo. Inténtalo de nuevo en unos minutos.',
    en: 'The file availability could not be confirmed. Please try again in a few minutes.',
  },
  'download.availability.retry': { es: 'Volver a comprobar', en: 'Check again' },
  'download.availability.checkedAt': { es: 'Comprobado', en: 'Checked' },

  'download.error.title': { es: 'La descarga no está disponible ahora mismo', en: 'The download is not available right now' },
  'download.error.desc': {
    es: 'No hemos podido acceder al archivo de esta versión. Puedes reintentar; si el problema continúa, consulta el historial de versiones.',
    en: 'We could not reach this version\u2019s file. You can retry; if the problem persists, check the version history.',
  },
  'download.error.retry': { es: 'Reintentar', en: 'Retry' },

  'download.warning.title': { es: 'Antes de instalar esta versión', en: 'Before installing this version' },

  'download.data.updated': { es: 'Datos de GitHub actualizados', en: 'GitHub data updated' },
  'download.data.stale': {
    es: 'Mostrando la última información disponible',
    en: 'Showing the last available information',
  },
  'download.data.source.github': { es: 'en directo', en: 'live' },
  'download.data.source.cache': { es: 'desde caché', en: 'from cache' },
  'download.data.source.snapshot': { es: 'desde copia local', en: 'from local copy' },

  'download.noRelease.title': { es: 'Todavía no hay versiones publicadas', en: 'No releases published yet' },
  'download.noRelease.desc': {
    es: 'Cuando se publique la primera versión con APK aparecerá aquí automáticamente.',
    en: 'As soon as the first release with an APK is published it will appear here automatically.',
  },

  'download.otherVersions': { es: 'Versiones anteriores', en: 'Previous versions' },
  'download.notesTitle': { es: 'Novedades de esta versión', en: "What's new in this version" },
  'download.installTitle': { es: 'Cómo instalarlo en Android', en: 'How to install it on Android' },
  'download.troubleshootTitle': { es: 'Si algo va mal', en: 'If something goes wrong' },

  /* ------------------------------------------------------------- Versiones */
  'versions.eyebrow': { es: 'Historial', en: 'History' },
  'versions.title': { es: 'Versiones publicadas', en: 'Published versions' },
  'versions.desc': {
    es: 'Todas las publicaciones oficiales, ordenadas por fecha real de publicación (de la más reciente a la más antigua).',
    en: 'Every official release, ordered by actual publication date (newest first).',
  },
  'versions.orderNote': {
    es: 'El historial se ordena por fecha de publicación, no por número de versión. Un número mayor no siempre es más reciente.',
    en: 'The history is ordered by publication date, not by version number. A higher number is not always more recent.',
  },
  'versions.latest': { es: 'Última estable', en: 'Latest stable' },
  'versions.prerelease': { es: 'Preliminar', en: 'Pre-release' },
  'versions.prereleases.title': {
    es: 'Versiones preliminares',
    en: 'Pre-release versions',
  },
  'versions.prereleases.note': {
    es: 'Publicadas para probar cambios antes de una versión estable. Pueden contener errores y no se ofrecen como descarga principal.',
    en: 'Published to test changes before a stable release. They may contain bugs and are not offered as the main download.',
  },
  'versions.prereleases.show': {
    es: 'Mostrar versiones preliminares',
    en: 'Show pre-release versions',
  },
  'versions.noApk': { es: 'Sin APK', en: 'No APK' },
  'versions.download': { es: 'Descargar', en: 'Download' },
  'versions.details': { es: 'Ver detalles', en: 'View details' },
  'versions.backToList': { es: 'Volver a todas las versiones', en: 'Back to all versions' },
  'versions.noNotes': {
    es: 'Esta publicación no incluye notas. No hay más información disponible.',
    en: 'This release has no notes. No further information is available.',
  },
  'versions.rawNotes': {
    es: 'Notas originales publicadas por el desarrollador.',
    en: 'Original notes published by the developer.',
  },
  'versions.higherNumberNote': {
    es: 'Publicada antes que la última versión estable, aunque su número sea mayor.',
    en: 'Published before the latest stable version, even though its number is higher.',
  },
  'versions.table.version': { es: 'Versión', en: 'Version' },
  'versions.table.date': { es: 'Fecha', en: 'Date' },
  'versions.table.size': { es: 'Tamaño', en: 'Size' },
  'versions.table.status': { es: 'Estado', en: 'Status' },
  'versions.status.stable': { es: 'Estable', en: 'Stable' },
  'versions.empty': { es: 'No hay versiones disponibles.', en: 'No versions available.' },
  'versions.detailTitle': { es: 'Detalles de la versión', en: 'Version details' },
  'versions.notFound.title': { es: 'Versión no encontrada', en: 'Version not found' },
  'versions.notFound.desc': {
    es: 'No existe ninguna versión publicada con esa etiqueta, o ya no está disponible.',
    en: 'No published version matches that tag, or it is no longer available.',
  },

  /* ----------------------------------------------------------------- Sobre */
  'about.eyebrow': { es: 'Sobre nosotros', en: 'About us' },
  'about.title': { es: 'Qué es VibeGrab y por qué existe', en: 'What VibeGrab is and why it exists' },
  'about.timeline.title': { es: 'Cronología del proyecto', en: 'Project timeline' },
  'about.principles.title': { es: 'Principios de desarrollo', en: 'Development principles' },
  'about.goals.title': { es: 'Objetivos', en: 'Goals' },
  'about.verified.title': { es: 'Datos verificables', en: 'Verifiable data' },
  'about.verified.created': { es: 'Primer commit del proyecto', en: 'First commit' },
  'about.verified.repo': { es: 'Repositorio publicado', en: 'Repository published' },
  'about.verified.releases': { es: 'Versiones publicadas', en: 'Releases published' },
  'about.verified.latest': { es: 'Última versión estable', en: 'Latest stable version' },
  'about.verified.note': {
    es: 'Estos datos proceden del propio proyecto y de la API pública de GitHub. No se ha inventado ninguna cifra.',
    en: 'This data comes from the project itself and the public GitHub API. No figure has been invented.',
  },
  'about.team.title': { es: 'Quién lo desarrolla', en: 'Who builds it' },
  'about.team.text': {
    es: 'VibeGrab lo desarrolla actualmente una sola persona, de forma independiente. No hay una empresa detrás ni un equipo al que atribuir el proyecto, y esta web no lo simula.',
    en: 'VibeGrab is currently developed by a single, independent person. There is no company behind it and no team to credit, and this website does not pretend otherwise.',
  },

  /* ----------------------------------------------------------------- Ayuda */
  'help.eyebrow': { es: 'Ayuda', en: 'Help' },
  'help.title': { es: 'Centro de ayuda', en: 'Help centre' },
  'help.desc': {
    es: 'Respuestas a las dudas más habituales sobre la descarga, la instalación y el uso de VibeGrab.',
    en: 'Answers to the most common questions about downloading, installing and using VibeGrab.',
  },
  'help.faq.title': { es: 'Preguntas frecuentes', en: 'Frequently asked questions' },
  'help.contact.title': { es: 'Contacto y soporte', en: 'Contact & support' },
  'help.install.title': { es: 'Guía de instalación paso a paso', en: 'Step-by-step install guide' },

  'contact.eyebrow': { es: 'Contacto', en: 'Contact' },
  'contact.title': { es: 'Contacto y soporte', en: 'Contact & support' },
  'contact.desc': {
    es: 'Vías reales para comunicarte con el desarrollo del proyecto.',
    en: 'Real channels to reach the project\u2019s developer.',
  },
  'contact.email.label': { es: 'Correo electrónico', en: 'Email' },
  'contact.support.label': { es: 'Centro de soporte', en: 'Support centre' },
  'contact.pending': {
    es: 'El canal de contacto todavía no se ha publicado.',
    en: 'The contact channel has not been published yet.',
  },
  'contact.pendingHint': {
    es: 'Esta web no inventa direcciones de correo. En cuanto exista un canal oficial, aparecerá aquí. Mientras tanto, puedes consultar la guía de instalación y las preguntas frecuentes.',
    en: 'This website does not invent email addresses. As soon as an official channel exists, it will appear here. In the meantime, please check the install guide and the FAQ.',
  },
  'contact.report.title': { es: 'Informar de un error', en: 'Report a bug' },
  'contact.report.text': {
    es: 'Si vas a comunicar un problema, incluye la versión de VibeGrab, el modelo de tu teléfono, la versión de Android y los pasos para reproducirlo. Con eso se puede investigar mucho más rápido.',
    en: 'If you report a problem, include your VibeGrab version, phone model, Android version and the steps to reproduce it. That makes it far quicker to investigate.',
  },

  /* ---------------------------------------------------------------- Legal */
  'legal.privacy.title': { es: 'Política de privacidad', en: 'Privacy policy' },
  'legal.terms.title': { es: 'Términos de uso', en: 'Terms of use' },
  'legal.updated': { es: 'Última actualización', en: 'Last updated' },
  'legal.toc': { es: 'En esta página', en: 'On this page' },
  'legal.reviewNote': {
    es: 'Este documento describe el funcionamiento real de la aplicación y de la web en la fecha indicada. Debe revisarse cada vez que cambie lo que hace la app o el sitio.',
    en: 'This document describes the actual behaviour of the application and the website as of the date shown. It must be reviewed whenever the app or the site changes.',
  },

  /* ------------------------------------------------------------------ 404 */
  'notfound.title': { es: 'Esta página no existe', en: 'This page does not exist' },
  'notfound.desc': {
    es: 'Puede que el enlace esté mal escrito o que la página se haya movido.',
    en: 'The link may be misspelled or the page may have moved.',
  },
  'notfound.home': { es: 'Volver al inicio', en: 'Back to home' },
  'notfound.download': { es: 'Ir a descargas', en: 'Go to downloads' },

  /* ------------------------------------------------------ Estados genéricos */
  'common.loading': { es: 'Cargando…', en: 'Loading…' },
  'common.and': { es: 'y', en: 'and' },
  'common.optional': { es: 'opcional', en: 'optional' },
  'common.new': { es: 'Nuevo', en: 'New' },
} as const;

export type StringKey = keyof typeof dict;

/** Traduce una clave. Las claves no traducidas devuelven la propia clave. */
export function t(locale: Locale, key: StringKey, vars?: Record<string, string | number>): string {
  const entry = dict[key];
  let value: string = entry ? entry[locale] : key;
  if (vars) {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replaceAll(`{${name}}`, String(replacement));
    }
  }
  return value;
}

export type Translator = (key: StringKey, vars?: Record<string, string | number>) => string;

/** Devuelve un traductor ligado a un idioma. */
export function useTranslations(locale: Locale): Translator {
  return (key, vars) => t(locale, key, vars);
}
