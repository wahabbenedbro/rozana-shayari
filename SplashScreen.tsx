import React, { useEffect, useState } from 'react';
import splashImage from 'figma:asset/32529971191d0459d95a97964484485ec9771d46.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after a brief delay
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 200);

    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(progressTimer);
          // Complete splash screen after progress finishes
          setTimeout(() => {
            onComplete();
          }, 500);
        }
        return Math.min(newProgress, 100);
      });
    }, 30);

    return () => {
      clearTimeout(contentTimer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-ivory via-white to-emerald-deep/5">
      {/* Background Patterns */}
      <div className="absolute inset-0">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-ivory via-white to-emerald-deep/3"></div>
        
        {/* Subtle Persian-inspired pattern */}
        <div className="absolute inset-0 persian-pattern opacity-30"></div>
        
        {/* Animated decorative circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-gold-accent/10 opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full border border-emerald-deep/10 opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className={`
          text-center space-y-8 transform transition-all duration-1000 ease-out
          ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        `}>
          {/* Main App Logo/Image */}
          <div className="relative">
            <div className="w-80 h-96 mx-auto mb-6 relative">
              {/* Main splash image */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <img 
                  src={splashImage}
                  alt="Rozana Shayari - Daily Poetry"
                  className="w-full h-full object-contain filter drop-shadow-lg"
                />
              </div>
              
              {/* Subtle glowing effect around the image */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gold-accent/10 to-emerald-deep/10 opacity-20 blur-xl"></div>
            </div>
          </div>

          {/* Subtitle */}
          <div className="space-y-4">
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-accent to-transparent mx-auto"></div>
            <p className="text-lg text-text-primary opacity-75">
              Daily Poetry for the Soul
            </p>
            <p className="text-sm text-text-secondary opacity-60">
              دل کی آواز، ہر دن نئی شاعری
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center space-x-4 opacity-50">
            <div className="w-2 h-2 rounded-full bg-gold-accent animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-deep animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2 h-2 rounded-full bg-midnight-blue animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`
          absolute bottom-16 left-6 right-6 transform transition-all duration-1000 ease-out
          ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <div className="text-center mb-4">
            <p className="text-xs text-text-secondary opacity-60">
              Loading your daily verse...
            </p>
          </div>
          
          <div className="relative">
            {/* Progress track */}
            <div className="h-1 bg-gold-accent/20 rounded-full overflow-hidden">
              {/* Progress fill */}
              <div 
                className="h-full bg-gradient-to-r from-emerald-deep to-gold-accent rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {/* Glowing effect */}
            <div 
              className="absolute top-0 h-1 bg-gradient-to-r from-transparent via-gold-accent/50 to-transparent rounded-full transition-all duration-300 ease-out opacity-75"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="text-center mt-2">
            <p className="text-xs text-text-secondary opacity-40">
              {progress}%
            </p>
          </div>
        </div>

        {/* Footer branding */}
        <div className={`
          absolute bottom-4 left-0 right-0 text-center transform transition-all duration-1000 ease-out
          ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <p className="text-xs text-text-secondary opacity-30">
            Crafted with ❤️ for Poetry Lovers
          </p>
        </div>
      </div>
    </div>
  );
}