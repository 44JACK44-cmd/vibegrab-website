# VibeGrab — sitio web oficial

Sitio de presentación, descarga e historial de versiones de **VibeGrab**, la app
de descargas y reproducción multimedia para Android. El contenido de versiones
se obtiene de **GitHub Releases** y se actualiza sin tocar el código.

- URL pública: `https://vibegrab-website.vercel.app` (el dominio se resuelve solo; ver [DEPLOY.md](./DEPLOY.md))
- Repositorio de la app: `44JACK44-cmd/vibeGrab` (solo lectura)
- Idiomas: español en la raíz (`/`) e inglés en `/en/`

## Stack

| Pieza | Qué se usa |
| --- | --- |
| Framework | Astro 7 con TypeScript, `output: 'server'` |
| Despliegue | Vercel (`@astrojs/vercel`) |
| Estilos | CSS propio con tokens, sin framework de UI |
| Tipografías | Inter Variable y Space Grotesk Variable, autoalojadas |
| Datos | API REST pública de GitHub Releases |
| Pruebas | Vitest |
| Imágenes | `sharp` solo en tareas de build (`scripts/`) |

No hay base de datos, cookies de analítica ni scripts de terceros por defecto.

## Requisitos

- Node.js 22 o superior
- npm 10 o superior

En Windows, si PowerShell bloquea `npm.ps1`, usa `npm.cmd`.

## Puesta en marcha

```bash
npm install
copy .env.example .env   # Windows
# cp .env.example .env   # macOS / Linux
npm run dev
```

El sitio queda en <http://localhost:4321>.

## Scripts

| Comando | Para qué sirve |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Comprobación de tipos + build de producción |
| `npm run build:fast` | Build sin `astro check` (más rápido) |
| `npm run check` | Diagnóstico de TypeScript y plantillas Astro |
| `npm test` | Pruebas de la integración, la caché y las rutas de descarga |
| `npm run check:links` | Rastrea las páginas y comprueba que no hay enlaces ni anclas rotas |
| `npm run preview` | Previsualiza el resultado del build |
| `npm run snapshot` | Regenera `src/data/releases.snapshot.json` desde GitHub |
| `npm run assets` | Regenera la imagen Open Graph y los favicons |

> `npm run preview` no funciona con el adaptador de Vercel: para revisar el
> resultado usa `npm run dev`, o `npm run build:fast` y el despliegue.

## Estructura

```text
src/
  components/            Componentes de interfaz (sin lógica de datos)
    views/               Composición de cada página
  config/
    site.ts              Producto, Android, repo y contacto
    site-url.ts          Resolución de la URL canónica (SITE_URL o Vercel)
    routes.ts            Rutas ES/EN, hreflang y URLs absolutas
    sections.ts          Apartados de la portada (anclas y scroll-spy)
    screenshots.ts       Capturas reales (vacío hasta tenerlas)
  content/
    curated-notes.ts     Novedades bilingües revisadas, por versión
    features.ts          Funcionalidades verificadas de la app
    app-tour.ts          Pantallas reales de la app (pestañas y vistas)
    security.ts          Seguridad, procedencia y limitaciones
    faq.ts, install.ts   Ayuda e instalación
    about.ts             Historia y principios del proyecto
    legal.ts             Privacidad y términos
  data/
    releases.snapshot.json   Respaldo estático de GitHub Releases
  i18n/ui.ts             Diccionario ES/EN de la interfaz
  layouts/BaseLayout.astro
  lib/
    releases.ts          Integración con GitHub, caché y validación
    reviews.ts           Marca, validación y formato de las opiniones
    reviews-server.ts    Lectura de las opiniones desde GitHub (solo servidor)
    notes.ts             Categorías y orden de las notas
    stats.ts             Métricas verificables del producto
    format.ts            Fechas, tamaños, hashes y contadores
  pages/
    api/download.ts      Redirección verificada al APK
    api/verify.ts        Comprobación de disponibilidad (JSON)
    api/releases.ts      Feed JSON con caché
    api/reviews.ts       Opiniones de la comunidad (JSON)
    sitemap-versions.xml.ts
    ...                  Rutas ES y EN
  styles/                tokens.css, base.css, components.css, sections.css
tests/                   Pruebas con Vitest
scripts/                 Snapshot, imágenes y comprobador de enlaces
public/                  Logo, favicons, og-image, robots
vercel.json              Cabeceras de seguridad y caché
```

## La portada

La portada es la página principal del producto y se compone así:

