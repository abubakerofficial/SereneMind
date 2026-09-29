import React, { useState } from 'react';
import {
  Download,
  X,
  Smartphone,
  Laptop,
  Apple,
  Share2,
  CheckCircle2,
  Music,
  FileText,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { download432HzAudio, downloadPsychologyHandbook } from '../utils/downloader';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isDesktop, platformName, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'app' | 'media'>('app');
  const [deviceFilter, setDeviceFilter] = useState<'auto' | 'android' | 'ios' | 'windows' | 'mac'>('auto');
  const [audioDownloadProgress, setAudioDownloadProgress] = useState(false);
  const [guideDownloaded, setGuideDownloaded] = useState(false);

  if (!isOpen) return null;

  // Determine which device instruction to highlight
  const currentDevice =
    deviceFilter !== 'auto'
      ? deviceFilter
      : isAndroid
      ? 'android'
      : isIOS
      ? 'ios'
      : isDesktop
      ? 'windows'
      : 'android';

  const handleInstallApp = async () => {
    if (isInstallable) {
      await install();
    }
  };

  const handleDownloadAudio = () => {
    setAudioDownloadProgress(true);
    setTimeout(() => {
      download432HzAudio(15, 'SereneMind-432Hz-Master-Audio.wav');
      setAudioDownloadProgress(false);
    }, 400);
  };

  const handleDownloadGuide = () => {
    setGuideDownloaded(true);
    downloadPsychologyHandbook();
    setTimeout(() => setGuideDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 text-stone-100 shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-stone-800/80 hover:bg-stone-750 text-stone-400 hover:text-stone-100 transition-colors z-20"
          title="Close Download Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-stone-100 tracking-tight">
                Download Center (تمام ڈیوائسز کے لیے ڈاؤن لوڈ)
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                All Devices Supported
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Detected Device: <strong className="text-emerald-400">{platformName}</strong> • Works on Android, iPhone/iPad, Windows PC &amp; Mac.
            </p>
          </div>
        </div>

        {/* Main Category Switcher */}
        <div className="flex items-center gap-2 p-1 bg-stone-950/80 rounded-2xl border border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('app')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'app'
                ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Install App on Any Device (ایپ ڈاؤن لوڈ کریں)</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'media'
                ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Offline Audio &amp; Guide (آف لائن فائلز)</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: INSTALL APP ON ALL DEVICES */}
        {/* ========================================================================= */}
        {activeTab === 'app' && (
          <div className="space-y-4">
            {/* Quick 1-Click Install Banner (if browser supports beforeinstallprompt) */}
            {isInstallable && !isInstalled && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-stone-900 to-teal-950/70 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-100">
                      1-Click Native App Install Ready!
                    </h4>
                    <p className="text-[11px] text-stone-300">
                      Your browser supports instant installation to your home screen or desktop.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleInstallApp}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download &amp; Install Now</span>
                </button>
              </div>
            )}

            {isInstalled && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>App Already Installed on this Device!</span>
                </div>
                <p className="text-xs text-stone-300">
                  You are enjoying SereneMind in standalone app mode with full offline caching.
                </p>
              </div>
            )}

            {/* Device Selector Tabs */}
            <div>
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
                Choose Your Device Platform (اپنی ڈیوائس کا انتخاب کریں):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'android', label: 'Android Phone', icon: Smartphone },
                  { id: 'ios', label: 'iPhone / iPad', icon: Apple },
                  { id: 'windows', label: 'Windows PC', icon: Laptop },
                  { id: 'mac', label: 'Apple Mac', icon: Apple },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDeviceFilter(item.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      currentDevice === item.id
                        ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Device Instructions Box */}
            <div className="p-5 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-3.5">
              {/* ANDROID INSTRUCTIONS */}
              {currentDevice === 'android' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4" />
                      Android Installation Guide (گوگل کروم / سام سنگ انٹرنیٹ)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400 font-mono">
                      No Google Play Required
                    </span>
                  </div>

                  <ol className="space-y-2 text-xs text-stone-300">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Chrome Browser mein ooper daayein (top-right) <strong>3 dots ⋮ (Menu)</strong> par tap karein.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Menu mein <strong>"Install app"</strong> ya <strong>"Add to Home screen" (ہوم اسکرین پر شامل کریں)</strong> par click karein.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        App foran aapke mobile ki home screen aur app drawer mein install ho jayegi aur bina browser bar ke full screen chale gi!
                      </span>
                    </li>
                  </ol>

                  {isInstallable && (
                    <button
                      onClick={handleInstallApp}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Direct Android Install Button</span>
                    </button>
                  )}
                </div>
              )}

              {/* IOS / IPHONE INSTRUCTIONS */}
              {currentDevice === 'ios' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Apple className="w-4 h-4" />
                      iPhone &amp; iPad Installation Guide (Safari Browser)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400 font-mono">
                      iOS Safari PWA
                    </span>
                  </div>

                  <ol className="space-y-2 text-xs text-stone-300">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Safari browser ke neechay toolbar mein <strong>Share Button</strong> (<Share2 className="w-3.5 h-3.5 inline text-emerald-400 mx-1" /> box with arrow pointing up) par tap karein.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Neechay scroll karein aur <strong>"Add to Home Screen" (+)</strong> par tap karein.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        Top-right mein <strong>"Add"</strong> dabayein. App iPhone ki home screen par regular iOS app ki tarah save ho jayegi!
                      </span>
                    </li>
                  </ol>
                </div>
              )}

              {/* WINDOWS PC INSTRUCTIONS */}
              {currentDevice === 'windows' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Laptop className="w-4 h-4" />
                      Windows 10 / 11 Desktop Installation (Chrome / Edge)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400 font-mono">
                      Desktop Standalone
                    </span>
                  </div>

                  <ol className="space-y-2 text-xs text-stone-300">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Google Chrome ya Microsoft Edge ke URL address bar ke bilkul daayein (right) taraf <strong>Install icon (🖥️ / ⊕)</strong> par click karein.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Popup mein <strong>"Install SereneMind AI"</strong> confirm karein.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        Aapke Windows Desktop aur Start Menu mein SereneMind ka icon ban jayega jo seedha native window mein open hoga!
                      </span>
                    </li>
                  </ol>

                  {isInstallable && (
                    <button
                      onClick={handleInstallApp}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Install on Windows Desktop</span>
                    </button>
                  )}
                </div>
              )}

              {/* MAC INSTRUCTIONS */}
              {currentDevice === 'mac' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Apple className="w-4 h-4" />
                      Apple Mac (macOS Sonoma / Ventura / Monterey)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400 font-mono">
                      Mac Dock App
                    </span>
                  </div>

                  <ol className="space-y-2 text-xs text-stone-300">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        <strong>Safari mein:</strong> File menu par click karein &rarr; <strong>"Add to Dock..."</strong> select karein.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        <strong>Chrome mein:</strong> URL bar mein <strong>Install</strong> icon dabayein ya 3 dots &rarr; "Save and Share" &rarr; "Install SereneMind".
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        SereneMind aapke Mac Dock aur Launchpad mein standalone Mac application ki tarah run hogi!
                      </span>
                    </li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: OFFLINE AUDIO & GUIDE FILES DOWNLOAD */}
        {/* ========================================================================= */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-300">
              Aap internet ke baghair bhi dimaaghi sukoon aur psychology guidance hasil karne ke liye yeh files kisi bhi device par direct download kar sakte hain:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 432 Hz Master Audio Download */}
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/20">
                      <Music className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-900 text-teal-300 border border-stone-800">
                      HD Lossless WAV
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-stone-100">
                    432 Hz Solfeggio Healing Audio
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                    Pure acoustic 432 Hz harmonic frequencies with subharmonic resonance. Offline meditation aur neend ke liye ideal.
                  </p>
                </div>

                <button
                  onClick={handleDownloadAudio}
                  disabled={audioDownloadProgress}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {audioDownloadProgress ? 'Generating HD Audio...' : 'Download 432 Hz Audio (.wav)'}
                  </span>
                </button>
              </div>

              {/* Psychology & Mindfulness Handbook Download */}
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/20">
                      <FileText className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-900 text-teal-300 border border-stone-800">
                      Complete Handbook
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-stone-100">
                    Psychology &amp; Mindfulness Handbook
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                    4-7-8 breathing rules, CBT cognitive reframe guide, Polyvagal theory notes, and book summaries in offline format.
                  </p>
                </div>

                <button
                  onClick={handleDownloadGuide}
                  className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs transition-all border border-stone-700 flex items-center justify-center gap-2"
                >
                  {guideDownloaded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Downloaded Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Download Offline Guide (.txt)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-3 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-stone-400 text-[11px]">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            100% Free, Safe, &amp; Private • No Ads or Trackers
          </span>
          <span className="text-stone-500">
            Crafted by Abubakar &amp; Mohsin
          </span>
        </div>
      </div>
    </div>
  );
};
