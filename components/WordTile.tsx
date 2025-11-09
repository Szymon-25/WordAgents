'use client';

import { Tile, Role } from '@/types';
import { cn } from '@/lib/utils';

interface WordTileProps {
  tile: Tile;
  role: Role;
  showKey: boolean;
  onToggle: (index: number) => void;
}

export default function WordTile({ tile, role, showKey, onToggle }: WordTileProps) {
  const isMaster = role === 'master';
  const shouldShowColor = isMaster && showKey;

  const getColorClasses = () => {
    if (!shouldShowColor && !tile.guessed) {
      return 'bg-amber-50 hover:bg-amber-100 border-amber-400 text-gray-800 shadow-md hover:shadow-lg';
    }

    const teamColors = {
      red: 'bg-red-500 border-red-600 text-white shadow-red-200',
      blue: 'bg-blue-500 border-blue-600 text-white shadow-blue-200',
      neutral: 'bg-gray-400 border-gray-500 text-gray-800 shadow-gray-200',
      assassin: 'bg-black border-gray-900 text-white shadow-gray-400'
    };

    return cn(
      teamColors[tile.team],
      tile.guessed ? 'opacity-60' : 'hover:opacity-90'
    );
  };

  return (
    <button
      onClick={() => onToggle(tile.index)}
      className={cn(
        'relative w-full transition-all duration-200 flex items-center justify-center',
        'border-2 rounded-lg font-bold text-xs sm:text-sm',
        'shadow-md active:scale-95',
        'aspect-[4/3] p-1', // Compact aspect ratio with minimal padding
        getColorClasses(),
        tile.guessed ? 'cursor-default' : 'cursor-pointer'
      )}
      aria-label={`${tile.word}${shouldShowColor ? `, ${tile.team} team` : ''}${tile.guessed ? ', guessed' : ''}`}
    >
      <span className="text-center break-words hyphens-auto uppercase tracking-tight leading-tight">
        {tile.word}
      </span>
    </button>
  );
}
