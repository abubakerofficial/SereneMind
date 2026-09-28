import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export interface AmbientTrack {
  id: '432hz' | 'singing-bowls' | 'rain' | 'ocean' | 'theta';
  name: string;
  nameUrdu: string;
  description: string;
  frequencyBadge: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

export const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: '432hz',
    name: '432 Hz Solfeggio Healing',
    nameUrdu: '۴۳۲ ہرٹز شفابخش فریکوئنسی',
    description: 'Natural mathematical healing tone that lowers heart rate and calms the emotional brain.',
    frequencyBadge: '432 Hz Resonance',
    icon: Disc,
    accentColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
  },
  {
    id: 'singing-bowls',
    name: 'Tibetan Singing Bowls',
    nameUrdu: 'تبتی باؤلز اور گھنٹیاں',
    description: 'Acoustic metal overtone singing bowls oscillating at 136.1 Hz for profound meditation.',
    frequencyBadge: '136.1 Hz Om',
    icon: Sparkles,
    accentColor: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-300',
  },
  {
    id: 'rain',
    name: 'Gentle Zen Rain & Wind',
    nameUrdu: 'پرسکون بارش اور ہوا',
    description: 'Organic filtered white noise simulating soothing forest rain patter on leaves.',
    frequencyBadge: 'Pink Noise Calmer',
    icon: CloudRain,
    accentColor: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-300',
  },
  {
    id: 'ocean',
    name: 'Ocean Waves & Tide Swell',
    nameUrdu: 'سمندر کی پرسکون لہریں',
    description: 'Gentle 8-second wave cadence that synchronizes naturally with slow abdominal breathing.',
    frequencyBadge: '0.12 Hz Cadence',
    icon: Waves,
    accentColor: 'from-cyan-500/20 to-teal-500/10 border-cyan-500/30 text-cyan-300',
  },
  {
    id: 'theta',
    name: 'Theta 4Hz Deep Stillness',
    nameUrdu: 'تھیٹا ویوز ذہنی یکسوئی',
    description: 'Binaural beats inducing the 4Hz Theta state of deep relaxation and release from rumination.',
    frequencyBadge: '4 Hz Theta Brainwave',
    icon: Radio,
    accentColor: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-300',
  },
];

interface AmbientMusicPlayerProps {
  onTrackChange?: (trackId: string) => void;
}

export const AmbientMusicPlayer: React.FC<AmbientMusicPlayerProps> = () => {
  const [selectedTrack, setSelectedTrack] = useState<AmbientTrack>(AMBIENT_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);

  const handleTogglePlay = (trackToPlay = selectedTrack) => {
    if (isPlaying && selectedTrack.id === trackToPlay.id) {
      soundEngine.stopAmbientSound();
      setIsPlaying(false);
    } else {
      setSelectedTrack(trackToPlay);
      soundEngine.startAmbientSound(trackToPlay.id, volume);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    soundEngine.setAmbientVolume(newVol);
  };

  useEffect(() => {
    return () => {
      soundEngine.stopAmbientSound();
    };
  }, []);

  return (
    <div className="bg-stone-900/60 border border-stone-800/90 rounded-3xl p-5 sm:p-7 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800/80 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-950/50">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg text-stone-100 tracking-tight">
                Calming Soundscapes &amp; Music
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                پرسکون موسیقی
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Web Audio synthesized ambient frequencies, Tibetan bowls, and nature sounds.
            </p>
          </div>
        </div>

        {/* Volume & Master Play Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-stone-950/70 border border-stone-800 px-3 py-1.5 rounded-2xl">
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
              title={`Volume: ${Math.round(volume * 100)}%`}
            />
          </div>

          <button
            onClick={() => handleTogglePlay(selectedTrack)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-stone-950 shadow-rose-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Music</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Soundscape</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Track Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {AMBIENT_TRACKS.map((track) => {
          const isCurrent = selectedTrack.id === track.id;
          const isCurrentlyPlayingThis = isPlaying && isCurrent;
          const Icon = track.icon;

          return (
            <button
              key={track.id}
              onClick={() => handleTogglePlay(track)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                isCurrent
                  ? `bg-gradient-to-br ${track.accentColor} shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/40`
                  : 'bg-stone-950/60 border-stone-800/80 hover:border-stone-700 hover:bg-stone-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div
                    className={`p-1.5 rounded-xl border ${
                      isCurrent
                        ? 'bg-stone-900/90 border-emerald-500/40 text-emerald-400'
                        : 'bg-stone-900 border-stone-800 text-stone-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-stone-900/80 text-stone-300 border border-stone-800">
                    {track.frequencyBadge}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-stone-100 group-hover:text-emerald-300 transition-colors">
                  {track.name}
                </h4>
                <span className="text-[10px] text-emerald-400/90 block font-medium mt-0.5">
                  {track.nameUrdu}
                </span>

                <p className="text-[11px] text-stone-400 mt-1 line-clamp-2 leading-tight">
                  {track.description}
                </p>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-1.5 pt-2.5 mt-2 border-t border-stone-800/60 text-[11px] font-semibold">
                {isCurrentlyPlayingThis ? (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Now Playing
                  </span>
                ) : (
                  <span className="text-stone-500 group-hover:text-stone-300 transition-colors flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" /> Tap to Play
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
