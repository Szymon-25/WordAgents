'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LanguageSelector from '@/components/LanguageSelector';
import RoleSelector from '@/components/RoleSelector';
import { generateRandomSeed } from '@/lib/boardGenerator';
import { buildGameUrl } from '@/lib/utils';
import { Role, VocabularyManifest } from '@/types';
import manifest from '@/data/vocab/manifest.json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<'create' | 'join' | null>(null);
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedSet, setSelectedSet] = useState('default');
  const [selectedRole, setSelectedRole] = useState<Role>('guesser');
  const [joinCode, setJoinCode] = useState('');

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
    if (!joinCode.trim()) return;
    const url = buildGameUrl({
      seed: joinCode.trim().toUpperCase(),
      role: selectedRole,
      lang: selectedLang,
      set: selectedSet
    });
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <main className="w-full max-w-2xl">
        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center space-y-2 pb-4">
            <CardTitle className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              🕵️ Word Agents
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              A strategic word-based guessing game for teams
            </CardDescription>
          </CardHeader>

          <CardContent>
            {mode === null && (
              <div className="space-y-4">
                <Button
                  onClick={() => setMode('create')}
                  className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xl font-bold shadow-lg"
                  size="lg"
                >
                  🎮 Create New Game
                </Button>
                <Button
                  onClick={() => setMode('join')}
                  className="w-full h-16 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white text-xl font-bold shadow-lg"
                  size="lg"
                >
                  🔗 Join Game
                </Button>

                <Card className="mt-6 bg-slate-50 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">How to Play:</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-700">
                    <p>• <strong>Spymaster</strong>: See all card colors and give clues</p>
                    <p>• <strong>Guesser</strong>: Make guesses based on clues</p>
                    <p>• Share the 4-character game code with your team</p>
                    <p>• Same code = same board for all players</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {mode === 'create' && (
              <div className="space-y-6">
                <Button
                  onClick={() => setMode(null)}
                  variant="ghost"
                  className="mb-2"
                >
                  ← Back
                </Button>

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

                <Button
                  onClick={handleCreateGame}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg shadow-lg"
                  size="lg"
                >
                  Start Game →
                </Button>
              </div>
            )}

            {mode === 'join' && (
              <div className="space-y-6">
                <Button
                  onClick={() => setMode(null)}
                  variant="ghost"
                  className="mb-2"
                >
                  ← Back
                </Button>

                <h2 className="text-2xl font-bold text-gray-900">Join Game</h2>

                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 4-Character Game Code:
                  </label>
                  <Input
                    id="code"
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="e.g., A1B2"
                    maxLength={4}
                    className="text-center text-2xl font-mono font-bold uppercase tracking-widest"
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

                <Button
                  onClick={handleJoinGame}
                  disabled={joinCode.trim().length !== 4}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold text-lg shadow-lg disabled:opacity-50"
                  size="lg"
                >
                  Join Game →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
