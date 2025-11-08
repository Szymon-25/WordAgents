'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LanguageSelector from '@/components/LanguageSelector';
import RoleSelector from '@/components/RoleSelector';
import { generateRandomSeed } from '@/lib/boardGenerator';
import { buildGameUrl } from '@/lib/utils';
import { Role, VocabularyManifest } from '@/types';
import manifest from '@/data/vocab/manifest.json';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<'create' | 'join' | null>(null);
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedSet, setSelectedSet] = useState('default');
  const [selectedRole, setSelectedRole] = useState<Role>('guesser');
  const [joinSeed, setJoinSeed] = useState('');

  const vocabManifest = manifest as VocabularyManifest;

  const handleLanguageChange = (lang: string) => {
    setSelectedLang(lang);
    // Set first available set for this language
    const firstSet = Object.keys(vocabManifest.languages[lang].sets)[0];
    setSelectedSet(firstSet);
  };

  const handleCreateGame = () => {
    const seed = generateRandomSeed();
    const url = buildGameUrl({
      seed,
      role: selectedRole,
      lang: selectedLang,
      set: selectedSet
    });
    router.push(url);
  };

  const handleJoinGame = () => {
    if (!joinSeed.trim()) return;
    const url = buildGameUrl({
      seed: joinSeed.trim(),
      role: selectedRole,
      lang: selectedLang,
      set: selectedSet
    });
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <main className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            🕵️ Codenames
          </h1>
          <p className="text-gray-600 text-lg">
            A word-based guessing game for teams
          </p>
        </div>

        {mode === null && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🎮 Create New Game
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full py-6 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold text-xl hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🔗 Join Existing Game
            </button>

            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-2">How to Play:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Spymaster</strong>: See all card colors and give clues</li>
                <li>• <strong>Guesser</strong>: Make guesses based on clues</li>
                <li>• Share the game link with your team to play together</li>
                <li>• Same seed = same board for all players</li>
              </ul>
            </div>
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-6">
            <button
              onClick={() => setMode(null)}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold text-gray-900">Create New Game</h2>

            <LanguageSelector
              manifest={vocabManifest}
              selectedLang={selectedLang}
              selectedSet={selectedSet}
              onLanguageChange={handleLanguageChange}
              onSetChange={setSelectedSet}
            />

            <RoleSelector
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
            />

            <button
              onClick={handleCreateGame}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Start Game →
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-6">
            <button
              onClick={() => setMode(null)}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold text-gray-900">Join Existing Game</h2>

            <div>
              <label htmlFor="seed" className="block text-sm font-medium text-gray-700 mb-2">
                Game Seed:
              </label>
              <input
                id="seed"
                type="text"
                value={joinSeed}
                onChange={(e) => setJoinSeed(e.target.value)}
                placeholder="Enter game seed..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <LanguageSelector
              manifest={vocabManifest}
              selectedLang={selectedLang}
              selectedSet={selectedSet}
              onLanguageChange={handleLanguageChange}
              onSetChange={setSelectedSet}
            />

            <RoleSelector
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
            />

            <button
              onClick={handleJoinGame}
              disabled={!joinSeed.trim()}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Game →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
