import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileQuickInstallBarProps {
  onOpenModal: () => void;
}

export const MobileQuickInstallBar: React.FC<MobileQuickInstallBarProps> = ({ onOpenModal }) => {
  const { isInstalled, isInstallable, install, isInfinix } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 850 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isInstalled || dismissed || !isMobile) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (!res) onOpenModal();
    } else {
      onOpenModal();
    }
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-40 max-w-md mx-auto bg-stone-900/95 border border-emerald-500/50 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-md animate-fade-in flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
          <Smartphone className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h5 className="text-xs font-bold text-stone-100 truncate">
            {isInfinix ? 'Infinix Hot 40 App' : 'SereneMind Android App'}
          </h5>
          <p className="text-[10px] text-emerald-300 truncate">
            ہوم اسکرین پر ڈاؤن لوڈ کریں (Works Offline)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 fill-current" />
          <span>انسٹال</span>
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 rounded-xl text-stone-500 hover:text-stone-300 transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
