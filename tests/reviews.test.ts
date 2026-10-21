/**
 * Pruebas del sistema de opiniones de la comunidad.
 *
 * Comprueban que solo se acepten los issues que son opiniones reales, que se
 * descarten los que no cumplen las reglas, que el resumen (media y media por
 * nota) sale de los datos y que el envío se valida antes de tocar la red.
 */
import { afterEach, describe, expect, it } from 'vitest';
import {
  averageRating,
  buildReviewBody,
  buildReviewTitle,
  parseReviewIssue,
  ratingBreakdown,
  REVIEW_MARKER,
  REVIEW_MAX_LENGTH,
  REVIEW_MIN_LENGTH,
  type Review,
} from '@/lib/reviews';
import { resetReviewsCache, submitReview } from '@/lib/reviews-server';

function issue(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    number: 7,
    title: '[Reseña] 5/5 · v1.1.38',
    body: `<!-- ${REVIEW_MARKER} {"rating":5,"version":"1.1.38","lang":"es"} -->\n\nMuy buena app, la uso a diario y va muy fluida.`,
    state: 'open',
    created_at: '2026-10-19T10:00:00Z',
    html_url: 'https://github.com/44JACK44-cmd/vibegrab-website/issues/7',
    user: { login: 'usuario-real', html_url: 'https://github.com/usuario-real' },
    ...overrides,
  };
}

describe('parseReviewIssue', () => {
  it('convierte un issue publicado con una cuenta en una opinión verificada', () => {
    const review = parseReviewIssue(issue());

    expect(review).not.toBeNull();
    expect(review?.author).toBe('usuario-real');
    expect(review?.verified).toBe(true);
    expect(review?.authorUrl).toContain('github.com');
    expect(review?.rating).toBe(5);
    expect(review?.version).toBe('1.1.38');
    expect(review?.lang).toBe('es');
    expect(review?.text).toContain('Muy buena app');
    expect(review?.text).not.toContain(REVIEW_MARKER);
  });

  it('una opinión del formulario usa el alias y no se marca como verificada', () => {
    const body = `<!-- ${REVIEW_MARKER} {"rating":4,"version":"1.1.38","lang":"es","alias":"Ana","via":"form"} -->\n\nLa uso a diario y me funciona muy bien, el reproductor va fluido.`;
    const review = parseReviewIssue(issue({ body }));

    expect(review?.author).toBe('Ana');
    expect(review?.verified).toBe(false);
    expect(review?.authorUrl).toBe('');
  });

  it('sin alias y sin cuenta se muestra con el nombre genérico', () => {
    const body = `<!-- ${REVIEW_MARKER} {"rating":4,"lang":"es","via":"form"} -->\n\nLa uso a diario y me funciona muy bien, el reproductor va fluido.`;
    const review = parseReviewIssue(issue({ body }));

    expect(review?.author).toBe('');
    expect(review?.verified).toBe(false);
  });

  it('descarta un issue sin la marca', () => {
    expect(parseReviewIssue(issue({ body: 'Un bug en la reproducción.' }))).toBeNull();
  });

  it('descarta los pull requests', () => {
    expect(parseReviewIssue(issue({ pull_request: { url: 'https://api.github.com/x' } }))).toBeNull();
  });

  it('descarta una puntuación fuera de 1 a 5', () => {
    const body = `<!-- ${REVIEW_MARKER} {"rating":9,"lang":"es"} -->\n\nTexto suficientemente largo para pasar la validación.`;
    expect(parseReviewIssue(issue({ body }))).toBeNull();
  });

  it('descarta un texto demasiado corto', () => {
    const body = `<!-- ${REVIEW_MARKER} {"rating":4,"lang":"es"} -->\n\nCorto`;
    expect(parseReviewIssue(issue({ body }))).toBeNull();
  });

  it('descarta un texto demasiado largo', () => {
    const body = `<!-- ${REVIEW_MARKER} {"rating":4,"lang":"es"} -->\n\n${'a'.repeat(REVIEW_MAX_LENGTH + 1)}`;
    expect(parseReviewIssue(issue({ body }))).toBeNull();
  });

  it('descarta una marca con JSON inválido', () => {
    const body = `<!-- ${REVIEW_MARKER} {rating:5} -->\n\nTexto suficientemente largo para pasar la validación.`;
    expect(parseReviewIssue(issue({ body }))).toBeNull();
  });
});

