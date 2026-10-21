/**
 * Arranque del servidor Node autónomo.
 *
 * El servidor debe escuchar en **todas las interfaces** (`0.0.0.0`). Con el
 * valor por defecto (`localhost`) los contenedores no son alcanzables desde
 * fuera: en Render el servicio se quedaría en «Timed Out» esperando un
 * escaneo de puertos.
 *
 * Si ya viene definido `HOST` (por ejemplo `127.0.0.1` en pruebas locales),
 * se respeta.
 */
process.env.HOST ||= '0.0.0.0';

await import('../dist/server/entry.mjs');
