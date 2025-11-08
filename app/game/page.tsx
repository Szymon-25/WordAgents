'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GameBoard from '@/components/GameBoard';
import ShareLink from '@/components/ShareLink';
import { generateBoard } from '@/lib/boardGenerator';
import { parseGameParams } from '@/lib/utils';
import { BoardData, VocabularySet } from '@/types';

function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        const vocabData = vocabModule.default as VocabularySet;
        
        if (!vocabData || !vocabData.words || vocabData.words.length < 25) {
          setError('Invalid vocabulary data.');
          return;
        }

        const board = generateBoard(params.seed, vocabData.words);
        setBoardData(board);
      } catch (err) {
        console.error('Failed to load vocabulary:', err);
        setError('Failed to load vocabulary. Please check your language and set selection.');
      }
    };

    loadVocabulary();
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Go to Home
          </button>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🕵️ Codenames
              </h1>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className={`px-3 py-1 rounded-full font-semibold ${
                  params.role === 'master' 
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {params.role === 'master' ? '🎭 Spymaster' : '🕵️ Guesser'}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-mono text-xs">
                  Seed: {boardData.seed}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                🏠 New Game
              </button>
            </div>
          </div>

          <div className="mt-4">
            <ShareLink params={params} />
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <GameBoard boardData={boardData} role={params.role} />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>🎮 Codenames - A word-based guessing game</p>
        </div>
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
