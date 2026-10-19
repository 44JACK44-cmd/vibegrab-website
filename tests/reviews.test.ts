/**
 * Pruebas del sistema de opiniones de la comunidad.
 *
 * Comprueban que solo se acepten los issues que son opiniones reales, que se
 * descarten los que no cumplen las reglas y que el resumen (media y media
 * por nota) sale de los datos, nunca de un número inventado.
 */
import { describe, expect, it } from 'vitest';
import {
  averageRating,
  buildReviewBody,
  buildReviewIssueUrl,
  parseReviewIssue,
  ratingBreakdown,
  REVIEW_MARKER,
  REVIEW_MAX_LENGTH,
  REVIEW_MIN_LENGTH,
  type Review,
} from '@/lib/reviews';

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
  it('convierte un issue marcado en una opinión', () => {
    const review = parseReviewIssue(issue());

    expect(review).not.toBeNull();
    expect(review?.author).toBe('usuario-real');
    expect(review?.rating).toBe(5);
    expect(review?.version).toBe('1.1.38');
    expect(review?.lang).toBe('es');
    expect(review?.text).toContain('Muy buena app');
    expect(review?.text).not.toContain(REVIEW_MARKER);
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

  it('descarta un issue sin autor', () => {
    expect(parseReviewIssue(issue({ user: undefined }))).toBeNull();
  });

  it('descarta una marca con JSON inválido', () => {
    const body = `<!-- ${REVIEW_MARKER} {rating:5} -->\n\nTexto suficientemente largo para pasar la validación.`;
    expect(parseReviewIssue(issue({ body }))).toBeNull();
  });
});

describe('resumen', () => {
  const reviews: Review[] = [
    { id: '1', number: 1, author: 'a', authorUrl: '', date: '2026-10-19', rating: 5, lang: 'es', text: 'x', source: 'GitHub', sourceUrl: '' },
    { id: '2', number: 2, author: 'b', authorUrl: '', date: '2026-10-19', rating: 4, lang: 'es', text: 'x', source: 'GitHub', sourceUrl: '' },
    { id: '3', number: 3, author: 'c', authorUrl: '', date: '2026-10-19', rating: 4, lang: 'en', text: 'x', source: 'GitHub', sourceUrl: '' },
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

describe('envío de la opinión', () => {
  it('el cuerpo incluye la marca y el texto', () => {
    const body = buildReviewBody({ text: '  Hola  ', rating: 4, version: '1.1.38', lang: 'es' });

    expect(body).toContain(REVIEW_MARKER);
    expect(body).toContain('"rating":4');
    expect(body).toContain('Hola');
    expect(body.endsWith('Hola')).toBe(true);
  });

  it('el enlace apunta al compositor de issues con el contenido relleno', () => {
    const url = new URL(
      buildReviewIssueUrl({ text: 'Mi opinión sobre la app', rating: 5, version: '1.1.38', lang: 'es' }),
    );

    expect(url.origin + url.pathname).toBe(
      'https://github.com/44JACK44-cmd/vibegrab-website/issues/new',
    );
    expect(url.searchParams.get('title')).toContain('5/5');
    expect(url.searchParams.get('body')).toContain(REVIEW_MARKER);
    expect(url.searchParams.get('body')).toContain('Mi opinión sobre la app');
  });

  it('usa el prefijo en inglés cuando el idioma es inglés', () => {
    const url = new URL(
      buildReviewIssueUrl({ text: 'My honest opinion about the app', rating: 3, lang: 'en' }),
    );

    expect(url.searchParams.get('title')).toContain('[Review]');
  });

  it('acepta un texto en el límite mínimo', () => {
    const text = 'a'.repeat(REVIEW_MIN_LENGTH);
    expect(text.length).toBeGreaterThanOrEqual(REVIEW_MIN_LENGTH);
    expect(buildReviewBody({ text, rating: 3, lang: 'es' })).toContain(text);
  });
});
