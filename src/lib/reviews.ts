/**
 * Opiniones de la comunidad.
 *
 * Las opiniones se guardan como **issues del repositorio del proyecto**:
 *
 *  · Si el servidor tiene `GITHUB_TOKEN`, el formulario escribe el issue
 *    directamente. El usuario **no necesita ninguna cuenta**: solo rellena la
 *    puntuación y el texto y pulsa publicar. El servidor valida, filtra el
 *    spam y crea el issue.
 *  · Si además se han publicado a mano con la cuenta de GitHub, se leen igual
 *    y se muestran con la verificación de esa cuenta.
 *
 * El cuerpo del issue lleva una marca oculta con los datos estructurados:
 *
 *   <!-- vibegrab-review {"rating":5,"version":"1.1.38","lang":"es","alias":"Ana","via":"form"} -->
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
  /**
   * Nombre visible. Es el alias que escribió la persona o, si no puso
   * ninguno, su cuenta de GitHub. Nunca es un nombre inventado por la web.
   */
  author: string;
  /** Enlace al perfil, si la opinión viene de una cuenta de GitHub. */
  authorUrl: string;
  /**
   * `true` solo cuando la opinión procede de una cuenta de GitHub identificable
   * (la persona la publicó con su cuenta). Las que llegan por el formulario
   * llevan un alias sin verificar y se muestran como tales.
   */
  verified: boolean;
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

/**
 * Opinión sin los datos internos del almacén (enlace al issue de origen y
 * nombre de la plataforma). Es lo que se devuelve al público: la web no
 * expone sus repositorios.
 */
export type PublicReview = Omit<Review, 'sourceUrl' | 'source'>;

/** Marca que identifica un issue como opinión de la comunidad. */
export const REVIEW_MARKER = 'vibegrab-review';

/** Longitud mínima y máxima del texto de una opinión. */
export const REVIEW_MIN_LENGTH = 20;
export const REVIEW_MAX_LENGTH = 800;

/** Longitud máxima del alias. */
export const REVIEW_ALIAS_MAX_LENGTH = 40;

