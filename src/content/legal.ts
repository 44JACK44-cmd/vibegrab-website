/**
 * Textos legales.
 *
 * Escritos a partir de lo que la aplicación y esta web hacen realmente.
 * No se afirma que la app esté verificada por ninguna tienda, ni que esté
 * libre de errores, ni se inventan entidades, direcciones ni jurisdicciones.
 */
import type { LocalizedText } from '@/lib/releases';

export interface LegalSection {
  id: string;
  heading: LocalizedText;
  paragraphs?: LocalizedText[];
  bullets?: LocalizedText[];
  /** Párrafos que se muestran después de la lista de viñetas. */
  closing?: LocalizedText[];
}

export interface LegalDocument {
  /** Fecha de la última revisión del texto. Actualízala al cambiarlo. */
  updated: string;
  sections: LegalSection[];
}

export const privacyPolicy: LegalDocument = {
  updated: '2026-10-17',
  sections: [
    {
      id: 'resumen',
      heading: { es: 'Resumen', en: 'Summary' },
      paragraphs: [
        {
          es: 'VibeGrab es una aplicación que se ejecuta en tu propio teléfono. Tus descargas, tu biblioteca, tus favoritos y tus ajustes se guardan en el dispositivo y no se envían a ningún servicio de VibeGrab. No hay cuentas, no hay publicidad y la aplicación no incorpora sistemas de analítica ni de informes de fallos de terceros.',
          en: 'VibeGrab is an application that runs on your own phone. Your downloads, library, favourites and settings are stored on the device and are not sent to any VibeGrab service. There are no accounts, no advertising, and the app includes no third-party analytics or crash-reporting systems.',
        },
        {
          es: 'Esta web es informativa: sirve para presentar la aplicación, publicar las versiones y permitir la descarga del APK. Solo hay dos cosas que la app y la web envían fuera, y se explican en detalle más abajo: el enlace que analizas y la comprobación de si existe una versión nueva.',
          en: 'This website is informational: it presents the app, publishes releases and allows the APK to be downloaded. Only two things the app and the site send out are explained in detail below: the link you analyse and the check for a new version.',
        },
      ],
    },
    {
      id: 'app-datos',
      heading: {
        es: 'Qué guarda la aplicación en tu teléfono',
        en: 'What the application stores on your phone',
      },
      bullets: [
        {
          es: 'Los archivos que descargas, en la carpeta Movies/VibeGrab de tu almacenamiento. Son visibles desde la galería del sistema.',
          en: 'The files you download, in the Movies/VibeGrab folder of your storage. They are visible from your system gallery.',
        },
        {
          es: 'Miniaturas y datos de la biblioteca, para que la lista cargue rápido.',
          en: 'Thumbnails and library data, so the list loads quickly.',
        },
        {
          es: 'Tus preferencias: tema, idioma, opciones de reproducción y de descarga.',
          en: 'Your preferences: theme, language, playback and download options.',
        },
        {
          es: 'El historial de lo que has reproducido y descargado, y tus favoritos.',
          en: 'The history of what you have played and downloaded, and your favourites.',
        },
        {
          es: 'Los archivos que muevas a la bóveda privada, protegidos con PIN.',
          en: 'Files you move to the private vault, protected with a PIN.',
        },
      ],
      paragraphs: [
        {
          es: 'Nada de lo anterior se transmite a VibeGrab ni a terceros. Si desinstalas la aplicación, esos datos se eliminan con ella, salvo los archivos que hayas guardado en el almacenamiento del teléfono.',
          en: 'None of the above is transmitted to VibeGrab or to third parties. If you uninstall the app, that data is removed with it, except for files you saved to the phone\u2019s storage.',
        },
      ],
    },
    {
      id: 'app-permisos',
      heading: { es: 'Permisos que solicita', en: 'Permissions it requests' },
      paragraphs: [
        {
          es: 'La aplicación pide únicamente permisos que necesita para funcionar, y Android los muestra todos antes de concederlos:',
          en: 'The app asks only for permissions it needs in order to work, and Android shows them all before you grant them:',
        },
      ],
      bullets: [
        {
          es: 'Internet: analizar enlaces, descargar archivos y comprobar si hay una versión nueva.',
          en: 'Internet: analyse links, download files and check for a new version.',
        },
        {
          es: 'Almacenamiento (lectura y escritura, o acceso a archivos según la versión de Android): guardar y leer las descargas en Movies/VibeGrab.',
          en: 'Storage (read and write, or file access depending on the Android version): save and read downloads in Movies/VibeGrab.',
        },
        {
          es: 'Acceso a todos los archivos: solo se pide si decides usar el lector de estados de WhatsApp, y Android lo muestra como un permiso especial y reversible.',
          en: 'All files access: it is only requested if you choose to use the WhatsApp status reader, and Android shows it as a special, reversible permission.',
        },
        {
          es: 'Servicio en primer plano: mantener las descargas y la reproducción activas mientras usas otras aplicaciones.',
          en: 'Foreground service: keep downloads and playback running while you use other apps.',
        },
        {
          es: 'Notificaciones: mostrar el progreso de las descargas y los controles del reproductor.',
          en: 'Notifications: show download progress and player controls.',
        },
        {
          es: 'Instalar paquetes: instalar una actualización desde la propia aplicación, solo cuando tú lo autorizas.',
          en: 'Install packages: install an update from within the app, only when you authorise it.',
        },
        {
          es: 'Modificar los ajustes de audio: aplicar el ecualizador.',
          en: 'Modify audio settings: apply the equalizer.',
        },
        {
          es: 'Mantener el dispositivo activo: evitar que la reproducción se corte con la pantalla apagada.',
          en: 'Keep the device awake: prevent playback from stopping with the screen off.',
        },
      ],
      closing: [
        {
          es: 'Todos son revocables en cualquier momento desde los ajustes de Android. Si revocas uno, es posible que la función correspondiente deje de funcionar.',
          en: 'All of them can be revoked at any time in Android settings. If you revoke one, the corresponding feature may stop working.',
        },
      ],
    },
    {
      id: 'app-analisis',
      heading: { es: 'Cuando analizas un enlace', en: 'When you analyse a link' },
      paragraphs: [
        {
          es: 'Para saber en qué formatos y calidades está disponible un vídeo, VibeGrab necesita procesar la dirección del contenido. Parte de ese análisis se hace en el teléfono y parte en un servidor de análisis propio de la aplicación, al que se envía esa dirección concreta.',
          en: 'To find out which formats and qualities a video is available in, VibeGrab needs to process the content\u2019s address. Part of that analysis happens on the phone, and part on the app\u2019s own analysis server, to which that specific address is sent.',
        },
        {
          es: 'Ese servidor no recibe tu identidad ni tu cuenta, porque la aplicación no tiene cuentas. Los archivos temporales que se generan durante el procesado se eliminan. La descarga final del archivo se hace desde el servidor de origen del contenido.',
          en: 'That server does not receive your identity or an account, because the app has no accounts. Temporary files generated during processing are removed. The final file download happens from the content\u2019s original server.',
        },
        {
          es: 'Puedes configurar en los ajustes de la aplicación la dirección del servidor que quieras usar.',
          en: 'You can set the address of the server you want to use in the app\u2019s settings.',
        },
      ],
    },
    {
      id: 'app-actualizaciones',
      heading: { es: 'Comprobación de actualizaciones', en: 'Update checks' },
      paragraphs: [
        {
          es: 'La aplicación consulta la API pública de GitHub para saber si existe una versión más reciente. Esa consulta no incluye datos personales: es una petición anónima al listado público de publicaciones. Si descargas la actualización, el archivo se obtiene desde el mismo sitio de publicación.',
          en: 'The app queries the public GitHub API to find out whether a more recent version exists. That query carries no personal data: it is an anonymous request to the public list of releases. If you download the update, the file comes from the same publishing site.',
        },
      ],
    },
    {
      id: 'web',
      heading: { es: 'Qué recoge esta web', en: 'What this website collects' },
      bullets: [
        {
          es: 'No se ha configurado ninguna herramienta de analítica. Por defecto no se carga ningún script de terceros.',
          en: 'No analytics tool has been configured. By default no third-party script is loaded.',
        },
        {
          es: 'No se usan cookies. El navegador guarda en tu equipo tu preferencia de tema (claro u oscuro) y una caché temporal de la lista de versiones, para no consultarla continuamente.',
          en: 'No cookies are used. Your browser stores your theme preference (light or dark) and a temporary cache of the release list on your device, to avoid querying it continuously.',
        },
        {
          es: 'Los botones de descarga apuntan al archivo publicado. La web no registra a quién pertenece cada descarga.',
          en: 'Download buttons point to the published file. The site does not record who each download belongs to.',
        },
      ],
      paragraphs: [
        {
          es: 'Si en el futuro se añade analítica, se hará con una herramienta sin cookies y respetuosa con la privacidad, y esta política se actualizará antes de activarla.',
          en: 'If analytics are added in the future, it will be done with a cookieless, privacy-respecting tool, and this policy will be updated before it is enabled.',
        },
      ],
    },
    {
      id: 'contacto-publicado',
      heading: {
        es: 'Datos de contacto publicados',
        en: 'Published contact details',
      },
      paragraphs: [
        {
          es: 'Esta web publica los datos de contacto de la persona que mantiene el proyecto (teléfono y perfiles de Facebook y TikTok) para que puedas comunicarte con quien lo desarrolla. Son datos que el propio proyecto decide publicar de forma pública.',
          en: 'This website publishes the contact details of the person who maintains the project (phone number and Facebook and TikTok profiles) so you can reach the developer. These are details the project itself chooses to publish publicly.',
        },
        {
          es: 'La web no registra quién contacta con esos canales ni los usa para crear perfiles. No hay analítica, ni cookies, niBoletín de suscripción.',
          en: 'The site does not record who reaches out through those channels nor uses them to build profiles. There is no analytics, no cookies and no mailing list.',
        },
      ],
    },
    {
      id: 'alojamiento',
      heading: { es: 'Alojamiento y registros técnicos', en: 'Hosting and technical logs' },
      paragraphs: [
        {
          es: 'El sitio se aloja en un proveedor de infraestructura. Como es habitual en cualquier servicio web, ese proveedor puede conservar registros técnicos (dirección IP, tipo de navegador, fecha y hora de la petición) con fines de seguridad, prevención de abuso y funcionamiento del servicio. Estos registros no se usan para crear perfiles ni se cruzan con otra información.',
          en: 'The site is hosted on an infrastructure provider. As is usual for any web service, that provider may retain technical logs (IP address, browser type, request time) for security, abuse prevention and service operation. These logs are not used to build profiles or combined with other information.',
        },
      ],
    },
    {
      id: 'terceros',
      heading: { es: 'Servicios de terceros', en: 'Third-party services' },
      bullets: [
        {
          es: 'GitHub: la web y la aplicación leen de la API pública de GitHub la lista de versiones y descargan el APK desde sus servidores. Se rige por la política de privacidad de GitHub.',
          en: 'GitHub: the website and the app read the release list from the public GitHub API and download the APK from its servers. GitHub\u2019s own privacy policy applies.',
        },
        {
          es: 'lrclib.net: si activas la letra sincronizada, la aplicación consulta ese servicio público con el título y el artista de la pista. Si no lo activas, no se consulta.',
          en: 'lrclib.net: if you turn on synced lyrics, the app queries that public service with the track\u2019s title and artist. If you do not turn it on, it is not queried.',
        },
        {
          es: 'El servidor de análisis del proyecto: es configurable, así que en los ajustes puedes indicar otra dirección. En ese caso la consulta se hace a la que tú indiques.',
          en: 'The project\u2019s analysis server: it is configurable, so you can point the app at a different address in the settings. In that case the request goes to whichever address you choose.',
        },
      ],
      paragraphs: [
        {
          es: 'No se venden, alquilan ni comparten datos personales con terceros, porque la aplicación y la web no recopilan datos personales identificativos.',
          en: 'Personal data is not sold, rented or shared with third parties, because the app and the site do not collect identifying personal data.',
        },
      ],
    },
    {
      id: 'menores',
      heading: { es: 'Menores de edad', en: 'Minors' },
      paragraphs: [
        {
          es: 'La aplicación no está dirigida a menores de 13 años y no recopila datos de forma consciente. El contenido que se descarga con ella es responsabilidad de quien lo descarga.',
          en: 'The app is not aimed at children under 13 and does not knowingly collect data. Content downloaded with it is the responsibility of whoever downloads it.',
        },
      ],
    },
    {
      id: 'derechos',
      heading: { es: 'Tus derechos', en: 'Your rights' },
      paragraphs: [
        {
          es: 'Como la aplicación no recopila datos personales en un servidor, no existe un perfil tuyo que consultar, corregir o eliminar. Puedes borrar todos los datos locales desinstalando la aplicación o borrando la carpeta Movies/VibeGrab.',
          en: 'Because the app does not collect personal data on a server, there is no profile of yours to access, correct or delete. You can erase all local data by uninstalling the app or deleting the Movies/VibeGrab folder.',
        },
        {
          es: 'Para cualquier duda sobre privacidad, usa el canal de contacto indicado en esta web.',
          en: 'For any privacy question, use the contact channel listed on this website.',
        },
      ],
    },
    {
      id: 'cambios',
      heading: { es: 'Cambios en esta política', en: 'Changes to this policy' },
      paragraphs: [
        {
          es: 'Si cambia lo que la aplicación o la web recogen, esta página se actualizará y se modificará la fecha de revisión que aparece al principio.',
          en: 'If what the app or the site collects changes, this page will be updated and the revision date at the top will change.',
        },
      ],
    },
  ],
};

