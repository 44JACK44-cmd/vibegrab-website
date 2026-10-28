/**
 * Compila (y opcionalmente despliega) para un objetivo concreto.
 *
 * Las variables de entorno tipo `DEPLOY_TARGET=cloudflare astro build` son
 * cómodas en Linux pero no en Windows, donde `VAR=x cmd` no es un comando.
 * Este envoltorio fija la variable y encadena los comandos de forma portable:
 *
 *   node scripts/build-target.mjs cloudflare            # compila para Workers
 *   node scripts/build-target.mjs cloudflare --deploy   # compila y despliega
 *   node scripts/build-target.mjs render                # compila para Render
 *
 * Los scripts de npm los usan `build:cf`, `deploy:cf` y `build:render`.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const target = process.argv[2] ?? '';
const extra = process.argv.slice(3);
const deploy = extra.includes('--deploy');

if (!target) {
  console.error('Falta el objetivo: node scripts/build-target.mjs <cloudflare|render|vercel>');
  process.exit(1);
}

const root = fileURLToPath(new URL('..', import.meta.url));

process.env.DEPLOY_TARGET = target;

console.log(`> compilando para ${target}...`);
const build = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
  stdio: 'inherit',
  env: process.env,
  cwd: root,
});
if (build.error) {
  console.error('No se pudo lanzar la compilación:', build.error.message);
  process.exit(1);
}
if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

if (!deploy) process.exit(0);

console.log('> desplegando a Cloudflare con wrangler...');
const wrangler = spawnSync(process.execPath, ['node_modules/wrangler/bin/wrangler.js', 'deploy'], {
  stdio: 'inherit',
  env: process.env,
  cwd: root,
});
if (wrangler.error) {
  console.error('No se pudo lanzar wrangler:', wrangler.error.message);
  process.exit(1);
}
process.exit(wrangler.status ?? 1);
