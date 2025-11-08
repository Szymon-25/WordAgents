'use client';

import { VocabularyManifest } from '@/types';

interface LanguageSelectorProps {
  manifest: VocabularyManifest;
  selectedLang: string;
  selectedSet: string;
  onLanguageChange: (lang: string) => void;
  onSetChange: (set: string) => void;
}

export default function LanguageSelector({
  manifest,
  selectedLang,
  selectedSet,
  onLanguageChange,
  onSetChange
}: LanguageSelectorProps) {
  const availableSets = manifest.languages[selectedLang]?.sets || {};

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
          Language:
        </label>
        <select
          id="language"
          value={selectedLang}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          {Object.entries(manifest.languages).map(([code, lang]) => (
            <option key={code} value={code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="vocabulary-set" className="block text-sm font-medium text-gray-700 mb-2">
          Vocabulary Set:
        </label>
        <select
          id="vocabulary-set"
          value={selectedSet}
          onChange={(e) => onSetChange(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          {Object.entries(availableSets).map(([setKey, setName]) => (
            <option key={setKey} value={setKey}>
              {setName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
