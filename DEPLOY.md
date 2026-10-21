# Despliegue

El sitio usa `output: 'server'`: las páginas de descarga, versiones y las rutas
`/api/*` se generan en el servidor, para leer GitHub en cada petición (con
caché). El resto se sirve estático.

El mismo repositorio despliega en **Render** (servidor Node) y en **Vercel**
(funciones serverless). Solo cambia el adaptador, y se elige con la variable de
entorno `DEPLOY_TARGET`:

| `DEPLOY_TARGET` | Adaptador | Salida | Plataforma |
| --- | --- | --- | --- |
| `render` (o `node`) | `@astrojs/node` en modo `standalone` | `dist/server/entry.mjs` | Render |
| `vercel` (por defecto) | `@astrojs/vercel` | `.vercel/output` | Vercel |

## 1. Subir el repositorio

```bash
git init
git add .
git commit -m "Sitio web oficial de VibeGrab"
git branch -M main
git remote add origin https://github.com/44JACK44-cmd/vibegrab-website.git
git push -u origin main
```

No se sube `.env` (está en `.gitignore`).

## 2. Desplegar en Render

1. Entra en <https://render.com/deploy?repo=https://github.com/44JACK44-cmd/vibegrab-website>
   (usa el `render.yaml` de este repositorio, que trae los ajustes ya puestos).
2. Elige **Web Service** y el plan **Free**.
3. Render detectará el repositorio y la rama `main`.
4. Deja estas variables (las pide el propio panel):
   - `SITE_URL`: el dominio del servicio, por ejemplo
     `https://vibegrab-website.onrender.com`. **Es obligatoria en Render**:
     no hay forma automática de saber el dominio, y de ella dependen las URL
     canónicas, los sitemaps y el `robots.txt`.
   - `GITHUB_TOKEN`: token de GitHub con permiso `public_repo` (para el canal
     de opiniones).
5. `DEPLOY_TARGET=render` y `NODE_VERSION=22` ya vienen en el blueprint.
6. **Deploy**. El primer arranque tarda un poco (instala dependencias y
   compila).

Ajustes equivalentes si lo creas a mano:

| Campo | Valor |
| --- | --- |
| Runtime | Node |
| Build command | `npm ci && npm run build` |
| Start command | `node ./dist/server/entry.mjs` |
| Health check path | `/` |
| Auto-deploy | Sí, desde `main` |

> **Arranques en frío.** En el plan gratuito Render apaga el servicio tras
> unos minutos sin tráfico y el siguiente visitante espera a que arranque
> (unos 30–60 segundos). El workflow `keep-alive.yml` lo despierta cada 10
> minutos para evitarlo, pero las tareas programadas de GitHub pueden retrasarse.
> Con el plan de pago el problema desaparece.

## 3. Desplegar en Vercel

1. Entra en <https://vercel.com/new>.
2. Importa `44JACK44-cmd/vibegrab-website`.
3. Framework preset: **Astro** (se detecta solo).
4. Build command: `npm run build`.
5. Output directory: dejar vacío (lo gestiona el adaptador).
6. Node.js: 22.x.

Cada `push` a `main` despliega en producción; las ramas generan previews.
En Vercel no hace falta `DEPLOY_TARGET`: el adaptador correcto es el de por
defecto.

## 4. Variables de entorno

En **Project → Settings → Environment Variables** (Vercel) o **Service →
Environment** (Render):

| Nombre | Valor | Obligatoria |
| --- | --- | --- |
| `DEPLOY_TARGET` | `render` en Render, `vercel` en Vercel | Sí |
| `SITE_URL` | Dominio real del servicio | **Sí en Render** |
| `GITHUB_REPO` | `44JACK44-cmd/vibeGrab` | No (ya es el valor por defecto) |
| `GITHUB_TOKEN` | Token de GitHub con permiso `public_repo` | Sí, para publicar opiniones |
| `RELEASES_CACHE_MINUTES` | `10` | No |
| `RELEASES_RETRY_SECONDS` | `60` | No |
| `REVIEWS_CACHE_MINUTES` | `10` | No |
| `REVIEWS_REQUIRE_MODERATION` | `0` | No (`1` = revisión previa) |
| `REVIEWS_MAX_PER_HOUR` | `5` | No |
| `CONTACT_EMAIL` | Correo real de soporte | No |
| `SUPPORT_URL` | Foro o formulario de soporte | No |
| `CONTACT_PHONE` | `944 834 202` | No (ya está en el código) |
| `CONTACT_PHONE_E164` | `+51944834202` | No (ya está en el código) |
| `CONTACT_FACEBOOK` | Perfil de Facebook | No (ya está en el código) |
| `CONTACT_TIKTOK` | Perfil de TikTok | No (ya está en el código) |
| `PUBLIC_ANALYTICS_DOMAIN` | Dominio de Plausible | No |

