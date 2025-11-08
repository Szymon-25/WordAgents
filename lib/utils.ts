import { GameParams } from '@/types';

/**
 * Parse game parameters from URL search params
 */
export function parseGameParams(searchParams: URLSearchParams): GameParams | null {
  const seed = searchParams.get('seed');
  const role = searchParams.get('role') as 'master' | 'guesser' | null;
  const lang = searchParams.get('lang') || 'en';
  const set = searchParams.get('set') || 'default';

  if (!seed || !role) {
    return null;
  }

  return { seed, role, lang, set };
}

/**
 * Build game URL from parameters
 */
export function buildGameUrl(params: GameParams): string {
  const searchParams = new URLSearchParams({
    seed: params.seed,
    role: params.role,
    lang: params.lang,
    set: params.set
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
  return `${window.location.origin}${buildGameUrl(params)}`;
}
