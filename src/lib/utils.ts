import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Dorothy colors from logo
export const dorothyColors = {
  orange: '#fc7f2b',
  green: '#37a599',
  blue: '#6271dd',
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  }
}

// Event categories helpers
export type UiEventCategory = 'seniors' | 'reeap' | 'laep' | 'jeunesse' | 'anime-quartier' | 'acces-droits' | 'general'

/**
 * Normalize a category from API (e.g., SENIORS, ANIME_QUARTIER, ACCES_DROITS)
 * or any input (e.g., seniors, anime-quartier) to a UI category id used in components
 */
export function toUiEventCategory(input?: string | null): UiEventCategory {
  const norm = String(input || '').trim().toUpperCase().replace(/-/g, '_')
  switch (norm) {
    case 'SENIORS':
      return 'seniors'
    case 'REEAP':
      return 'reeap'
    case 'LAEP':
      return 'laep'
    case 'JEUNESSE':
      return 'jeunesse'
    case 'ANIME_QUARTIER':
      return 'anime-quartier'
    case 'ACCES_DROITS':
      return 'acces-droits'
    default:
      return 'general'
  }
}

export function getUiEventCategoryLabel(category: UiEventCategory): string {
  switch (category) {
    case 'seniors':
      return 'Seniors'
    case 'reeap':
      return 'REEAP'
    case 'laep':
      return 'Ti-Ludo'
    case 'jeunesse':
      return 'Jeunesse'
    case 'anime-quartier':
      return 'Anime Quartier'
    case 'acces-droits':
      return 'Accès aux droits'
    default:
      return 'Général'
  }
}