/**
 * Pruebas del helper de Markdown para textos planos de novedades.
 *
 * Los resúmenes de versiones se escriben con Markdown (`**negrita**`,
 * `` `código` ``, `[texto](url)`); la web los muestra en listas (tarjeta de
 * nueva versión, resúmenes) y ahí hay que texto plano sin formato.
 */
import { describe, expect, it } from 'vitest';
import { renderInline, stripMarkdown } from '@/lib/notes';

describe('stripMarkdown', () => {
  it('quita el formato de negrita y cursiva', () => {
    expect(stripMarkdown('🛡️ **Bloqueo de anuncios real** — El navegador corta')).toBe(
      '🛡️ Bloqueo de anuncios real — El navegador corta',
    );
    expect(stripMarkdown('*cursiva*')).toBe('cursiva');
  });

  it('quita los enlaces manteniendo el texto visible', () => {
    expect(stripMarkdown('Mira [la guía](https://ejemplo.com)')).toBe('Mira la guía');
  });

  it('quita el código y los títulos de sección', () => {
    expect(stripMarkdown('Usa `SHA256SUMS.txt` para verificar')).toBe(
      'Usa SHA256SUMS.txt para verificar',
    );
    expect(stripMarkdown('## Novedades\n- Algo')).toBe('Novedades - Algo');
  });

  it('normaliza los espacios sobrantes', () => {
    expect(stripMarkdown('  **Un**   **Dos**  ')).toBe('Un Dos');
  });
});

describe('renderInline', () => {
  it('convierte el markdown en HTML sin escapar el contenido', () => {
    expect(renderInline('**Dos** y [link](https://ejemplo.com)')).toBe(
      '<strong>Dos</strong> y <a href="https://ejemplo.com" rel="noopener noreferrer nofollow">link</a>',
    );
  });
});
