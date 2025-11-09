'use client';

import React, { useEffect, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FullscreenButtonProps {
  className?: string;
  size?: number;
}

export default function FullscreenButton({ className, size = 20 }: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keep state in sync if user hits ESC or OS-level toggles
  useEffect(() => {
    const handleChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      className={cn(
        'p-2 rounded-xl bg-gray-200 hover:bg-gray-300 active:scale-95 transition inline-flex items-center justify-center border',
        'border-gray-300 shadow-sm',
        className
      )}
      title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      aria-pressed={isFullscreen}
    >
      {isFullscreen ? <Minimize2 size={size} /> : <Maximize2 size={size} />}
    </button>
  );
}
