'use client';

import { Tile, Role } from '@/types';
import { cn } from '@/lib/utils';
import { useFitText } from '@/lib/useFitText';
import { useIsMobile } from '@/lib/useIsMobile';

interface WordTileProps {
  tile: Tile;
  role: Role;
  showKey: boolean;
  onToggle: (index: number) => void;
}

// Centralized HEX color palettes
type TeamKey = Tile['team'] | 'hidden';
const PALETTES: Record<TeamKey, { outer: string; inner: string; dark: string; text: string }> = {
  red:      { outer: '#ff9159', inner: '#f8543a', dark: '#852d15', text: '#FFFFFF' },
  blue:     { outer: '#3dd1ee', inner: '#00a3d8', dark: '#17527f', text: '#FFFFFF' },
  neutral:  { outer: '#e7e1dcff', inner: '#c0bebdff', dark: '#706256ff', text: '#FFFFFF' },
  assassin: { outer: '#8c8d8d', inner: '#525252', dark: '#2a2a2a', text: '#FFFFFF' },
  hidden:   { outer: '#ffd5af', inner: '#ffd5af', dark: '#967355', text: '#FFFFFF' },
};

export default function WordTile({ tile, role, showKey, onToggle }: WordTileProps) {
  const isMaster = role === 'master';
  const shouldShowColor = isMaster && showKey;

  const visualTeam: TeamKey = (shouldShowColor || tile.guessed) ? tile.team : 'hidden';
  const palette = PALETTES[visualTeam];

  // Only allow clicking if the tile is 'hidden' and not guessed
  const clickable = visualTeam === 'hidden' && !tile.guessed;

  return (
    <TileCard
      text={tile.word}
      palette={palette}
      onClick={clickable ? () => onToggle(tile.index) : undefined}
      disabled={!clickable}
      ariaLabel={`${tile.word}${shouldShowColor ? `, ${tile.team} team` : ''}${tile.guessed ? ', guessed' : ''}`}
    />
  );
}

interface TileCardProps {
  text: string;
  palette: { outer: string; inner: string; dark: string; text: string };
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}

function TileCard({ text, palette, onClick, disabled, ariaLabel }: TileCardProps) {
  const isMobile = useIsMobile();
  // Auto-fit only on mobile: allow font between 10px and 42px
  const { containerRef, textRef, fontSize } = useFitText({ min: 1, max: 18, step: 1, enabled: isMobile });

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'relative w-full transition-all duration-150',
        // Borders/Padding: minimal on mobile to maximize text area
        isMobile
          ? 'rounded-md border p-0.5'
          : 'rounded-lg border p-1 sm:p-2',
        // Adaptive aspect ratio: taller on very small screens for readability
        !isMobile && 'aspect-[5/4] xs:aspect-[6/4] sm:aspect-[8/5]',
        disabled ? 'cursor-default opacity-100' : 'cursor-pointer hover:brightness-110 active:scale-95'
      )}
      style={{ backgroundColor: palette.outer, borderColor: palette.dark, borderWidth: isMobile ? 1 : 2, borderStyle: 'solid' }}
    >
      <div
        className={cn(
          'relative w-full h-full flex flex-col',
          isMobile ? 'rounded-sm border' : 'rounded-md border'
        )}
        style={{ backgroundColor: palette.inner, borderColor: palette.dark, borderWidth: isMobile ? 1 : 2, borderStyle: 'solid' }}
      >
        {/* Mid horizontal divider (slightly lower on mobile to avoid overlay) */}
        <div
          className={cn(
            'absolute left-0 w-full h-[2px] opacity-50',
            isMobile ? 'top-[50%]' : 'top-1/2'
          )}
          style={{ backgroundColor: palette.dark }}
        />
        {/* Bottom bar with word text (inset and centered) */}
        <div className="absolute left-0 bottom-0 flex items-center justify-center h-1/2 w-full px-1.5 pb-1 pt-1">
          <div
            ref={isMobile ? containerRef : undefined}
            className={cn(
              'w-full flex items-center justify-center rounded-[4px] border text-center',
              isMobile ? 'py-1' : 'py-1 sm:py-1.5'
            )}
            style={{
              backgroundColor: palette.dark,
              borderColor: palette.dark,
              borderWidth: isMobile ? 1 : 2,
              borderStyle: 'solid',
              color: palette.text,
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            <span
              ref={isMobile ? textRef : undefined}
              className="block w-full font-black tracking-tight uppercase"
              style={{ fontSize: isMobile ? fontSize : undefined, lineHeight: 1, letterSpacing: '0.5px' }}
            >
              {text}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

