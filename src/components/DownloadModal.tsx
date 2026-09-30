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
  MoreVertical,
  Check,
  AlertCircle,
  ExternalLink,
  Maximize2,
  Zap,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  download432HzAudio,
  downloadPsychologyHandbook,
  downloadAndroidWebShortcut,
} from '../utils/downloader';
import { SereneMindLogo } from './SereneMindLogo';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'universe' | 'sunrise';
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  theme = 'universe',
}) => {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isInfinix,
    isSamsung,
    isXiaomi,
    isDesktop,
    deviceModel,
    platformName,
    install,
    toggleFullscreen,
    isFullscreen,
    getDeviceGuide,
  } = usePWAInstall();

  const [activeTab, setActiveTab] = useState<'app' | 'media'>('app');
  const [deviceFilter, setDeviceFilter] = useState<'auto' | 'android' | 'ios' | 'windows'>('auto');
  const [audioDownloadProgress, setAudioDownloadProgress] = useState(false);
  const [guideDownloaded, setGuideDownloaded] = useState(false);
  const [shortcutDownloaded, setShortcutDownloaded] = useState(false);
  const [installStatusMessage, setInstallStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Selected device view
  const currentDevice =
    deviceFilter !== 'auto'
      ? deviceFilter
      : isIOS
      ? 'ios'
      : isAndroid || isInfinix || isSamsung || isXiaomi
      ? 'android'
      : isDesktop
      ? 'windows'
      : 'android';

  const guide = getDeviceGuide();

  const handleInstallApp = async () => {
    if (isInstallable) {
      setInstallStatusMessage('انسٹالیشن ڈائیلاگ کھل رہا ہے...');
      const success = await install();
      if (!success) {
        setInstallStatusMessage(
          'کروم یا براؤزر کے اوپر دائیں کونے میں ۳ نقطوں (⋮) پر ٹیپ کریں اور "Install app" یا "Add to Home screen" منتخب کریں۔'
        );
      } else {
        setInstallStatusMessage('مبارک ہو! ایپ کامیابی سے آپ کے فون میں انسٹال ہو گئی ہے۔');
      }
    } else {
      setInstallStatusMessage(
        isIOS
          ? 'آئی فون کے لیے: نیچے شیئر ⎋ دبائیں اور "Add to Home Screen ⊞" منتخب کریں۔'
          : 'براؤزر کے اوپر دائیں کونے میں ۳ نقطوں (⋮) پر کلک کر کے "Install app" یا "Add to Home screen" منتخب کریں۔'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-br from-[#060b1e] via-[#0b153b] to-[#120e2e] border border-cyan-400/40 rounded-3xl max-w-2xl w-full max-h-[92dvh] overflow-y-auto p-4 sm:p-6 text-slate-100 shadow-2xl relative space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-cyan-500/30 transition-colors z-20 cursor-pointer"
          title="بند کریں"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-indigo-400/40 shadow-sm p-1 flex items-center justify-center shrink-0">
            <SereneMindLogo size={38} withContainer={false} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
                خودکار ریل ایپ ڈاؤن لوڈ اور اسکرین فٹنگ
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400/40">
                100% ریل موبائل ایپ
              </span>
            </div>
            <p className="text-xs text-cyan-200/80 mt-0.5">
              آپ کا موبائل: <strong className="text-cyan-300 font-bold">{deviceModel}</strong> ({platformName}) • بغیر براؤزر ونڈو کے خودکار فل اسکرین فٹنگ
            </p>
          </div>
        </div>

        {/* Real App Fitting Guaranteed Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-2xl bg-[#030614]/80 border border-indigo-500/30 text-[11px]">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="font-bold text-slate-200">نو ونڈو ویو</div>
              <div className="text-[9px] text-cyan-300/80">براؤزر فریم کے بغیر</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-slate-200">خودکار فٹنگ</div>
              <div className="text-[9px] text-amber-300/80">نوچ اور کیمرہ پروٹیکشن</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-slate-200">آئی فون و اینڈرائیڈ</div>
              <div className="text-[9px] text-emerald-300/80">تمام برانڈز پر فٹ</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <div className="font-bold text-slate-200">مکمل آف لائن</div>
              <div className="text-[9px] text-sky-300/80">بغیر نیٹ ورک چلے گی</div>
            </div>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-950/80 rounded-2xl border border-indigo-500/30 text-xs">
          <button
            onClick={() => setActiveTab('app')}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'app'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-cyan-300" />
            <span>موبائل میں ریل ایپ ڈاؤن لوڈ کریں</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'media'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/25 border border-teal-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4 text-teal-300" />
            <span>آف لائن آڈیو اور ہینڈ بک</span>
          </button>
        </div>

        {/* TAB 1: INSTALL APP */}
        {activeTab === 'app' && (
          <div className="space-y-4">
            {/* Quick 1-Click Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-indigo-950/50 to-slate-900 border border-cyan-500/35 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-900/60 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>ایک کلک پر اصلی موبائل ایپ بنائیں</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-400/40 font-mono">
                      کوئی پلے اسٹور نہیں چاہیے
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    یہ ایپ خودکار طور پر آپ کے فون کی پوری اسکرین پر فٹ ہو جائے گی، اور براؤزر کا اوپر نیچے کا ونڈو فریم ختم ہو جائے گا۔
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleInstallApp}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4 fill-current" />
                  <span>انسٹال ریل ایپ</span>
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="ابھی فل اسکرین کریں"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{isFullscreen ? 'عام ویو' : 'فل اسکرین'}</span>
                </button>
              </div>
            </div>

            {/* Install Status Feedback Message */}
            {installStatusMessage && (
              <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-xs text-cyan-200 flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{installStatusMessage}</span>
              </div>
            )}

            {/* Platform Selector Buttons */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                ڈیوائس منتخب کریں (یا نیچے دی گئی خودکار گائیڈ دیکھیں):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'android', label: 'اینڈرائیڈ (Infinix, Samsung, Xiaomi)', icon: Smartphone },
                  { id: 'ios', label: 'ایپل آئی فون (iPhone / iPad)', icon: Apple },
                  { id: 'windows', label: 'کمپیوٹر (Windows / Mac)', icon: Laptop },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDeviceFilter(item.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      currentDevice === item.id
                        ? 'bg-cyan-950/80 border-cyan-400/60 text-cyan-300 shadow-md ring-1 ring-cyan-400/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ANDROID / INFINIX / SAMSUNG / XIAOMI GUIDE */}
            {currentDevice === 'android' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#04081c]/90 border border-cyan-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-500/20">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      <Smartphone className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        اینڈرائیڈ موبائلز (انفنکس، سام سنگ، شیاؤمی، ویوو، اوپو)
                      </h4>
                      <p className="text-[11px] text-cyan-300/90">
                        گوگل کروم • سام سنگ انٹرنیٹ • اوپیرا • فینکس
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-semibold self-start sm:self-auto">
                    خودکار ریل ایپ فٹنگ
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900/70 border border-cyan-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <MoreVertical className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>بغیر ونڈو کے اصلی موبائل ایپ بنانے کا گارنٹی شدہ طریقہ:</span>
                  </div>

                  <ol className="space-y-2.5 text-xs text-slate-200 mt-2">
                    <li className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        اپنی اسکرین کے <strong>اوپر دائیں کونے (Top-Right)</strong> میں دیکھیں، وہاں براؤزر کے <strong>3 ڈاٹس ⋮ (Menu)</strong> کا آئیکن موجود ہے۔
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        3 ڈاٹس پر ٹیپ کریں، مینو میں <strong>"Install app" (ایپ انسٹال کریں)</strong> یا <strong>"Add to Home screen" (ہوم اسکرین پر شامل کریں)</strong> منتخب کریں۔
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        <strong>"Install"</strong> کنفرم کریں۔ ایپ فوراً آپ کے موبائل کی ہوم اسکرین پر محفوظ ہو جائے گی اور بغیر کسی براؤزر ونڈو بار کے 100% اصلی ایپ بن جائے گی!
                      </span>
                    </li>
                  </ol>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={handleInstallApp}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Download className="w-4 h-4 fill-current" />
                    <span>کروم ڈائریکٹ انسٹال</span>
                  </button>

                  <button
                    onClick={handleDownloadShortcut}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {shortcutDownloaded ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>شارٹ کٹ فائل ڈاؤن لوڈ ہو گئی!</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 text-cyan-400" />
                        <span>موبائل شارٹ کٹ فائل محفوظ کریں</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* IPHONE / IPAD GUIDE */}
            {currentDevice === 'ios' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#04081c]/90 border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Apple className="w-4 h-4" />
                    ایپل آئی فون اور آئی پیڈ (Apple iOS Safari Guide)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono">
                    آئی فون فل اسکرین فٹنگ
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900/70 border border-cyan-500/20 space-y-2">
                  <div className="text-xs font-bold text-cyan-300">
                    آئی فون میں براؤزر ونڈو ختم کر کے اصلی ریل ایپ بنانے کا طریقہ:
                  </div>

                  <ol className="space-y-2.5 text-xs text-slate-200 mt-2">
                    <li className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        سفاری براؤزر میں سب سے نیچے موجود <strong>شیئر بٹن</strong> (<Share2 className="w-3.5 h-3.5 inline text-cyan-400 mx-1" /> تیر والا باکس) پر کلک کریں۔
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        تھوڑا نیچے سکرول کریں اور <strong>"Add to Home Screen" (ہوم اسکرین پر شامل کریں ⊞)</strong> پر ٹیپ کریں۔
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        اوپر دائیں طرف <strong>"Add"</strong> دبائیں۔ ایپ فوری طور پر آپ کے آئی فون کی اسکرین پر آ جائے گی، اور نوچ / ڈائنامک آئی لینڈ کے مطابق خودکار فل اسکرین سیٹ ہو جائے گی!
                      </span>
                    </li>
                  </ol>
                </div>

                <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-cyan-200/90 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span>آئی فون میں ہوم اسکرین پر ایڈ کرنے کے بعد یہ بالکل اصلی ایپ اسٹور والی ایپ کی طرح بغیر سفاری بار کے چلتی ہے۔</span>
                </div>
              </div>
            )}

            {/* WINDOWS PC / MAC GUIDE */}
            {currentDevice === 'windows' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#04081c]/90 border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Laptop className="w-4 h-4" />
                    کمپیوٹر اور لیپ ٹاپ انسٹالیشن (Windows PC / Mac)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono">
                    ڈیسک ٹاپ ایپ
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  کروم یا مائیکروسافٹ ایج براؤزر کے اوپر یو آر ایل بار کے دائیں جانب <strong>انسٹال آئیکن (⊕ یا ڈیسک ٹاپ ڈاؤن لوڈ)</strong> پر کلک کریں، یا مینو میں "Install SereneMind" دبائیں۔ یہ ونڈوز ٹاسک بار اور اسٹارٹ مینو میں اصلی ونڈوز ایپ بن جائے گی۔
                </p>

                <button
                  onClick={handleInstallApp}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 fill-current" />
                  <span>پی سی پر انسٹال کریں</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: OFFLINE AUDIO & HANDBOOK DOWNLOAD */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#04081c]/90 border border-teal-500/30 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-500/40 flex items-center justify-center shrink-0">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    432Hz ہائی ڈیفینیشن مراقبہ آڈیو (Master Audio)
                  </h4>
                  <p className="text-xs text-teal-200/80">
                    15 منٹ کا پرسکون ساؤنڈ ٹریک، اضطراب اور اوور تھنکنگ کے فوری علاج کے لیے
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownloadAudio}
                disabled={audioDownloadProgress}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 fill-current" />
                <span>{audioDownloadProgress ? 'ڈاؤن لوڈ ہو رہا ہے...' : '432Hz آڈیو فائل ڈاؤن لوڈ کریں (.wav)'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#04081c]/90 border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    نفسیاتی رہنمائی کی کتابچہ (CBT Mindfulness Guide)
                  </h4>
                  <p className="text-xs text-indigo-200/80">
                    اوور تھنکنگ، اضطراب اور ذہنی سکون کے سائنسی اصولوں پر مبنی مکمل گائیڈ
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownloadGuide}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {guideDownloaded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>کتابچہ ڈاؤن لوڈ ہو گیا!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>پی ڈی ایف گائیڈ ڈاؤن لوڈ کریں</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer Note */}
        <div className="text-[11px] text-center text-slate-400 pt-2 border-t border-indigo-500/20">
          ✓ کسی بھی موبائل (آئی فون، اینڈرائیڈ، انفنکس، سام سنگ) میں خودکار طور پر بغیر براؤزر ونڈو کے فل اسکرین چلے گی۔
        </div>
      </div>
    </div>
  );
};