export const termsOfUse: LegalDocument = {
  updated: '2026-10-17',
  sections: [
    {
      id: 'aceptacion',
      heading: { es: 'Aceptación', en: 'Acceptance' },
      paragraphs: [
        {
          es: 'Al descargar, instalar o usar VibeGrab aceptas estos términos. Si no estás de acuerdo con ellos, no uses la aplicación.',
          en: 'By downloading, installing or using VibeGrab you accept these terms. If you do not agree with them, do not use the application.',
        },
      ],
    },
    {
      id: 'servicio',
      heading: { es: 'Qué ofrece esta web', en: 'What this website provides' },
      paragraphs: [
        {
          es: 'Esta web publica la información de VibeGrab, su historial de versiones y los archivos APK para su descarga. No es una tienda de aplicaciones, no aloja cuentas de usuario y no presta un servicio en la nube.',
          en: 'This website publishes information about VibeGrab, its release history and the APK files for download. It is not an app store, it hosts no user accounts and it provides no cloud service.',
        },
      ],
    },
    {
      id: 'licencia',
      heading: { es: 'Uso del software', en: 'Software use' },
      paragraphs: [
        {
          es: 'Se te concede un permiso personal y no exclusivo para instalar y usar VibeGrab en tus dispositivos. El proyecto no publica una licencia de reutilización: no se concede el derecho a redistribuir, vender, modificar o publicar versiones derivadas de la aplicación sin autorización expresa.',
          en: 'You are granted a personal, non-exclusive permission to install and use VibeGrab on your devices. The project does not publish a reuse licence: you are not granted the right to redistribute, sell, modify or publish derivative versions of the application without express permission.',
        },
      ],
    },
    {
      id: 'contenido',
      heading: { es: 'Contenido que descargas', en: 'Content you download' },
      paragraphs: [
        {
          es: 'VibeGrab es una herramienta técnica. Tú decides qué descargas y asumes la responsabilidad de hacerlo legalmente. No se permite usar la aplicación para vulnerar derechos de autor, descargar contenido ilegal o incumplir las condiciones de uso de otras plataformas.',
          en: 'VibeGrab is a technical tool. You decide what to download and you take responsibility for doing so legally. The app must not be used to infringe copyright, download illegal content or breach other platforms\u2019 terms of service.',
        },
      ],
    },
    {
      id: 'descargas',
      heading: { es: 'Descargas y actualizaciones', en: 'Downloads and updates' },
      paragraphs: [
        {
          es: 'Los APK se distribuyen tal y como se han compilado y firmado. En cada versión se publica el tamaño del archivo y su huella SHA-256 para que puedas comprobar que la descarga es íntegra.',
          en: 'APKs are distributed exactly as compiled and signed. For each version the file size and its SHA-256 fingerprint are published so you can verify the download is intact.',
        },
        {
          es: 'Algunas actualizaciones pueden requerir desinstalar e instalar de nuevo, por ejemplo si cambia la clave de firma. Cuando eso ocurre se avisa de forma destacada antes de la descarga.',
          en: 'Some updates may require uninstalling and reinstalling, for example if the signing key changes. When that happens it is prominently flagged before the download.',
        },
      ],
    },
    {
      id: 'garantias',
      heading: { es: 'Sin garantías', en: 'No warranty' },
      paragraphs: [
        {
          es: 'La aplicación y esta web se ofrecen «tal cual», sin garantías de ningún tipo. No se garantiza que funcionen sin errores, ni que sean compatibles con todos los dispositivos, ni que los servicios de terceros de los que dependen estén siempre disponibles. Las funciones pueden cambiar entre versiones.',
          en: 'The application and this website are provided “as is”, without warranties of any kind. We do not warrant that they are error-free, compatible with every device, or that the third-party services they rely on will always be available. Features may change between versions.',
        },
      ],
    },
    {
      id: 'afiliacion',
      heading: { es: 'Sin afiliación', en: 'No affiliation' },
      paragraphs: [
        {
          es: 'VibeGrab es un proyecto independiente. No está afiliado, asociado, autorizado ni patrocinado por ninguna de las plataformas de contenido con las que puede interactuar, ni por Google. Las marcas mencionadas pertenecen a sus respectivos titulares.',
          en: 'VibeGrab is an independent project. It is not affiliated with, associated with, authorised or sponsored by any of the content platforms it may interact with, nor by Google. Trademarks mentioned belong to their respective owners.',
        },
      ],
    },
    {
      id: 'responsabilidad',
      heading: { es: 'Limitación de responsabilidad', en: 'Limitation of liability' },
      paragraphs: [
        {
          es: 'En la medida permitida por la ley aplicable, no se asume responsabilidad por daños derivados del uso de la aplicación, incluida la pérdida de archivos, el uso indebido del contenido descargado o las interrupciones de terceros. Usa la aplicación de forma responsable y mantén copias de seguridad de lo que te importe.',
          en: 'To the extent permitted by applicable law, no liability is accepted for damages arising from use of the application, including loss of files, misuse of downloaded content or third-party outages. Use the app responsibly and keep backups of anything important.',
        },
      ],
    },
    {
      id: 'cambios',
      heading: { es: 'Cambios en los términos', en: 'Changes to the terms' },
      paragraphs: [
        {
          es: 'Estos términos pueden actualizarse cuando cambie el funcionamiento de la aplicación o de la web. La fecha de revisión que aparece al principio indica la última versión del texto.',
          en: 'These terms may be updated when the app or the site changes. The revision date at the top indicates the latest version of the text.',
        },
      ],
    },
    {
      id: 'contacto',
      heading: { es: 'Contacto', en: 'Contact' },
      paragraphs: [
        {
          es: 'Para cualquier duda sobre estos términos, usa el canal de contacto publicado en esta web.',
          en: 'For any question about these terms, use the contact channel published on this website.',
        },
      ],
    },
  ],
};
