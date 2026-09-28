import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { BreathingPatternConfig } from '../types';

const BREATH_PATTERNS: BreathingPatternConfig[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Deep Calm',
    description: 'Relaxes the nervous system & quiets racing thoughts',
    inhale: 4,
    hold: 7,
    exhale: 8,
    holdPost: 0,
    cycles: 4,
    benefits: 'Activates vagus nerve, ideal for acute overthinking & sleep preparation.',
  },
  {
    id: 'box',
    name: 'Box Breathing (4-4-4-4)',
    description: 'Stabilizes adrenaline & clears mental fog',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdPost: 4,
    cycles: 4,
    benefits: 'Used by mindfulness masters & performers to reset focus immediately.',
  },
  {
    id: 'calm',
    name: 'Soothing Flow (4-6)',
    description: 'Gentle cadence to lower heart rate effortlessly',
    inhale: 4,
    hold: 0,
    exhale: 6,
    holdPost: 0,
    cycles: 5,
    benefits: 'Quick 1-minute reset between stressful meetings or tasks.',
  },
];

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'holdPost' | 'ready' | 'completed';

interface BreathingExerciseProps {
  onClose?: () => void;
  initialPattern?: '4-7-8' | 'box' | 'calm';
  embedded?: boolean;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  onClose,
  initialPattern = '4-7-8',
  embedded = false,
}) => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPatternConfig>(() => {
    return BREATH_PATTERNS.find((p) => p.id === initialPattern) || BREATH_PATTERNS[0];
  });

  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('ready');
  const [secondsRemaining, setSecondsRemaining] = useState(selectedPattern.inhale);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<any>(null);

  // Update seconds when pattern changes while not active
  useEffect(() => {
    if (!isActive) {
      setSecondsRemaining(selectedPattern.inhale);
      setPhase('ready');
      setCurrentCycle(1);
    }
  }, [selectedPattern, isActive]);

  // Main breath loop
  useEffect(() => {
    if (!isActive) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Phase Transition
        let nextPhase: BreathPhase = phase;
        let nextDuration = 4;

        if (phase === 'ready' || phase === 'exhale' || phase === 'holdPost') {
          // Check if cycle is complete
          if (phase === 'exhale' && selectedPattern.holdPost === 0) {
            if (currentCycle >= selectedPattern.cycles) {
              setIsActive(false);
              setPhase('completed');
              if (soundEnabled) soundEngine.playCalmChime('finish');
              return 0;
            } else {
              setCurrentCycle((c) => c + 1);
            }
          } else if (phase === 'holdPost') {
            if (currentCycle >= selectedPattern.cycles) {
              setIsActive(false);
              setPhase('completed');
              if (soundEnabled) soundEngine.playCalmChime('finish');
              return 0;
            } else {
              setCurrentCycle((c) => c + 1);
            }
          }

          nextPhase = 'inhale';
          nextDuration = selectedPattern.inhale;
          if (soundEnabled) soundEngine.playCalmChime('inhale');
        } else if (phase === 'inhale') {
          if (selectedPattern.hold > 0) {
            nextPhase = 'hold';
            nextDuration = selectedPattern.hold;
            if (soundEnabled) soundEngine.playCalmChime('hold');
          } else {
            nextPhase = 'exhale';
            nextDuration = selectedPattern.exhale;
            if (soundEnabled) soundEngine.playCalmChime('exhale');
          }
        } else if (phase === 'hold') {
          nextPhase = 'exhale';
          nextDuration = selectedPattern.exhale;
          if (soundEnabled) soundEngine.playCalmChime('exhale');
        }

        setPhase(nextPhase);
        return nextDuration;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isActive, phase, selectedPattern, currentCycle, soundEnabled]);

  const handleStartPause = () => {
    if (phase === 'completed') {
      setCurrentCycle(1);
      setPhase('ready');
      setSecondsRemaining(selectedPattern.inhale);
      setIsActive(true);
      return;
    }

    if (isActive) {
      setIsActive(false);
    } else {
      if (phase === 'ready') {
        setPhase('inhale');
        setSecondsRemaining(selectedPattern.inhale);
        if (soundEnabled) soundEngine.playCalmChime('inhale');
      }
      setIsActive(true);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('ready');
    setSecondsRemaining(selectedPattern.inhale);
    setCurrentCycle(1);
  };

  // Get orb scale and instruction
  const getOrbState = () => {
    switch (phase) {
      case 'inhale':
        return {
          scale: 'scale-125 transition-transform duration-[4000ms] ease-out',
          color: 'from-emerald-400/30 to-teal-500/20 border-teal-400/50 shadow-teal-500/20',
          title: 'Inhale gently through nose',
          subtitle: 'Fill your lower belly, expanding with calm',
        };
      case 'hold':
        return {
          scale: 'scale-125 transition-transform duration-500 ease-in-out',
          color: 'from-sky-400/30 to-indigo-500/20 border-sky-400/50 shadow-sky-500/20',
          title: 'Hold softly...',
          subtitle: 'Notice the stillness inside you',
        };
      case 'exhale':
        return {
          scale: 'scale-75 transition-transform duration-[6000ms] ease-in-out',
          color: 'from-amber-400/20 to-emerald-400/20 border-emerald-400/40 shadow-emerald-400/10',
          title: 'Release completely through mouth',
          subtitle: 'Let your shoulders drop and thoughts dissolve',
        };
      case 'holdPost':
        return {
          scale: 'scale-75 transition-transform duration-500 ease-in-out',
          color: 'from-slate-400/20 to-teal-400/20 border-slate-400/40 shadow-slate-400/10',
          title: 'Rest in pause...',
          subtitle: 'Empty and free of tension',
        };
      case 'completed':
        return {
          scale: 'scale-100 transition-transform duration-700 ease-out',
          color: 'from-emerald-400/30 to-teal-400/30 border-emerald-400/60 shadow-emerald-500/30',
          title: 'Cycle Complete',
          subtitle: 'Bask in this renewed clarity and peace',
        };
      default:
        return {
          scale: 'scale-100 transition-transform duration-700 ease-out',
          color: 'from-teal-400/20 to-emerald-400/20 border-teal-400/30 shadow-teal-500/10',
          title: 'Ready to center',
          subtitle: 'Press start to begin breath cadence',
        };
    }
  };

  const orb = getOrbState();

  const content = (
    <div className={`relative w-full ${embedded ? 'max-w-2xl' : 'max-w-lg'} bg-stone-900/95 border border-emerald-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 flex flex-col items-center overflow-hidden backdrop-blur-md`}>
      {/* Ambient background glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-stone-800 z-10">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-100 text-base sm:text-lg">Mindful Breath Oasis</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                سانسوں کی پریکٹس
              </span>
            </div>
            <p className="text-xs text-stone-400">Step-by-step vagus nerve reset &amp; acute overthinking relief</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute ambient chime' : 'Unmute ambient chime'}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-300 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          {!embedded && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Pattern Selector Tabs */}
      <div className="w-full flex gap-1.5 p-1 my-5 bg-stone-950/70 rounded-2xl border border-stone-800 z-10">
        {BREATH_PATTERNS.map((pattern) => {
          const isSelected = selectedPattern.id === pattern.id;
          return (
            <button
              key={pattern.id}
              onClick={() => {
                setSelectedPattern(pattern);
                setIsActive(false);
                setPhase('ready');
                setCurrentCycle(1);
                setSecondsRemaining(pattern.inhale);
              }}
              className={`flex-1 py-2 px-2 text-xs font-semibold rounded-xl transition-all ${
                isSelected
                  ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
              }`}
            >
              {pattern.name.split(' ')[0]} {pattern.id === '4-7-8' ? '(Deep Calm)' : ''}
            </button>
          );
        })}
      </div>

      {/* Central Breathing Orb */}
      <div className="relative my-6 sm:my-8 flex items-center justify-center w-60 h-60 sm:w-64 sm:h-64 z-10">
        {/* Outer Pulsing Aura */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${orb.color} blur-xl opacity-60 transition-all ${orb.scale}`}
        />

        {/* Main Breathing Orb */}
        <div
          className={`relative w-44 h-44 sm:w-48 sm:h-48 rounded-full border-2 bg-stone-900/80 flex flex-col items-center justify-center shadow-lg transition-all ${orb.scale} ${orb.color}`}
        >
          {phase === 'completed' ? (
            <div className="flex flex-col items-center text-center p-3 animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-1" />
              <span className="text-sm font-semibold text-emerald-200">Refreshed</span>
            </div>
          ) : (
            <>
              <span className="text-4xl font-light tracking-tight text-stone-100 font-mono">
                {phase === 'ready' ? selectedPattern.inhale : secondsRemaining}
              </span>
              <span className="text-xs uppercase font-semibold tracking-wider text-emerald-300/90 mt-1">
                {phase === 'ready' ? 'SEC' : phase}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Verbal Instruction */}
      <div className="text-center min-h-[4rem] z-10 px-4">
        <h4 className="text-lg font-medium text-stone-100 transition-all">
          {orb.title}
        </h4>
        <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
          {orb.subtitle}
        </p>
      </div>

      {/* Cycle Progress Dots */}
      <div className="flex items-center gap-2 my-4 z-10">
        <span className="text-xs text-stone-400 mr-1">
          Cycle {currentCycle} of {selectedPattern.cycles}
        </span>
        {Array.from({ length: selectedPattern.cycles }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i + 1 < currentCycle
                ? 'bg-emerald-400 scale-100'
                : i + 1 === currentCycle
                ? 'bg-emerald-400 ring-2 ring-emerald-400/40 scale-125'
                : 'bg-stone-700'
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="w-full flex items-center justify-center gap-4 mt-2 z-10">
        <button
          onClick={handleReset}
          className="p-3 rounded-2xl bg-stone-800/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-all"
          title="Reset exercise"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handleStartPause}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-medium shadow-lg transition-all ${
            isActive
              ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-semibold shadow-emerald-500/20'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5" /> Pause
            </>
          ) : phase === 'completed' ? (
            <>
              <RotateCcw className="w-5 h-5" /> Breathe Again
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" /> Begin Breathing (شروع کریں)
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-stone-500 mt-5 text-center max-w-sm z-10">
        {selectedPattern.benefits}
      </p>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      {content}
    </div>
  );
};
