'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { VocabularyManifest } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  manifest: VocabularyManifest;
  selectedLang: string;
  onLanguageChange: (lang: string) => void;
  className?: string;
}

const LANG_STORAGE_KEY = 'preferred-language';

export default function LanguageSelector({
  manifest,
  selectedLang,
  onLanguageChange,
  className
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);

  // flag emoji map (extend as needed)
  const flags: Record<string, string> = {
    en: '🇺🇸',
    es: '🇪🇸',
    pl: '🇵🇱',
    fr: '🇫🇷',
    de: '🇩🇪',
    ja: '🇯🇵',
    zh: '🇨🇳'
  };

  // restore persisted preference
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
      if (savedLang && savedLang !== selectedLang && manifest.languages[savedLang]) {
        onLanguageChange(savedLang);
      }
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeLang = (lang: string) => {
    onLanguageChange(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (_) {}
    setOpen(false);
  };

  return (
    <div className={cn('relative inline-block text-left z-50', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(o => !o)}
        className="font-semibold flex items-center gap-2 bg-white/70 hover:bg-white/90 backdrop-blur-sm"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4 hidden md:block" />
        <span className="uppercase">{selectedLang}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </Button>
      {open && (
        <div
          role="menu"
          className="absolute z-50 mt-2 origin-top-right rounded-lg border border-gray-300 bg-gray-100 text-gray-900 shadow-lg p-2 flex flex-col gap-1 min-w-[8rem]"
        >
          {Object.entries(manifest.languages).map(([code, info]) => (
            <button
              key={code}
              type="button"
              onClick={() => handleChangeLang(code)}
              className={cn(
                'group flex items-center justify-between gap-2 w-full rounded-md px-3 py-2 text-sm font-medium transition-colors',
                'hover:bg-gray-200 active:bg-gray-300',
                code === selectedLang ? 'bg-gray-300' : 'text-gray-900'
              )}
            >
              <span className="flex items-center gap-2">
                <span>{flags[code] ?? '🌐'}</span> {info.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
