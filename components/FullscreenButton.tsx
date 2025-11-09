'use client';

import React, { useEffect, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FullscreenButtonProps {
  className?: string;
  size?: number;
}

export default function FullscreenButton({ className, size = 18 }: FullscreenButtonProps) {
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
    <Button
      variant="outline"
      size="sm"
      onClick={toggleFullscreen}
      className={cn("p-0 rounded-md inline-flex items-center justify-center h-8 w-8", className)}
      title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      aria-pressed={isFullscreen}
    >
      {isFullscreen ? <Minimize2 size={size} /> : <Maximize2 size={size} />}
    </Button>
  );
}
