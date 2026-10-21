/**
 * Presentación de las notas de versión: orden de categorías, etiquetas e
 * iconos. Se comparte entre la portada, la ficha de descarga y el historial.
 */
import type { LocalizedText, NoteCategory, NoteSection } from '@/lib/releases';

export const categoryMeta: Record<
  NoteCategory,
  { label: LocalizedText; icon: string; accent: boolean }
> = {
  features: {
    label: { es: 'Nuevas funciones', en: 'New features' },
    icon: 'bolt',
    accent: true,
  },
  improvements: {
    label: { es: 'Mejoras', en: 'Improvements' },
    icon: 'arrow-up-right',
    accent: true,
  },
  fixes: {
    label: { es: 'Correcciones', en: 'Fixes' },
    icon: 'check-circle',
    accent: false,
  },
  stability: {
    label: { es: 'Estabilidad', en: 'Stability' },
    icon: 'shield',
    accent: false,
  },
  important: {
    label: { es: 'Importante antes de instalar', en: 'Important before installing' },
    icon: 'warning',
    accent: false,
  },
  changes: {
    label: { es: 'Cambios incluidos', en: 'Included changes' },
    icon: 'file-text',
    accent: false,
  },
};

const ORDER: NoteCategory[] = ['features', 'improvements', 'fixes', 'stability', 'important', 'changes'];

/** Ordena las secciones según el orden canónico de categorías. */
export function sortedSections(sections: NoteSection[]): NoteSection[] {
  return [...sections].sort(
    (a, b) => ORDER.indexOf(a.category) - ORDER.indexOf(b.category),
  );
}

/** Devuelve la sección de avisos importantes, si existe. */
export function pickImportant(
  sections: NoteSection[],
  locale?: 'es' | 'en',
): NoteSection | null {
  const pool = locale ? sectionsForLocale(sections, locale) : sections;
  return pool.find((section) => section.category === 'important') ?? null;
}

/** Secciones sin los avisos importantes (que se muestran aparte). */
export function withoutImportant(
  sections: NoteSection[],
  locale?: 'es' | 'en',
): NoteSection[] {
  const pool = locale ? sectionsForLocale(sections, locale) : sections;
  return pool.filter((section) => section.category !== 'important');
}

/**
 * Secciones que corresponden al idioma de la página.
 *
 * Las publicaciones que traen el texto en dos idiomas lo marcan con
 * `<!-- es -->` y `<!-- en -->`; cada sección queda etiquetada y aquí se
 * filtra por el idioma de la página. Las secciones sin idioma (notas curadas
 * o publicaciones de un solo idioma) se muestran siempre.
 *
 * Si la publicación no tiene nada en el idioma pedido, se muestran todas:
 * es preferible a una ficha sin novedades.
 */
export function sectionsForLocale(
  sections: NoteSection[],
  locale: 'es' | 'en',
): NoteSection[] {
  const matching = sections.filter((section) => !section.lang || section.lang === locale);
  return matching.length > 0 ? matching : sections;
}

/**
 * Convierte un Markdown mínimo y seguro (`**negrita**`, `` `código` ``,
 * `[texto](url)`) en HTML. Se escapa primero, así que el contenido nunca
 * puede inyectar etiquetas.
 */
export function renderInline(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  return escaped
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noopener noreferrer nofollow">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\s)\*([^*\n]+)\*/g, '$1<em>$2</em>');
}
