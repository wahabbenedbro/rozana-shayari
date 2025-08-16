import React from 'react';
import { Calendar, Volume2 } from 'lucide-react';

type Language = 'urdu' | 'hindi' | 'english';

interface Poem {
  urdu: string;
  hindi: string;
  english: string;
  author: {
    urdu: string;
    hindi: string;
    english: string;
  };
}

interface PoemWidgetProps {
  poem: Poem;
  language: Language;
  date?: string;
  onExpand?: () => void;
  onPlayAudio?: () => void;
}

export function PoemWidget({ poem, language, date, onExpand, onPlayAudio }: PoemWidgetProps) {
  const getLanguageClass = (lang: Language) => {
    switch (lang) {
      case 'urdu':
        return 'poetry-urdu text-sm';
      case 'hindi':
        return 'poetry-hindi text-sm';
      case 'english':
        return 'poetry-english text-sm';
      default:
        return 'poetry-english text-sm';
    }
  };

  const poemText = poem[language];
  const authorText = poem.author[language];
  
  // Truncate poem for widget display (first 2 lines)
  const truncatedPoem = poemText.split('\n').slice(0, 2).join('\n');

  return (
    <div className="
      relative w-full max-w-md mx-auto
      bg-gradient-to-br from-ivory via-white to-emerald-deep/5
      rounded-3xl shadow-lg border border-gold-accent/20
      p-6 cursor-pointer group
      transition-all duration-300 ease-out
      hover:shadow-xl hover:scale-102
    " onClick={onExpand}>
      {/* Background Pattern */}
      <div className="absolute inset-0 persian-pattern rounded-3xl opacity-30"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-gold-accent" />
          <span className="text-xs text-text-secondary opacity-75">
            {date || 'Today'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayAudio?.();
            }}
            className="
              p-2 rounded-full bg-white/60 backdrop-blur-sm
              text-emerald-deep hover:bg-emerald-deep hover:text-white
              transition-all duration-200 shadow-sm
            "
          >
            <Volume2 size={14} />
          </button>
        </div>
      </div>

      {/* App Branding */}
      <div className="relative z-10 text-center mb-4">
        <h3 className="text-lg font-medium text-text-primary mb-1">
          روزانہ شاعری
        </h3>
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gold-accent to-transparent mx-auto"></div>
      </div>

      {/* Poem Preview */}
      <div className={`
        ${getLanguageClass(language)}
        text-center text-text-primary
        leading-relaxed mb-4
        relative
      `}>
        <div className="relative z-10">
          {truncatedPoem.split('\n').map((line, index) => (
            <div key={index} className="mb-1">
              {line}
            </div>
          ))}
          {poemText.split('\n').length > 2 && (
            <div className="text-gold-accent text-xs mt-2 opacity-75">
              ...
            </div>
          )}
        </div>
      </div>

      {/* Author */}
      <div className={`
        text-center text-text-secondary text-xs opacity-75
        ${language === 'urdu' ? 'text-right' : 'text-center'}
        mb-4
      `}>
        — {authorText}
      </div>

      {/* Expand Indicator */}
      <div className="relative z-10 text-center">
        <div className="
          inline-flex items-center space-x-1 
          text-xs text-gold-accent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
        ">
          <span>Tap to read full poem</span>
        </div>
      </div>

      {/* Decorative corner accents */}
      <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-gold-accent/30 rounded-tl-lg"></div>
      <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-gold-accent/30 rounded-tr-lg"></div>
      <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-gold-accent/30 rounded-bl-lg"></div>
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-gold-accent/30 rounded-br-lg"></div>
    </div>
  );
}