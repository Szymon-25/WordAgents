"use client";

import { useEffect, useRef, useState } from 'react';
import { BoardData, Role } from '@/types';
import WordTile from './WordTile';
import { useIsLandscape, useIsMobile } from '@/lib/useIsMobile';
import { Maximize2, RotateCw } from 'lucide-react';
import CircularProgress from './CircularProgress';

interface GameBoardProps {
  boardData: BoardData;
  role: Role;
}

export default function GameBoard({ boardData, role }: GameBoardProps) {
  const isMobile = useIsMobile();
  const isLandscape = useIsLandscape();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const fsRef = useRef<HTMLDivElement | null>(null);
  const [tileDims, setTileDims] = useState<{ w: number; h: number } | null>(null);

  const [tiles, setTiles] = useState(() => {
    // Initialize tiles with saved state if available
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(`game-${boardData.seed}`);
      if (savedState) {
        try {
          const guessedIndices = JSON.parse(savedState) as number[];
          return boardData.tiles.map(tile =>
            guessedIndices.includes(tile.index)
              ? { ...tile, guessed: true }
              : tile
          );
        } catch (e) {
          console.error('Failed to load game state:', e);
        }
      }
    }
    return boardData.tiles;
  });

  // Update tiles when boardData changes (e.g., new game)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(`game-${boardData.seed}`);
      if (savedState) {
        try {
          const guessedIndices = JSON.parse(savedState) as number[];
          setTiles(boardData.tiles.map(tile =>
            guessedIndices.includes(tile.index)
              ? { ...tile, guessed: true }
              : tile
          ));
        } catch (e) {
          console.error('Failed to load game state:', e);
          setTiles(boardData.tiles);
        }
      } else {
        setTiles(boardData.tiles);
      }
    }
  }, [boardData]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const isTargetFullscreen = isFullscreen && fsRef.current && document.fullscreenElement === fsRef.current;
  const needsOverlay = isMobile && (!isTargetFullscreen || !isLandscape);

  const requestMobileFullscreen = async () => {
    try {
      const el = fsRef.current || document.documentElement;
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      }
      // Try to lock orientation if supported
      const anyScreen = (window.screen as any);
      if (anyScreen?.orientation?.lock) {
        try {
          await anyScreen.orientation.lock('landscape');
        } catch {
          // Some browsers (iOS Safari) do not support lock; fall back to hint message
        }
      }
    } catch (e) {
      console.warn('Fullscreen request failed:', e);
    }
  };

  // Compute tile sizes when in mobile fullscreen landscape to fit grid without cuts
  useEffect(() => {
    if (!(isMobile && isTargetFullscreen && isLandscape && fsRef.current)) {
      setTileDims(null);
      return;
    }
    const GAP = 4; // px
    const COLS = 5;
    const ROWS = 5;
    const RATIO_H_PER_W = 0.75; // slightly wider than tall to help long words

    const compute = () => {
      const rect = fsRef.current!.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      const tileWCandidate = Math.floor((width - (COLS - 1) * GAP) / COLS);
      const tileHCandidate = Math.floor((height - (ROWS - 1) * GAP) / ROWS);
      const hFromRatio = Math.floor(tileWCandidate * RATIO_H_PER_W);
      // Use height limited by available space
      const h = Math.min(tileHCandidate, hFromRatio);
      const w = tileWCandidate; // fill width across columns
      setTileDims({ w, h });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(fsRef.current!);
    window.addEventListener('orientationchange', compute);
    window.addEventListener('resize', compute);
    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', compute);
      window.removeEventListener('resize', compute);
    };
  }, [isMobile, isTargetFullscreen, isLandscape]);

  const handleToggleTile = (index: number) => {
    setTiles(prev => {
      const newTiles = prev.map(tile =>
        tile.index === index ? { ...tile, guessed: !tile.guessed } : tile
      );

      // Save to localStorage
      const guessedIndices = newTiles
        .filter(t => t.guessed)
        .map(t => t.index);
      localStorage.setItem(`game-${boardData.seed}`, JSON.stringify(guessedIndices));

      return newTiles;
    });
  };

  const remainingCounts = tiles.reduce(
    (acc, tile) => {
      if (!tile.guessed) {
        acc[tile.team]++;
      }
      return acc;
    },
    { red: 0, blue: 0, neutral: 0, assassin: 0 } as Record<string, number>
  );

  // Calculate max points for each team
  const maxCounts = tiles.reduce(
    (acc, tile) => {
      acc[tile.team]++;
      return acc;
    },
    { red: 0, blue: 0, neutral: 0, assassin: 0 } as Record<string, number>
  );

  // Calculate guessed counts (progress from 0)
  const guessedCounts = {
    blue: maxCounts.blue - remainingCounts.blue,
    red: maxCounts.red - remainingCounts.red,
  };

  const startingTeam = boardData.teamStart;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main game area with counters */}
      <div className="flex items-start gap-2 flex-1">
        {/* Left side - Blue team counter and character (ONLY for guessers) */}
        {role === 'guesser' && (
          <div className="hidden md:flex flex-col items-center gap-3 min-w-[140px]">
            <div className="text-blue-600">
              <CircularProgress 
                value={guessedCounts.blue}
                max={maxCounts.blue}
                size={140}
                progressClassName="stroke-blue-600"
                labelClassName="text-sm font-bold text-blue-600"
                renderLabel={(current, max) => (
                  <div className="flex flex-col items-center gap-0">
                    <div className="text-5xl font-bold">{current}<span className="text-xl">/{max}</span></div>
                  </div>
                )}
              />
            </div>
            {/* Blue character image */}
            <img 
              src="/blue_character.png" 
              alt="Blue Team Character" 
              className="w-full object-contain"
              style={{ height: 'calc(5 * 80px + 4 * 4px)' }}
            />
          </div>
        )}

        {/* Game Grid - Center */}
        <div className="flex-1 flex">
          {/* Spacer before grid */}
          <div className="hidden md:block flex-1" />
          {/* Fullscreen-capable grid wrapper */}
          <div ref={fsRef} className="relative flex-10 w-full">
            {isTargetFullscreen ? (
              <div className="absolute inset-0 flex items-center justify-center" style={{ padding: 6 }}>
                <div
                  className="grid"
                  style={
                    tileDims
                      ? {
                          gridTemplateColumns: `repeat(5, ${tileDims.w}px)`,
                          gridAutoRows: `${tileDims.h}px`,
                          gap: '4px',
                          width: '100%',
                          height: '100%',
                          alignContent: 'center',
                          justifyContent: 'center',
                        }
                      : undefined
                  }
                >
                  {tiles.map((tile) => (
                    <WordTile
                      key={tile.index}
                      tile={tile}
                      role={role}
                      showKey={true}
                      onToggle={handleToggleTile}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative grid grid-cols-5 gap-1 md:gap-1.5 lg:gap-2 w-full">
                {tiles.map((tile) => (
                  <WordTile
                    key={tile.index}
                    tile={tile}
                    role={role}
                    showKey={true}
                    onToggle={handleToggleTile}
                  />
                ))}
              </div>
            )}

            {/* Mobile overlay to encourage fullscreen + landscape */}
            {needsOverlay && (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />
                <div className="relative mx-3 max-w-sm w-[92%] text-center rounded-xl border border-gray-200 shadow-xl p-4 sm:p-5 bg-white/95 z-30">
                  <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                    <Maximize2 />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">Better on Fullscreen</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    For small screens we use fullscreen and landscape so words are fully visible.
                  </p>

                  {!isLandscape && (
                    <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                      <RotateCw className="h-4 w-4" />
                      Rotate your phone horizontally
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={requestMobileFullscreen}
                    className="mt-4 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold py-2 active:scale-[0.98] shadow hover:from-indigo-700 hover:to-blue-700"
                  >
                    Enter fullscreen
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Spacer after grid */}
          <div className="hidden md:block flex-1" />
        </div>

        {/* Right side - Red team counter and character (ONLY for guessers) */}
        {role === 'guesser' && (
          <div className="hidden md:flex flex-col items-center gap-3 min-w-[140px]">
            <div className="text-red-600">
              <CircularProgress 
                value={guessedCounts.red}
                max={maxCounts.red}
                size={140}
                progressClassName="stroke-red-600"
                labelClassName="text-sm font-bold text-red-600"
                renderLabel={(current, max) => (
                  <div className="flex flex-col items-center gap-0">
                    <div className="text-5xl font-bold">{current}<span className="text-xl">/{max}</span></div>
                  </div>
                )}
              />
            </div>
            {/* Red character image */}
            <img 
              src="/red_character.png" 
              alt="Red Team Character" 
              className="w-full object-contain"
              style={{ height: 'calc(5 * 80px + 4 * 4px)' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
