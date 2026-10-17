/**
 * Capturas de pantalla reales de la aplicación.
 *
 * Todavía no hay capturas publicadas en el proyecto, así que la lista está
 * vacía y la web muestra un estado honesto en lugar de una imagen inventada.
 *
 * Para añadirlas:
 *   1. Copia las imágenes a `public/screenshots/` (por ejemplo `inicio.png`).
 *   2. Añade una entrada aquí con su texto alternativo en los dos idiomas.
 * La portada y la galería se actualizan solas.
 */
import type { LocalizedText } from '@/lib/releases';

export interface Screenshot {
  src: string;
  alt: LocalizedText;
  caption: LocalizedText;
}

export const screenshots: Screenshot[] = [];

/**
 * Captura que se muestra dentro del marco del teléfono en la portada.
 * Si es `null` se muestra el logotipo y la versión reales.
 */
export const heroScreenshot: string | null = null;
