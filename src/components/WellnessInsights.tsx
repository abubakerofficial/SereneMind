import React from 'react';
import { CoachAssessment, ExerciseType } from '../types';
import { Sparkles, Brain, Wind, ShieldCheck, HeartHandshake, Activity, Eye, Zap } from 'lucide-react';

interface WellnessInsightsProps {
  assessment: CoachAssessment;
  onOpenExercise: (type: ExerciseType) => void;
}

const ARCHETYPE_DESCRIPTIONS: Record<string, string> = {
  'Analytical Overthinker': 'You process deeply and crave clarity before relaxing. Your strength is intellectual rigor; your practice is accepting unknown outcomes.',
  'Empathetic Absorber': 'You instinctively take on others emotional energy. Your strength is profound empathy; your practice is gentle energetic boundaries.',
  'Perfectionist Striver': 'You hold exceptionally high standards. Your strength is excellence; your practice is self-compassion when things are imperfect.',
  'Overwhelmed Juggler': 'Too many cognitive threads are pulling at once. Your strength is capability; your practice is single-task grounding.',
  'Mindful Seeker': 'You are actively tuning into presence. Your awareness is expanding.',
};

export const WellnessInsights: React.FC<WellnessInsightsProps> = ({
  assessment,
  onOpenExercise,
}) => {
  const getStressColor = (level: number) => {
    if (level <= 3) return { text: 'text-emerald-400', bg: 'bg-emerald-500', label: 'Rest & Digest (Calm)' };
    if (level <= 6) return { text: 'text-sky-400', bg: 'bg-sky-500', label: 'Mild Vigilance (Manageable)' };
    if (level <= 8) return { text: 'text-amber-400', bg: 'bg-amber-500', label: 'Elevated Overthinking (Active)' };
    return { text: 'text-rose-400', bg: 'bg-rose-500', label: 'High Cognitive Load (Reset Needed)' };
  };

  const stressInfo = getStressColor(assessment.stressLevel);
  const archetypeDesc =
    ARCHETYPE_DESCRIPTIONS[assessment.detectedArchetype] ||
    'Your natural cognitive style is being gently mapped through mindful dialogue.';

  return (
    <div className="bg-stone-900/60 backdrop-blur-md border border-stone-800 rounded-3xl p-5 sm:p-6 text-stone-100 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold tracking-wide uppercase text-stone-300">
            Mindset &amp; Nervous System Profile
          </h3>
        </div>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-400 font-medium">
          Live AI Assessment
        </span>
      </div>

      {/* Stress Gauge */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-xs text-stone-400 font-medium">Overthinking &amp; Tension Load</span>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-bold ${stressInfo.text}`}>
              Level {assessment.stressLevel}/10
            </span>
            <span className="text-[11px] text-stone-500">({stressInfo.label})</span>
          </div>
        </div>

        {/* Progress meter */}
        <div className="w-full h-2.5 bg-stone-950 rounded-full overflow-hidden p-0.5 border border-stone-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ${stressInfo.bg}`}
            style={{ width: `${Math.min(100, Math.max(10, assessment.stressLevel * 10))}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-stone-500 mt-1">
          <span>Parasympathetic</span>
          <span>Baseline</span>
          <span>Fight/Flight</span>
        </div>
      </div>

      {/* Detected Archetype Card */}
      <div className="p-4 rounded-2xl bg-stone-950/50 border border-stone-800/90 relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-teal-950/50 border border-teal-500/30 text-teal-300">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">
              Observed Personality Style
            </span>
            <h4 className="text-base font-semibold text-stone-100 mt-0.5">
              {assessment.detectedArchetype}
            </h4>
            <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
              {archetypeDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Mindful Observation */}
      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-emerald-300 block">Coach Insight</span>
            <p className="text-xs text-stone-200 mt-1 italic leading-relaxed">
              "{assessment.mindfulObservation}"
            </p>
          </div>
        </div>
      </div>

      {/* Soothing Affirmation */}
      <div className="p-3.5 rounded-2xl bg-sky-950/20 border border-sky-500/20">
        <div className="flex items-start gap-2.5">
          <HeartHandshake className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-sky-300 block">Today's Anchor</span>
            <p className="text-xs text-stone-300 mt-0.5">
              {assessment.soothingAffirmation}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Interactive Practices */}
      <div className="pt-2">
        <span className="text-xs font-semibold text-stone-400 block mb-2.5 uppercase tracking-wider">
          Suggested Mindful Relievers
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onOpenExercise('breathing')}
            className="flex flex-col items-center p-3 rounded-2xl bg-stone-950/60 hover:bg-emerald-950/30 border border-stone-800 hover:border-emerald-500/40 text-stone-300 hover:text-emerald-200 transition-all text-center group"
          >
            <Wind className="w-5 h-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">4-7-8 Breath</span>
            <span className="text-[10px] text-stone-500 mt-0.5">Vagal Reset</span>
          </button>

          <button
            onClick={() => onOpenExercise('grounding')}
            className="flex flex-col items-center p-3 rounded-2xl bg-stone-950/60 hover:bg-sky-950/30 border border-stone-800 hover:border-sky-500/40 text-stone-300 hover:text-sky-200 transition-all text-center group"
          >
            <Eye className="w-5 h-5 text-sky-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">5-4-3-2-1</span>
            <span className="text-[10px] text-stone-500 mt-0.5">Sensory Anchor</span>
          </button>

          <button
            onClick={() => onOpenExercise('defusion')}
            className="flex flex-col items-center p-3 rounded-2xl bg-stone-950/60 hover:bg-purple-950/30 border border-stone-800 hover:border-purple-500/40 text-stone-300 hover:text-purple-200 transition-all text-center group"
          >
            <Zap className="w-5 h-5 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Thought Float</span>
            <span className="text-[10px] text-stone-500 mt-0.5">Defusion</span>
          </button>
        </div>
      </div>
    </div>
  );
};
