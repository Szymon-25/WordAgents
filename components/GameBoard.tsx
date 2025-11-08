'use client';

import { useState, useEffect } from 'react';
import { BoardData, Role } from '@/types';
import WordTile from './WordTile';

interface GameBoardProps {
  boardData: BoardData;
  role: Role;
}

export default function GameBoard({ boardData, role }: GameBoardProps) {
  const [tiles, setTiles] = useState(boardData.tiles);
  const [showKey, setShowKey] = useState(true);
  const [colorblindMode, setColorblindMode] = useState(false);

  // Load guessed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(`game-${boardData.seed}`);
    if (savedState) {
      try {
        const guessedIndices = JSON.parse(savedState) as number[];
        setTiles(prev =>
          prev.map(tile =>
            guessedIndices.includes(tile.index)
              ? { ...tile, guessed: true }
              : tile
          )
        );
      } catch (e) {
        console.error('Failed to load game state:', e);
      }
    }
  }, [boardData.seed]);

  // Load colorblind mode preference
  useEffect(() => {
    const saved = localStorage.getItem('colorblind-mode');
    if (saved === 'true') {
      setColorblindMode(true);
    }
  }, []);

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

  const handleToggleColorblind = () => {
    const newValue = !colorblindMode;
    setColorblindMode(newValue);
    localStorage.setItem('colorblind-mode', String(newValue));
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
    <div className="w-full max-w-6xl mx-auto">
      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        {role === 'master' && (
          <button
            onClick={() => setShowKey(!showKey)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            {showKey ? '🔒 Hide Key' : '🔓 Show Key'}
          </button>
        )}
        <button
          onClick={handleToggleColorblind}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
        >
          {colorblindMode ? '🎨 Normal Mode' : '♿ Colorblind Mode'}
        </button>
      </div>

      {/* Score indicators */}
      {role === 'master' && (
        <div className="mb-4 flex gap-4 justify-center flex-wrap text-sm sm:text-base font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Red: {remainingCounts.red}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Blue: {remainingCounts.blue}</span>
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

      {/* Game Grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {tiles.map((tile) => (
          <WordTile
            key={tile.index}
            tile={tile}
            role={role}
            showKey={showKey}
            colorblindMode={colorblindMode}
            onToggle={handleToggleTile}
          />
        ))}
      </div>

      {/* Team start indicator */}
      {role === 'master' && (
        <div className="mt-4 text-center text-lg font-semibold">
          <span
            className={`inline-block px-4 py-2 rounded-lg ${
              boardData.teamStart === 'red'
                ? 'bg-red-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            {boardData.teamStart.toUpperCase()} team starts (9 cards)
          </span>
        </div>
      )}
    </div>
  );
}