1. **Portada**: versión estable real, fecha de publicación y botón de descarga.
2. **Métricas verificables** (`StatStrip`): versión actual, número de versiones
   publicadas, tamaño del APK y descargas del archivo en GitHub. El contador de
   GitHub se etiqueta siempre como *descargas del archivo*, nunca como usuarios.
3. **Escaparate de funciones** (`FeatureShowcase`): bloques alternos con
   explicación, beneficio y un diagrama CSS (`FeatureVisual`) que explica la
   función. No son capturas de pantalla.
4. **Cómo funciona**: cuatro pasos y la nota de procedencia del APK.
5. **La aplicación** (`AppTour`): las seis pestañas reales del producto, con
   navegación por teclado, más la galería de capturas cuando existan.
6. **Novedades**: notas curadas de la última versión publicada.
7. **Seguridad y uso responsable**: fuente oficial, integridad, privacidad y
   las limitaciones reales del producto.
8. **Comunidad** (`Community`): sin reseñas inventadas. Con reseñas verificadas
   las muestra; sin ellas, indica que no las hay y ofrece las vías reales.
9. **Preguntas frecuentes** y llamada a la acción final.

## Cómo se obtienen las versiones

Todo vive en `src/lib/releases.ts` y se configura en `src/config/site.ts`.

1. Se consulta `GET https://api.github.com/repos/{repo}/releases?per_page=100`.
   El propietario y el nombre del repositorio se cambian en un solo sitio:
   `siteConfig.repo` (o con la variable `GITHUB_REPO`).
2. Se descartan los **borradores** y las publicaciones cuyo `tag_name` no sigue
   el formato real de la app: `vX.Y.Z-B`.
3. Se busca el APK **entre los assets reales** de cada publicación. Un asset
   solo se acepta si:
   - termina en `.apk`,
   - GitHub lo marca como `uploaded`,
   - tiene tamaño mayor que cero,
   - y su `browser_download_url` pertenece a
     `github.com/<repo>/releases/download/...`.
4. La **versión estable actual** es la publicación más reciente **por fecha de
   publicación** (`published_at`) entre las que no son preliminares y tienen un
   APK válido. Nunca se elige por número de versión. Esto importa porque
   `v1.2.0-3` se publicó antes que `v1.1.35-40`.
5. Las versiones **preliminares** no se ofrecen como descarga principal y se
   muestran en una sección aparte, plegada.
6. Las versiones sin APK aparecen como no descargables, nunca con un botón.

### Caché y tolerancia a fallos

- En memoria, `RELEASES_CACHE_MINUTES` minutos (10 por defecto).
- Revalidación con `ETag`: si GitHub responde `304`, no se gasta cuota.
- Tras un error se espera `RELEASES_RETRY_SECONDS` (60 por defecto) antes de
  volver a intentarlo, para no bombardear la API.
- Si falla y hay datos en memoria, se sirven marcados como antiguos, con la
  fecha de la última consulta correcta.
- Si no hay nada en memoria, se usa `src/data/releases.snapshot.json`, generado
  con `npm run snapshot`.
- Sin publicaciones válidas, la interfaz muestra un estado vacío explícito.

### Descargas

El botón visible apunta siempre a `/api/download?tag=…&lang=…`, en el dominio
del sitio:

1. Resuelve la versión pedida (o la última estable).
2. Rechaza borradores, versiones sin APK y enlaces que no sean del repositorio.
3. Hace una petición de 1 byte al APK para comprobar que sigue disponible.
4. Redirige con `302` al `browser_download_url` real, sin caché.

Si algo falla, vuelve a la página de descarga con `?estado=no-disponible` y un
mensaje comprensible. El usuario nunca necesita entrar al repositorio.

## Novedades de cada versión

`src/content/curated-notes.ts` contiene el texto bilingüe revisado de las
versiones, tomado del catálogo de novedades que la propia app muestra
(`mobile/lib/features/whats_new/data/whats_new_catalog.dart`). Se agrupa en
nuevas funciones, mejoras, correcciones, estabilidad y avisos importantes.

Si una versión no tiene entrada curada, se muestra el texto original de GitHub
**tal cual** y etiquetado como «Notas originales publicadas por el
desarrollador». Así nunca se presenta un mensaje de commit como una novedad
verificada.

Para añadir una versión nueva al catálogo, añade una clave con el número de
versión (`'1.2.0'`) y sus secciones. No hace falta tocar componentes.

## Pruebas

```bash
npm test
```

Cubren, entre otras cosas:

