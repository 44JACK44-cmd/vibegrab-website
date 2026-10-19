/**
 * Reseñas y opiniones de la comunidad.
 *
 * IMPORTANTE: esta lista está **vacía a propósito**.
 *
 * No se incluyen testimonios inventados, nombres ficticios, Photographs de
 * personas que no existen ni puntuaciones sin respaldo. Para que aparezcan
 * reseñas en la web tiene que existir una fuente real de opiniones (por
 * ejemplo un foro, una tienda de aplicaciones o un formulario con
 * almacenamiento real), y las reseñas deben llegar desde ahí con su atribución.
 *
 * Para activarlas:
 *   1. Define la fuente real en `src/content/reviews.ts` (`reviewsSource`).
 *   2. Añade cada opinión a `reviews`, con su texto, autoría, fecha, versión
 *      y la fuente de la que procede.
 * La sección de comunidad los mostrará automáticamente y, mientras no haya
 * ninguna, mostrará el estado honesto en lugar de reseñas de relleno.
 */
import type { LocalizedText } from '@/lib/releases';

export interface Review {
  id: string;
  /** Opinión tal cual la escribió la persona, sin retocar el sentido. */
  text: LocalizedText;
  /** Nombre o alias mostrado. */
  author: string;
  /** Fecha real de la opinión, en ISO. */
  date: string;
  /** Versión de VibeGrab que usaba la persona. */
  version?: string;
  /** Puntuación, si la fuente la publica y es verificable. */
  rating?: number;
  /** De dónde procede la opinión (foro, tienda, etc.). */
  source: string;
  /** Enlace a la opinión original, si es público. */
  sourceUrl?: string;
}

/**
 * Fuente de las reseñas. Vacía = no hay reseñas verificadas todavía.
 */
export const reviewsSource: {
  name: string;
  url: string | null;
} = {
  name: '',
  url: null,
};

/** Opiniones verificadas. Vacío mientras no haya una fuente real. */
export const reviews: Review[] = [];
