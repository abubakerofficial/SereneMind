import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Volume2,
  VolumeX,
  RotateCcw,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
} from 'lucide-react';
import {
  COGNITIVE_DISTORTIONS,
  PSYCHOLOGY_MODELS,
  GAD7_QUESTIONS,
  RRS_QUESTIONS,
} from '../data/psychology';
import { CognitiveDistortion, PsychologyModel } from '../types';
import { soundEngine } from '../utils/audio';

export const PsychologyHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'distortions' | 'models' | 'assessments'>('distortions');

  // CBT Laboratory State
  const [selectedDistortion, setSelectedDistortion] = useState<CognitiveDistortion>(COGNITIVE_DISTORTIONS[0]);
  const [userCustomThought, setUserCustomThought] = useState('');
  const [activeReframedOutput, setActiveReframedOutput] = useState<string | null>(null);
  const [isSpeakingReframe, setIsSpeakingReframe] = useState(false);

  // Psychology Models State
  const [selectedModel, setSelectedModel] = useState<PsychologyModel>(PSYCHOLOGY_MODELS[0]);

  // GAD-7 Assessment State
  const [gad7Answers, setGad7Answers] = useState<Record<number, number>>({});
  const [gad7Submitted, setGad7Submitted] = useState(false);

  // RRS Rumination Assessment State
  const [rrsAnswers, setRrsAnswers] = useState<Record<number, number>>({});
  const [rrsSubmitted, setRrsSubmitted] = useState(false);
  const [assessmentType, setAssessmentType] = useState<'gad7' | 'rrs'>('gad7');

  // Handle CBT Reframe Generation
  const handleApplyReframe = () => {
    soundEngine.playCalmChime('inhale');
    if (userCustomThought.trim()) {
      setActiveReframedOutput(
        `Rational Psychological Reframe: While it is understandable to feel concerned, thinking "${userCustomThought.trim()}" reflects ${selectedDistortion.name}. An objective look shows: ${selectedDistortion.cbtReframe}`
      );
    } else {
      setActiveReframedOutput(selectedDistortion.cbtReframe);
    }
  };

  const handleListenReframe = () => {
    if (isSpeakingReframe) {
      soundEngine.stopPlayback();
      setIsSpeakingReframe(false);
      return;
    }
    const textToSpeak = activeReframedOutput || selectedDistortion.cbtReframe;
    setIsSpeakingReframe(true);
    soundEngine.speakFallback(textToSpeak, () => {
      setIsSpeakingReframe(false);
    });
  };

  // Calculate GAD-7 Score
  const calculateGad7Score = () => {
    return Object.values(gad7Answers).reduce((a, b) => a + b, 0);
  };

  const getGad7Interpretation = (score: number) => {
    if (score <= 4) {
      return {
        level: 'Minimal Anxiety (معمولی بے چینی)',
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60',
        advice: 'Your nervous system is well-regulated. Continue daily mindfulness and 4-7-8 breathing to sustain baseline calm.',
      };
    } else if (score <= 9) {
      return {
        level: 'Mild Anxiety (ہلکی بے چینی)',
        color: 'text-teal-300 border-teal-500/40 bg-teal-950/60',
        advice: 'Noticeable autonomic activation. Benefit greatly from scheduled 15-minute worry windows and somatic grounding exercises.',
      };
    } else if (score <= 14) {
      return {
        level: 'Moderate Anxiety (درمیانے درجے کی بے چینی)',
        color: 'text-amber-300 border-amber-500/40 bg-amber-950/60',
        advice: 'Active sympathetic nervous arousal. Prioritize diaphragmatic breathing, cognitive defusion, and limit caffeine and news consumption.',
      };
    } else {
      return {
        level: 'Severe Anxiety (شدید بے چینی)',
        color: 'text-rose-300 border-rose-500/40 bg-rose-950/60',
        advice: 'High fight-or-flight alert. Engage in daily Polyvagal vagus nerve resets, full body scans, and consider consulting a licensed clinical psychologist.',
      };
    }
  };

  // Calculate RRS Score
  const calculateRrsScore = () => {
    return Object.values(rrsAnswers).reduce((a, b) => a + b, 0);
  };

  const getRrsInterpretation = (score: number) => {
    if (score <= 6) {
      return {
        level: 'Adaptive Problem Solver (تخلیقی اور متوازن سوچ)',
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60',
        advice: 'You process difficulties objectively without getting trapped in obsessive mental loops.',
      };
    } else if (score <= 11) {
      return {
        level: 'Moderate Rumination (وقتی اوور تھنکنگ)',
        color: 'text-amber-300 border-amber-500/40 bg-amber-950/60',
        advice: 'Tendency to replay past conversations when stressed. Use the 5-4-3-2-1 Sensory Grounding practice to forcibly interrupt cortex loops.',
      };
    } else {
      return {
        level: 'High Chronic Rumination (مسلسل ذہنی گردش)',
        color: 'text-rose-300 border-rose-500/40 bg-rose-950/60',
        advice: 'Your mind frequently treats past thoughts as emergency warnings. Practice the Thought Defusion sky exercise and enforce the 60-second non-vital decision rule.',
      };
    }
  };

  return (
    <section className="bg-stone-900/50 border border-stone-800/90 rounded-3xl p-5 sm:p-7 backdrop-blur-md shadow-2xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-950/50">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-stone-100 tracking-tight">
                Psychology &amp; Cognitive Science Sanctuary
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                علمِ نفسیات
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Evidence-based CBT reframing, neuroscience mental models, and real clinical psychological assessments.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-950/70 rounded-2xl border border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('distortions')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'distortions'
                ? 'bg-emerald-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>CBT Reframe Lab (سوچ کی اصلاح)</span>
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'models'
                ? 'bg-emerald-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Mental Models (نفسیاتی ماڈلز)</span>
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'assessments'
                ? 'bg-emerald-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Clinical Self-Tests (نفسیاتی ٹیسٹ)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CBT THOUGHT REFRAME LABORATORY */}
      {/* ========================================================================= */}
      {activeTab === 'distortions' && (
        <div className="space-y-6">
          {/* Distortion Selector Pills */}
          <div>
            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2.5">
              Select a Cognitive Distortion Pattern (سوچ کی غلط فہمی کا انتخاب کریں):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {COGNITIVE_DISTORTIONS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setSelectedDistortion(d);
                    setActiveReframedOutput(null);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                    selectedDistortion.id === d.id
                      ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 font-semibold shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
                  }`}
                >
                  <span className="block truncate font-bold">{d.name}</span>
                  <span className="text-[10px] text-stone-500 block truncate mt-0.5">{d.nameUrdu.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Reframe Workshop Box */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left Column: The Problem Thought & Mechanism */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-stone-900 text-emerald-400 border border-emerald-500/20">
                    {selectedDistortion.name} • {selectedDistortion.nameUrdu}
                  </span>
                  <span className="text-[11px] text-stone-500">CBT Step 1 &amp; 2</span>
                </div>

                <h3 className="text-base font-bold text-stone-100">
                  {selectedDistortion.definition}
                </h3>

                {/* Example Distorted Thought */}
                <div className="mt-4 p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/20 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                    Classic Distorted Automatic Thought:
                  </span>
                  <p className="text-stone-200 italic font-medium">
                    {selectedDistortion.exampleThought}
                  </p>
                </div>

                {/* User Custom Thought Input */}
                <div className="mt-4">
                  <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                    Or Test Your Own Anxious Thought (اختیاری: اپنی پریشان کن سوچ لکھیں):
                  </label>
                  <input
                    type="text"
                    value={userCustomThought}
                    onChange={(e) => setUserCustomThought(e.target.value)}
                    placeholder="e.g., Everyone noticed I stumbled during the meeting..."
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-700/80 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {/* Socratic Questions */}
              <div className="pt-3 border-t border-stone-800">
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mb-2">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Socratic Questions to Challenge This Thought:
                </span>
                <ul className="space-y-1.5 text-xs text-stone-300">
                  {selectedDistortion.socraticQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold shrink-0">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleApplyReframe}
                  className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Evidence-Based CBT Reframe (سوچ کو درست کریں)</span>
                </button>
              </div>
            </div>

            {/* Right Column: The Rational Psychological Reframe Result */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-stone-950 to-teal-950/30 border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Rational CBT Restructuring</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    Prefrontal Cortex Activation
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-stone-900/90 border border-emerald-500/20 space-y-3">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-400/90 block">
                    Balanced Cognitive Reframe:
                  </span>
                  <p className="text-sm text-stone-100 font-medium leading-relaxed">
                    {activeReframedOutput || selectedDistortion.cbtReframe}
                  </p>
                </div>

                {/* Neurological Mechanism */}
                <div className="mt-4 p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block mb-1">
                    Neurological Underpinning (دماغی میکانزم):
                  </span>
                  <p className="text-stone-300 leading-relaxed">
                    {selectedDistortion.mechanism}
                  </p>
                </div>
              </div>

              {/* Audio Listen & Reset */}
              <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                <button
                  onClick={handleListenReframe}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSpeakingReframe
                      ? 'bg-rose-500 text-stone-950 shadow-md'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                  }`}
                >
                  {isSpeakingReframe ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Listen to Audio Reframe</span>
                    </>
                  )}
                </button>

                {userCustomThought && (
                  <button
                    onClick={() => {
                      setUserCustomThought('');
                      setActiveReframedOutput(null);
                    }}
                    className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Custom Thought
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PSYCHOLOGY & NEUROSCIENCE FRAMEWORKS */}
      {/* ========================================================================= */}
      {activeTab === 'models' && (
        <div className="space-y-6">
          {/* Models Grid Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PSYCHOLOGY_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedModel.id === model.id
                    ? 'bg-emerald-950/70 border-emerald-500/50 shadow-xl ring-1 ring-emerald-500/30'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  {model.field}
                </span>
                <h4 className="text-sm font-bold text-stone-100 leading-snug">
                  {model.title}
                </h4>
                <p className="text-[11px] text-stone-400 mt-1">
                  by {model.founder}
                </p>
              </button>
            ))}
          </div>

          {/* Model Deep Dive Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-stone-950/80 border border-stone-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    {selectedModel.field}
                  </span>
                  <span className="text-xs text-stone-400">Founded by {selectedModel.founder}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-100">
                  {selectedModel.title} • <span className="text-emerald-400 font-light text-base">{selectedModel.titleUrdu}</span>
                </h3>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-teal-300 font-medium self-start sm:self-auto">
                Brain Circuitry: {selectedModel.brainRegion}
              </div>
            </div>

            {/* Core Scientific Insight */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                Core Scientific Principle
              </h4>
              <p className="text-sm text-stone-200 leading-relaxed bg-stone-900/60 p-4 rounded-2xl border border-stone-800">
                {selectedModel.coreInsight}
              </p>
            </div>

            {/* Practical Application */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                How to Apply in Daily Life (عملی اطلاق)
              </h4>
              <p className="text-sm text-stone-300 leading-relaxed bg-stone-900/60 p-4 rounded-2xl border border-stone-800">
                {selectedModel.practicalApplication}
              </p>
            </div>

            {/* Golden Takeaway */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block mb-0.5">
                  Clinical Rule of Thumb
                </span>
                <p className="text-sm font-semibold text-stone-100">
                  "{selectedModel.takeaway}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CLINICAL SELF-ASSESSMENTS (GAD-7 & RRS) */}
      {/* ========================================================================= */}
      {activeTab === 'assessments' && (
        <div className="space-y-6">
          {/* Assessment Switcher */}
          <div className="flex gap-2">
            <button
              onClick={() => setAssessmentType('gad7')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                assessmentType === 'gad7'
                  ? 'bg-emerald-500 text-stone-950 shadow-md'
                  : 'bg-stone-950/60 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              GAD-7 Anxiety Screening (بے چینی کا پیمانہ)
            </button>
            <button
              onClick={() => setAssessmentType('rrs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                assessmentType === 'rrs'
                  ? 'bg-emerald-500 text-stone-950 shadow-md'
                  : 'bg-stone-950/60 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              RRS Rumination Index (اوور تھنکنگ انڈیکس)
            </button>
          </div>

          {/* GAD-7 QUESTIONNAIRE */}
          {assessmentType === 'gad7' && (
            <div className="p-5 sm:p-7 rounded-3xl bg-stone-950/70 border border-stone-800 space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-stone-100">
                  GAD-7 Generalized Anxiety Scale
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Over the last 2 weeks, how often have you been bothered by the following problems?
                </p>
              </div>

              <div className="space-y-4">
                {GAD7_QUESTIONS.map((q) => {
                  const currentAnswer = gad7Answers[q.id];
                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="max-w-md">
                        <span className="text-xs font-semibold text-stone-200 block">
                          {q.id}. {q.question}
                        </span>
                        <span className="text-[11px] text-emerald-400/90 font-medium block mt-0.5">
                          {q.questionUrdu}
                        </span>
                      </div>

                      {/* 4 Point Scale Buttons */}
                      <div className="flex gap-1.5">
                        {[
                          { label: 'Not at all', score: 0 },
                          { label: 'Several days', score: 1 },
                          { label: 'Over half days', score: 2 },
                          { label: 'Nearly everyday', score: 3 },
                        ].map((opt) => (
                          <button
                            key={opt.score}
                            onClick={() => {
                              setGad7Answers((prev) => ({ ...prev, [q.id]: opt.score }));
                              setGad7Submitted(false);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                              currentAnswer === opt.score
                                ? 'bg-emerald-500 text-stone-950 shadow-sm'
                                : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            {opt.score} - {opt.label.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit / Score Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-800">
                <span className="text-xs text-stone-400">
                  Answered: {Object.keys(gad7Answers).length} of {GAD7_QUESTIONS.length} questions
                </span>

                <button
                  disabled={Object.keys(gad7Answers).length < GAD7_QUESTIONS.length}
                  onClick={() => setGad7Submitted(true)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-stone-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
                >
                  Calculate Clinical Anxiety Score
                </button>
              </div>

              {/* Result Display */}
              {gad7Submitted && (
                <div className="p-5 rounded-2xl bg-stone-900 border border-emerald-500/30 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                        GAD-7 Total Clinical Score
                      </span>
                      <h4 className="text-2xl font-extrabold text-stone-100">
                        {calculateGad7Score()} / 21
                      </h4>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                        getGad7Interpretation(calculateGad7Score()).color
                      }`}
                    >
                      {getGad7Interpretation(calculateGad7Score()).level}
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed pt-2 border-t border-stone-800">
                    <strong className="text-emerald-400 font-semibold">Recommended Psychological Next Step:</strong>{' '}
                    {getGad7Interpretation(calculateGad7Score()).advice}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* RRS RUMINATION SCALE */}
          {assessmentType === 'rrs' && (
            <div className="p-5 sm:p-7 rounded-3xl bg-stone-950/70 border border-stone-800 space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-stone-100">
                  RRS Ruminative Responses Scale (Overthinking Index)
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  How frequently do you experience repetitive, looping self-evaluations?
                </p>
              </div>

              <div className="space-y-4">
                {RRS_QUESTIONS.map((q) => {
                  const currentAnswer = rrsAnswers[q.id];
                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="max-w-md">
                        <span className="text-xs font-semibold text-stone-200 block">
                          {q.id}. {q.question}
                        </span>
                        <span className="text-[11px] text-emerald-400/90 font-medium block mt-0.5">
                          {q.questionUrdu}
                        </span>
                      </div>

                      {/* 4 Point Scale Buttons */}
                      <div className="flex gap-1.5">
                        {[
                          { label: 'Rarely', score: 1 },
                          { label: 'Sometimes', score: 2 },
                          { label: 'Often', score: 3 },
                          { label: 'Always', score: 4 },
                        ].map((opt) => (
                          <button
                            key={opt.score}
                            onClick={() => {
                              setRrsAnswers((prev) => ({ ...prev, [q.id]: opt.score }));
                              setRrsSubmitted(false);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                              currentAnswer === opt.score
                                ? 'bg-emerald-500 text-stone-950 shadow-sm'
                                : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit / Score Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-800">
                <span className="text-xs text-stone-400">
                  Answered: {Object.keys(rrsAnswers).length} of {RRS_QUESTIONS.length} questions
                </span>

                <button
                  disabled={Object.keys(rrsAnswers).length < RRS_QUESTIONS.length}
                  onClick={() => setRrsSubmitted(true)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-stone-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
                >
                  Analyze Overthinking Score
                </button>
              </div>

              {/* Result Display */}
              {rrsSubmitted && (
                <div className="p-5 rounded-2xl bg-stone-900 border border-emerald-500/30 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                        Rumination Tendency Score
                      </span>
                      <h4 className="text-2xl font-extrabold text-stone-100">
                        {calculateRrsScore()} / 20
                      </h4>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                        getRrsInterpretation(calculateRrsScore()).color
                      }`}
                    >
                      {getRrsInterpretation(calculateRrsScore()).level}
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed pt-2 border-t border-stone-800">
                    <strong className="text-emerald-400 font-semibold">Cognitive Recommendation:</strong>{' '}
                    {getRrsInterpretation(calculateRrsScore()).advice}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
