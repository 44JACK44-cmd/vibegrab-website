/** Formateadores compartidos (tamaños, fechas, hashes). */
import type { Locale } from '@/config/routes';

const LOCALE_TAG: Record<Locale, string> = { es: 'es-ES', en: 'en-GB' };

/**
 * Tamaño legible. Se calcula con base 1024 (como muestra Android),
 * pero con un decimal para no perder precisión en los MB.
 */
export function formatBytes(bytes: number | null | undefined, locale: Locale = 'es'): string {
  if (bytes == null || !Number.isFinite(bytes) || bytes <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = value >= 100 || unit === 0 ? 0 : 1;
  return `${value.toLocaleString(LOCALE_TAG[locale], {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} ${units[unit]}`;
}

/** Número con separador de miles: `12 480`. */
export function formatCount(value: number | null | undefined, locale: Locale = 'es'): string {
  if (value == null || !Number.isFinite(value)) return '—';
  return value.toLocaleString(LOCALE_TAG[locale]);
}

/** Fecha larga y legible: «17 de octubre de 2026». */
export function formatDate(iso: string | null | undefined, locale: Locale = 'es'): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Fecha y hora, para «última comprobación». */
export function formatDateTime(iso: string | null | undefined, locale: Locale = 'es'): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** «hace 3 días» / «hace 2 horas». */
export function formatRelative(iso: string | null | undefined, locale: Locale = 'es'): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  const diffMs = date.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat(LOCALE_TAG[locale], { numeric: 'auto' });
  const minutes = Math.round(diffMs / 60000);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
  const hours = Math.round(diffMs / 3600000);
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
  const days = Math.round(diffMs / 86400000);
  if (Math.abs(days) < 30) return rtf.format(days, 'day');
  const months = Math.round(diffMs / 2592000000);
  if (Math.abs(months) < 12) return rtf.format(months, 'month');
  return rtf.format(Math.round(diffMs / 31536000000), 'year');
}

/** SHA-256 abreviado para listados: `e95993ac…6d81`. */
export function shortHash(hash: string | null | undefined): string {  if (!hash) return '—';
  const clean = hash.replace(/^sha256:/i, '');
  if (clean.length <= 20) return clean;
  return `${clean.slice(0, 10)}…${clean.slice(-4)}`;
}

/** Normaliza un hash al formato `abc...` sin el prefijo `sha256:`. */
export function normalizeHash(hash: string | null | undefined): string | null {
  if (!hash) return null;
  const clean = hash.replace(/^sha256:/i, '').trim().toLowerCase();
  return /^[a-f0-9]{64}$/.test(clean) ? clean : null;
}

/** Convierte texto plano en un slug seguro para URLs. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
