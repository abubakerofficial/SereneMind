import React from 'react';
import { CoachAssessment, ExerciseType } from '../types';
import { Sparkles, Brain, Wind, HeartHandshake, Activity, Eye, Zap } from 'lucide-react';

interface WellnessInsightsProps {
  assessment: CoachAssessment;
  onOpenExercise: (type: ExerciseType) => void;
  theme?: 'universe' | 'sunrise';
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
  theme = 'universe',
}) => {
  const isCosmic = theme === 'universe';

  const getStressColor = (level: number) => {
    if (level <= 3) return { text: isCosmic ? 'text-teal-300' : 'text-teal-700', bg: 'bg-teal-400', label: 'Rest & Digest (Calm)' };
    if (level <= 6) return { text: isCosmic ? 'text-sky-300' : 'text-sky-700', bg: 'bg-sky-400', label: 'Mild Vigilance (Manageable)' };
    if (level <= 8) return { text: isCosmic ? 'text-amber-300' : 'text-amber-700', bg: 'bg-amber-400', label: 'Elevated Overthinking (Active)' };
    return { text: isCosmic ? 'text-rose-300' : 'text-rose-700', bg: 'bg-rose-400', label: 'High Cognitive Load (Reset Needed)' };
  };

  const stressInfo = getStressColor(assessment.stressLevel);
  const archetypeDesc =
    ARCHETYPE_DESCRIPTIONS[assessment.detectedArchetype] ||
    'Your natural cognitive style is being gently mapped through mindful dialogue.';

  return (
    <div
      className={`rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 transition-all duration-300 ${
        isCosmic
          ? 'bg-gradient-to-br from-[#0e173b]/90 via-[#131f47]/85 to-[#0b1633]/90 border border-indigo-400/35 text-slate-100 shadow-2xl shadow-indigo-950/60'
          : 'bg-white border border-slate-100 text-slate-700'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between pb-3 border-b ${isCosmic ? 'border-indigo-500/25' : 'border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg border ${
              isCosmic
                ? 'bg-indigo-900/60 border-indigo-400/40 text-cyan-300'
                : 'bg-sky-50 text-sky-600 border-sky-100'
            }`}
          >
            <Activity className="w-4 h-4" />
          </div>
          <h3 className={`text-sm font-semibold tracking-wide uppercase ${isCosmic ? 'text-white' : 'text-slate-700'}`}>
            Mindset &amp; Nervous System Profile
          </h3>
        </div>
        <span
          className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
            isCosmic
              ? 'bg-indigo-950/80 text-cyan-300 border border-indigo-400/40'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          Live AI Assessment
        </span>
      </div>

      {/* Stress Gauge */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className={`text-xs font-medium ${isCosmic ? 'text-slate-300' : 'text-slate-500'}`}>Overthinking &amp; Tension Load</span>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-bold ${stressInfo.text}`}>
              Level {assessment.stressLevel}/10
            </span>
            <span className={`text-[11px] ${isCosmic ? 'text-slate-400' : 'text-slate-400'}`}>({stressInfo.label})</span>
          </div>
        </div>

        {/* Progress meter */}
        <div className={`w-full h-2.5 rounded-full overflow-hidden p-0.5 border ${isCosmic ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
          <div
            className={`h-full rounded-full transition-all duration-700 ${stressInfo.bg}`}
            style={{ width: `${Math.min(100, Math.max(10, assessment.stressLevel * 10))}%` }}
          />
        </div>
        <div className={`flex justify-between text-[10px] mt-1 ${isCosmic ? 'text-slate-400' : 'text-slate-400'}`}>
          <span>Parasympathetic</span>
          <span>Baseline</span>
          <span>Fight/Flight</span>
        </div>
      </div>

      {/* Detected Archetype Card */}
      <div className={`p-4 rounded-2xl border relative overflow-hidden ${isCosmic ? 'bg-indigo-950/50 border-indigo-500/30' : 'bg-slate-50 border-slate-100'}`}>
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl border ${isCosmic ? 'bg-purple-900/50 border-purple-400/40 text-purple-200' : 'bg-teal-50 border-teal-100 text-teal-600'}`}>
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-[11px] font-semibold tracking-wider uppercase ${isCosmic ? 'text-teal-300' : 'text-teal-700'}`}>
              Observed Personality Style
            </span>
            <h4 className={`text-base font-semibold mt-0.5 ${isCosmic ? 'text-white' : 'text-slate-700'}`}>
              {assessment.detectedArchetype}
            </h4>
            <p className={`text-xs mt-1.5 leading-relaxed ${isCosmic ? 'text-slate-200' : 'text-slate-500'}`}>
              {archetypeDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Mindful Observation */}
      <div className={`p-4 rounded-2xl border ${isCosmic ? 'bg-sky-950/50 border-sky-400/30' : 'bg-sky-50/70 border-sky-100'}`}>
        <div className="flex items-start gap-2.5">
          <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${isCosmic ? 'text-cyan-300' : 'text-sky-600'}`} />
          <div>
            <span className={`text-xs font-semibold block ${isCosmic ? 'text-cyan-200' : 'text-sky-800'}`}>Coach Insight</span>
            <p className={`text-xs mt-1 italic leading-relaxed ${isCosmic ? 'text-slate-200' : 'text-slate-700'}`}>
              "{assessment.mindfulObservation}"
            </p>
          </div>
        </div>
      </div>

      {/* Soothing Affirmation */}
      <div className={`p-3.5 rounded-2xl border ${isCosmic ? 'bg-teal-950/50 border-teal-400/30' : 'bg-teal-50/70 border-teal-100'}`}>
        <div className="flex items-start gap-2.5">
          <HeartHandshake className={`w-4 h-4 shrink-0 mt-0.5 ${isCosmic ? 'text-teal-300' : 'text-teal-600'}`} />
          <div>
            <span className={`text-xs font-semibold block ${isCosmic ? 'text-teal-200' : 'text-teal-800'}`}>Today's Anchor</span>
            <p className={`text-xs mt-0.5 ${isCosmic ? 'text-slate-200' : 'text-slate-700'}`}>
              {assessment.soothingAffirmation}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Interactive Practices */}
      <div className="pt-2">
        <span className={`text-xs font-semibold block mb-2.5 uppercase tracking-wider ${isCosmic ? 'text-slate-300' : 'text-slate-500'}`}>
          Suggested Mindful Relievers
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onOpenExercise('breathing')}
            className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center group cursor-pointer ${
              isCosmic
                ? 'bg-slate-900/80 hover:bg-sky-950/60 border-indigo-500/30 hover:border-cyan-400 text-slate-200 hover:text-white'
                : 'bg-slate-50 hover:bg-sky-50 border-slate-200/70 hover:border-sky-300 text-slate-700 hover:text-sky-700'
            }`}
          >
            <Wind className="w-5 h-5 text-sky-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">4-7-8 Breath</span>
            <span className={`text-[10px] mt-0.5 ${isCosmic ? 'text-slate-400' : 'text-slate-400'}`}>Vagal Reset</span>
          </button>

          <button
            onClick={() => onOpenExercise('grounding')}
            className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center group cursor-pointer ${
              isCosmic
                ? 'bg-slate-900/80 hover:bg-sky-950/60 border-indigo-500/30 hover:border-cyan-400 text-slate-200 hover:text-white'
                : 'bg-slate-50 hover:bg-sky-50 border-slate-200/70 hover:border-sky-300 text-slate-700 hover:text-sky-700'
            }`}
          >
            <Eye className="w-5 h-5 text-teal-500 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">5-4-3-2-1</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Sensory Anchor</span>
          </button>

          <button
            onClick={() => onOpenExercise('defusion')}
            className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center group cursor-pointer ${
              isCosmic
                ? 'bg-slate-900/80 hover:bg-purple-950/60 border-indigo-500/30 hover:border-purple-400 text-slate-200 hover:text-white'
                : 'bg-slate-50 hover:bg-sky-50 border-slate-200/70 hover:border-sky-300 text-slate-700 hover:text-sky-700'
            }`}
          >
            <Zap className="w-5 h-5 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Thought Float</span>
            <span className={`text-[10px] mt-0.5 ${isCosmic ? 'text-slate-400' : 'text-slate-400'}`}>Defusion</span>
          </button>
        </div>
      </div>
    </div>
  );
};