- selección por fecha frente a número de versión (`v1.2.0-3` vs `v1.1.35-40`),
- exclusión de borradores y preliminares de la versión estable,
- descarte de APKs inexistentes, no subidos o alojados fuera del repositorio,
- lista vacía y fallo total de la API,
- caché dentro del intervalo, revalidación `304` y espera tras un error,
- redirección de `/api/download` al APK correcto y aviso cuando no está,
- respuesta de `/api/verify`.

## Variables de entorno

Están documentadas en `.env.example`. Las importantes:

| Variable | Por defecto | Notas |
| --- | --- | --- |
| `SITE_URL` | vacío | Dominio propio (opcional). Si falta, se usa el dominio de producción de Vercel |
| `GITHUB_REPO` | `44JACK44-cmd/vibeGrab` | Repositorio de releases |
| `GITHUB_TOKEN` | vacío | Solo servidor; sube el límite de la API |
| `RELEASES_CACHE_MINUTES` | `10` | 1–1440 |
| `RELEASES_RETRY_SECONDS` | `60` | 10–3600 |
| `CONTACT_EMAIL` | vacío | La web lo indica como pendiente si falta |
| `SUPPORT_URL` | vacío | Alternativa al correo |
| `PUBLIC_ANALYTICS_DOMAIN` | vacío | Sin analítica si está vacío |

Nunca pongas secretos en variables `PUBLIC_*`: llegan al navegador.

## Cómo añadir capturas reales

La web **nunca** muestra pantallas ficticias. Para publicar capturas de verdad:

1. Copia las imágenes a `public/screenshots/` (por ejemplo `explore.png`).
2. Añade una entrada en `src/config/screenshots.ts` con el `id` de la pantalla
   (`explore`, `browser`, `analyzer`, `downloads`, `library`, `settings`,
   `shorts`, `video-detail`, `media-player`, `vault`, `trash`), el texto
   alternativo y el pie de foto en los dos idiomas, más el ancho y el alto
   reales para evitar saltos de maquetación.
3. La galería de la portada y las fichas de función las recogen solas.

Los identificadores están en `src/content/app-tour.ts`.

## Reseñas y comunidad

Las opiniones se guardan como **issues públicos** del repositorio de la web
(`44JACK44-cmd/vibegrab-website`) y se leen de la API pública de GitHub.

El flujo es real y sin intermediarios:

1. La persona rellena la puntuación (1–5) y la opinión.
2. El formulario abre el compositor de issues de GitHub con el texto ya
   escrito y una marca con los datos estructurados:
   `<!-- vibegrab-review {"rating":5,"version":"1.1.38","lang":"es"} -->`
3. Inicia sesión en GitHub y publica. La opinión queda **firmada por su
   cuenta**, que es la única forma de que un testimonio sea atribuible.
4. La web la recoge en el siguiente `npm run snapshot`-like refresh (la caché
   dura `REVIEWS_CACHE_MINUTES`, 10 minutos por defecto).

Moderación: **cerrar el issue retira la opinión** de la lista, sin tocar
código. Solo se aceptan issues con la marca válida, puntuación entre 1 y 5 y
texto entre 20 y 800 caracteres.

Si algún día se quiere cambiar de almacén (por ejemplo a una base de datos),
el punto de conexión es `src/lib/reviews-server.ts`; la interfaz y el
formulario no cambian.

## Estado y pendientes

- **Dominio**: no comprado. Se despliega en `https://vibegrab-website.vercel.app`.
- **Contacto**: sin correo ni canal público todavía; la página lo dice.
- **Capturas**: no existen capturas reales publicadas. La portada usa una pieza
  de marca y los diagramas CSS que explican cada función; la galería se muestra
  en cuanto haya imágenes en `src/config/screenshots.ts`.
- **Estadísticas de usuarios**: no hay fuente fiable de usuarios únicos ni de
  instalaciones. La web solo muestra el contador de descargas del archivo que
  publica GitHub, etiquetado como tal. No se deduce ninguna cifra de usuarios.
- **Reseñas**: el sistema está activo y usa los issues públicos del repositorio
  como almacén real. Todavía no hay ninguna opinión publicada, así que la
  sección lo indica con claridad. La primera que se cree aparecerá sola.
- **Licencia**: la app no tiene licencia publicada; los textos legales no
  afirman lo contrario.
- **Aviso de `npm audit`**: hay 3 avisos altos en dependencias transitivas de
  `@astrojs/vercel` (`path-to-regexp`). No afectan al navegador ni a la lógica
  de descarga; la corrección automática implica una bajada de versión mayor, así
  que se revisa al actualizar el adaptador.

## Despliegue

Ver [DEPLOY.md](./DEPLOY.md).
