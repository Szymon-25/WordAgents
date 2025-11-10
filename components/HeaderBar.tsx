"use client";

import Image from "next/image";
import { ChevronsRight, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  return (
    <div className="relative z-50 rounded-xl border border-border/30 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm p-0.5">
      <div className="flex items-center justify-between gap-4 max-w-screen-2xl mx-auto">
        {/* Left section */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Title and Role */}
          <div className="flex items-center gap-3">
            <h1 className="flex items-center gap-2 text-white tracking-tight">
              <Image alt="Word Agents Logo" src="/logo.png" width={32} height={32}/>
              <span className="hidden sm:inline">Word Agents</span>
            </h1>
            
            <Badge
              variant="secondary"
              className={cn(
                "px-2.5 py-0.5 flex-shrink-0",
                role === "master"
                  ? "bg-purple-100 text-purple-900 hover:bg-purple-100"
                  : "bg-blue-100 text-blue-900 hover:bg-blue-100"
              )}
            >
              {role === "master" ? "🎭 Spymaster" : "🕵️ Guesser"}
            </Badge>
          </div>

          {/* <Separator orientation="vertical" className="h-6 bg-white/20 hidden sm:block" /> */}

          {/* Game Code */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 border border-white/20 backdrop-blur-sm flex-shrink-0">
            <span className="text-xs text-white/70 hidden sm:inline">Game Code:</span>
            <span className="font-mono text-green-400 tracking-wider">
              {boardData.seed}
            </span>
          </div>

            {/* <Separator orientation="vertical" className="h-6 bg-white/20 hidden lg:block" /> */}

          {/* Share menu */}
          <div className="hidden lg:block">
            <RoleShareMenu params={params} seed={boardData.seed} />
          </div>
        </div>

        {/* Right section - Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
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
          {/* Share menu for mobile/tablet */}
          <div className="lg:hidden">
            <RoleShareMenu params={params} seed={boardData.seed} />
          </div>

            <Button
              onClick={onNextGame}
              size="sm"
              variant="outline"
              className="font-semibold flex items-center bg-white/70 hover:bg-white/90 backdrop-blur-sm"
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="hidden sm:inline">Next Game</span>
            </Button>

          <Button
            variant="outline"
            onClick={onHome}
            size="sm"
            className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
          >
            <Home className="h-4 w-4" />
            <span className="hidden md:inline">Home</span>
          </Button>

          <FullscreenButton className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white" />
        </div>
      </div>
    </div>
  );
}

export default HeaderBar;
