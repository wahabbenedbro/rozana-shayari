import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  onPlay: () => void;
}

export function AudioPlayer({ onPlay }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    onPlay();
  };

  return (
    <div className="flex justify-center mb-8">
      <button
        onClick={handlePlayPause}
        className="
          group relative
          w-16 h-16
          bg-gradient-to-br from-emerald-deep to-midnight-blue
          rounded-full
          shadow-lg hover:shadow-xl
          transition-all duration-300 ease-out
          transform hover:scale-105
          active:scale-95
        "
      >
        {/* Glowing ring effect */}
        <div className="
          absolute inset-0
          rounded-full
          bg-gradient-to-br from-gold-accent/30 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          animate-pulse
        "></div>
        
        {/* Icon */}
        <div className="
          relative z-10
          w-full h-full
          flex items-center justify-center
          text-white
        ">
          {isPlaying ? (
            <Pause size={24} className="ml-0" />
          ) : (
            <Play size={24} className="ml-1" />
          )}
        </div>
        
        {/* Ripple effect */}
        <div className="
          absolute inset-0
          rounded-full
          border-2 border-gold-accent/40
          scale-110
          opacity-0 group-active:opacity-100 group-active:scale-125
          transition-all duration-200
        "></div>
      </button>
    </div>
  );
}