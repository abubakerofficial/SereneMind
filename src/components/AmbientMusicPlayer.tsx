import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  CloudRain,
  Waves,
  Disc,
  Radio,
  Clock,
  Sliders,
  Headphones,
  Check,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export interface AmbientTrack {
  id: '432hz' | 'singing-bowls' | 'rain' | 'ocean' | 'theta' | 'piano-strings';
  name: string;
  nameUrdu: string;
  description: string;
  frequencyBadge: string;
  qualityBadge: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

export const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: '432hz',
    name: '432 Hz Solfeggio Master Healing',
    nameUrdu: '۴۳۲ ہرٹز شفابخش فریکوئنسی (اسٹوڈیو کوالٹی)',
    description: 'High-definition mathematical healing tone that lowers cortisol and calms the emotional brain.',
    frequencyBadge: '432 Hz Harmonics',
    qualityBadge: 'HD 48kHz / 320kbps',
    icon: Disc,
    accentColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
  },
  {
    id: 'piano-strings',
    name: 'Celestial Ambient Piano & Strings',
    nameUrdu: 'پرسکون پیانو اور اسٹرنگز (ایچ ڈی ساؤنڈ)',
    description: 'Lush, slow ambient piano arpeggios in major pentatonic with celestial shimmering tape decay.',
    frequencyBadge: 'Acoustic Pentatonic',
    qualityBadge: 'Lossless Master',
    icon: Music,
    accentColor: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-300',
  },
  {
    id: 'singing-bowls',
    name: 'Tibetan Singing Bowls & Gongs',
    nameUrdu: 'تبتی باؤلز اور گھنٹیاں (اسٹوڈیو ماسٹر)',
    description: 'Acoustic metal overtone singing bowls oscillating at 136.1 Hz Om for deep meditative trance.',
    frequencyBadge: '136.1 Hz Om',
    qualityBadge: 'HD 24-Bit Depth',
    icon: Sparkles,
    accentColor: 'from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-300',
  },
  {
    id: 'rain',
    name: '3D Spatial Zen Rain & Forest Wind',
    nameUrdu: 'تھری ڈی بارش اور پرسکون ہوائیں',
    description: 'Stereo binaural organic white noise simulating soothing forest rain patter on broad leaves.',
    frequencyBadge: '3D Binaural Noise',
    qualityBadge: 'Dolby Spatial',
    icon: CloudRain,
    accentColor: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-300',
  },
  {
    id: 'ocean',
    name: 'Pacific Ocean Waves & Deep Surf',
    nameUrdu: 'سمندر کی پرسکون لہریں (گہری سانس کی لے)',
    description: 'Gentle 8-second wave cadence that synchronizes naturally with slow abdominal breathing.',
    frequencyBadge: '0.12 Hz Cadence',
    qualityBadge: 'Sub-Bass 40Hz',
    icon: Waves,
    accentColor: 'from-cyan-500/20 to-teal-500/10 border-cyan-500/30 text-cyan-300',
  },
  {
    id: 'theta',
    name: 'Cosmic Theta 4Hz (Binaural Beats)',
    nameUrdu: 'تھیٹا ویوز ذہنی یکسوئی اور سکون',
    description: 'Binaural beats inducing the 4Hz Theta state of deep relaxation and release from rumination.',
    frequencyBadge: '4 Hz Theta Brainwave',
    qualityBadge: 'Binaural Stereo',
    icon: Radio,
    accentColor: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-300',
  },
];

