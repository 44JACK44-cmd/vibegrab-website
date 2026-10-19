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
| `npm run preview` | Previsualiza el resultado del build |
| `npm run snapshot` | Regenera `src/data/releases.snapshot.json` desde GitHub |
| `npm run assets` | Regenera la imagen Open Graph y los favicons |

## Estructura

```text
src/
  components/            Componentes de interfaz (sin lógica de datos)
    views/               Composición de cada página
  config/
    site.ts              Producto, Android, repo y contacto
    routes.ts            Rutas ES/EN, hreflang y URLs absolutas
    screenshots.ts       Capturas reales (vacío hasta tenerlas)
  content/
    curated-notes.ts     Novedades bilingües revisadas, por versión
    features.ts          Funcionalidades verificadas de la app
    faq.ts, install.ts   Ayuda e instalación
    legal.ts             Privacidad y términos
  data/
    releases.snapshot.json   Respaldo estático de GitHub Releases
  i18n/ui.ts             Diccionario ES/EN de la interfaz
  layouts/BaseLayout.astro
  lib/
    releases.ts          Integración con GitHub, caché y validación
    notes.ts             Categorías y orden de las notas
    format.ts            Fechas, tamaños y hashes
  pages/
    api/download.ts      Redirección verificada al APK
    api/verify.ts        Comprobación de disponibilidad (JSON)
    api/releases.ts      Feed JSON con caché
    sitemap-versions.xml.ts
    ...                  Rutas ES y EN
  styles/                tokens.css, base.css, components.css
tests/                   Pruebas con Vitest
scripts/                 Generadores de snapshot y de imágenes
public/                  Logo, favicons, og-image, robots
vercel.json              Cabeceras de seguridad y caché
```

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

## Estado y pendientes

- **Dominio**: no comprado. Se puede desplegar primero en `*.vercel.app`.
- **Contacto**: sin correo ni canal público todavía; la página lo dice.
- **Capturas**: no existen capturas reales publicadas. La portada usa una pieza
  de marca, no una captura falsa, y la galería se oculta hasta que haya
  imágenes en `src/config/screenshots.ts`.
- **Licencia**: la app no tiene licencia publicada; los textos legales no
  afirman lo contrario.
- **Aviso de `npm audit`**: hay 3 avisos altos en dependencias transitivas de
  `@astrojs/vercel` (`path-to-regexp`). No afectan al navegador ni a la lógica
  de descarga; la corrección automática implica una bajada de versión mayor, así
  que se revisa al actualizar el adaptador.

## Despliegue

Ver [DEPLOY.md](./DEPLOY.md).
