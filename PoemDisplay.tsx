import React from 'react';

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

interface PoemDisplayProps {
  poem: Poem;
  language: Language;
}

export function PoemDisplay({ poem, language }: PoemDisplayProps) {
  const getLanguageClass = (lang: Language) => {
    switch (lang) {
      case 'urdu':
        return 'poetry-urdu';
      case 'hindi':
        return 'poetry-hindi';
      case 'english':
        return 'poetry-english';
      default:
        return 'poetry-english';
    }
  };

  const poemText = poem[language];
  const authorText = poem.author[language];

  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      {/* Decorative top border */}
      <div className="flex justify-center mb-8">
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold-accent to-transparent"></div>
      </div>
      
      {/* Poem text */}
      <div className={`
        ${getLanguageClass(language)}
        text-center
        text-text-primary
        leading-relaxed
        mb-8
        px-4
        relative
      `}>
        {/* Subtle decorative quotes for English */}
        {language === 'english' && (
          <>
            <span className="absolute -top-4 -left-2 text-6xl text-gold-accent/30 font-serif">"</span>
            <span className="absolute -bottom-8 -right-2 text-6xl text-gold-accent/30 font-serif">"</span>
          </>
        )}
        
        <div className="relative z-10">
          {poemText.split('\n').map((line, index) => (
            <div key={index} className="mb-2">
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Author attribution */}
      <div className="text-center text-text-secondary mb-8">
        <span className="text-sm opacity-75">— {authorText}</span>
      </div>

      {/* Decorative bottom border */}
      <div className="flex justify-center">
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold-accent to-transparent"></div>
      </div>
    </div>
  );
}