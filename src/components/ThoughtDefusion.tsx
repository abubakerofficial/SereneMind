import React, { useState } from 'react';
import { CloudRain, Wind, Sparkles, X, RotateCcw, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ThoughtDefusionProps {
  onClose: () => void;
  initialThought?: string;
}

export const ThoughtDefusion: React.FC<ThoughtDefusionProps> = ({
  onClose,
  initialThought = '',
}) => {
  const [thought, setThought] = useState(initialThought);
  const [isFloating, setIsFloating] = useState(false);
  const [isDissolved, setIsDissolved] = useState(false);

  const handleRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim()) return;

    soundEngine.playCalmChime('exhale');
    setIsFloating(true);

    setTimeout(() => {
      setIsDissolved(true);
      setIsFloating(false);
      soundEngine.playCalmChime('finish');
    }, 2800);
  };

  const handleReset = () => {
    setThought('');
    setIsFloating(false);
    setIsDissolved(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900/95 border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 flex flex-col overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 z-10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-950/60 text-purple-300 border border-purple-500/20">
              <CloudRain className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-semibold text-stone-100 text-lg">Thought Defusion Sanctuary</h3>
              <p className="text-xs text-stone-400">Leaves on a Stream Cognitive Reframe</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isDissolved ? (
          <div className="text-center py-8 z-10 flex flex-col items-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-4 shadow-lg shadow-purple-900/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-semibold text-stone-100">The Thought Has Passed</h4>
            <p className="text-sm text-stone-300 mt-2 max-w-sm leading-relaxed">
              "I am having the thought that..." You are the expansive sky watching clouds float by, not the storm itself.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" /> Release Another Thought
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-stone-950 text-sm font-semibold shadow-lg shadow-purple-500/20"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="z-10 py-3">
            <p className="text-xs text-stone-300 mb-4 leading-relaxed">
              When overthinking, we fuse with anxious predictions. Put your looping thought into words below, and watch it detach from your identity:
            </p>

            <form onSubmit={handleRelease} className="space-y-4">
              <div className="relative">
                <textarea
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  disabled={isFloating}
                  placeholder="e.g., What if I failed the review and everyone thinks I'm incompetent?"
                  rows={3}
                  className="w-full p-4 rounded-2xl bg-stone-950/70 border border-stone-800 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 text-stone-100 placeholder-stone-500 text-sm outline-none resize-none transition-all"
                />

                {/* Animated Floating Leaf / Cloud state */}
                {isFloating && (
                  <div className="absolute inset-0 bg-stone-950/90 rounded-2xl flex items-center justify-center p-4 overflow-hidden">
                    <div className="animate-bounce flex flex-col items-center text-center transition-all duration-[2500ms] opacity-0 translate-y-[-80px] scale-75">
                      <Wind className="w-8 h-8 text-purple-400 mb-2 animate-spin" />
                      <span className="text-xs text-purple-200 italic max-w-xs">
                        "{thought}"
                      </span>
                      <span className="text-[11px] text-stone-400 mt-1">
                        Dissolving into the breeze...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick sample overthinking triggers */}
              {!isFloating && !thought && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] text-stone-500 w-full">Common overthinking loops:</span>
                  {[
                    "I should have handled that conversation better",
                    "I have too much to do and not enough time",
                    "What if something goes wrong tomorrow?",
                  ].map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => setThought(sample)}
                      className="text-[11px] py-1 px-2.5 rounded-lg bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-300 border border-stone-800 text-left transition-colors"
                    >
                      "{sample}"
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Defusion weakens cortisol triggers</span>
                </div>

                <button
                  type="submit"
                  disabled={!thought.trim() || isFloating}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-40 text-stone-950 text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all"
                >
                  <Wind className="w-4 h-4" />
                  {isFloating ? 'Dissolving...' : 'Release to the Sky'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
