"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronsRight, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
import RoleShareMenu from "@/components/RoleShareMenu";
import FullscreenButton from "@/components/FullscreenButton";
import { BoardData, GameParams, Role, VocabularyManifest } from "@/types";
import { cn, buildGameUrl } from "@/lib/utils";
import LanguageSelector from "@/components/LanguageSelector";
import manifest from "@/data/vocab/manifest.json";
import { useRouter } from "next/navigation";

interface HeaderBarProps {
  boardData: BoardData;
  params: GameParams;
  role: Role;
  onNextGame: () => void;
  onHome: () => void;
}

export function HeaderBar({ boardData, params, role, onNextGame, onHome }: HeaderBarProps) {
  const router = useRouter();
  const vocabManifest = manifest as VocabularyManifest;
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [editCode, setEditCode] = useState(boardData.seed);

  const handleCodeClick = () => {
    setEditCode(boardData.seed);
    setIsEditingCode(true);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    // Only allow alphanumeric characters and limit to 4 characters
    const filtered = value.replace(/[^A-Z0-9]/g, '').slice(0, 4);
    setEditCode(filtered);
  };

  const handleCodeSubmit = () => {
    if (editCode.length === 4) {
      const newUrl = buildGameUrl({ seed: editCode, role: params.role, lang: params.lang });
      router.push(newUrl);
      setIsEditingCode(false);
    }
  };

  const handleCodeBlur = () => {
    if (editCode.length === 4) {
      handleCodeSubmit();
    } else {
      setIsEditingCode(false);
      setEditCode(boardData.seed);
    }
  };

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editCode.length === 4) {
      handleCodeSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingCode(false);
      setEditCode(boardData.seed);
    }
  };

  return (
    <div className="relative z-50 rounded-xl border border-border/30 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm p-1 sm:p-0.5">
      <div className="flex items-center justify-between gap-1.5 sm:gap-4 max-w-screen-2xl mx-auto">
        {/* Left section */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
          {/* Title and Role */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <h1 className="flex items-center gap-1 sm:gap-2 text-white tracking-tight">
              <Image alt="Word Agents Logo" src="./logo.webp" width={24} height={24} className="sm:w-8 sm:h-8"/>
              <span className="hidden sm:inline">Word Agents</span>
            </h1>
            
            <Badge
              variant="secondary"
              className={cn(
                "px-1.5 py-0.5 text-xs sm:px-2.5 flex-shrink-0",
                role === "master"
                  ? "bg-purple-100 text-purple-900 hover:bg-purple-100"
                  : "bg-blue-100 text-blue-900 hover:bg-blue-100"
              )}
            >
              <span className="hidden xs:inline">{role === "master" ? "🎭 Spymaster" : "🕵️ Guesser"}</span>
              <span className="xs:hidden">{role === "master" ? "🎭" : "🕵️"}</span>
            </Badge>
          </div>

          {/* <Separator orientation="vertical" className="h-6 bg-white/20 hidden sm:block" /> */}

          {/* Game Code */}
          <div className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2 py-0.5 rounded-md bg-white/10 border border-white/20 backdrop-blur-sm flex-shrink-0">
            <span className="text-xs text-white/70 hidden md:inline">Code:</span>
            {isEditingCode ? (
              <Input
                type="text"
                inputMode="text"
                value={editCode}
                onChange={handleCodeChange}
                onBlur={handleCodeBlur}
                onKeyDown={handleCodeKeyDown}
                maxLength={4}
                autoFocus
                className="font-mono text-sm sm:text-base text-green-400 tracking-wider font-semibold bg-transparent border-0 p-0 h-auto text-center focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{ width: '3.5rem', fontSize: '16px' }}
              />
            ) : (
              <span 
                onClick={handleCodeClick}
                className="font-mono text-sm sm:text-base text-green-400 tracking-wider font-semibold cursor-pointer hover:text-green-300 transition-colors inline-block text-center"
              >
                {boardData.seed}
              </span>
            )}
          </div>

            {/* <Separator orientation="vertical" className="h-6 bg-white/20 hidden lg:block" /> */}

          {/* Share menu */}
          <div className="hidden lg:block">
            <RoleShareMenu params={params} seed={boardData.seed} />
          </div>
        </div>

        {/* Right section - Action buttons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* In-game language selector (md and up) */}
          <div className="hidden md:block">
            <LanguageSelector
              manifest={vocabManifest}
              selectedLang={params.lang}
              onLanguageChange={(lang) => {
                // navigate to same game but with new language; set selection is implicit (first set)
                const newUrl = buildGameUrl({ seed: boardData.seed, role: params.role, lang });
                router.push(newUrl);
              }}
            />
          </div>
          {/* Mobile language selector dropdown - visible on small screens */}
          <div className="md:hidden">
            <LanguageSelector
              manifest={vocabManifest}
              selectedLang={params.lang}
              onLanguageChange={(lang) => {
                const newUrl = buildGameUrl({ seed: boardData.seed, role: params.role, lang });
                router.push(newUrl);
              }}
            />
          </div>
          {/* Share menu for mobile/tablet */}
          <div className="lg:hidden">
            <RoleShareMenu params={params} seed={boardData.seed} />
          </div>

            <Button
              onClick={onNextGame}
              size="sm"
              variant="outline"
              className="font-semibold flex items-center bg-white/70 hover:bg-white/90 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-3"
            >
              <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Next Game</span>
            </Button>

          <Button
            variant="outline"
            onClick={onHome}
            size="sm"
            className="gap-1 sm:gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white text-xs sm:text-sm px-2 sm:px-3"
          >
            <Home className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden md:inline">Home</span>
          </Button>

          {/* Fullscreen button - hidden on mobile as fullscreen is auto-managed */}
          <div className="hidden md:block">
            <FullscreenButton className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderBar;
