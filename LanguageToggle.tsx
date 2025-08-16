import React from 'react';

type Language = 'urdu' | 'hindi' | 'english';

interface LanguageToggleProps {
  activeLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageToggle({ activeLanguage, onLanguageChange }: LanguageToggleProps) {
  const languages = [
    { key: 'urdu' as Language, label: 'اردو', displayName: 'Urdu' },
    { key: 'hindi' as Language, label: 'हिंदी', displayName: 'Hindi' },
    { key: 'english' as Language, label: 'English', displayName: 'English' },
  ];

  return (
    <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-sm border border-gold-accent/20">
      {languages.map((lang) => (
        <button
          key={lang.key}
          onClick={() => onLanguageChange(lang.key)}
          className={`
            relative px-4 py-2 rounded-xl transition-all duration-300 ease-out
            ${activeLanguage === lang.key 
              ? 'bg-gradient-to-br from-emerald-deep to-midnight-blue text-white shadow-md transform scale-105' 
              : 'text-text-secondary hover:text-text-primary hover:bg-white/50'
            }
          `}
        >
          <span className="relative z-10 font-medium">
            {lang.label}
          </span>
          {activeLanguage === lang.key && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold-accent/20 to-transparent opacity-30"></div>
          )}
        </button>
      ))}
    </div>
  );
}