/** Configuración del almacén de opiniones. */
export const reviewsConfig = {
  /**
   * Repositorio donde se publican las opiniones. Se puede cambiar con
   * `REVIEWS_REPO` para usar un repositorio **privado**: en ese caso las
   * opiniones dejan de ser públicas y la web las lee con su propio token.
   */
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
  alias?: unknown;
  via?: unknown;
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

  const version =
    typeof marker.version === 'string' && /^v?\d+\.\d+\.\d+/.test(marker.version)
      ? marker.version.replace(/^v/, '')
      : undefined;

  const lang: 'es' | 'en' = marker.lang === 'en' ? 'en' : 'es';

  const githubLogin = typeof data.user?.login === 'string' ? data.user.login : '';
  const alias =
    typeof marker.alias === 'string' && marker.alias.trim() !== ''
      ? marker.alias.trim().slice(0, REVIEW_ALIAS_MAX_LENGTH)
      : '';

  // `via: "form"` significa que la escribió alguien sin cuenta verificable.
  const fromForm = marker.via === 'form';

  const author = alias || (fromForm ? '' : githubLogin);

  return {
    id: `gh-${data.id ?? data.number}`,
    number: Number(data.number) || 0,
    author,
    authorUrl:
      !fromForm && typeof data.user?.html_url === 'string' ? data.user.html_url : '',
    verified: !fromForm && Boolean(githubLogin),
    date: typeof data.created_at === 'string' ? data.created_at : '',
    rating,
    version,
    lang,
    text,
    source: 'GitHub',
    sourceUrl: typeof data.html_url === 'string' ? data.html_url : '',
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

/** Datos que envía el formulario. */
export interface ReviewSubmission {
  text: string;
  rating: number;
  version?: string;
  lang: 'es' | 'en';
  /** Alias opcional elegido por la persona. */
  alias?: string;
}

/** Construye el cuerpo del issue con la marca y la opinión. */
export function buildReviewBody(input: ReviewSubmission & { via?: string }): string {
  const marker = JSON.stringify({
    rating: input.rating,
    version: input.version ?? '',
    lang: input.lang,
    alias: (input.alias ?? '').slice(0, REVIEW_ALIAS_MAX_LENGTH),
    via: input.via ?? 'form',
  });
  return `<!-- ${REVIEW_MARKER} ${marker} -->\n\n${input.text.trim()}`;
}

/** Construye el título del issue. */
export function buildReviewTitle(input: { rating: number; version?: string; lang: 'es' | 'en' }): string {
  const prefix = input.lang === 'en' ? reviewsConfig.titlePrefixEn : reviewsConfig.titlePrefix;
  const version = input.version ? ` · v${input.version.replace(/^v/, '')}` : '';
  return `${prefix} ${input.rating}/5${version}`;
}

/** Texto de la interfaz de la sección de comunidad. */
export const communityCopy = {
  formTitle: {
    es: 'Deja tu opinión sobre VibeGrab',
    en: 'Share your opinion about VibeGrab',
  },
  formIntro: {
    es: 'Puntúa la versión que usas y cuenta qué te funcionó y qué no. No hace falta crear ninguna cuenta: pulsa publicar y tu opinión aparece en esta página.',
    en: 'Rate the version you use and say what worked and what did not. No account needed: tap publish and your opinion appears on this page.',
  },
  formAlias: { es: 'Tu nombre o alias (opcional)', en: 'Your name or alias (optional)' },
  formAliasPlaceholder: {
    es: 'Cómo quieres que te veamos',
    en: 'How you want to be shown',
  },
  formAliasNote: {
    es: 'El alias es público. Si lo dejas vacío, tu opinión aparecerá como «Usuario de la comunidad».',
    en: 'The alias is public. If you leave it empty, your opinion will appear as “Community member”.',
  },
  formRating: { es: 'Tu puntuación', en: 'Your rating' },
  ratingOption: {
    es: '{value} de 5 estrellas',
    en: '{value} out of 5 stars',
  },
  ratingValue: { es: '{value} de 5', en: '{value} out of 5' },
  ratingEmpty: { es: 'Sin elegir', en: 'Not selected' },
  formText: { es: 'Tu opinión', en: 'Your opinion' },
  formTextPlaceholder: {
    es: '¿Qué te ha funcionado bien? ¿Qué echaste en falta? Sé concreto: ayuda más que los elogios.',
    en: 'What worked well for you? What did you miss? Be specific: it helps more than praise.',
  },
  formVersion: { es: 'Versión que usas (opcional)', en: 'Version you are using (optional)' },
  formSubmit: { es: 'Publicar mi opinión', en: 'Publish my opinion' },
  formSending: { es: 'Publicando…', en: 'Publishing…' },
  formNote: {
    es: 'Las opiniones se guardan en el repositorio público del proyecto para que el desarrollo pueda leerlas. Puedes revisar o retirar la tuya en cualquier momento.',
    en: 'Opinions are stored in the project’s public repository so the developers can read them. You can review or withdraw yours at any time.',
  },
  formErrorShort: {
    es: 'Escribe un poco más para que la opinión sea útil (mínimo 20 caracteres).',
    en: 'Write a little more so the opinion is useful (at least 20 characters).',
  },
  formErrorRating: { es: 'Elige una puntuación del 1 al 5.', en: 'Choose a rating from 1 to 5.' },
  formErrorServer: {
    es: 'No hemos podido publicar la opinión. Inténtalo de nuevo en unos minutos.',
    en: 'We could not publish the opinion. Please try again in a few minutes.',
  },
  formErrorRate: {
    es: 'Has enviado demasiadas opiniones seguidas. Inténtalo más tarde.',
    en: 'You have sent too many opinions in a row. Please try again later.',
  },
  formErrorDuplicate: {
    es: 'Esa opinión ya se ha enviado. No la repitas.',
    en: 'That opinion has already been sent. Please do not repeat it.',
  },
  formSuccess: {
    es: '¡Gracias! Tu opinión ya está publicada.',
    en: 'Thank you! Your opinion has been published.',
  },
  formSuccessPending: {
    es: '¡Gracias! Tu opinión se publicará en cuanto sea revisada.',
    en: 'Thank you! Your opinion will be published once it has been reviewed.',
  },
  formUnavailable: {
    es: 'El canal de opiniones no está disponible ahora mismo.',
    en: 'The opinion channel is not available right now.',
  },
  summaryTitle: { es: 'Lo que dice la comunidad', en: 'What the community says' },
  summaryEmpty: {
    es: 'Todavía no hay opiniones publicadas. Cuando exista la primera, aparecerá aquí con su puntuación y su fecha.',
    en: 'There are no published opinions yet. As soon as the first one exists it will appear here with its rating and date.',
  },
  summaryCount: { es: '{count} opiniones', en: '{count} opinions' },
  summaryCountOne: { es: '1 opinión', en: '1 opinion' },
  summaryAverage: { es: 'media de {value} sobre 5', en: '{value} average out of 5' },
  reviewAnonymous: { es: 'Usuario de la comunidad', en: 'Community member' },
  reviewVerified: { es: 'cuenta verificada', en: 'verified account' },
  reviewAlias: { es: 'alias sin verificar', en: 'unverified alias' },
  reviewVersion: { es: 'usaba la v{version}', en: 'using v{version}' },
  sourceNote: {
    es: 'Las opiniones se revisan y se pueden retirar en cualquier momento.',
    en: 'Opinions are reviewed and can be withdrawn at any time.',
  },
} satisfies Record<string, LocalizedText>;
