'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GameBoard from '@/components/GameBoard';
import ShareLink from '@/components/ShareLink';
import { generateBoard, generateRandomSeed } from '@/lib/boardGenerator';
import { parseGameParams, buildGameUrl } from '@/lib/utils';
import { BoardData, VocabularySet } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vocabData, setVocabData] = useState<VocabularySet | null>(null);

  useEffect(() => {
    const params = parseGameParams(searchParams);
    
    if (!params) {
      setError('Invalid game parameters. Please start from the home page.');
      return;
    }

    // Load vocabulary
    const loadVocabulary = async () => {
      try {
        const vocabModule = await import(`@/data/vocab/${params.lang}/${params.set}.json`);
        const vocabDataImported = vocabModule.default as VocabularySet;
        
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

    // Generate new seed and create new board
    const newSeed = generateRandomSeed();
    const newBoard = generateBoard(newSeed, vocabData.words);
    setBoardData(newBoard);

    // Update URL without reload
    const newUrl = buildGameUrl({
      seed: newSeed,
      role: params.role,
      lang: params.lang,
      set: params.set
    });
    window.history.pushState({}, '', newUrl);

    // Clear localStorage for new game
    localStorage.removeItem(`game-${newSeed}`);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-4 flex flex-col">
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <Card className="mb-2 sm:mb-3 shadow-lg border-2">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  🕵️ Word Agents
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <span className={`px-3 py-1.5 rounded-full font-semibold shadow-sm ${
                    params.role === 'master' 
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    {params.role === 'master' ? '🎭 Spymaster' : '🕵️ Guesser'}
                  </span>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-full shadow-sm">
                    <span className="text-xs font-medium text-gray-700">Game Code:</span>
                    <span className="font-mono font-bold text-lg text-green-700 tracking-wider">
                      {boardData.seed}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleNextGame}
                  variant="default"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                >
                  🎲 Next Game
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="font-semibold"
                >
                  🏠 Home
                </Button>
              </div>
            </div>

            <div className="mt-3">
              <ShareLink params={params} seed={boardData.seed} />
            </div>
          </CardContent>
        </Card>

        {/* Game Board - fills remaining space */}
        <Card className="flex-1 flex flex-col min-h-0 shadow-lg border-2">
          <CardContent className="p-2 sm:p-3 flex-1 flex flex-col min-h-0">
            <GameBoard boardData={boardData} role={params.role} />
          </CardContent>
        </Card>
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
