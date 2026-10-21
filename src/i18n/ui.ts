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
  'nav.demo': { es: 'La app', en: 'The app' },
  'nav.news': { es: 'Novedades', en: "What's new" },
  'nav.how': { es: 'Cómo funciona', en: 'How it works' },
  'nav.faq': { es: 'Preguntas frecuentes', en: 'FAQ' },

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
  'footer.social': { es: 'Síguenos', en: 'Follow us' },

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
  'home.hero.cta.how': { es: 'Cómo funciona', en: 'How it works' },
  'home.hero.published': {
    es: 'Publicada el {date}',
    en: 'Published on {date}',
  },
  'home.hero.publishedLink': {
    es: 'Ver todas las versiones',
    en: 'See all versions',
  },
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
  'home.features.count': {
    es: '{count} funciones verificadas en el código de la app',
    en: '{count} features verified in the app code',
  },
  'home.features.all': {
    es: 'Ver todas las características',
    en: 'See all features',
  },

  'home.how.eyebrow': { es: 'Cómo funciona', en: 'How it works' },
  'home.how.title': {
    es: 'De la descarga al primer archivo, en cuatro pasos',
    en: 'From the download to your first file, in four steps',
  },
  'home.how.desc': {
    es: 'VibeGrab se distribuye como APK, así que la instalación es la de siempre en Android: abrir el archivo y autorizar una única fuente. Nada de desactivar protecciones del sistema.',
    en: 'VibeGrab is distributed as an APK, so installing is the usual Android routine: open the file and authorise one single source. No system protections to turn off.',
  },

  'home.demo.eyebrow': { es: 'La aplicación', en: 'The application' },
  'home.demo.title': {
    es: 'Una app de Android con seis pestañas y nada que no exista',
    en: 'An Android app with six tabs and nothing that is not real',
  },
  'home.demo.desc': {
    es: 'Estas son las pantallas reales de VibeGrab, con lo que ofrece cada una. Los diagramas explican cómo funciona cada parte; en cuanto haya capturas reales de la app, se mostrarán aquí.',
    en: 'These are the real screens of VibeGrab and what each one offers. The diagrams explain how each part works; as soon as real screenshots of the app exist, they will show up here.',
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
  'home.whatsnew.sourceNote': {
    es: 'Estas novedades proceden de la publicación oficial de la versión.',
    en: 'These notes come from the official release of this version.',
  },

  'home.security.eyebrow': { es: 'Seguridad y uso responsable', en: 'Security & responsible use' },
  'home.security.title': {
    es: 'De dónde viene el archivo y qué se puede esperar',
    en: 'Where the file comes from and what to expect',
  },
  'home.security.desc': {
    es: 'Sin promesas grandilocuentes: esto es lo que la web y la aplicación hacen de verdad, y también lo que no hacen.',
    en: 'No grand claims: this is what the website and the app actually do, and also what they do not do.',
  },
  'home.security.limitations': {
    es: 'Limitaciones que conviene conocer',
    en: 'Limitations worth knowing',
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
  'home.gallery.diagramNote': {
    es: 'Los dibujos de esta página son diagramas que explican el funcionamiento, no capturas de la aplicación.',
    en: 'The drawings on this page are diagrams that explain how things work; they are not screenshots of the application.',
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
    es: 'No se ha podido comprobar si el archivo está disponible. Inténtalo de nuevo en unos minutos.',
    en: 'The file availability could not be checked. Please try again in a few minutes.',
  },
  'download.availability.removed': {
    es: 'Esta versión ya no está disponible: el archivo se ha retirado.',
    en: 'This version is no longer available: the file has been withdrawn.',
  },
  'download.availability.retry': { es: 'Volver a comprobar', en: 'Check again' },
  'download.availability.checkedAt': { es: 'Comprobado', en: 'Checked' },

  'download.error.title': { es: 'La descarga no está disponible ahora mismo', en: 'The download is not available right now' },
  'download.error.desc': {
    es: 'No hemos podido acceder al archivo de esta versión. Puedes reintentar; si el problema continúa, consulta el historial de versiones.',
    en: 'We could not reach this version\u2019s file. You can retry; if the problem persists, check the version history.',
  },
  'download.error.retry': { es: 'Reintentar', en: 'Retry' },

  'download.removed.title': {
    es: 'Esta versión ya no está disponible',
    en: 'This version is no longer available',
  },
  'download.removed.desc': {
    es: 'Se ha retirado de las publicaciones oficiales, así que su archivo no se puede descargar. El resto de versiones siguen en el historial.',
    en: 'It has been withdrawn from the official releases, so its file cannot be downloaded. The other versions are still in the history.',
  },
  'download.removed.cta': {
    es: 'Ver el historial de versiones',
    en: 'See the version history',
  },

  'download.warning.title': { es: 'Antes de instalar esta versión', en: 'Before installing this version' },

  'download.data.updated': {
    es: 'Datos de las publicaciones actualizados',
    en: 'Release data updated',
  },
  'download.data.stale': {
    es: 'Mostrando la última información disponible',
    en: 'Showing the last available information',
  },
  'download.data.source.live': { es: 'en directo', en: 'live' },
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
  'versions.removed.title': {
    es: 'Esta versión ya no está disponible',
    en: 'This version is no longer available',
  },
  'versions.removed.desc': {
    es: 'Se ha retirado de las publicaciones oficiales, así que su página y su archivo ya no existen. El resto de versiones siguen en el historial.',
    en: 'It has been withdrawn from the official releases, so its page and file no longer exist. The other versions are still in the history.',
  },
  'versions.removed.cta': {
    es: 'Ver el historial de versiones',
    en: 'See the version history',
  },

  /* ----------------------------------------------------------------- Sobre */
  'about.eyebrow': { es: 'Sobre nosotros', en: 'About us' },
  'about.title': { es: 'Qué es VibeGrab y por qué existe', en: 'What VibeGrab is and why it exists' },
  'about.timeline.title': { es: 'Cronología del proyecto', en: 'Project timeline' },
  'about.principles.title': { es: 'Principios de desarrollo', en: 'Development principles' },
  'about.goals.title': { es: 'Objetivos', en: 'Goals' },
  'about.verified.title': { es: 'Datos verificables', en: 'Verifiable data' },
  'about.verified.created': { es: 'Primer commit del proyecto', en: 'First commit' },
  'about.verified.firstRelease': {
    es: 'Primera versión publicada',
    en: 'First published release',
  },
  'about.verified.repo': { es: 'Repositorio publicado', en: 'Repository published' },
  'about.verified.releases': { es: 'Versiones publicadas', en: 'Releases published' },
  'about.verified.latest': { es: 'Última versión estable', en: 'Latest stable version' },
  'about.verified.note': {
    es: 'Estos datos proceden del propio proyecto y de su API pública de publicaciones. No se ha inventado ninguna cifra.',
    en: 'This data comes from the project itself and its public release API. No figure has been invented.',
  },
  'about.team.title': { es: 'Quién lo desarrolla', en: 'Who builds it' },
  'about.team.text': {
    es: 'VibeGrab lo desarrolla actualmente una sola persona, de forma independiente. No hay una empresa detrás ni un equipo al que atribuir el proyecto, y esta web no lo simula.',
    en: 'VibeGrab is currently developed by a single, independent person. There is no company behind it and no team to credit, and this website does not pretend otherwise.',
  },
  'about.evolution.title': {
    es: 'Cómo evoluciona el proyecto',
    en: 'How the project evolves',
  },
  'about.team.contactOk': {
    es: 'Hay un canal de contacto publicado en esta web para consultas, avisos de errores y peticiones.',
    en: 'A contact channel is published on this site for questions, bug reports and requests.',
  },
  'about.team.contactPending': {
    es: 'Todavía no hay un canal de contacto publicado. En cuanto exista, aparecerá en la página de contacto; mientras tanto, la guía de instalación y las preguntas frecuentes cubren los casos habituales.',
    en: 'There is no published contact channel yet. As soon as one exists it will appear on the contact page; in the meantime, the install guide and the FAQ cover the common cases.',
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
  'contact.phone.label': { es: 'Teléfono', en: 'Phone' },
  'contact.phone.call': { es: 'Llamar', en: 'Call' },
  'contact.phone.hint': {
    es: 'Marca este número para comunicarte con el responsable del proyecto.',
    en: 'Dial this number to reach the person behind the project.',
  },
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

  'features.spotlight.eyebrow': { es: 'Lo esencial', en: 'The essentials' },
  'features.spotlight.title': {
    es: 'Las funciones que se usan todos los días',
    en: 'The features used every day',
  },

  /* ------------------------------------------------------------ Métricas */
  'stats.title': { es: 'Datos del producto', en: 'Product data' },
  'stats.latestVersion': { es: 'Versión estable actual', en: 'Current stable version' },
  'stats.publishedOn': { es: 'Publicada el {date}', en: 'Published on {date}' },
  'stats.stableReleases': {
    es: 'Versiones publicadas con APK',
    en: 'Versions published with an APK',
  },
  'stats.prereleaseNote': {
    es: '{count} preliminares aparte',
    en: '{count} pre-releases on top',
  },
  'stats.apkSize': { es: 'Tamaño del APK actual', en: 'Size of the current APK' },
  'stats.apkSizeNote': {
    es: 'Archivo único para cualquier dispositivo',
    en: 'A single file for any device',
  },
  'stats.apkDownloads': {
    es: 'Descargas del APK',
    en: 'APK downloads',
  },
  'stats.latestDownloads': {
    es: 'La última versión: {count}.',
    en: 'The latest version: {count}.',
  },
  'stats.fileDownloads': {
    es: 'Descargas del archivo',
    en: 'Downloads of the file',
  },

  /* --------------------------------------------------- Recorrido por la app */
  'tour.title': { es: 'Recorrido por la aplicación', en: 'Tour of the application' },
  'tour.tabsLabel': {
    es: 'Pestañas de la aplicación',
    en: 'Application tabs',
  },

  /* ------------------------------------------------------------ Comunidad */
  'community.eyebrow': { es: 'Comunidad', en: 'Community' },
  'community.title': {
    es: 'Lo que dice la comunidad y lo que puedes contar tú',
    en: 'What the community says and what you can share',
  },
  'community.desc': {
    es: 'Las opiniones se publican firmadas por cuentas reales y se guardan en el repositorio público del proyecto, así cada valoración es atribuible. Si has usado VibeGrab, cuéntanos qué tal.',
    en: 'Opinions are published signed by real accounts and are stored in the project’s public repository, so every rating is attributable. If you have used VibeGrab, tell us how it went.',
  },

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
