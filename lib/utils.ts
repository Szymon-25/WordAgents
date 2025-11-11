import { GameParams } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parse game parameters from URL search params
 */
export function parseGameParams(searchParams: URLSearchParams): GameParams | null {
  const seed = searchParams.get('seed');
  const role = searchParams.get('role') as 'master' | 'guesser' | null;
  const lang = searchParams.get('lang') || 'en';

  if (!seed || !role) {
    return null;
  }

  return { seed, role, lang };
}

/**
 * Build game URL from parameters
 */
export function buildGameUrl(params: GameParams): string {
  const searchParams = new URLSearchParams({
    seed: params.seed,
    role: params.role,
    lang: params.lang
  });
  
  return `/game?${searchParams.toString()}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Get full URL for sharing
 */
export function getShareUrl(params: GameParams): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.protocol}//${window.location.host}${window.location.pathname.replace(/\/game.*$/, '')}${buildGameUrl(params)}`;
}
