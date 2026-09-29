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
  Shield,
  Layers,
  HelpCircle,
  MoreVertical,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  download432HzAudio,
  downloadPsychologyHandbook,
  downloadAndroidWebShortcut,
} from '../utils/downloader';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isInfinix,
    isDesktop,
    platformName,
    install,
  } = usePWAInstall();

  const [activeTab, setActiveTab] = useState<'app' | 'media'>('app');
  const [deviceFilter, setDeviceFilter] = useState<'auto' | 'android' | 'ios' | 'windows' | 'mac'>('auto');
  const [audioDownloadProgress, setAudioDownloadProgress] = useState(false);
  const [guideDownloaded, setGuideDownloaded] = useState(false);
  const [shortcutDownloaded, setShortcutDownloaded] = useState(false);
  const [installStatusMessage, setInstallStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isMobileScreen = typeof window !== 'undefined' ? window.innerWidth <= 850 : false;
  const hasTouch = typeof window !== 'undefined' ? 'ontouchstart' in window : false;

  // Determine current device: ALWAYS default to android on phones, touch devices, or Infinix!
  const currentDevice =
    deviceFilter !== 'auto'
      ? deviceFilter
      : isIOS
      ? 'ios'
      : isAndroid || isInfinix || isMobileScreen || hasTouch
      ? 'android'
      : isDesktop
      ? 'windows'
      : 'android';

  const handleInstallApp = async () => {
    if (isInstallable) {
      setInstallStatusMessage('Opening Chrome install dialog...');
      const success = await install();
      if (!success) {
        setInstallStatusMessage(
          'Please tap the 3 dots (⋮) in the top-right corner of Chrome and select "Install app" or "Add to Home screen".'
        );
      } else {
        setInstallStatusMessage('App installed successfully!');
      }
    } else {
      setInstallStatusMessage(
        'Chrome install prompt: Tap the 3 dots (⋮) at the top-right of your screen and select "Install app" (ایپ انسٹال کریں).'
      );
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

  const handleDownloadShortcut = () => {
    setShortcutDownloaded(true);
    downloadAndroidWebShortcut();
    setTimeout(() => setShortcutDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/90 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full max-h-[94vh] overflow-y-auto p-4 sm:p-7 text-stone-100 shadow-2xl relative space-y-4 sm:space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-stone-800 hover:bg-stone-750 text-stone-400 hover:text-stone-100 transition-colors z-20"
          title="Close Download Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-xl font-bold text-stone-100 tracking-tight">
                Download Center (تمام ڈیوائسز کے لیے ڈاؤن لوڈ)
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                Infinix &amp; All Mobile Fixed
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Current Device: <strong className="text-emerald-400 font-bold">{platformName}</strong> • Direct install for Infinix, Tecno, Samsung, iOS &amp; PC.
            </p>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex items-center gap-2 p-1 bg-stone-950/80 rounded-2xl border border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('app')}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'app'
                ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Install App on Phone / PC (ایپ ڈاؤن لوڈ کریں)</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
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
        {/* TAB 1: INSTALL APP ON MOBILE & DESKTOP */}
        {/* ========================================================================= */}
        {activeTab === 'app' && (
          <div className="space-y-4">
            {/* Quick 1-Click Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-stone-900 to-teal-950/80 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-100 flex items-center gap-2">
                    <span>1-Click App Installation</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono">
                      No Play Store Required
                    </span>
                  </h4>
                  <p className="text-[11px] text-stone-300">
                    Installs directly to your home screen with offline support and zero storage burden.
                  </p>
                </div>
              </div>

              <button
                onClick={handleInstallApp}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4 fill-current" />
                <span>Download &amp; Install Now</span>
              </button>
            </div>

            {/* Install Status Feedback Message (if user clicked) */}
            {installStatusMessage && (
              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{installStatusMessage}</span>
              </div>
            )}

            {/* Platform Selector Buttons (Android is FIRST & SELECTED) */}
            <div>
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
                Select Your Device Platform (ڈیوائس کا انتخاب کریں):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'android', label: 'Android (Infinix etc.)', icon: Smartphone },
                  { id: 'ios', label: 'iPhone / iPad', icon: Apple },
                  { id: 'windows', label: 'Windows PC', icon: Laptop },
                  { id: 'mac', label: 'Apple Mac', icon: Apple },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDeviceFilter(item.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      currentDevice === item.id
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* ANDROID / INFINIX INSTRUCTIONS (FIRST & COMPREHENSIVE) */}
            {/* ========================================================================= */}
            {currentDevice === 'android' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/90 border border-emerald-500/30 space-y-4">
                {/* Device Title Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      <Smartphone className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-100">
                        Infinix Hot 40 &amp; All Android Phones (انفینکس اور تمام اینڈرائیڈ)
                      </h4>
                      <p className="text-[11px] text-emerald-400/90">
                        Google Chrome • Samsung Internet • Phoenix • Opera
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold self-start sm:self-auto">
                    Direct 10-Second Method
                  </span>
                </div>

                {/* VISUAL STEP 1: Point to 3 dots right on their screen! */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-stone-900 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <MoreVertical className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>کروم میں ڈاؤن لوڈ کرنے کا سب سے آسان اور گارنٹیڈ طریقہ:</span>
                  </div>

                  <ol className="space-y-2.5 text-xs text-stone-200 mt-2">
                    <li className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        اپنی اسکرین کے <strong>سب سے اوپر دائیں کونے (Top-Right)</strong> میں دیکھیں، وہاں کروم کے <strong>3 ڈاٹس ⋮ (Menu)</strong> کا آئیکن موجود ہے (جیسا کہ آپ کی تصویر میں [2] ٹیب کے ساتھ نظر آ رہا ہے)۔
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        3 ڈاٹس پر ٹیپ کریں، مینو میں <strong>"Install app" (ایپ انسٹال کریں)</strong> یا <strong>"Add to Home screen" (ہوم اسکرین پر شامل کریں)</strong> پر کلک کریں۔
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        <strong>"Install"</strong> کنفرم کریں۔ ایپ فوراً آپ کے انفینکس فون کی ہوم اسکرین اور ایپس مینو میں محفوظ ہو جائے گی اور بغیر براؤزر بار کے فل اسکرین چلے گی!
                      </span>
                    </li>
                  </ol>
                </div>

                {/* DESKTOP SITE WARNING (Common Infinix Issue) */}
                <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800 text-[11px] text-stone-300 flex items-start gap-2">
                  <span className="text-amber-400 font-bold text-base leading-none">💡</span>
                  <div>
                    <strong className="text-stone-100">اہم رہنمائی برائے انفینکس فون:</strong> اگر آپ کے کروم میں 3 ڈاٹس کے مینو کے اندر <strong>"Desktop site"</strong> کے آگے ٹک (✓) لگا ہوا ہے، تو اس پر کلک کر کے اسے بند (Uncheck) کریں۔ اس کے بعد موبائل انسٹال کا بٹن فوراً کام کرے گا۔
                  </div>
                </div>

                {/* Direct Action Buttons for Android */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={handleInstallApp}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 fill-current" />
                    <span>Try Direct Chrome Install</span>
                  </button>

                  <button
                    onClick={handleDownloadShortcut}
                    className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-100 font-bold text-xs border border-stone-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {shortcutDownloaded ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Downloaded to Phone!</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 text-emerald-400" />
                        <span>Download Mobile Shortcut File</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* IPHONE / IPAD INSTRUCTIONS */}
            {/* ========================================================================= */}
            {currentDevice === 'ios' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/90 border border-stone-800 space-y-3.5">
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
                      Safari browser ke neechay toolbar mein <strong>Share Button</strong> (<Share2 className="w-3.5 h-3.5 inline text-emerald-400 mx-1" /> box with arrow) par tap karein.
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
                      Top-right mein <strong>"Add"</strong> dabayein. App iPhone par standalone save ho jayegi!
                    </span>
                  </li>
                </ol>
              </div>
            )}

            {/* ========================================================================= */}
            {/* WINDOWS PC INSTRUCTIONS */}
            {/* ========================================================================= */}
            {currentDevice === 'windows' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/90 border border-stone-800 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Laptop className="w-4 h-4" />
                    Windows 10 / 11 PC Desktop Installation
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400 font-mono">
                    Windows Desktop App
                  </span>
                </div>

                <ol className="space-y-2 text-xs text-stone-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Google Chrome ya Edge mein address bar ke daayein taraf <strong>Install icon (🖥️ / ⊕)</strong> dabayein.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Popup mein <strong>"Install"</strong> confirm karein.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Aapke Windows Desktop aur Start Menu par SereneMind AI ka shortcut ban jayega!
                    </span>
                  </li>
                </ol>

                <button
                  onClick={handleInstallApp}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 fill-current" />
                  <span>Install on Windows Desktop</span>
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* MAC INSTRUCTIONS */}
            {/* ========================================================================= */}
            {currentDevice === 'mac' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/90 border border-stone-800 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Apple className="w-4 h-4" />
                    Apple Mac (macOS Dock Application)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400 font-mono">
                    Mac Standalone
                  </span>
                </div>

                <ol className="space-y-2 text-xs text-stone-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      <strong>Safari mein:</strong> File menu &rarr; <strong>"Add to Dock..."</strong> par click karein.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      <strong>Chrome mein:</strong> URL bar mein Install icon dabayein ya 3 dots &rarr; "Install SereneMind".
                    </span>
                  </li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: OFFLINE AUDIO & GUIDE FILES */}
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
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
                  className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-100 font-bold text-xs transition-all border border-stone-700 flex items-center justify-center gap-2 cursor-pointer"
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
