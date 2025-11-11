'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RoleSelector from '@/components/RoleSelector';
import { generateRandomSeed } from '@/lib/boardGenerator';
import { buildGameUrl } from '@/lib/utils';
import { Role } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useRules } from '@/components/RulesDialogProvider';
import Script from 'next/script';

export default function Home() {
  const router = useRouter();
  const { open } = useRules();
  const [mode, setMode] = useState<'create' | 'join' | null>(null);
  const [selectedLang] = useState('en'); // language fixed for now
  const [selectedRole, setSelectedRole] = useState<Role>('guesser');
  const [joinCode, setJoinCode] = useState('');

  const handleCreateGame = () => {
    const seed = generateRandomSeed();
    const url = buildGameUrl({
      seed,
      role: selectedRole,
      lang: selectedLang,
    });
    router.push(url);
  };

  const handleEnterCode = () => {
    if (!joinCode.trim()) return;
    setMode('join');
  };

  const handleJoinGame = () => {
    const url = buildGameUrl({
      seed: joinCode.trim().toUpperCase(),
      role: selectedRole,
      lang: selectedLang,
    });
    router.push(url);
  };

  return (
    <>
    {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-GNPNMMZVKW"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-GNPNMMZVKW', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    <div className="min-h-screen flex items-center justify-center p-6">
      <main className="w-full flex items-center justify-center">
        <div>
          <header className="mb-3 flex items-center gap-2 justify-center">
            <Image alt="Word Agents Logo" src="./logo.webp" width={40} height={40}/>
            <h1 className="text-3xl font-bold text-white pr-3" style={{ fontFamily: 'Roboto, sans-serif' }}>Word Agents</h1>
          </header>
          <div className="bg-white rounded-lg p-5 w-[18rem] min-h-[220px] flex flex-col items-center justify-center">
            {mode === null && (
              <div className="space-y-2 w-full">
                <Input
                  id="code"
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Game code"
                  maxLength={4}
                  className="text-center h-11 text-base font-semibold"
                />
                <Button
                  onClick={handleEnterCode}
                  disabled={joinCode.trim().length === 0}
                  className="w-full h-11 text-white font-semibold disabled:opacity-100"
                  style={{ backgroundColor: '#000', borderColor: '#000', boxShadow: 'none' }}
                >
                  Enter
                </Button>
                <div className="flex items-center gap-2">
                  <span className="flex-1 h-px bg-gray-300" />
                  <span className="text-xs text-gray-400">or</span>
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
              <div className="space-y-2 w-full">
                <div className="relative w-full">
                  <Button onClick={() => setMode(null)} variant="ghost" size="icon-sm" className="text-gray-700 absolute left-0 top-0">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-base font-bold text-gray-900 text-center">Create new game</h2>
                </div>
                <div className="w-full">
                  <div className="mx-auto">
                    <RoleSelector selectedRole={selectedRole} onRoleChange={setSelectedRole} />
                  </div>
                </div>
                <Button
                  onClick={handleCreateGame}
                  className="w-full h-11 text-white font-semibold shadow"
                  style={{ backgroundColor: '#000' }}
                >
                  Start game
                </Button>
              </div>
            )}
            {mode === 'join' && (
              <div className="space-y-2 w-full">
                <div className="relative w-full">
                  <Button onClick={() => setMode(null)} variant="ghost" size="icon-sm" className="text-gray-700 absolute left-0 top-0">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-base font-bold text-gray-900 text-center">Join game</h2>
                </div>
                <div className="w-full">
                  <div className="mx-auto">
                    <RoleSelector selectedRole={selectedRole} onRoleChange={setSelectedRole} />
                  </div>
                </div>
                <Button
                  onClick={handleJoinGame}
                  className="w-full h-11 text-white font-semibold shadow"
                  style={{ backgroundColor: '#000' }}
                >
                  Join game
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Rules button fixed at bottom center on home */}
      <div className="fixed bottom-6 left-0 right-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <button 
            onClick={open} 
            className="px-4 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-sm font-medium text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Rules
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
