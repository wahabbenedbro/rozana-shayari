import React, { useEffect, useState } from 'react';

interface PWAServiceProps {
  children: React.ReactNode;
}

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAService({ children }: PWAServiceProps) {
  const [isInstallable, setIsInstallable] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Skip service worker registration in this environment as it's not supported
    console.log('PWA Service: Service workers disabled in this environment, focusing on install prompt and manifest features');

    // Handle install prompt (this still works without service workers)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as InstallPromptEvent);
      setIsInstallable(true);
      console.log('PWA install prompt available');
    };

    // Handle app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
      console.log('PWA was installed');
    };

    // Check if already installed (standalone mode)
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        console.log('PWA is running in standalone mode');
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    checkIfInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };

  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setInstallPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error during app installation:', error);
    }
  };

  const handleUpdateClick = () => {
    // Since service workers are disabled, just reload to get latest version
    window.location.reload();
  };

  return (
    <>
      {children}
      
      {/* Install App Banner */}
      {isInstallable && !isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="bg-gradient-to-r from-emerald-deep to-midnight-blue text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h3 className="font-medium text-sm mb-1">Install Rozana Shayari</h3>
                <p className="text-xs opacity-90">
                  Add to your home screen for quick access to daily poetry
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsInstallable(false)}
                  className="px-3 py-2 text-xs bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                >
                  Later
                </button>
                <button
                  onClick={handleInstallClick}
                  className="px-3 py-2 text-xs bg-white text-emerald-deep rounded-md hover:bg-white/90 transition-colors font-medium"
                >
                  Install
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update banner disabled since service workers are not available */}
    </>
  );
}