export const AmbientMusicPlayer: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<AmbientTrack>(AMBIENT_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null); // minutes
  const [spatialAudioEnabled, setSpatialAudioEnabled] = useState(true);

  // Equalizer visualizer random height simulation
  const [eqHeights, setEqHeights] = useState<number[]>([
    25, 45, 70, 85, 60, 40, 90, 75, 55, 80, 65, 45, 85, 60, 35, 20,
  ]);

  const timerRef = useRef<any>(null);

  // Handle Play / Pause Toggle
  const handleTogglePlay = (trackToPlay = selectedTrack) => {
    if (isPlaying && selectedTrack.id === trackToPlay.id) {
      soundEngine.stopAmbientSound();
      setIsPlaying(false);
    } else {
      setSelectedTrack(trackToPlay);
      soundEngine.startAmbientSound(trackToPlay.id, volume);
      setIsPlaying(true);
      setElapsedSeconds(0);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    soundEngine.setAmbientVolume(newVol);
  };

  // Elapsed time tracker and Equalizer animation
  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        // Check sleep timer
        if (sleepTimer && next >= sleepTimer * 60) {
          soundEngine.stopAmbientSound();
          setIsPlaying(false);
          return 0;
        }
        return next;
      });

      // Animate 16-band EQ heights
      setEqHeights(
        Array.from({ length: 16 }).map(() => Math.floor(Math.random() * 75) + 20)
      );
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isPlaying, sleepTimer]);

  useEffect(() => {
    return () => {
      soundEngine.stopAmbientSound();
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-stone-900/60 border border-stone-800/90 rounded-3xl p-5 sm:p-7 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with HD Audio Tag */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-950/50">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg text-stone-100 tracking-tight">
                HD Studio Soundscapes &amp; Music
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                ایچ ڈی میوزک
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-stone-900 text-teal-300 border border-stone-800 hidden sm:inline">
                Lossless 320 kbps • 48 kHz
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              High-definition binaural soundscapes, 432 Hz Solfeggio acoustic masters, ambient piano, and Tibetan singing bowls.
            </p>
          </div>
        </div>

        {/* Master Controls & Status */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Spatial Audio Toggle */}
          <button
            onClick={() => setSpatialAudioEnabled(!spatialAudioEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              spatialAudioEnabled
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-stone-900 border-stone-800 text-stone-500'
            }`}
            title="Spatial 3D Audio Dispersion"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3D Spatial</span>
          </button>

          {/* Sleep Timer Preset Selector */}
          <div className="flex items-center gap-1 p-1 bg-stone-950/80 border border-stone-800 rounded-xl text-xs">
            <Clock className="w-3.5 h-3.5 text-stone-500 ml-1.5" />
            {[
              { label: 'Off', val: null },
              { label: '15m', val: 15 },
              { label: '30m', val: 30 },
              { label: '60m', val: 60 },
            ].map((t, idx) => (
              <button
                key={idx}
                onClick={() => setSleepTimer(t.val)}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  sleepTimer === t.val
                    ? 'bg-emerald-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 bg-stone-950/80 border border-stone-800 px-3 py-1.5 rounded-2xl">
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-stone-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 sm:w-24 accent-emerald-400 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              title={`HD Volume: ${Math.round(volume * 100)}%`}
            />
            <span className="text-[11px] font-mono text-stone-400 min-w-[2rem] text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={() => handleTogglePlay(selectedTrack)}
            className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-stone-950 shadow-rose-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause HD Music</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play HD Soundscape</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Studio Now-Playing Banner & Live 16-Band Equalizer Spectrum */}
      <div className="mb-6 p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Disc className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-100">
                {selectedTrack.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-emerald-400 font-mono">
                {selectedTrack.qualityBadge}
              </span>
            </div>
            <p className="text-[11px] text-emerald-400/90 mt-0.5">
              {selectedTrack.nameUrdu} • {selectedTrack.frequencyBadge}
            </p>
          </div>
        </div>

        {/* 16-Band Animated Graphic Equalizer */}
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-1 h-8 px-2 py-1 rounded-lg bg-stone-900/90 border border-stone-800">
            {eqHeights.map((h, i) => (
              <div
                key={i}
                style={{ height: isPlaying ? `${h}%` : '15%' }}
                className={`w-1 rounded-t transition-all duration-300 ${
                  isPlaying
                    ? 'bg-gradient-to-t from-emerald-500 to-teal-300'
                    : 'bg-stone-700'
                }`}
              />
            ))}
          </div>

          {/* Live Timer */}
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-stone-200 block">
              {formatTime(elapsedSeconds)}
            </span>
            <span className="text-[10px] text-stone-500">
              {sleepTimer ? `Sleep in ${sleepTimer}m` : 'Continuous HD'}
            </span>
          </div>
        </div>
      </div>

      {/* HD Track Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {AMBIENT_TRACKS.map((track) => {
          const isCurrent = selectedTrack.id === track.id;
          const isCurrentlyPlayingThis = isPlaying && isCurrent;
          const Icon = track.icon;

          return (
            <button
              key={track.id}
              onClick={() => handleTogglePlay(track)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                isCurrent
                  ? `bg-gradient-to-br ${track.accentColor} shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/40`
                  : 'bg-stone-950/60 border-stone-800/80 hover:border-stone-700 hover:bg-stone-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2.5">
                  <div
                    className={`p-2 rounded-xl border ${
                      isCurrent
                        ? 'bg-stone-900/90 border-emerald-500/40 text-emerald-400'
                        : 'bg-stone-900 border-stone-800 text-stone-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-900/90 text-emerald-300 border border-emerald-500/20 font-mono">
                      {track.qualityBadge}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-stone-900 text-stone-400 border border-stone-800">
                      {track.frequencyBadge}
                    </span>
                  </div>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-stone-100 group-hover:text-emerald-300 transition-colors">
                  {track.name}
                </h4>
                <span className="text-[11px] text-emerald-400/90 block font-medium mt-0.5">
                  {track.nameUrdu}
                </span>

                <p className="text-[11px] text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {track.description}
                </p>
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-800/60 text-[11px] font-semibold">
                {isCurrentlyPlayingThis ? (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Now Playing in HD
                  </span>
                ) : (
                  <span className="text-stone-500 group-hover:text-stone-300 transition-colors flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" /> Play HD Sound
                  </span>
                )}

                <span className="text-[10px] text-stone-500">Lossless</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
