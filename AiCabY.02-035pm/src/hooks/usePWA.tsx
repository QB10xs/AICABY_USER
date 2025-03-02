import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface PWAStatus {
  isInstallable: boolean;
  isInstalled: boolean;
  isUpdateAvailable: boolean;
}

export const usePWA = () => {
  const [status, setStatus] = useState<PWAStatus>({
    isInstallable: false,
    isInstalled: false,
    isUpdateAvailable: false,
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if app is installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    setStatus(prev => ({ ...prev, isInstalled: isInstalled }));

    // Listen for beforeinstallprompt event
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setStatus(prev => ({ ...prev, isInstallable: true }));
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setStatus(prev => ({ ...prev, isInstalled: true, isInstallable: false }));
      setDeferredPrompt(null);
      toast.success('App installed successfully!');
    };

    // Listen for service worker updates
    const handleServiceWorkerUpdate = () => {
      setStatus(prev => ({ ...prev, isUpdateAvailable: true }));
      toast((t) => {
        return (
          <div className="flex flex-col gap-2">
            <div className="font-medium">Update Available</div>
            <div className="text-sm opacity-80">A new version is available</div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  window.location.reload();
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1.5 bg-[#F7C948] text-black text-sm font-medium rounded-lg hover:bg-[#F7C948]/90 transition-colors"
              >
                Update Now
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="px-3 py-1.5 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        );
      }, {
        duration: Infinity,
        position: 'bottom-center',
      });
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleServiceWorkerUpdate);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleServiceWorkerUpdate);
      }
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setStatus(prev => ({ ...prev, isInstalled: true, isInstallable: false }));
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error('Error installing app:', error);
      toast.error('Failed to install app');
    }
  };

  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
    }
  };

  return {
    ...status,
    installApp,
    checkForUpdates,
  };
};

export default usePWA; 