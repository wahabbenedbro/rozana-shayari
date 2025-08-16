import React, { useState, useEffect } from 'react';
import { LanguageToggle } from './components/LanguageToggle';
import { PoemDisplay } from './components/PoemDisplay';
import { AudioPlayer } from './components/AudioPlayer';
import { DecorativeBackground } from './components/DecorativeBackground';
import { EmailSignup } from './components/EmailSignup';
import { ShareButton } from './components/ShareButton';
import { SplashScreen } from './components/SplashScreen';
import { PWAService } from './components/PWAService';
import { AdminPanel } from './components/AdminPanel';
import { PoemExplanation } from './components/PoemExplanation';
import { PoemService, Poem } from './components/PoemService';

type Language = 'urdu' | 'hindi' | 'english';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeLanguage, setActiveLanguage] = useState<Language>('urdu');
  const [currentPoem, setCurrentPoem] = useState<Poem | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [backendInitialized, setBackendInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emailSignupComplete, setEmailSignupComplete] = useState(false);

  useEffect(() => {
    // Initialize backend and load today's poem
    const initializeApp = async () => {
      try {
        // Initialize backend
        const initResult = await PoemService.initializeBackend();
        if (initResult.success) {
          setBackendInitialized(true);
          console.log('Backend initialized successfully');
        } else {
          console.error('Failed to initialize backend:', initResult.error);
        }

        // Load today's poem
        const poemResult = await PoemService.getTodaysPoem();
        if (poemResult.success && poemResult.data) {
          setCurrentPoem(poemResult.data.poem);
        } else {
          console.error('Failed to load today\'s poem:', poemResult.error);
          // Fallback to default poem if backend fails
          setCurrentPoem({
            id: 'fallback',
            urdu: `دل میں چھپے ہوئے خوابوں کو\nآنکھوں میں سجانا آتا ہے\nہر غم کو خوشی میں بدلنا\nاردو شاعری کا جادو ہے`,
            hindi: `दिल में छुपे हुए सपनों को\nआंखों में सजाना आता है\nहर गम को खुशी में बदलना\nहिंदी कविता का जादू है`,
            english: `Hidden dreams within the heart,\nAdorn the eyes with gentle art.\nTurning sorrow into joy,\nIs poetry's timeless ploy.`,
            author: {
              urdu: 'علامہ اقبال',
              hindi: 'अल्लामा इक़बाल',
              english: 'Allama Iqbal'
            },
            category: 'inspiration',
            dateAdded: new Date().toISOString(),
            isActive: true
          });
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    // Add PWA meta tags dynamically
    const addMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const addLinkTag = (rel: string, href: string, type?: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
      if (type) link.type = type;
    };

    // PWA Meta Tags
    addMetaTag('application-name', 'Rozana Shayari');
    addMetaTag('apple-mobile-web-app-capable', 'yes');
    addMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    addMetaTag('apple-mobile-web-app-title', 'Rozana Shayari');
    addMetaTag('description', 'Daily poetry app for Pakistani and Indian poetry lovers');
    addMetaTag('format-detection', 'telephone=no');
    addMetaTag('mobile-web-app-capable', 'yes');
    addMetaTag('msapplication-TileColor', '#0f4c3a');
    addMetaTag('msapplication-tap-highlight', 'no');
    addMetaTag('theme-color', '#0f4c3a');

    // Viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover';

    // Create a simple inline manifest as fallback
    const createInlineManifest = () => {
      const manifest = {
        name: "Rozana Shayari - Daily Poetry",
        short_name: "Rozana Shayari",
        description: "Daily poetry app for Pakistani and Indian poetry lovers",
        start_url: "/",
        display: "standalone",
        background_color: "#faf9f6",
        theme_color: "#0f4c3a",
        orientation: "portrait-primary",
        scope: "/",
        lang: "en",
        dir: "ltr",
        categories: ["education", "lifestyle", "books"],
        icons: [
          {
            src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='192' viewBox='0 0 192 192'%3E%3Crect width='192' height='192' fill='%230f4c3a'/%3E%3Ctext x='96' y='110' text-anchor='middle' fill='%23d4af37' font-size='24' font-family='serif'%3Eروزانہ%3C/text%3E%3Ctext x='96' y='135' text-anchor='middle' fill='%23faf9f6' font-size='16'%3EShayari%3C/text%3E%3C/svg%3E",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "maskable any"
          }
        ]
      };
      
      const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
      return URL.createObjectURL(blob);
    };

    // Try to use external manifest, fallback to inline
    const manifestUrl = createInlineManifest();
    addLinkTag('manifest', manifestUrl, 'application/manifest+json');

    // Use SVG icon as fallback
    const iconSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%230f4c3a'/%3E%3Ctext x='48' y='55' text-anchor='middle' fill='%23d4af37' font-size='12' font-family='serif'%3Eروزانہ%3C/text%3E%3Ctext x='48' y='70' text-anchor='middle' fill='%23faf9f6' font-size='8'%3EShayari%3C/text%3E%3C/svg%3E";
    
    // Apple touch icons
    addLinkTag('apple-touch-icon', iconSvg);
    addLinkTag('icon', iconSvg, 'image/svg+xml');
    addLinkTag('shortcut icon', iconSvg);

    // Set document title
    document.title = 'Rozana Shayari - Daily Poetry';
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handlePlayAudio = () => {
    // In a real app, this would play the audio narration
    console.log(`Playing audio for ${activeLanguage} poem`);
  };

  const handleLearnAboutPoem = () => {
    if (currentPoem) {
      setShowExplanation(true);
    }
  };

  const handleAdminAccess = () => {
    // Simple admin access - in production, this would require proper authentication
    const password = prompt('Enter admin password to manage poems:');
    if (password === 'admin123') {
      setShowAdmin(true);
    } else if (password === 'demo') {
      // Demo access with limited permissions
      setShowAdmin(true);
      alert('Demo mode: You can view the admin panel but changes will not be saved.');
    } else if (password !== null) {
      alert('Incorrect password. Contact the administrator for access.');
    }
  };

  const handleEmailSignupComplete = (email: string) => {
    setEmailSignupComplete(true);
    console.log('Email signup completed for:', email);
  };

  return (
    <PWAService>
      {/* Show splash screen */}
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : loading ? (
        /* Loading screen */
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-deep mb-4"></div>
            <p className="text-text-secondary">Loading today's poetry...</p>
          </div>
        </div>
      ) : (
        /* Main app content */
        <div className="min-h-screen relative overflow-hidden">
          {/* Decorative Background */}
          <DecorativeBackground />
          
          {/* Main Content */}
          <div className="relative z-10 min-h-screen flex flex-col animate-in fade-in duration-1000">
            {/* Header with Language Toggle */}
            <header className="pt-12 pb-8 px-6">
              <div className="flex flex-col items-center space-y-6">
                {/* App Title */}
                <div className="text-center">
                  <h1 className="text-2xl font-medium text-text-primary mb-2">
                    روزانہ شاعری
                  </h1>
                  <p className="text-sm text-text-secondary opacity-75">
                    Daily Poetry for the Soul
                  </p>
                </div>
                
                {/* Language Toggle */}
                <LanguageToggle 
                  activeLanguage={activeLanguage}
                  onLanguageChange={setActiveLanguage}
                />
              </div>
            </header>

            {/* Main Poem Section */}
            <main className="flex-1 flex flex-col justify-center px-4 py-8">
              {/* Today's Date */}
              <div className="text-center mb-8">
                <p className="text-sm text-text-secondary opacity-60">
                  Saturday, August 16, 2025
                </p>
                {currentPoem?.category && (
                  <p className="text-xs text-gold-accent opacity-75 mt-1">
                    Category: {currentPoem.category}
                  </p>
                )}
              </div>

              {/* Poem Display */}
              {currentPoem && (
                <PoemDisplay poem={currentPoem} language={activeLanguage} />
              )}
              
              {/* Audio Player */}
              <AudioPlayer onPlay={handlePlayAudio} />
              
              {/* Action Buttons */}
              <div className="flex flex-col items-center space-y-4">
                {/* Share Button */}
                {currentPoem && (
                  <ShareButton 
                    poem={currentPoem}
                    language={activeLanguage}
                    date="Saturday, August 16, 2025"
                  />
                )}
                
                {/* Learn About This Poem Link */}
                <button
                  onClick={handleLearnAboutPoem}
                  className="
                    text-sm text-gold-accent hover:text-emerald-deep
                    transition-colors duration-200
                    underline decoration-dotted decoration-1
                    underline-offset-4
                    hover:decoration-solid
                  "
                >
                  Learn about this poem
                </button>
              </div>
            </main>

            {/* Email Signup Section */}
            <section className="px-6 pb-8">
              <div className="max-w-sm mx-auto">
                <EmailSignup onSignupComplete={handleEmailSignupComplete} />
              </div>
            </section>

            {/* Footer */}
            <footer className="pb-8 px-6">
              <div className="text-center">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gold-accent/50 to-transparent mx-auto mb-4"></div>
                <p className="text-xs text-text-secondary opacity-50">
                  Rozana Shayari
                </p>
                {emailSignupComplete && (
                  <p className="text-xs text-emerald-deep opacity-75 mt-1">
                    📧 Email notifications enabled
                  </p>
                )}
              </div>
            </footer>
          </div>
          
          {/* Hidden Admin Access - Bottom Right Corner */}
          <div className="fixed bottom-4 right-4 z-40">
            <button
              onClick={handleAdminAccess}
              className="
                w-6 h-6 rounded-full
                bg-black/5 hover:bg-black/10
                transition-all duration-200
                text-gray-400 hover:text-gray-600
                text-xs
                opacity-20 hover:opacity-60
                cursor-default hover:cursor-pointer
              "
              title="Admin"
              aria-label="Admin Panel Access"
            >
              •
            </button>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      <AdminPanel 
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
      />

      {/* Poem Explanation Modal */}
      {currentPoem && (
        <PoemExplanation
          poem={currentPoem}
          language={activeLanguage}
          isOpen={showExplanation}
          onClose={() => setShowExplanation(false)}
        />
      )}
    </PWAService>
  );
}