`GITHUB_TOKEN` es opcional: sin él la web funciona igual, gracias a la caché y
al respaldo estático. Si lo configuras, usa un token clásico **sin permisos
administrativos** o `public_repo` y **no lo marques como `PUBLIC_`**.

> **El canal de opiniones necesita que el token pueda escribir.** Sin
> `GITHUB_TOKEN` (o sin permiso `public_repo`) el formulario de opiniones no se
> muestra: es preferible a un botón que no pueda guardar nada.

Después de cambiar variables hay que **redesplegar** para que las funciones las
reciban.

### Mientras no haya dominio

No hace falta configurar nada. La URL canónica se resuelve en
`src/config/site-url.ts` con este orden de prioridad:

1. `SITE_URL`, si está definida.
2. `VERCEL_PROJECT_PRODUCTION_URL`, que Vercel inyecta por su cuenta en cada
   build y en cada función, con el dominio de producción del proyecto
   (`https://<proyecto>.vercel.app`).
3. El respaldo del proyecto, para desarrollo local sin `.env`.

Al desplegar en Vercel, `canonical`, `hreflang`, Open Graph, `robots.txt` y los
dos sitemaps apuntan solos a `https://<proyecto>.vercel.app`.

Cuando registres un dominio propio (paso 4), define `SITE_URL` con ese dominio y
redespliega.

> **Nunca** pongas en `SITE_URL` un dominio que no hayas registrado, ni lo añadas
> en Vercel: el sitio publicaría URLs ajenas y, si el dominio queda apuntado al
> proyecto, `*.vercel.app` redirige allí y **el sitio queda inaccesible**.

## 5. Dominio propio

> **Aviso importante.** Añade en Vercel **solo** dominios que ya hayas registrado
> a tu nombre y cuyo DNS puedas editar. Añadir un dominio de terceros (por
> ejemplo `vibegrab.com`, que NO pertenece a este proyecto) hace que Vercel
> redirija `*.vercel.app` hacia ese dominio y **el sitio deja de ser accesible**.
> Vercel no regala dominios: el registro se paga aparte (GoDaddy, Namecheap,
> Porkbun, Cloudflare…) o se usa un subdominio gratuito.
> Si ya has añadido un dominio que no es tuyo: **Project → Settings → Domains →
> elimínalo**, y `*.vercel.app` vuelve a funcionar.

1. **Vercel → Project → Settings → Domains → Add**.
2. Añade `tudominio.com` y `www.tudominio.com` (los que hayas registrado tú).
3. En el registrador, crea los registros que indique Vercel:
   - `A @ 76.76.21.21` (o el valor que muestre Vercel),
   - `CNAME www cname.vercel-dns.com`.
4. Espera la verificación y el certificado TLS (automático).
5. Elige el dominio principal y redirige el otro.
6. Actualiza `SITE_URL` y redespliega.

## 6. Comprobar que la integración funciona

Con el sitio desplegado (sustituye el dominio):

```bash
# Última versión y feed
curl -s https://vibegrab-website.vercel.app/api/releases | head -40

# La descarga debe ser un 302 al APK real
curl -sI "https://vibegrab-website.vercel.app/api/download" | findstr /i "location x-vibegrab-version"

# Una etiqueta inexistente vuelve a la página con aviso
curl -sI "https://vibegrab-website.vercel.app/api/download?tag=v9.9.9-99" | findstr /i location

# Disponibilidad del archivo
curl -s "https://vibegrab-website.vercel.app/api/verify"
```

