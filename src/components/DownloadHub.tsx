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
}

export const DownloadHub: React.FC<DownloadHubProps> = ({ onOpenDownloadModal }) => {
  const { isInstallable, isInstalled, platformName, install } = usePWAInstall();

  const handlePrimaryInstall = async () => {
    if (isInstallable) {
      await install();
    } else {
      onOpenDownloadModal();
    }
  };

  return (
    <section className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-7 shadow-sm text-slate-700 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Information */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100 flex items-center gap-1 shadow-xs">
              <Download className="w-3 h-3 text-sky-600" />
              All Devices Download Center
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-teal-700">
              Your Device: {platformName}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-700 tracking-tight leading-snug">
            Download SereneMind AI to Any Device{' '}
            <span className="text-sky-600 font-light block sm:inline">
              (تمام ڈیوائسز پر ڈاؤن لوڈ کریں)
            </span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Install SereneMind on your <strong>Android phone</strong>, <strong>iPhone / iPad</strong>, <strong>Windows PC</strong>, or <strong>Apple Mac</strong> without visiting external app stores. Instant launch, zero loading delay, and 100% offline support.
          </p>

          {/* Device Badges & Benefits */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 font-semibold">
              <Smartphone className="w-3.5 h-3.5 text-sky-600" />
              Infinix &amp; Android Phone
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
              <Apple className="w-3.5 h-3.5 text-slate-500" />
              iOS Safari Home App
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
              <Laptop className="w-3.5 h-3.5 text-slate-500" />
              Windows 10/11 Desktop
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
              <Apple className="w-3.5 h-3.5 text-slate-500" />
              macOS Dock App
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 font-medium">
              <WifiOff className="w-3.5 h-3.5 text-teal-600" />
              Works Offline
            </span>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <button
            onClick={handlePrimaryInstall}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-teal-300 hover:from-sky-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-200/50 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Download className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            <span>
              {isInstalled
                ? 'App Installed • View Options'
                : 'Download & Install App (تمام ڈیوائسز)'}
            </span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => download432HzAudio(15)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="Download 432 Hz Solfeggio Audio File"
            >
              <Music className="w-3.5 h-3.5 text-sky-600" />
              <span>Offline Audio (.wav)</span>
            </button>

            <button
              onClick={() => downloadPsychologyHandbook()}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="Download Complete Psychology Handbook"
            >
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              <span>Psychology Guide</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
