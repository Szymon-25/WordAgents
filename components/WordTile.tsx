'use client';

import { Tile, Role } from '@/types';

interface WordTileProps {
  tile: Tile;
  role: Role;
  showKey: boolean;
  colorblindMode: boolean;
  onToggle: (index: number) => void;
}

export default function WordTile({ tile, role, showKey, colorblindMode, onToggle }: WordTileProps) {
  const isMaster = role === 'master';
  const shouldShowColor = isMaster && showKey;

  const getColorClasses = () => {
    if (!shouldShowColor && !tile.guessed) {
      return 'bg-amber-50 hover:bg-amber-100 border-amber-300';
    }

    const baseClasses = {
      red: 'bg-red-500 border-red-600',
      blue: 'bg-blue-500 border-blue-600',
      neutral: 'bg-gray-400 border-gray-500',
      assassin: 'bg-black border-gray-900'
    };

    const textClasses = {
      red: 'text-white',
      blue: 'text-white',
      neutral: 'text-gray-800',
      assassin: 'text-white'
    };

    return `${baseClasses[tile.team]} ${textClasses[tile.team]} ${
      tile.guessed ? 'opacity-60' : 'hover:opacity-90'
    }`;
  };

  const getPatternClasses = () => {
    if (!colorblindMode || (!shouldShowColor && !tile.guessed)) return '';
    
    const patterns = {
      red: 'border-8 border-double',
      blue: 'border-8 border-dashed',
      neutral: 'border-4',
      assassin: 'border-8 border-dotted'
    };

    return patterns[tile.team];
  };

  const getIcon = () => {
    if (!colorblindMode || (!shouldShowColor && !tile.guessed)) return null;
    
    const icons = {
      red: '●',
      blue: '■',
      neutral: '○',
      assassin: '☠'
    };

    return (
      <span className="absolute top-1 right-2 text-2xl opacity-75">
        {icons[tile.team]}
      </span>
    );
  };

  return (
    <button
      onClick={() => onToggle(tile.index)}
      className={`
        relative
        w-full aspect-square
        border-4
        rounded-lg
        font-bold
        text-base sm:text-lg md:text-xl
        transition-all
        duration-200
        flex items-center justify-center
        p-2
        ${getColorClasses()}
        ${getPatternClasses()}
        ${tile.guessed ? 'cursor-default' : 'cursor-pointer active:scale-95'}
      `}
      aria-label={`${tile.word}${shouldShowColor ? `, ${tile.team} team` : ''}${tile.guessed ? ', guessed' : ''}`}
    >
      {getIcon()}
      <span className="text-center break-words hyphens-auto px-1">
        {tile.word}
      </span>
    </button>
  );
}
