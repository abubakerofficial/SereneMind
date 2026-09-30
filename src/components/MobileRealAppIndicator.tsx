import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  CheckCircle2,
  Maximize2,
  Sparkles,
  ChevronRight,
  X,
  ShieldCheck,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileRealAppIndicatorProps {
  onOpenModal: () => void;
  theme?: 'universe' | 'sunrise';
}

export const MobileRealAppIndicator: React.FC<MobileRealAppIndicatorProps> = ({
  onOpenModal,
  theme = 'universe',
}) => {
  const {
    isInstalled,
    isInstallable,
    isIOS,
    deviceModel,
    isMobile,
    install,
    toggleFullscreen,
    isFullscreen,
  } = usePWAInstall();

  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const savedDismiss = sessionStorage.getItem('serenemind_mobile_bar_dismissed');
    if (savedDismiss === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('serenemind_mobile_bar_dismissed', 'true');
  };

  if (!isMobile || dismissed) return null;

  const isCosmic = theme === 'universe';

  const handleAction = async () => {
    if (isInstallable) {
      const res = await install();
      if (!res) onOpenModal();
    } else {
      onOpenModal();
    }
  };

  return (
    <div
      className={`w-full transition-all border-b ${
        isInstalled
          ? isCosmic
            ? 'bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-slate-950/80 border-emerald-500/30 text-emerald-200'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : isCosmic
          ? 'bg-gradient-to-r from-[#0d1538]/90 via-[#132050]/85 to-[#0e173a]/90 border-cyan-500/30 text-slate-100'
          : 'bg-sky-50 border-sky-200 text-slate-800'
      }`}
    >
      <div className="max-w-6xl mx-auto px-3 py-2 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isInstalled
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
            }`}
          >
            {isInstalled ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Smartphone className="w-4 h-4 text-cyan-400 animate-pulse" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-[11px] sm:text-xs">
                {deviceModel}
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isInstalled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}
              >
                {isInstalled ? 'اصلی ریل ایپ فعال' : 'خودکار ریل ایپ فٹنگ'}
              </span>
            </div>
            <p className="text-[10px] opacity-80 truncate">
              {isInstalled
                ? 'ہر براؤزر ونڈو ختم — 100% فل اسکرین خودکار فٹنگ کے ساتھ تیار'
                : 'ونڈو ویو کے بغیر مکمل اصلی موبائل ایپ کی طرح فٹ کریں'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isInstalled && (
            <button
              onClick={handleAction}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-[11px] shadow-sm flex items-center gap-1 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3 fill-current" />
              <span>ایپ بنائیں</span>
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className={`p-1 rounded-lg border text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
              isCosmic
                ? 'border-indigo-500/30 text-slate-300 hover:text-white hover:bg-slate-800/60'
                : 'border-slate-300 text-slate-600 hover:bg-white'
            }`}
            title="فل اسکرین موڈ"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">
              {isFullscreen ? 'عام ویو' : 'فل اسکرین'}
            </span>
          </button>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
            title="بند کریں"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