describe('resumen', () => {
  const reviews: Review[] = [
    { id: '1', number: 1, author: 'a', authorUrl: '', verified: false, date: '2026-10-19', rating: 5, lang: 'es', text: 'x', source: 'GitHub', sourceUrl: '' },
    { id: '2', number: 2, author: 'b', authorUrl: '', verified: false, date: '2026-10-19', rating: 4, lang: 'es', text: 'x', source: 'GitHub', sourceUrl: '' },
    { id: '3', number: 3, author: 'c', authorUrl: '', verified: true, date: '2026-10-19', rating: 4, lang: 'en', text: 'x', source: 'GitHub', sourceUrl: '' },
  ];

  it('calcula la media real', () => {
    expect(averageRating(reviews)).toBe(4.3);
  });

  it('no inventa una media cuando no hay opiniones', () => {
    expect(averageRating([])).toBeNull();
  });

  it('reparte las puntuaciones de 5 a 1', () => {
    expect(ratingBreakdown(reviews)).toEqual([
      { rating: 5, count: 1 },
      { rating: 4, count: 2 },
      { rating: 3, count: 0 },
      { rating: 2, count: 0 },
      { rating: 1, count: 0 },
    ]);
  });
});

describe('preparación del envío', () => {
  it('el cuerpo incluye la marca, el alias y el texto', () => {
    const body = buildReviewBody({
      text: '  Hola  ',
      rating: 4,
      version: '1.1.38',
      lang: 'es',
      alias: 'Ana',
    });

    expect(body).toContain(REVIEW_MARKER);
    expect(body).toContain('"rating":4');
    expect(body).toContain('"alias":"Ana"');
    expect(body).toContain('"via":"form"');
    expect(body.endsWith('Hola')).toBe(true);
  });

  it('el título lleva la puntuación y la versión', () => {
    expect(buildReviewTitle({ rating: 5, version: '1.1.38', lang: 'es' })).toBe(
      '[Reseña] 5/5 · v1.1.38',
    );
    expect(buildReviewTitle({ rating: 3, lang: 'en' })).toBe('[Review] 3/5');
  });

  it('acepta un texto en el límite mínimo', () => {
    const text = 'a'.repeat(REVIEW_MIN_LENGTH);
    expect(text.length).toBeGreaterThanOrEqual(REVIEW_MIN_LENGTH);
    expect(buildReviewBody({ text, rating: 3, lang: 'es' })).toContain(text);
  });
});

describe('envío de la opinión', () => {
  afterEach(() => {
    resetReviewsCache();
  });

  it('rechaza un texto demasiado corto sin tocar la red', async () => {
    const result = await submitReview({ text: 'corto', rating: 4, lang: 'es', ip: '1.1.1.1' });
    expect(result).toEqual({ ok: false, reason: 'invalid' });
  });

  it('rechaza una puntuación inválida', async () => {
    const result = await submitReview({
      text: 'Un texto suficientemente largo para pasar la validación.',
      rating: 9,
      lang: 'es',
      ip: '1.1.1.2',
    });
    expect(result).toEqual({ ok: false, reason: 'invalid' });
  });

  it('sin token configurado el canal no está disponible', async () => {
    const result = await submitReview({
      text: 'Un texto suficientemente largo para pasar la validación.',
      rating: 4,
      lang: 'es',
      ip: '1.1.1.3',
    });
    // En las pruebas no hay token, así que el canal se declara no disponible
    // en vez de fingir que la opinión se ha guardado.
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.reason).toBe('unavailable');
  });
});
