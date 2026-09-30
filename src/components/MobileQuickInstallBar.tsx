import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileQuickInstallBarProps {
  onOpenModal: () => void;
  theme?: 'universe' | 'sunrise';
}

export const MobileQuickInstallBar: React.FC<MobileQuickInstallBarProps> = ({
  onOpenModal,
  theme = 'universe',
}) => {
  const { isInstalled, isInstallable, install, deviceModel, isMobile, isIOS } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('serenemind_install_bar_dismissed');
    if (saved === 'true') {
      setDismissed(true);
    }
  }, []);

  if (isInstalled || dismissed || !isMobile) return null;

  const isCosmic = theme === 'universe';

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (!res) onOpenModal();
    } else {
      onOpenModal();
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('serenemind_install_bar_dismissed', 'true');
  };

  return (
    <div
      className={`fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-40 max-w-md mx-auto rounded-2xl p-3 shadow-2xl backdrop-blur-xl border transition-all animate-fade-in flex items-center justify-between gap-3 ${
        isCosmic
          ? 'bg-[#080d24]/95 border-cyan-500/40 shadow-[0_10px_30px_rgba(6,182,212,0.2)] text-white'
          : 'bg-white/95 border-sky-300 shadow-xl text-slate-800'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            isCosmic
              ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-400/50 text-cyan-300'
              : 'bg-sky-50 border-sky-300 text-sky-600'
          }`}
        >
          <Smartphone className="w-5 h-5 animate-pulse" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h5 className="text-xs font-bold truncate">
              {deviceModel}
            </h5>
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold">
              ریل ایپ فٹنگ
            </span>
          </div>
          <p className="text-[10px] text-cyan-300/90 truncate">
            {isIOS
              ? 'بغیر براؤزر ونڈو کے فل اسکرین اصلی ایپ بنائیں'
              : 'براہ راست ڈاؤن لوڈ کریں — 100% فل اسکرین فٹ'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Download className="w-3.5 h-3.5 fill-current" />
          <span>انسٹال</span>
        </button>

        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
          title="بند کریں"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
