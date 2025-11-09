"use client";

import { useEffect, useRef, useState } from 'react';
import { BoardData, Role } from '@/types';
import WordTile from './WordTile';
import { Badge } from '@/components/ui/badge';
import { useIsLandscape, useIsMobile } from '@/lib/useIsMobile';
import { Maximize2, RotateCw } from 'lucide-react';

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

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main game area with counters on sides */}
      <div className="flex items-start gap-2 flex-1">
        {/* Left side - Blue team counter (ONLY for guessers) */}
        {role === 'guesser' && (
          <div className="hidden md:flex flex-col items-center gap-3 min-w-[100px]">
            <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-xl border-4 border-blue-500 shadow-lg">
              <div className="text-4xl font-bold text-blue-600">{remainingCounts.blue}</div>
              <Badge className="bg-blue-500 text-white text-xs px-2 py-1 hover:bg-blue-600">
                BLUE
              </Badge>
              <div className="text-xs text-blue-600 font-semibold">Left</div>
            </div>
            {boardData.teamStart === 'blue' && (
              <div className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                STARTS
              </div>
            )}
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

        {/* Right side - Red team counter (ONLY for guessers) */}
        {role === 'guesser' && (
          <div className="hidden md:flex flex-col items-center gap-3 min-w-[100px]">
            <div className="flex flex-col items-center gap-2 p-3 bg-red-50 rounded-xl border-4 border-red-500 shadow-lg">
              <div className="text-4xl font-bold text-red-600">{remainingCounts.red}</div>
              <Badge className="bg-red-500 text-white text-xs px-2 py-1 hover:bg-red-600">
                RED
              </Badge>
              <div className="text-xs text-red-600 font-semibold">Left</div>
            </div>
            {boardData.teamStart === 'red' && (
              <div className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                STARTS
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom info for master only */}
      {role === 'master' && (
        <div className="mt-3 flex justify-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Blue: {remainingCounts.blue}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Red: {remainingCounts.red}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span>Neutral: {remainingCounts.neutral}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black rounded"></div>
            <span>Assassin: {remainingCounts.assassin}</span>
          </div>
        </div>
      )}
    </div>
  );
}
