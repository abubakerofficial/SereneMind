import React, { useState } from 'react';
import { Eye, Hand, Ear, Wind, Heart, CheckCircle2, ChevronRight, X, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface GroundingExerciseProps {
  onClose: () => void;
}

const STEPS = [
  {
    step: 5,
    title: '5 Things You Can SEE',
    icon: Eye,
    color: 'text-sky-400 bg-sky-950/50 border-sky-500/30',
    instruction: 'Look around your space right now. Notice 5 distinct visual details: a patch of sunlight, a pattern in the wood, a specific shadow, or a plant leaf.',
    placeholder: 'e.g. The subtle grain of the wooden desk, a reflection in the glass...',
    count: 5,
  },
  {
    step: 4,
    title: '4 Things You Can FEEL',
    icon: Hand,
    color: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30',
    instruction: 'Bring awareness to your tactile body: the weight of your feet on the floor, the texture of your fabric, the cool air on your skin, or your chair supporting you.',
    placeholder: 'e.g. The warmth of the mug, softness of my sleeve...',
    count: 4,
  },
  {
    step: 3,
    title: '3 Things You Can HEAR',
    icon: Ear,
    color: 'text-amber-400 bg-amber-950/50 border-amber-500/30',
    instruction: 'Listen past the immediate room. Tune into subtle ambient layers: a distant hum of traffic, the whisper of air conditioning, birdsong, or your own breathing.',
    placeholder: 'e.g. The soft whir of the fan, distant wind...',
    count: 3,
  },
  {
    step: 2,
    title: '2 Things You Can SMELL',
    icon: Wind,
    color: 'text-purple-400 bg-purple-950/50 border-purple-500/30',
    instruction: 'Take a soft breath through your nose. Notice any subtle fragrance: fresh morning air, tea, soap on your hands, or simply the neutral scent of your room.',
    placeholder: 'e.g. Herbal peppermint tea, fresh laundry...',
    count: 2,
  },
  {
    step: 1,
    title: '1 Thing You TASTE or Feel Grateful For',
    icon: Heart,
    color: 'text-rose-400 bg-rose-950/50 border-rose-500/30',
    instruction: 'Notice the lingering taste of water or mint, or mentally name one simple thing you feel genuinely safe and grateful for right now in this breath.',
    placeholder: 'e.g. Grateful for this quiet moment to slow down...',
    count: 1,
  },
];

export const GroundingExercise: React.FC<GroundingExerciseProps> = ({ onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [itemsChecked, setItemsChecked] = useState<{ [step: number]: boolean[] }>({
    5: [false, false, false, false, false],
    4: [false, false, false, false],
    3: [false, false, false],
    2: [false, false],
    1: [false],
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStep = STEPS[currentStepIndex];

  const handleToggleCheck = (index: number) => {
    const currentList = [...(itemsChecked[currentStep.step] || [])];
    currentList[index] = !currentList[index];

    setItemsChecked((prev) => ({
      ...prev,
      [currentStep.step]: currentList,
    }));

    soundEngine.playCalmChime('inhale');

    // If all in this step checked, offer to move forward
    if (currentList.every(Boolean)) {
      setTimeout(() => {
        handleNextStep();
      }, 400);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      soundEngine.playCalmChime('hold');
    } else {
      setIsCompleted(true);
      soundEngine.playCalmChime('finish');
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setItemsChecked({
      5: [false, false, false, false, false],
      4: [false, false, false, false],
      3: [false, false, false],
      2: [false, false],
      1: [false],
    });
    setIsCompleted(false);
  };

  const Icon = currentStep?.icon || Eye;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900/95 border border-sky-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 flex flex-col overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 z-10">
          <div>
            <h3 className="font-semibold text-stone-100 text-lg">5-4-3-2-1 Sensory Grounding</h3>
            <p className="text-xs text-stone-400">Anchor out of anxious thoughts into physical reality</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress indicators */}
        <div className="grid grid-cols-5 gap-2 my-5 z-10">
          {STEPS.map((s, idx) => {
            const isDone = (itemsChecked[s.step] || []).every(Boolean);
            const isCurrent = idx === currentStepIndex && !isCompleted;
            return (
              <div
                key={s.step}
                className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'border-sky-400/60 bg-sky-950/40 text-sky-200 shadow-sm'
                    : isDone
                    ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                    : 'border-stone-800 bg-stone-950/40 text-stone-500'
                }`}
              >
                <span className="text-xs font-bold">{s.step}</span>
                <span className="text-[10px] hidden sm:inline opacity-80">{s.title.split(' ')[3]}</span>
              </div>
            );
          })}
        </div>

        {isCompleted ? (
          <div className="text-center py-8 z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-900/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-semibold text-stone-100">You Are Fully Grounded Here</h4>
            <p className="text-sm text-stone-300 mt-2 max-w-sm">
              Your senses have pulled your nervous system back into the safety of the present moment. The overthinking spiral is breaking.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" /> Repeat Practice
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-sm font-semibold shadow-lg shadow-emerald-500/20"
              >
                Return to Coach
              </button>
            </div>
          </div>
        ) : (
          <div className="z-10 py-2">
            {/* Step card */}
            <div className="flex items-start gap-3.5 mb-4">
              <div className={`p-3 rounded-2xl border ${currentStep.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
                  Step {5 - currentStepIndex} of 5
                </span>
                <h4 className="text-lg font-medium text-stone-100">{currentStep.title}</h4>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  {currentStep.instruction}
                </p>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5 my-4">
              {Array.from({ length: currentStep.count }).map((_, i) => {
                const checked = itemsChecked[currentStep.step]?.[i] || false;
                return (
                  <button
                    key={i}
                    onClick={() => handleToggleCheck(i)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      checked
                        ? 'border-emerald-500/40 bg-emerald-950/20 text-stone-200'
                        : 'border-stone-800 bg-stone-900/60 hover:border-stone-700 text-stone-400'
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {checked ? `✓ Identified item #${i + 1}` : `Tap to confirm item #${i + 1}`}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        checked
                          ? 'border-emerald-400 bg-emerald-500 text-stone-950'
                          : 'border-stone-600'
                      }`}
                    >
                      {checked && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-800">
              <button
                onClick={() => {
                  if (currentStepIndex > 0) setCurrentStepIndex((p) => p - 1);
                }}
                disabled={currentStepIndex === 0}
                className="text-xs text-stone-400 hover:text-stone-200 disabled:opacity-30"
              >
                Previous Step
              </button>

              <button
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 text-sm font-semibold shadow-lg shadow-sky-500/20"
              >
                {currentStepIndex === STEPS.length - 1 ? 'Complete Exercise' : 'Next Sense'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
