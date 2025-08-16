import React from 'react';

export function DecorativeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ivory via-white to-emerald-deep/5"></div>
      
      {/* Subtle Persian-inspired pattern */}
      <div className="absolute inset-0 persian-pattern"></div>
      
      {/* Top decorative arc */}
      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
        <div className="w-80 h-80 rounded-full border border-gold-accent/10 opacity-30"></div>
        <div className="absolute inset-4 rounded-full border border-gold-accent/5"></div>
      </div>
      
      {/* Bottom decorative elements */}
      <div className="absolute -bottom-32 -left-16">
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-deep/5 to-transparent"></div>
      </div>
      
      <div className="absolute -bottom-24 -right-20">
        <div className="w-48 h-48 rounded-full bg-gradient-to-bl from-midnight-blue/5 to-transparent"></div>
      </div>
      
      {/* Subtle geometric pattern */}
      <div className="absolute top-1/4 right-8 opacity-20">
        <svg width="60" height="60" viewBox="0 0 60 60" className="text-gold-accent">
          <path
            d="M30 0 L45 15 L30 30 L15 15 Z M30 30 L45 45 L30 60 L15 45 Z"
            fill="currentColor"
            opacity="0.3"
          />
          <circle cx="30" cy="30" r="3" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
      
      <div className="absolute bottom-1/3 left-8 opacity-15">
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-emerald-deep">
          <path
            d="M20 0 L30 10 L20 20 L10 10 Z"
            fill="currentColor"
            opacity="0.4"
          />
          <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
}