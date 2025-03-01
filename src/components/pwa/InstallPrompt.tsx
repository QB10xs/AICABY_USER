import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import usePWA from '@/hooks/usePWA';

const InstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();

  if (!isInstallable || isInstalled) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-4 left-4 right-4 z-50"
      >
        <div className="bg-[#2A2A2A] rounded-xl p-4 shadow-xl border border-[#F7C948]/20 backdrop-blur-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <img
                src="/icons/icon-192x192.png"
                alt="AICABY"
                className="w-16 h-16 rounded-xl"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-1">Install AICABY</h3>
              <p className="text-white/80 text-sm mb-4">
                Install our app for a better experience with quick access and offline features
              </p>
              <div className="flex gap-2">
                <button
                  onClick={installApp}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F7C948] text-black font-medium rounded-lg hover:bg-[#F7C948]/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Install Now
                </button>
                <button
                  onClick={() => {
                    const prompt = document.querySelector('.install-prompt');
                    if (prompt) {
                      prompt.remove();
                    }
                  }}
                  className="px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className="text-[#F7C948] font-medium mb-2">Features:</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#F7C948] rounded-full"></span>
                Quick access from home screen
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#F7C948] rounded-full"></span>
                Works offline
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#F7C948] rounded-full"></span>
                Push notifications
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#F7C948] rounded-full"></span>
                Faster loading times
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt; 