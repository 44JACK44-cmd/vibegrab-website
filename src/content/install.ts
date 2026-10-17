/**
 * Guía de instalación y solución de problemas.
 *
 * El procedimiento es el estándar de Android para instalar un APK fuera de
 * Google Play. No se pide desactivar protecciones generales del dispositivo.
 */
import type { LocalizedText } from '@/lib/releases';

export interface InstallStep {
  title: LocalizedText;
  text: LocalizedText;
}

export const installSteps: InstallStep[] = [
  {
    title: { es: 'Descarga el APK', en: 'Download the APK' },
    text: {
      es: 'Pulsa «Descargar APK» en esta web. Se guardará en la carpeta de descargas de tu teléfono.',
      en: 'Tap “Download APK” on this site. It will be saved to your phone\u2019s downloads folder.',
    },
  },
  {
    title: { es: 'Abre el archivo', en: 'Open the file' },
    text: {
      es: 'Abre el archivo descargado desde las notificaciones o desde el gestor de archivos del teléfono.',
      en: 'Open the downloaded file from your notifications or from your phone\u2019s file manager.',
    },
  },
  {
    title: { es: 'Permite instalar desde esta fuente', en: 'Allow installing from this source' },
    text: {
      es: 'Android avisará de que la instalación de apps desconocidas está bloqueada. Permite la instalación solo para la app con la que abriste el archivo (tu navegador o tu gestor de archivos).',
      en: 'Android will warn that installing unknown apps is blocked. Allow installation only for the app you opened the file with (your browser or your file manager).',
    },
  },
  {
    title: { es: 'Completa la instalación', en: 'Finish the installation' },
    text: {
      es: 'Confirma el aviso y espera a que termine. Si Android Play Protect muestra una advertencia por tratarse de un APK descargado fuera de la tienda, puedes revisar los detalles y continuar.',
      en: 'Confirm the prompt and wait for it to finish. If Android Play Protect shows a warning because the APK came from outside the store, you can review the details and continue.',
    },
  },
  {
    title: { es: 'Abre VibeGrab', en: 'Open VibeGrab' },
    text: {
      es: 'Ya está. En el primer arranque la app pedirá los permisos que necesita para descargar y reproducir.',
      en: 'Done. On first launch the app will ask for the permissions it needs to download and play content.',
    },
  },
];

export interface Troubleshoot {
  problem: LocalizedText;
  solution: LocalizedText;
}

export const troubleshooting: Troubleshoot[] = [
  {
    problem: {
      es: '«App no instalada» o «El paquete parece no ser válido»',
      en: '“App not installed” or “Package appears to be invalid”',
    },
    solution: {
      es: 'Normalmente ocurre cuando la descarga se interrumpió. Vuelve a descargar el APK desde esta web y comprueba que el tamaño coincide con el indicado en la ficha de descarga.',
      en: 'This usually happens when the download was interrupted. Download the APK again from this site and check that the size matches the one shown in the download card.',
    },
  },
  {
    problem: {
      es: '«No se puede instalar la actualización» tras venir de una versión anterior',
      en: '“Update not installed” after coming from an earlier version',
    },
    solution: {
      es: 'Las versiones 1.1.34 y anteriores estaban firmadas con otra clave. La 1.1.35 y posteriores usan una clave nueva, así que Android exige desinstalar una vez antes de instalar. Tus archivos en Movies/VibeGrab no se borran.',
      en: 'Versions 1.1.34 and earlier were signed with a different key. 1.1.35 and later use a new key, so Android requires a one-time uninstall before installing. Your files in Movies/VibeGrab are not deleted.',
    },
  },
  {
    problem: {
      es: 'El botón de descarga no responde o la página no muestra la versión',
      en: 'The download button does not respond or the page shows no version',
    },
    solution: {
      es: 'La web lee la información de las publicaciones oficiales. Si el servicio falla, sigue mostrando la última información disponible indicando de cuándo es. Recarga la página y vuelve a intentarlo.',
      en: 'The site reads data from the official releases. If the service fails it still shows the last available information and indicates how old it is. Reload the page and try again.',
    },
  },
  {
    problem: {
      es: 'Las descargas se quedan en cola o se cortan',
      en: 'Downloads stay queued or get interrupted',
    },
    solution: {
      es: 'Comprueba la conexión y que quede espacio libre en el teléfono. Android puede limitar el trabajo en segundo plano: mantener la app abierta ayuda a que termine. Si persiste, cierra VibeGrab y vuelve a abrirlo para que reanude las tareas.',
      en: 'Check your connection and that you have free space on the phone. Android may restrict background work: keeping the app open helps it finish. If it persists, close VibeGrab and reopen it so it resumes tasks.',
    },
  },
  {
    problem: {
      es: 'No encuentro los archivos descargados',
      en: 'I cannot find the downloaded files',
    },
    solution: {
      es: 'Los vídeos se guardan en Movies/VibeGrab, dentro del almacenamiento del teléfono, y aparecen en la galería del sistema. Las miniaturas se guardan aparte para no llenar la galería.',
      en: 'Videos are saved to Movies/VibeGrab in your phone\u2019s storage and appear in the system gallery. Thumbnails are kept separately so they do not clutter your gallery.',
    },
  },
  {
    problem: {
      es: 'He borrado un archivo por error',
      en: 'I deleted a file by mistake',
    },
    solution: {
      es: 'Ábrelo desde la papelera de VibeGrab y restáuralo. Los elementos de la papelera se eliminan definitivamente a los 7 días.',
      en: 'Open it from VibeGrab\u2019s trash and restore it. Trash items are permanently deleted after 7 days.',
    },
  },
];
