/**
 * Preguntas frecuentes.
 *
 * Las respuestas describen el funcionamiento real de la app y de la web.
 * Cuando algo no está confirmado (por ejemplo, la presencia en Google Play)
 * se dice tal cual, sin prometer nada.
 */
import type { LocalizedText } from '@/lib/releases';
import type { RouteKey } from '@/config/routes';

export interface FaqItem {
  id: string;
  question: LocalizedText;
  /** Párrafos de la respuesta. */
  answer: LocalizedText[];
  /** Enlace interno relacionado, si existe. */
  link?: { key: RouteKey; label: LocalizedText };
}

export const faq: FaqItem[] = [
  {
    id: 'download',
    question: { es: '¿Cómo descargo VibeGrab?', en: 'How do I download VibeGrab?' },
    answer: [
      {
        es: 'Entra en la página de descarga de esta web y pulsa el botón «Descargar APK». El botón apunta siempre a la última versión estable publicada, así que no tienes que buscar nada más.',
        en: 'Open the download page on this site and tap “Download APK”. The button always points to the latest published stable version, so there is nothing else to look for.',
      },
      {
        es: 'Verás el número de versión, la fecha de publicación, el tamaño del archivo y su huella SHA-256 antes de descargar.',
        en: 'You will see the version number, publication date, file size and its SHA-256 fingerprint before downloading.',
      },
    ],
    link: { key: 'download', label: { es: 'Ir a descargas', en: 'Go to downloads' } },
  },
  {
    id: 'install',
    question: { es: '¿Cómo lo instalo en Android?', en: 'How do I install it on Android?' },
    answer: [
      {
        es: 'Abre el APK descargado. Android pedirá permiso para instalar aplicaciones desde esa fuente concreta: concédelo solo a la app con la que abriste el archivo y continúa.',
        en: 'Open the downloaded APK. Android will ask for permission to install apps from that specific source: grant it only to the app you opened the file with and continue.',
      },
      {
        es: 'La guía de instalación de esta web explica cada paso y qué hacer si aparece un aviso de Play Protect.',
        en: 'The install guide on this site explains each step and what to do if a Play Protect warning appears.',
      },
    ],
    link: { key: 'help', label: { es: 'Ver la guía', en: 'See the guide' } },
  },
  {
    id: 'requirements',
    question: {
      es: '¿Qué requisitos necesita el teléfono?',
      en: 'What does my phone need?',
    },
    answer: [
      {
        es: 'VibeGrab funciona en Android 7.0 o superior. Necesita conexión a internet para analizar enlaces y descargar, y espacio libre en el almacenamiento para guardar los archivos.',
        en: 'VibeGrab runs on Android 7.0 or newer. It needs an internet connection to analyse links and download, plus free storage space to save files.',
      },
    ],
  },
  {
    id: 'update',
    question: { es: '¿Cómo actualizo a la versión nueva?', en: 'How do I update to the new version?' },
    answer: [
      {
        es: 'La propia app avisa cuando hay una versión nueva y permite descargarla e instalarla. También puedes descargar el APK desde esta web e instalarlo encima: si ya tienes VibeGrab, se conservan tus archivos y ajustes.',
        en: 'The app itself tells you when a new version is out and lets you download and install it. You can also download the APK from this site and install it on top: if you already have VibeGrab, your files and settings are kept.',
      },
      {
        es: 'Excepción importante: al pasar de la 1.1.34 o anterior a la 1.1.35 o posterior hay que desinstalar una vez, porque la clave de firma cambió. Solo ocurre una vez.',
        en: 'Important exception: going from 1.1.34 or earlier to 1.1.35 or later requires a one-time uninstall, because the signing key changed. This only happens once.',
      },
    ],
    link: { key: 'versions', label: { es: 'Ver versiones', en: 'See versions' } },
  },
  {
    id: 'changelog',
    question: { es: '¿Dónde veo qué cambia en cada versión?', en: 'Where can I see what changed in each version?' },
    answer: [
      {
        es: 'En la página de versiones de esta web tienes todas las publicaciones con su fecha, tamaño, estado y notas. Dentro de la app, la pantalla de novedades muestra los cambios de la versión que acabas de instalar.',
        en: 'The versions page on this site lists every release with its date, size, status and notes. Inside the app, the what\u2019s-new screen shows the changes in the version you just installed.',
      },
    ],
    link: { key: 'versions', label: { es: 'Abrir historial', en: 'Open history' } },
  },
  {
    id: 'download-fails',
    question: { es: 'La descarga ha fallado, ¿qué hago?', en: 'The download failed, what now?' },
    answer: [
      {
        es: 'Vuelve a intentarlo desde la ficha de descarga: la web comprueba si el archivo está disponible y te avisa si no lo está. Si el archivo se descarga incompleto, bórralo y descárgalo de nuevo.',
        en: 'Try again from the download card: the site checks whether the file is available and warns you if it is not. If the file downloads incompletely, delete it and download it again.',
      },
      {
        es: 'Si el problema persiste, puede ser temporal. El historial de versiones también te permite descargar una versión anterior.',
        en: 'If the problem persists it may be temporary. The version history also lets you download an earlier version.',
      },
    ],
  },
  {
    id: 'verify',
    question: { es: '¿Cómo sé que el archivo que descargo es el correcto?', en: 'How do I know the file I download is the right one?' },
    answer: [
      {
        es: 'Cada versión muestra la huella SHA-256 del APK publicado. Puedes compararla con la del archivo que has descargado para comprobar que no se ha modificado por el camino.',
        en: 'Each version shows the SHA-256 fingerprint of the published APK. You can compare it with the file you downloaded to check that it has not been altered along the way.',
      },
    ],
  },
  {
    id: 'play-store',
    question: { es: '¿Está en Google Play?', en: 'Is it on Google Play?' },
    answer: [
      {
        es: 'No. VibeGrab se distribuye como APK desde esta web. Por eso Android muestra el aviso de instalación desde fuentes externas y por eso aquí publicamos el tamaño y la huella de cada archivo.',
        en: 'No. VibeGrab is distributed as an APK from this website. That is why Android shows the external-source warning and why we publish the size and fingerprint of each file here.',
      },
    ],
  },
  {
    id: 'cost',
    question: { es: '¿Es gratis? ¿Necesito una cuenta?', en: 'Is it free? Do I need an account?' },
    answer: [
      {
        es: 'Sí, es gratuita y no requiere crear ninguna cuenta. Tampoco tiene publicidad ni compras dentro de la aplicación.',
        en: 'Yes, it is free and requires no account. It has no ads and no in-app purchases either.',
      },
    ],
  },
  {
    id: 'privacy',
    question: { es: '¿Qué datos recoge la app?', en: 'What data does the app collect?' },
    answer: [
      {
        es: 'La app guarda tus descargas, ajustes y biblioteca en tu propio teléfono. No incorpora SDKs de analítica, publicidad ni informes de fallos de terceros. Los detalles, y qué ocurre al analizar un enlace, están en la política de privacidad.',
        en: 'The app stores your downloads, settings and library on your own phone. It includes no third-party analytics, advertising or crash-reporting SDKs. The details, including what happens when you analyse a link, are in the privacy policy.',
      },
    ],
    link: { key: 'privacy', label: { es: 'Leer la política', en: 'Read the policy' } },
  },
  {
    id: 'report',
    question: { es: '¿Cómo informo de un error o pido ayuda?', en: 'How do I report a bug or get help?' },
    answer: [
      {
        es: 'Incluye siempre la versión de VibeGrab, el modelo de tu teléfono, tu versión de Android y los pasos para reproducir el problema. Los canales disponibles se indican en la página de contacto.',
        en: 'Always include your VibeGrab version, phone model, Android version and the steps to reproduce the issue. The available channels are listed on the contact page.',
      },
    ],
    link: { key: 'contact', label: { es: 'Ver contacto', en: 'See contact' } },
  },
  {
    id: 'legal-use',
    question: {
      es: '¿Puedo descargar cualquier contenido?',
      en: 'Can I download any content?',
    },
    answer: [
      {
        es: 'VibeGrab es una herramienta: la responsabilidad de lo que descargas es tuya. Debes respetar los derechos de autor y las condiciones de uso de cada plataforma, y usarla solo con contenido para el que tengas permiso o que puedas guardar legalmente.',
        en: 'VibeGrab is a tool: responsibility for what you download is yours. You must respect copyright and each platform\u2019s terms of use, and use it only with content you are allowed to save.',
      },
    ],
    link: { key: 'terms', label: { es: 'Términos de uso', en: 'Terms of use' } },
  },
];
