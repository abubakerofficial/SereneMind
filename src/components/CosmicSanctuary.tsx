import React, { useState } from 'react';
import {
  Stars,
  Sparkles,
  Compass,
  Moon,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle2,
  Radio,
  Flame,
  Zap,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface CosmicSanctuaryProps {
  onTriggerShootingStar: () => void;
  isCosmicTheme: boolean;
  onToggleTheme: () => void;
}

export const CosmicSanctuary: React.FC<CosmicSanctuaryProps> = ({
  onTriggerShootingStar,
  isCosmicTheme,
  onToggleTheme,
}) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [wishesCount, setWishesCount] = useState(1);
  const [activeMood, setActiveMood] = useState<'starlight' | 'nebula' | 'golden'>('starlight');

  const handleMakeWish = () => {
    setWishesCount((prev) => prev + 1);
    onTriggerShootingStar();
  };

  const handleToggleSound = () => {
    if (isPlayingSound) {
      soundEngine.stopAmbientSound();
      setIsPlayingSound(false);
    } else {
      soundEngine.startAmbientSound('cosmic-universe', 0.45);
      setIsPlayingSound(true);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-gradient-to-br from-[#0c1236]/90 via-[#121a44]/85 to-[#1a103c]/90 backdrop-blur-xl border border-indigo-400/30 shadow-2xl shadow-indigo-950/60 text-slate-100 transition-all duration-500">
      {/* Dynamic Cosmic Aurora Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header with Title and Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-bold text-cyan-300 flex items-center gap-1.5">
                <Stars className="w-4 h-4 text-amber-300 animate-spin" />
                Cosmic Universe &amp; Living Starfield (کائنات اور چمکتے ستارے)
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-400/40 text-cyan-300 shadow-xs">
                Live Animated Cosmos
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <span>Cosmic Starlight Sanctuary</span>
              <span className="text-sm font-normal text-cyan-300 hidden sm:inline">
                (ستاروں کی حسین کہکشاں)
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              کائنات کے لامحدود سکون کو محسوس کریں۔ متحرک ٹمٹماتے ستارے، جڑتے ہوئے جھرمٹ اور پرسکون کہکشانی لہریں جو ذہنی دباؤ اور وسوسوں کو لمحوں میں تحلیل کر دیتی ہیں۔
            </p>
          </div>

          {/* Theme Mode Toggle Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                isCosmicTheme
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white border-cyan-400/50 shadow-lg shadow-cyan-500/25'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle between Cosmic Universe and Calm Sunrise"
            >
              <Moon className="w-4 h-4 text-amber-300" />
              <span>{isCosmicTheme ? '🌌 کائناتی تھیم فعال ہے (Cosmic)' : '🌅 طلوعِ آفتاب (Sunrise)'}</span>
            </button>
          </div>
        </div>

        {/* Feature Grid: Interactive Star Actions with Colorful Cosmic Distinctness */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Action 1: Make a Starlight Wish (Sapphire & Cyan Glow) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-950/70 via-indigo-950/50 to-slate-900/80 border border-sky-400/35 hover:border-cyan-300 transition-all flex flex-col justify-between space-y-3.5 shadow-lg shadow-sky-950/40 group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>Shooting Star (ٹوٹتا تارا)</span>
              </span>
              <span className="text-[11px] font-mono text-cyan-200 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-400/40">
                {wishesCount} دعائیں / Wishes
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              اپنی سکرین پر روشن ٹوٹتا ہوا تارا چھوڑیں اور کائنات کا پرسکون، خوبصورت پیغام حاصل کریں۔
            </p>
            <button
              onClick={handleMakeWish}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
              <span>تارا چمکائیں / دعا مانگیں (Wish)</span>
            </button>
          </div>

          {/* Action 2: Deep Space 432Hz Sound (Amethyst & Indigo Glow) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-950/70 via-indigo-950/50 to-slate-900/80 border border-purple-400/35 hover:border-purple-300 transition-all flex flex-col justify-between space-y-3.5 shadow-lg shadow-purple-950/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-purple-300" />
                <span>Cosmic 432Hz Drone</span>
              </span>
              <span className="text-[11px] font-mono text-purple-200 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-400/40">
                432Hz Harmonics
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              گہری کائناتی فریکوئنسی سنیں جو دماغی لہروں کو تھیٹا مراقبے کی گہرائیوں میں لے جا کر شانت کرتی ہے۔
            </p>
            <button
              onClick={handleToggleSound}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isPlayingSound
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-md shadow-rose-500/30'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30'
              }`}
            >
              {isPlayingSound ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>آواز بند کریں (Stop Cosmic Sound)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-200" />
                  <span>کائناتی آواز سنیں (Play 432Hz)</span>
                </>
              )}
            </button>
          </div>

          {/* Action 3: Universe Constellation Sync (Teal & Emerald Starlight) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-950/70 via-cyan-950/50 to-slate-900/80 border border-teal-400/35 hover:border-teal-300 transition-all flex flex-col justify-between space-y-3.5 shadow-lg shadow-teal-950/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-200 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-teal-300" />
                <span>Constellation Sync</span>
              </span>
              <span className="text-[11px] font-mono text-teal-200 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-400/40">
                240+ Stars Active
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              اپنی انگلی یا ماؤس کو سکرین پر حرکت دیں، ستارے کششِ ثقل سے جڑ کر حسین جھرمٹ بناتے ہیں۔
            </p>
            <div className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-900/60 to-cyan-900/60 border border-teal-400/30 text-center text-xs text-teal-200 font-semibold shadow-xs">
              ✨ ماؤس یا انگلی گھما کر تارے جوڑیں
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CosmicSanctuary;
