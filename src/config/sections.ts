/**
 * Secciones de la portada.
 *
 * Cada sección tiene un identificador estable que se usa como ancla
 * (`/#caracteristicas`), como destino de la navegación por secciones y como
 * clave del resaltado activo al hacer scroll.
 */
import type { LocalizedText } from '@/lib/releases';

export interface HomeSection {
  id: string;
  label: LocalizedText;
  /** Texto corto para el menú de secciones. */
  short?: LocalizedText;
}

export const homeSections: HomeSection[] = [
  {
    id: 'caracteristicas',
    label: { es: 'Características', en: 'Features' },
    short: { es: 'Funciones', en: 'Features' },
  },
  {
    id: 'como-funciona',
    label: { es: 'Cómo funciona', en: 'How it works' },
    short: { es: 'Cómo funciona', en: 'How it works' },
  },
  {
    id: 'demo',
    label: { es: 'La aplicación', en: 'The app' },
    short: { es: 'La app', en: 'The app' },
  },
  {
    id: 'novedades',
    label: { es: 'Novedades', en: 'What’s new' },
    short: { es: 'Novedades', en: 'Updates' },
  },
  {
    id: 'seguridad',
    label: { es: 'Seguridad y uso responsable', en: 'Security & responsible use' },
    short: { es: 'Seguridad', en: 'Safety' },
  },
  {
    id: 'comunidad',
    label: { es: 'Comunidad', en: 'Community' },
    short: { es: 'Comunidad', en: 'Community' },
  },
  {
    id: 'preguntas',
    label: { es: 'Preguntas frecuentes', en: 'Frequently asked questions' },
    short: { es: 'Preguntas', en: 'FAQ' },
  },
];
