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
    <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-slate-900/80 backdrop-blur-xl border border-indigo-500/25 shadow-2xl shadow-indigo-950/50 text-slate-100 transition-all duration-500">
      {/* Dynamic Cosmic Aurora Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header with Title and Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-bold text-cyan-400 flex items-center gap-1.5">
                <Stars className="w-4 h-4 text-amber-300 animate-spin" />
                Cosmic Universe &amp; Living Starfield (ब्रह्मांड और सितारे)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300">
                Live Animated Cosmos
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <span>Cosmic Starlight Sanctuary</span>
              <span className="text-sm font-normal text-cyan-300 hidden sm:inline">
                (सितारों की दुनिया)
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Experience the infinite peace of the cosmos. Watch twinkling stars, connecting constellations, and drifting nebulae that gently soothe anxiety and dissolve overthinking.
            </p>
          </div>

          {/* Theme Mode Toggle Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                isCosmicTheme
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white border-cyan-400/40 shadow-lg shadow-cyan-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle between Cosmic Universe and Calm Sunrise"
            >
              <Moon className="w-4 h-4 text-amber-300" />
              <span>{isCosmicTheme ? '🌌 Cosmic Active (कॉस्मिक ऑन)' : '🌅 Switch to Cosmos'}</span>
            </button>
          </div>
        </div>

        {/* Feature Grid: Interactive Star Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          {/* Action 1: Make a Starlight Wish */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 hover:border-cyan-400/50 transition-all flex flex-col justify-between space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>Shooting Star (टूटता सितारा)</span>
              </span>
              <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded-full border border-cyan-500/30">
                {wishesCount} Wishes Made
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Launch a brilliant shooting star across your screen and receive a calming mindful affirmation.
            </p>
            <button
              onClick={handleMakeWish}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 hover:from-sky-400 hover:to-purple-400 text-white font-bold text-xs shadow-md shadow-sky-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Make a Wish / Launch Star (विश मांगें)</span>
            </button>
          </div>

          {/* Action 2: Deep Space 432Hz Sound */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 hover:border-cyan-400/50 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>Cosmic 432Hz Drone</span>
              </span>
              <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/70 px-2 py-0.5 rounded-full border border-indigo-500/30">
                432Hz Sub-Harmonics
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Listen to an ethereal interstellar frequency designed to slow brainwaves into relaxed theta meditation.
            </p>
            <button
              onClick={handleToggleSound}
              className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isPlayingSound
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
              }`}
            >
              {isPlayingSound ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Cosmic Sound (آواز بند)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>Play Cosmic Sound (کائناتی آواز)</span>
                </>
              )}
            </button>
          </div>

          {/* Action 3: Universe Breathing & Stargazing Insight */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 hover:border-cyan-400/50 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Constellation Sync</span>
              </span>
              <span className="text-[11px] font-mono text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded-full border border-purple-500/30">
                240+ Stars Active
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Move your mouse or finger across the screen to create gravitational waves that connect the stars.
            </p>
            <div className="py-2 px-3 rounded-xl bg-indigo-900/40 border border-indigo-500/30 text-center text-xs text-cyan-200 font-medium">
              ✨ Move cursor to connect stars
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CosmicSanctuary;