```bash
# Enlaces y anclas internas rotas (con el servidor de desarrollo en marcha)
npm run check:links -- http://127.0.0.1:4321
```

Comprobaciones manuales:

- [ ] El botón principal descarga un `.apk` (no una página HTML).
- [ ] El nombre y el tamaño coinciden con el asset de GitHub.
- [ ] El SHA-256 mostrado coincide con el `digest` de la API.
- [ ] El historial está ordenado por fecha.
- [ ] `v1.2.0-3` aparece marcada como anterior a la estable actual.
- [ ] Ninguna página enlaza al repositorio ni al código fuente.
- [ ] `/versiones/<tag>/` y `/en/versions/<tag>/` responden 200.
- [ ] Una etiqueta inventada responde 404.
- [ ] `robots.txt` y los dos sitemaps responden 200.

## 7. Actualizaciones automáticas de la app

**No hay que redesplegar al publicar una versión.** El flujo es:

1. El repositorio de la app publica una release con el APK.
2. Como máximo `RELEASES_CACHE_MINUTES` después, la web consulta GitHub y
   muestra la nueva versión como estable si es la más reciente por fecha.
3. El botón de descarga resuelve el asset en ese momento.

El historial se regenera en cada petición; los enlaces son siempre los reales
de GitHub. Si una release se publica sin APK, no se ofrece.

Para que el respaldo estático también esté al día, el workflow
`.github/workflows/snapshot.yml` ejecuta `npm run snapshot` a diario y hace
commit si cambió. También se puede lanzar a mano desde **Actions → Refresh
releases snapshot → Run workflow**.

## 8. Límites y errores de GitHub

- Sin token: 60 peticiones/hora. La caché de 10 minutos reduce el uso a unas 6/h
  por instancia caliente.
- Con token: 5.000/hora.
- `403`/`429`: se muestra la última información válida (o el snapshot) y se
  espera `RELEASES_RETRY_SECONDS` antes de reintentar.
- `404`: repositorio mal escrito en `GITHUB_REPO`; revisa el valor.
- La web funciona aunque GitHub esté caído, con el aviso de datos antiguos.

## 9. Seguridad

- Ningún secreto llega al navegador: el token solo se lee en el servidor.
- Las URLs de descarga se validan contra
  `github.com/<repo>/releases/download/...`; una URL externa se descarta.
- `/api/download` no cachea la redirección y comprueba el archivo antes.
- Cabeceras en `vercel.json`: `nosniff`, `SAMEORIGIN`, `Referrer-Policy`,
  `Permissions-Policy`.
- Sin analítica por defecto. Si se activa Plausible, es sin cookies y solo si
  `PUBLIC_ANALYTICS_DOMAIN` tiene valor.

## 10. Revertir un despliegue

En Vercel, **Deployments → … → Promote to Production** sobre el despliegue
anterior. No hace falta tocar el repositorio de la app.

## 11. Notas de mantenimiento

- Actualiza `@astrojs/vercel` cuando haya versión nueva para resolver los
  avisos de `npm audit` en dependencias transitivas.
- Si cambia el formato de etiqueta de la app (`vX.Y.Z-B`), actualiza
  `TAG_PATTERN` en `src/lib/releases.ts` y las pruebas.
- Si el APK deja de llamarse `VibeGrab.apk`, no hay que cambiar código: se usa
  el primer `.apk` válido y se prefiere el nombre conocido si existe.

## 12. Verificación de Google Search Console

El archivo `public/googlec0d5ac6fe8d7300f.html` verifica la propiedad del sitio
en Google Search Console (propiedad de tipo "prefijo de URL"). Se sirve en la
raíz: `https://vibegrab-website.vercel.app/googlec0d5ac6fe8d7300f.html`.

**No borrar.** Si se elimina, Google pierde la verificación. No afecta al
rendimiento ni al SEO negativo (es un archivo estático suelto).

Cuando exista el dominio propio, añadir **además** una propiedad de tipo
"Dominio" y verificarla por **DNS (registro TXT)**; esa verificación no depende
de ningún archivo ni del hosting, así que sobrevive a cambios de proveedor.
