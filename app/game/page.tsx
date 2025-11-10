'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GameBoard from '@/components/GameBoard';
import HeaderBar from '@/components/HeaderBar';
import Footer from '@/components/Footer';
import { generateBoard, generateRandomSeed } from '@/lib/boardGenerator';
import { parseGameParams, buildGameUrl } from '@/lib/utils';
import { BoardData, VocabularySet, VocabularyManifest } from '@/types';
import manifest from '@/data/vocab/manifest.json';
import enDefault from '@/data/vocab/en/default.json';
import esSpanish from '@/data/vocab/es/spanish.json';
import plPolish from '@/data/vocab/pl/polish.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Preloaded vocabulary map
const vocabularies: Record<string, Record<string, VocabularySet>> = {
  en: { default: enDefault as VocabularySet },
  es: { spanish: esSpanish as VocabularySet },
  pl: { polish: plPolish as VocabularySet },
};

// Debug: Log what we have
console.log('Vocabularies loaded:', {
  en: { title: enDefault.title, first3: enDefault.words.slice(0, 3) },
  es: { title: esSpanish.title, first3: esSpanish.words.slice(0, 3) },
  pl: { title: plPolish.title, first3: plPolish.words.slice(0, 3) },
});

function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vocabData, setVocabData] = useState<VocabularySet | null>(null);
  const currentSeedRef = useRef<string | null>(null);
  const currentLangRef = useRef<string | null>(null);

  useEffect(() => {
    const params = parseGameParams(searchParams);
    
    if (!params) {
      setError('Invalid game parameters. Please start from the home page.');
      return;
    }

    // Track if seed or language changed
    const seedChanged = currentSeedRef.current !== params.seed;
    const langChanged = currentLangRef.current !== params.lang;
    
    if (seedChanged) {
      currentSeedRef.current = params.seed;
    }
    if (langChanged) {
      currentLangRef.current = params.lang;
    }

    // Load vocabulary (pick the first available set for the language)
    const loadVocabulary = async () => {
      try {
        const vocabManifest = manifest as VocabularyManifest;
        const sets = vocabManifest.languages[params.lang]?.sets || {};
        const firstSet = Object.keys(sets)[0];
        
        // Get vocabulary from preloaded map
        const vocabDataImported = vocabularies[params.lang]?.[firstSet];
        
        console.log('Loaded vocabulary:', {
          lang: params.lang,
          file: firstSet,
          title: vocabDataImported?.title,
          firstWords: vocabDataImported?.words.slice(0, 5)
        });
        
        if (!vocabDataImported || !vocabDataImported.words || vocabDataImported.words.length < 25) {
          setError('Invalid vocabulary data.');
          return;
        }

        setVocabData(vocabDataImported);
        const board = generateBoard(params.seed, vocabDataImported.words);
        setBoardData(board);
      } catch (err) {
        console.error('Failed to load vocabulary:', err);
        setError('Failed to load vocabulary. Please check your language and set selection.');
      }
    };

    loadVocabulary();
  }, [searchParams]);

  const handleNextGame = () => {
    const params = parseGameParams(searchParams);
    if (!params || !vocabData) return;

    // Clear old game state
    const oldSeed = boardData?.seed;
    if (oldSeed) {
      localStorage.removeItem(`game-${oldSeed}`);
    }

    // Generate new seed and create new board
    const newSeed = generateRandomSeed();
    const newBoard = generateBoard(newSeed, vocabData.words);
    setBoardData(newBoard);

    // Update URL without reload (no set parameter)
    const newUrl = buildGameUrl({
      seed: newSeed,
      role: params.role,
      lang: params.lang
    });
    window.history.pushState({}, '', newUrl);
    
    // Update current seed ref
    currentSeedRef.current = newSeed;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-2xl">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!boardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚙️</div>
          <p className="text-xl text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  const params = parseGameParams(searchParams)!;

  return (
    <div className="min-h-screen p-1 flex flex-col" style={{ background: 'radial-gradient(circle at center, white 0%, #cbd1dbff 50%, #110b66ff 100%)' }}>
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col">
        <HeaderBar 
          boardData={boardData}
          params={params}
          role={params.role}
          onNextGame={handleNextGame}
          onHome={() => router.push('/')}
        />
        
        {/* Game Board - fills remaining space and centers vertically when content fits */}
        <div className="flex-1 flex flex-col min-h-0 justify-center py-4">
            <div className="p-2 sm:p-3">
            <GameBoard boardData={boardData} role={params.role} />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚙️</div>
          <p className="text-xl text-gray-600">Loading game...</p>
        </div>
      </div>
    }>
      <GameContent />
    </Suspense>
  );
}
