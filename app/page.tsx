'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LanguageSelector from '@/components/LanguageSelector';
import RoleSelector from '@/components/RoleSelector';
import RulesCarousel from '@/components/RulesCarousel';
import { generateRandomSeed } from '@/lib/boardGenerator';
import { buildGameUrl } from '@/lib/utils';
import { Role, VocabularyManifest } from '@/types';
import manifest from '@/data/vocab/manifest.json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<'create' | 'join' | null>(null);
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedRole, setSelectedRole] = useState<Role>('guesser');
  const [joinCode, setJoinCode] = useState('');

  const vocabManifest = manifest as VocabularyManifest;

  const handleLanguageChange = (lang: string) => {
    setSelectedLang(lang);
  };

  const handleCreateGame = () => {
    const seed = generateRandomSeed();
    const url = buildGameUrl({
      seed,
      role: selectedRole,
      lang: selectedLang,
    });
    router.push(url);
  };

  const handleJoinGame = () => {
    if (!joinCode.trim()) return;
    const url = buildGameUrl({
      seed: joinCode.trim().toUpperCase(),
      role: selectedRole,
      lang: selectedLang,
    });
    router.push(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <main className="w-full flex items-center justify-center">
        <div>
          <header className="mb-4 flex items-center gap-3 justify-center pr-5">
            <Image alt="Word Agents Logo" src="/logo.png" width={55} height={55}/>
            <h1 className="text-4xl font-extrabold text-white bg-clip-text">Word Agents</h1>
            </header>
        <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
          {mode === null && (
            <div className="space-y-3">
              <div>
                <Input
                  id="code"
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Game code"
                  maxLength={8}
                  className="text-center text-lg font-bold  "
                />
              </div>

              <Button
                onClick={handleJoinGame}
                disabled={joinCode.trim().length === 0}
                className="w-full h-11 text-white font-semibold disabled:opacity-100"
                style={{ backgroundColor: '#000', borderColor: '#000', boxShadow: 'none' }}
              >
                Enter
              </Button>

              <div className="flex items-center gap-3">
                <span className="flex-1 h-px bg-gray-300" />
                <span className="text-sm text-gray-400">or</span>
                <span className="flex-1 h-px bg-gray-300" />
              </div>

              <Button
                onClick={() => setMode('create')}
                className="w-full h-11 text-white font-semibold shadow"
                style={{ backgroundColor: '#32056e' }}
              >
                Create new game
              </Button>
            </div>
          )}

          {mode === 'create' && (
            <div className="space-y-4">
              <Button onClick={() => setMode(null)} variant="ghost" className="-ml-2">
                ← Back
              </Button>

              <h2 className="text-xl font-bold text-gray-900">Create New Game</h2>

              <RoleSelector
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
              />

              <Button
                onClick={handleCreateGame}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold"
              >
                Start Game →
              </Button>
            </div>
          )}
        </div>
        </div>
      </main>
    </div>
  );
}
