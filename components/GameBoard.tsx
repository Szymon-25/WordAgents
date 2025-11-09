'use client';

import { useState } from 'react';
import { BoardData, Role } from '@/types';
import WordTile from './WordTile';
import { Badge } from '@/components/ui/badge';

interface GameBoardProps {
  boardData: BoardData;
  role: Role;
}

export default function GameBoard({ boardData, role }: GameBoardProps) {
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
      <div className="flex items-start gap-4 flex-1">
        {/* Left side - Blue team counter */}
        {role === 'master' && (
          <div className="flex flex-col items-center gap-3 min-w-[120px]">
            <div className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl border-4 border-blue-500 shadow-lg">
              <div className="text-5xl font-bold text-blue-600">{remainingCounts.blue}</div>
              <Badge className="bg-blue-500 text-white text-sm px-3 py-1 hover:bg-blue-600">
                BLUE TEAM
              </Badge>
              <div className="text-xs text-blue-600 font-semibold">Cards Left</div>
            </div>
            {boardData.teamStart === 'blue' && (
              <div className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                STARTS
              </div>
            )}
          </div>
        )}

        {/* Game Grid - Center */}
        <div className="flex-1 grid grid-cols-5 gap-2 sm:gap-3">
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

        {/* Right side - Red team counter */}
        {role === 'master' && (
          <div className="flex flex-col items-center gap-3 min-w-[120px]">
            <div className="flex flex-col items-center gap-2 p-4 bg-red-50 rounded-xl border-4 border-red-500 shadow-lg">
              <div className="text-5xl font-bold text-red-600">{remainingCounts.red}</div>
              <Badge className="bg-red-500 text-white text-sm px-3 py-1 hover:bg-red-600">
                RED TEAM
              </Badge>
              <div className="text-xs text-red-600 font-semibold">Cards Left</div>
            </div>
            {boardData.teamStart === 'red' && (
              <div className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                STARTS
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom info for master only */}
      {role === 'master' && (
        <div className="mt-4 flex justify-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span>Neutral: {remainingCounts.neutral}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-black rounded"></div>
            <span>Assassin: {remainingCounts.assassin}</span>
          </div>
        </div>
      )}
    </div>
  );
}
