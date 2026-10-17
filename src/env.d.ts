/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** Idioma deducido de la URL en cada petición. */
    locale: 'es' | 'en';
  }
}
