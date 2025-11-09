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
      <div className="flex items-start gap-2 flex-1">
        {/* Left side - Blue team counter (ONLY for guessers) */}
        {role === 'guesser' && (
          <div className="flex flex-col items-center gap-3 min-w-[100px]">
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
        <div className="flex-1 grid grid-cols-5 gap-1.5 sm:gap-2">
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

        {/* Right side - Red team counter (ONLY for guessers) */}
        {role === 'guesser' && (
          <div className="flex flex-col items-center gap-3 min-w-[100px]">
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
