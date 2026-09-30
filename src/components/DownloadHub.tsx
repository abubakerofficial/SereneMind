import React from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  Apple,
  Sparkles,
  Music,
  FileText,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  WifiOff,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { download432HzAudio, downloadPsychologyHandbook } from '../utils/downloader';

interface DownloadHubProps {
  onOpenDownloadModal: () => void;
  theme?: 'universe' | 'sunrise';
}

export const DownloadHub: React.FC<DownloadHubProps> = ({
  onOpenDownloadModal,
  theme = 'universe',
}) => {
  const { isInstallable, isInstalled, platformName, install } = usePWAInstall();
  const isCosmic = theme === 'universe';

  const handlePrimaryInstall = async () => {
    if (isInstallable) {
      await install();
    } else {
      onOpenDownloadModal();
    }
  };

  return (
    <section
      className={`rounded-3xl p-5 sm:p-7 relative overflow-hidden transition-all duration-500 ${
        isCosmic
          ? 'bg-gradient-to-br from-[#0c163a]/92 via-[#0e1d4b]/88 to-[#161240]/92 backdrop-blur-2xl border border-sky-400/35 shadow-2xl shadow-indigo-950/70 text-slate-100'
          : 'bg-white border border-slate-100 shadow-sm text-slate-700'
      }`}
    >
      {/* Background ambient glow */}
      {isCosmic && (
        <>
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Information */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1 shadow-xs ${
                isCosmic
                  ? 'bg-sky-950/90 text-cyan-300 border-sky-400/40'
                  : 'bg-sky-50 text-sky-700 border-sky-100'
              }`}
            >
              <Download className="w-3 h-3 text-cyan-400" />
              ڈاؤن لوڈ سینٹر (All Devices Download Hub)
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                isCosmic
                  ? 'bg-indigo-950/80 border-indigo-400/40 text-teal-300'
                  : 'bg-slate-100 border-slate-200 text-teal-700'
              }`}
            >
              آپ کا آلہ: {platformName}
            </span>
          </div>

          <h3 className={`text-xl sm:text-2xl font-bold tracking-tight leading-snug ${isCosmic ? 'text-white' : 'text-slate-700'}`}>
            تمام ڈیوائسز پر ڈاؤن لوڈ کریں{' '}
            <span className={isCosmic ? 'text-cyan-300 font-light block sm:inline' : 'text-sky-600 font-light block sm:inline'}>
              (Download SereneMind AI App)
            </span>
          </h3>

          <p className={`text-xs sm:text-sm leading-relaxed ${isCosmic ? 'text-slate-200' : 'text-slate-500'}`}>
            کسی بھی ایپ اسٹور کے بغیر اپنے <strong>انفینکس و اینڈرائیڈ موبائل</strong>، <strong>آئی فون / آئی پیڈ</strong>، یا <strong>ونڈوز کمپیوٹر</strong> پر انسٹال کریں۔ فوری آغاز، زیرو لوڈنگ وقت اور ۱۰۰٪ آف لائن کام کی صلاحیت۔
          </p>

          {/* Device Badges & Benefits */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-semibold border ${
                isCosmic
                  ? 'bg-sky-950/80 border-sky-400/40 text-cyan-300 shadow-sm'
                  : 'bg-sky-50 border-sky-200 text-sky-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              Infinix &amp; Android Phone
            </span>
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border ${
                isCosmic
                  ? 'bg-slate-900/80 border-indigo-500/30 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Apple className="w-3.5 h-3.5 opacity-80" />
              iOS Safari Home App
            </span>
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border ${
                isCosmic
                  ? 'bg-slate-900/80 border-indigo-500/30 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 opacity-80" />
              Windows 10/11 Desktop
            </span>
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-medium border ${
                isCosmic
                  ? 'bg-teal-950/80 border-teal-400/40 text-teal-300'
                  : 'bg-teal-50 border-teal-200 text-teal-700'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5 text-teal-400" />
              آف لائن کام کرتا ہے (Works Offline)
            </span>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <button
            onClick={handlePrimaryInstall}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/30 transition-all flex items-center justify-center gap-2.5 group cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            <span>
              {isInstalled
                ? 'ایپ انسٹال ہے • اختیارات دیکھیں'
                : 'موبائل / کمپیوٹر پر ڈاؤن لوڈ کریں'}
            </span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => download432HzAudio(15)}
              className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                isCosmic
                  ? 'bg-slate-900/80 border-indigo-500/30 text-cyan-300 hover:bg-slate-800 hover:border-cyan-400'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Download 432 Hz Solfeggio Audio File"
            >
              <Music className="w-3.5 h-3.5 text-cyan-400" />
              <span>432Hz میوزک ڈاؤن لوڈ</span>
            </button>

            <button
              onClick={() => downloadPsychologyHandbook()}
              className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                isCosmic
                  ? 'bg-slate-900/80 border-indigo-500/30 text-teal-300 hover:bg-slate-800 hover:border-teal-400'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Download Complete Psychology Handbook"
            >
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>نفسیاتی گائیڈ ڈاؤن لوڈ</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
