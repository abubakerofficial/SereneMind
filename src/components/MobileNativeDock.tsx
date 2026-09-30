import React from 'react';
import {
  MessageSquare,
  Wind,
  Brain,
  BookOpen,
  Smartphone,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileNativeDockProps {
  onOpenDownloadModal: () => void;
  onScrollToChat: () => void;
  onScrollToBreathing: () => void;
  onScrollToPsychology: () => void;
  onScrollToBooks: () => void;
  theme?: 'universe' | 'sunrise';
}

export const MobileNativeDock: React.FC<MobileNativeDockProps> = ({
  onOpenDownloadModal,
  onScrollToChat,
  onScrollToBreathing,
  onScrollToPsychology,
  onScrollToBooks,
  theme = 'universe',
}) => {
  const { isInstalled, isMobile, deviceModel } = usePWAInstall();

  // Show dock on mobile and tablet devices
  if (!isMobile) return null;

  const isCosmic = theme === 'universe';

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden px-3 pt-2 pb-[max(env(safe-area-inset-bottom),10px)] backdrop-blur-xl border-t transition-all ${
        isCosmic
          ? 'bg-[#050814]/92 border-indigo-500/30 shadow-[0_-8px_30px_rgba(2,6,23,0.8)] text-slate-200'
          : 'bg-white/92 border-slate-200/80 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] text-slate-700'
      }`}
      aria-label="Mobile Navigation Dock"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-around gap-1 text-center">
        {/* 1. Chat Coach Tab */}
        <button
          onClick={onScrollToChat}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            isCosmic
              ? 'hover:bg-indigo-950/60 active:scale-95 text-slate-300 hover:text-cyan-300'
              : 'hover:bg-slate-100 active:scale-95 text-slate-600 hover:text-sky-600'
          }`}
          title="چیٹ اور رہنمائی"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
          </div>
          <span className="text-[10px] font-medium mt-1 leading-tight tracking-tight">
            کوچ
          </span>
        </button>

        {/* 2. Breathing Tab */}
        <button
          onClick={onScrollToBreathing}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            isCosmic
              ? 'hover:bg-indigo-950/60 active:scale-95 text-slate-300 hover:text-sky-300'
              : 'hover:bg-slate-100 active:scale-95 text-slate-600 hover:text-sky-600'
          }`}
          title="سانس کی مشق"
        >
          <Wind className="w-5 h-5 text-sky-400" />
          <span className="text-[10px] font-medium mt-1 leading-tight tracking-tight">
            سانس
          </span>
        </button>

        {/* 3. Psychology Tab */}
        <button
          onClick={onScrollToPsychology}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            isCosmic
              ? 'hover:bg-indigo-950/60 active:scale-95 text-slate-300 hover:text-indigo-300'
              : 'hover:bg-slate-100 active:scale-95 text-slate-600 hover:text-indigo-600'
          }`}
          title="علمِ نفسیات"
        >
          <Brain className="w-5 h-5 text-indigo-400" />
          <span className="text-[10px] font-medium mt-1 leading-tight tracking-tight">
            نفسیات
          </span>
        </button>

        {/* 4. Books Tab */}
        <button
          onClick={onScrollToBooks}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            isCosmic
              ? 'hover:bg-indigo-950/60 active:scale-95 text-slate-300 hover:text-emerald-300'
              : 'hover:bg-slate-100 active:scale-95 text-slate-600 hover:text-emerald-600'
          }`}
          title="کتب خانہ"
        >
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-medium mt-1 leading-tight tracking-tight">
            کتب
          </span>
        </button>

        {/* 5. Real Mobile App Status / Install Tab */}
        <button
          onClick={onOpenDownloadModal}
          className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            isInstalled
              ? isCosmic
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : isCosmic
              ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200'
              : 'bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-700'
          }`}
          title={isInstalled ? 'ریل ایپ فعال ہے' : 'ریل ایپ انسٹال کریں'}
        >
          {isInstalled ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] font-bold mt-1 leading-tight">ریل ایپ ✓</span>
            </>
          ) : (
            <>
              <div className="relative">
                <Smartphone className="w-5 h-5 text-cyan-300 animate-pulse" />
                <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1" />
              </div>
              <span className="text-[10px] font-bold mt-1 leading-tight text-cyan-300">
                ایپ فٹنگ
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
