/**
 * Capturas de pantalla reales de la aplicación.
 *
 * Todavía no hay capturas publicadas en el proyecto, así que la lista está
 * vacía y la web muestra un estado honesto en lugar de una imagen inventada.
 * Los diagramas que acompañan a las funciones son ilustraciones construidas
 * con CSS (`FeatureVisual.astro`), no imágenes de la aplicación.
 *
 * Para añadirlas:
 *   1. Copia las imágenes a `public/screenshots/` (por ejemplo `explore.png`).
 *   2. Añade una entrada aquí con su identificador de pantalla (`explore`,
 *      `player`, `library`…), su texto alternativo y su pie de foto en los dos
 *      idiomas.
 * La portada, la galería y las fichas de función se actualizan solas.
 */
import type { LocalizedText } from '@/lib/releases';

export interface Screenshot {
  /** Identificador de la pantalla. Debe coincidir con `AppScreen.id`. */
  id: string;
  src: string;
  alt: LocalizedText;
  caption: LocalizedText;
  /** Ancho y alto reales del archivo, para evitar saltos de maquetación. */
  width: number;
  height: number;
}

export const screenshots: Screenshot[] = [];

/** Busca la captura real de una pantalla, si existe. */
export function findScreenshot(id: string): Screenshot | null {
  return screenshots.find((shot) => shot.id === id) ?? null;
}

/**
 * Captura que se muestra dentro del marco del teléfono en la portada.
 * Si es `null` se muestra el logotipo y la versión reales.
 */
export const heroScreenshot: string | null = null;
