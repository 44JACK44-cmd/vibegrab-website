/**
 * Opiniones de la comunidad.
 *
 * Las opiniones se guardan como **issues públicas** del repositorio de la web
 * y se leen de la API pública de GitHub. Se ha elegido este almacén porque:
 *
 *  · No hace falta ningún servicio nuevo ni base de datos.
 *  · Cada opinión queda atribuida a una **cuenta real de GitHub**, que es la
 *    única forma de que un testimonio sea atribuible y no un nombre inventado.
 *  · El moderador puede **cerrar** un issue para ocultarlo, sin tocar código.
 *  · Es un canal con una barrera de spam natural: hay que tener cuenta.
 *
 * El cuerpo del issue lleva una marca oculta con los datos estructurados:
 *
 *   <!-- vibegrab-review {"rating":5,"version":"1.1.38","lang":"es"} -->
 *   Texto de la opinión…
 *
 * El texto se muestra tal cual lo escribió la persona, en su idioma y sin
 * traducirlo ni retocarlo.
 */
import type { LocalizedText } from '@/lib/releases';

export interface Review {
  /** Identificador estable (número del issue). */
  id: string;
  number: number;
  /** Alias público de quien la escribió (su cuenta de GitHub). */
  author: string;
  authorUrl: string;
  /** Fecha real de publicación, en ISO. */
  date: string;
  /** Puntuación de 1 a 5. */
  rating: number;
  /** Versión de VibeGrab que estaba usando, si la indicó. */
  version?: string;
  /** Idioma en el que escribió la opinión. */
  lang: 'es' | 'en';
  /** Texto literal de la opinión. */
  text: string;
  /** Nombre de la fuente. */
  source: string;
  /** Enlace a la opinión original. */
  sourceUrl: string;
}

/** Marca que identifica un issue como opinión de la comunidad. */
export const REVIEW_MARKER = 'vibegrab-review';

/** Longitud mínima y máxima del texto de una opinión. */
export const REVIEW_MIN_LENGTH = 20;
export const REVIEW_MAX_LENGTH = 800;

/** Configuración del almacén de opiniones. */
export const reviewsConfig = {
  /** Repositorio donde se publican las opiniones. */
  repo: '44JACK44-cmd/vibegrab-website',
  /** Prefijo del título del issue, para reconocerlos de un vistazo. */
  titlePrefix: '[Reseña]',
  /** Prefijo del título en inglés. */
  titlePrefixEn: '[Review]',
} as const;

const MARKER_PATTERN = new RegExp(`<!--\\s*${REVIEW_MARKER}\\s*(\\{[^>]*?\\})\\s*-->`, 'i');

/** Datos estructurados que viajan dentro de la marca. */
interface ReviewMarker {
  rating?: unknown;
  version?: unknown;
  lang?: unknown;
}

/**
 * Convierte un issue de GitHub en una opinión válida.
 * Devuelve `null` si no es una opinión o si incumple las reglas mínimas.
 */
export function parseReviewIssue(issue: unknown): Review | null {
  if (!issue || typeof issue !== 'object') return null;
  const data = issue as Record<string, any>;

  // Los issues de GitHub también incluyen los pull requests.
  if (data.pull_request) return null;

  const body = typeof data.body === 'string' ? data.body : '';
  const match = MARKER_PATTERN.exec(body);
  if (!match) return null;

  let marker: ReviewMarker = {};
  try {
    marker = JSON.parse(match[1]) as ReviewMarker;
  } catch {
    return null;
  }

  const rating = Number(marker.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return null;

  const text = body.replace(match[0], '').trim();
  if (text.length < REVIEW_MIN_LENGTH || text.length > REVIEW_MAX_LENGTH) return null;

  const author = typeof data.user?.login === 'string' ? data.user.login : '';
  if (!author) return null;

  const version =
    typeof marker.version === 'string' && /^v?\d+\.\d+\.\d+/.test(marker.version)
      ? marker.version.replace(/^v/, '')
      : undefined;

  const lang: 'es' | 'en' = marker.lang === 'en' ? 'en' : 'es';

  const number = Number(data.number);
  const htmlUrl = typeof data.html_url === 'string' ? data.html_url : '';

  return {
    id: `gh-${data.id ?? number}`,
    number: Number.isFinite(number) ? number : 0,
    author,
    authorUrl: typeof data.user?.html_url === 'string' ? data.user.html_url : `https://github.com/${author}`,
    date: typeof data.created_at === 'string' ? data.created_at : '',
    rating,
    version,
    lang,
    text,
    source: 'GitHub',
    sourceUrl: htmlUrl,
  };
}

/** Nota media de las opiniones. `null` si no hay ninguna. */
export function averageRating(reviews: Review[]): number | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

/** Reparto de puntuaciones, de 5 a 1, para el resumen. */
export function ratingBreakdown(reviews: Review[]): Array<{ rating: number; count: number }> {
  return [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
  }));
}

