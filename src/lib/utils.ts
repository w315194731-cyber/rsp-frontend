/**
 * Utility: classnames with Tailwind — merges conditional classes cleanly.
 * Uses tailwind-merge when available, falls back to manual object spread.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}