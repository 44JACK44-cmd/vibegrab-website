# Despliegue en Vercel

El sitio usa `output: 'server'`: las páginas de descarga, versiones y las rutas
`/api/*` se ejecutan como funciones de Vercel, para leer GitHub en cada
petición (con caché). El resto se sirve estático.

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

## 2. Importar en Vercel

1. Entra en <https://vercel.com/new>.
2. Importa `44JACK44-cmd/vibegrab-website`.
3. Framework preset: **Astro** (se detecta solo).
4. Build command: `npm run build`.
5. Output directory: dejar vacío (lo gestiona el adaptador).
6. Node.js: 22.x.

Cada `push` a `main` despliega en producción; las ramas generan previews.

## 3. Variables de entorno

En **Project → Settings → Environment Variables** (Production y Preview):

| Nombre | Valor | Obligatoria |
| --- | --- | --- |
| `SITE_URL` | `https://vibegrab.com` o el subdominio de Vercel mientras tanto | Recomendada |
| `GITHUB_REPO` | `44JACK44-cmd/vibeGrab` | No (ya es el valor por defecto) |
| `GITHUB_TOKEN` | Token de solo lectura de GitHub | No |
| `RELEASES_CACHE_MINUTES` | `10` | No |
| `RELEASES_RETRY_SECONDS` | `60` | No |
| `CONTACT_EMAIL` | Correo real de soporte | No |
| `SUPPORT_URL` | Foro o formulario de soporte | No |
| `PUBLIC_ANALYTICS_DOMAIN` | Dominio de Plausible | No |

`GITHUB_TOKEN` es opcional: sin él hay 60 peticiones/hora por IP de salida; con
la caché y el respaldo es suficiente para un sitio pequeño. Si lo configuras,
usa un token clásico **sin permisos** (los repositorios públicos se leen igual)
o `public_repo`. No lo marques como `PUBLIC_`.

Después de cambiar variables hay que **redesplegar** para que las funciones las
reciban.

### Mientras no haya dominio

1. Despliega y obtén la URL `https://<proyecto>.vercel.app`.
2. Define `SITE_URL` con esa URL para que canonical, Open Graph y sitemap sean
   coherentes (por ejemplo `https://vibegrab-website.vercel.app`).
3. **No añadas dominios que no hayas registrado**: romperá el acceso al sitio.
4. Cuando compres el dominio, cambia `SITE_URL` al dominio definitivo y
   redespliega.

> Si `SITE_URL` no se define, el valor por defecto del código es
> `https://vibegrab.com`. Ese dominio **no es de este proyecto**, así que si la
> web se publica con ese valor, canonical/Open Graph/sitemap apuntarán a un
> dominio ajeno. Defínelo siempre.

## 4. Dominio propio

> **Aviso importante.** Añade en Vercel **solo** dominios que ya hayas registrado
> a tu nombre y cuyo DNS puedas editar. Añadir un dominio de terceros (por
> ejemplo `vibegrab.com`, que NO pertenece a este proyecto) hace que Vercel
> redirija `*.vercel.app` hacia ese dominio y **el sitio deja de ser accesible**.
> Vercel no regala dominios: el registro se paga aparte (GoDaddy, Namecheap,
> Porkbun, Cloudflare…) o se usa un subdominio gratuito.
> Si ya has añadido un dominio que no es tuyo: **Project → Settings → Domains →
> elimínalo**, y `*.vercel.app` vuelve a funcionar.

1. **Vercel → Project → Settings → Domains → Add**.
2. Añade `vibegrab.com` y `www.vibegrab.com`.
3. En el registrador, crea los registros que indique Vercel:
   - `A @ 76.76.21.21` (o el valor que muestre Vercel),
   - `CNAME www cname.vercel-dns.com`.
4. Espera la verificación y el certificado TLS (automático).
5. Elige el dominio principal y redirige el otro.
6. Actualiza `SITE_URL` y redespliega.

## 5. Comprobar que la integración funciona

Con el sitio desplegado (sustituye el dominio):

```bash
# Última versión y feed
curl -s https://vibegrab.com/api/releases | head -40

# La descarga debe ser un 302 al APK real
curl -sI "https://vibegrab.com/api/download" | findstr /i "location x-vibegrab-version"

# Una etiqueta inexistente vuelve a la página con aviso
curl -sI "https://vibegrab.com/api/download?tag=v9.9.9-99" | findstr /i location

# Disponibilidad del archivo
curl -s "https://vibegrab.com/api/verify"
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

## 6. Actualizaciones automáticas de la app

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

## 7. Límites y errores de GitHub

- Sin token: 60 peticiones/hora. La caché de 10 minutos reduce el uso a unas 6/h
  por instancia caliente.
- Con token: 5.000/hora.
- `403`/`429`: se muestra la última información válida (o el snapshot) y se
  espera `RELEASES_RETRY_SECONDS` antes de reintentar.
- `404`: repositorio mal escrito en `GITHUB_REPO`; revisa el valor.
- La web funciona aunque GitHub esté caído, con el aviso de datos antiguos.

## 8. Seguridad

- Ningún secreto llega al navegador: el token solo se lee en el servidor.
- Las URLs de descarga se validan contra
  `github.com/<repo>/releases/download/...`; una URL externa se descarta.
- `/api/download` no cachea la redirección y comprueba el archivo antes.
- Cabeceras en `vercel.json`: `nosniff`, `SAMEORIGIN`, `Referrer-Policy`,
  `Permissions-Policy`.
- Sin analítica por defecto. Si se activa Plausible, es sin cookies y solo si
  `PUBLIC_ANALYTICS_DOMAIN` tiene valor.

## 9. Revertir un despliegue

En Vercel, **Deployments → … → Promote to Production** sobre el despliegue
anterior. No hace falta tocar el repositorio de la app.

## 10. Notas de mantenimiento

- Actualiza `@astrojs/vercel` cuando haya versión nueva para resolver los
  avisos de `npm audit` en dependencias transitivas.
- Si cambia el formato de etiqueta de la app (`vX.Y.Z-B`), actualiza
  `TAG_PATTERN` en `src/lib/releases.ts` y las pruebas.
- Si el APK deja de llamarse `VibeGrab.apk`, no hay que cambiar código: se usa
  el primer `.apk` válido y se prefiere el nombre conocido si existe.

## 11. Verificación de Google Search Console

El archivo `public/googlec0d5ac6fe8d7300f.html` verifica la propiedad del sitio
en Google Search Console (propiedad de tipo "prefijo de URL"). Se sirve en la
raíz: `https://vibegrab-website.vercel.app/googlec0d5ac6fe8d7300f.html`.

**No borrar.** Si se elimina, Google pierde la verificación. No afecta al
rendimiento ni al SEO negativo (es un archivo estático suelto).

Cuando exista el dominio propio, añadir **además** una propiedad de tipo
"Dominio" y verificarla por **DNS (registro TXT)**; esa verificación no depende
de ningún archivo ni del hosting, así que sobrevive a cambios de proveedor.