/** Construye el cuerpo del issue con la marca y la opinión. */
export function buildReviewBody(input: {
  text: string;
  rating: number;
  version?: string;
  lang: 'es' | 'en';
}): string {
  const marker = JSON.stringify({
    rating: input.rating,
    version: input.version ?? '',
    lang: input.lang,
  });
  return `<!-- ${REVIEW_MARKER} ${marker} -->\n\n${input.text.trim()}`;
}

/** Construye el enlace al compositor de issues de GitHub, ya relleno. */
export function buildReviewIssueUrl(input: {
  repo?: string;
  text: string;
  rating: number;
  version?: string;
  lang: 'es' | 'en';
}): string {
  const repo = input.repo ?? reviewsConfig.repo;
  const prefix = input.lang === 'en' ? reviewsConfig.titlePrefixEn : reviewsConfig.titlePrefix;
  const title = `${prefix} ${input.rating}/5${input.version ? ` · v${input.version.replace(/^v/, '')}` : ''}`;
  const body = buildReviewBody(input);
  const params = new URLSearchParams({ title, body });
  return `https://github.com/${repo}/issues/new?${params.toString()}`;
}

/** Textos de la interfaz de la sección de comunidad. */
export const communityCopy = {
  formTitle: {
    es: 'Deja tu opinión sobre VibeGrab',
    en: 'Share your opinion about VibeGrab',
  },
  formIntro: {
    es: 'Puntúa la versión que usas y cuenta qué te funcionó y qué no. Tu opinión se publica de forma pública en el repositorio del proyecto, firmada con tu cuenta de GitHub, para que cada valoración sea atribuible a una persona real.',
    en: 'Rate the version you use and say what worked and what did not. Your opinion is published publicly in the project repository, signed with your GitHub account, so every rating is attributable to a real person.',
  },
  formRating: { es: 'Tu puntuación', en: 'Your rating' },
  formText: { es: 'Tu opinión', en: 'Your opinion' },
  formTextPlaceholder: {
    es: '¿Qué te ha funcionado bien? ¿Qué echaste en falta? Sé concreto: ayuda más que los elogios.',
    en: 'What worked well for you? What did you miss? Be specific: it helps more than praise.',
  },
  formVersion: { es: 'Versión que usas (opcional)', en: 'Version you are using (optional)' },
  formSubmit: { es: 'Publicar mi opinión', en: 'Publish my opinion' },
  formNote: {
    es: 'Se abrirá GitHub con la opinión ya escrita: revísala, inicia sesión si hace falta y publícala. Tu nombre de usuario quedará visible junto a la puntuación.',
    en: 'GitHub will open with the opinion already written: review it, sign in if needed and publish it. Your username will be visible next to the rating.',
  },
  formErrorShort: {
    es: 'Escribe un poco más para que la opinión sea útil (mínimo 20 caracteres).',
    en: 'Write a little more so the opinion is useful (at least 20 characters).',
  },
  formErrorRating: { es: 'Elige una puntuación del 1 al 5.', en: 'Choose a rating from 1 to 5.' },
  formErrorSpam: {
    es: 'No hemos podido enviar la opinión. Inténtalo de nuevo.',
    en: 'We could not submit the opinion. Please try again.',
  },
  summaryTitle: { es: 'Lo que dice la comunidad', en: 'What the community says' },
  summaryEmpty: {
    es: 'Todavía no hay opiniones publicadas. Cuando exista la primera, aparecerá aquí con su puntuación y su fecha.',
    en: 'There are no published opinions yet. As soon as the first one exists it will appear here with its rating and date.',
  },
  summaryCount: { es: '{count} opiniones', en: '{count} opinions' },
  summaryAverage: { es: 'media de {value} sobre 5', en: '{value} average out of 5' },
  reviewBy: { es: 'por {author}', en: 'by {author}' },
  reviewVersion: { es: 'usaba la v{version}', en: 'using v{version}' },
  reviewSource: { es: 'publicada en GitHub', en: 'published on GitHub' },
  sourceNote: {
    es: 'Las opiniones se guardan como issues públicos del repositorio del proyecto. Cerrar un issue retira la opinión de esta lista.',
    en: 'Opinions are stored as public issues in the project repository. Closing an issue removes the opinion from this list.',
  },
} satisfies Record<string, LocalizedText>;
