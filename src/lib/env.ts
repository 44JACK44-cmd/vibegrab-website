/**
 * Lectura de variables de entorno.
 *
 * En el servidor leemos `process.env` (es lo que Vercel inyecta en las
 * funciones) y, como respaldo, `import.meta.env`. Así el mismo código
 * funciona en local, en `astro dev` y en Vercel sin cambios.
 */

type EnvMap = Record<string, unknown>;

function fromProcess(name: string): string | undefined {
  const env = typeof process !== 'undefined' ? (process.env as EnvMap | undefined) : undefined;
  const value = env?.[name];
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}

function fromImportMeta(name: string): string | undefined {
  const meta = import.meta.env as unknown as EnvMap | undefined;
  const value = meta?.[name];
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}

/** Variable de servidor (puede contener secretos). Nunca la expongas al cliente. */
export function serverEnv(name: string): string | undefined {
  return fromProcess(name) ?? fromImportMeta(name);
}

/** Variable pública: solo las que empiezan por `PUBLIC_` llegan al navegador. */
export function publicEnv(name: string): string | undefined {
  return fromImportMeta(name) ?? fromProcess(name);
}

export function serverEnvNumber(name: string, fallback: number): number {
  const raw = serverEnv(name);
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export function serverEnvBool(name: string, fallback = false): boolean {
  const raw = serverEnv(name)?.toLowerCase();
  if (raw === undefined) return fallback;
  return raw === '1' || raw === 'true' || raw === 'yes' || raw === 'on';
}
