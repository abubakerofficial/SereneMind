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

interface PsychologyHubProps {
  theme?: 'universe' | 'sunrise';
}

export const PsychologyHub: React.FC<PsychologyHubProps> = ({ theme = 'universe' }) => {
  const [activeTab, setActiveTab] = useState<'distortions' | 'models' | 'assessments'>('distortions');

  const isCosmic = theme === 'universe';

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
        color: isCosmic ? 'text-emerald-300 border-emerald-500/40 bg-emerald-950/60' : 'text-emerald-700 border-emerald-200 bg-emerald-50',
        advice: 'آپ کا اعصابی نظام متوازن ہے۔ روزانہ کی سانس کی مشق اور مراقبہ جاری رکھیں۔',
      };
    } else if (score <= 9) {
      return {
        level: 'Mild Anxiety (ہلکی بے چینی)',
        color: isCosmic ? 'text-teal-300 border-teal-500/40 bg-teal-950/60' : 'text-teal-700 border-teal-200 bg-teal-50',
        advice: 'اعصابی تناؤ موجود ہے۔ روزانہ ۱۵ منٹ سوچوں کا وقت مخصوص کریں اور ۵-۴-۳-۲-۱ مشق کریں۔',
      };
    } else if (score <= 14) {
      return {
        level: 'Moderate Anxiety (درمیانے درجے کی بے چینی)',
        color: isCosmic ? 'text-amber-300 border-amber-500/40 bg-amber-950/60' : 'text-amber-700 border-amber-200 bg-amber-50',
        advice: 'دماغ الرٹ موڈ میں ہے۔ گہری ڈایافرامک سانس لیں، کیفین کم کریں اور پرسکون رہنمائی سنیں۔',
      };
    } else {
      return {
        level: 'Severe Anxiety (شدید بے چینی)',
        color: isCosmic ? 'text-rose-300 border-rose-500/40 bg-rose-950/60' : 'text-rose-700 border-rose-200 bg-rose-50',
        advice: 'اعصابی تناؤ کافی زیادہ ہے۔ ویگس نرو ری سیٹ کریں اور مستند ماہرِ نفسیات سے رہنمائی لیں۔',
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
        color: isCosmic ? 'text-emerald-300 border-emerald-500/40 bg-emerald-950/60' : 'text-emerald-700 border-emerald-200 bg-emerald-50',
        advice: 'آپ مسائل کو معروضی انداز سے حل کرتے ہیں اور فکری الجھنوں میں نہیں پھنستے۔',
      };
    } else if (score <= 11) {
      return {
        level: 'Moderate Rumination (وقتی اوور تھنکنگ)',
        color: isCosmic ? 'text-amber-300 border-amber-500/40 bg-amber-950/60' : 'text-amber-700 border-amber-200 bg-amber-50',
        advice: 'ماضی کی باتوں کو بار بار دہرانے کا رجحان ہے۔ حسی گراؤنڈنگ سے دماغی لوپ کو توڑیں۔',
      };
    } else {
      return {
        level: 'High Chronic Rumination (مسلسل ذہنی گردش)',
        color: isCosmic ? 'text-rose-300 border-rose-500/40 bg-rose-950/60' : 'text-rose-700 border-rose-200 bg-rose-50',
        advice: 'سوچوں کو حقیقت سمجھنے سے بچیں۔ خیالات کو بادلوں کی طرح تحلیل کرنے کی مشق کریں۔',
      };
    }
  };

  return (
    <section
      className={`rounded-3xl p-5 sm:p-7 relative overflow-hidden transition-all duration-500 ${
        isCosmic
          ? 'bg-gradient-to-br from-[#0f143a]/92 via-[#141544]/88 to-[#1f103d]/92 backdrop-blur-2xl border border-indigo-400/35 shadow-2xl shadow-indigo-950/70 text-slate-100'
          : 'bg-white border border-slate-100 shadow-sm text-slate-700'
      }`}
    >
      {/* Dynamic Aurora Glow */}
      {isCosmic && (
        <>
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b mb-6 relative z-10 ${
          isCosmic ? 'border-indigo-500/25' : 'border-slate-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-2xl border shadow-xs ${
              isCosmic
                ? 'bg-indigo-950/80 border-indigo-400/40 text-cyan-300'
                : 'bg-sky-50 border-sky-100 text-sky-600'
            }`}
          >
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${isCosmic ? 'text-white' : 'text-slate-700'}`}>
                Psychology &amp; Cognitive Science Sanctuary
              </h2>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isCosmic
                    ? 'bg-indigo-950/90 text-cyan-300 border-indigo-400/40'
                    : 'bg-sky-50 text-sky-700 border-sky-100'
                }`}
              >
                علمِ نفسیات
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isCosmic ? 'text-indigo-200/80' : 'text-slate-500'}`}>
              تحقیقی سی بی ٹی اصلاح، نیورو سائنس ماڈلز اور کلینیکل تشخیصی پیمانے برائے ذہنی سکون۔
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-2xl border text-xs ${
            isCosmic ? 'bg-[#080920]/85 border-indigo-500/30' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            onClick={() => setActiveTab('distortions')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'distortions'
                ? isCosmic
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 font-bold'
                  : 'bg-white text-sky-700 shadow-xs font-bold'
                : isCosmic
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>سوچ کی اصلاح (CBT Reframe)</span>
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'models'
                ? isCosmic
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 font-bold'
                  : 'bg-white text-sky-700 shadow-xs font-bold'
                : isCosmic
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>نفسیاتی ماڈلز (Models)</span>
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'assessments'
                ? isCosmic
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 font-bold'
                  : 'bg-white text-sky-700 shadow-xs font-bold'
                : isCosmic
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>تشخیصی پیمانے (Scales)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CBT COGNITIVE REFRAME LAB */}
      {/* ========================================================================= */}
      {activeTab === 'distortions' && (
        <div className="space-y-6 relative z-10">
          {/* Distortion Cards Carousel / Horizontal Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {COGNITIVE_DISTORTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedDistortion(item);
                  setActiveReframedOutput(null);
                  setUserCustomThought('');
                }}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-between h-20 ${
                  selectedDistortion.id === item.id
                    ? isCosmic
                      ? 'bg-gradient-to-br from-indigo-900/90 to-purple-900/90 border-2 border-cyan-400 text-white shadow-md shadow-cyan-500/25'
                      : 'bg-sky-50 border-2 border-sky-400 text-sky-800 shadow-xs'
                    : isCosmic
                    ? 'bg-slate-900/80 border-indigo-500/30 text-slate-300 hover:text-white hover:border-cyan-400/50'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-[11px] font-bold block truncate leading-tight">
                  {item.name}
                </span>
                <span className="text-[10px] block opacity-80 truncate text-cyan-300">
                  {item.nameUrdu}
                </span>
                <span className="text-[9px] uppercase tracking-wider opacity-60">
                  CBT Refocus
                </span>
              </button>
            ))}
          </div>

          {/* Interactive CBT Restructuring Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left Column: The Problem & The Anxious Thought */}
            <div
              className={`p-5 sm:p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${
                isCosmic
                  ? 'bg-slate-900/85 border-indigo-500/35 text-slate-100 shadow-xl'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    شناخت شدہ فکری مغالطہ (Cognitive Distortion)
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-400/40">
                    {selectedDistortion.nameUrdu}
                  </span>
                </div>

                <h3 className={`text-lg font-bold ${isCosmic ? 'text-white' : 'text-slate-700'}`}>
                  {selectedDistortion.name}
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${isCosmic ? 'text-slate-300' : 'text-slate-500'}`}>
                  {selectedDistortion.definition}
                </p>

                {/* Example Distorted Thought */}
                <div
                  className={`mt-4 p-3.5 rounded-xl border text-xs ${
                    isCosmic
                      ? 'bg-rose-950/70 border-rose-500/40 text-rose-200'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                    عام منفی یا وسوسہ انگیز سوچ (Automatic Thought):
                  </span>
                  <p className="italic font-medium">"{selectedDistortion.exampleThought}"</p>
                </div>

                {/* User Custom Thought Input */}
                <div className="mt-4">
                  <label className={`text-[11px] font-semibold block mb-1 ${isCosmic ? 'text-slate-300' : 'text-slate-600'}`}>
                    اپنی سوچ ٹیسٹ کریں (اختیاری: اپنی پریشان کن سوچ لکھیں):
                  </label>
                  <input
                    type="text"
                    value={userCustomThought}
                    onChange={(e) => setUserCustomThought(e.target.value)}
                    placeholder="مثال: مجھے لگتا ہے کہ میٹنگ میں سب نے میری غلطی نوٹ کر لی..."
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs transition-all focus:outline-none ${
                      isCosmic
                        ? 'bg-slate-950/80 border border-indigo-400/40 text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30'
                        : 'bg-white border border-slate-300 text-slate-700 placeholder-slate-400 focus:border-sky-400'
                    }`}
                  />
                </div>
              </div>

              {/* Socratic Questions */}
              <div className={`pt-3 border-t ${isCosmic ? 'border-indigo-500/25' : 'border-slate-200'}`}>
                <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1 mb-2">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  اس سوچ کو چیلنج کرنے والے سوالات (Socratic Questions):
                </span>
                <ul className={`space-y-1.5 text-xs ${isCosmic ? 'text-slate-300' : 'text-slate-600'}`}>
                  {selectedDistortion.socraticQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold shrink-0">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleApplyReframe}
                  className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                  <span>سوچ کی سائنسی اصلاح کریں (Generate CBT Reframe)</span>
                </button>
              </div>
            </div>

            {/* Right Column: The Rational Psychological Reframe Result */}
            <div
              className={`p-5 sm:p-6 rounded-2xl border flex flex-col justify-between shadow-xl ${
                isCosmic
                  ? 'bg-gradient-to-br from-[#0c1840]/90 to-[#120f38]/90 border-cyan-400/40 text-slate-100'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>منطقی و متوازن سوچ (Rational CBT Restructuring)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-950 text-cyan-300 border border-indigo-400/40">
                    Prefrontal Cortex Activation
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-[#121f47]/90 to-[#0e1838]/90 border border-cyan-400/40 space-y-3 shadow-md">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-cyan-300 block">
                    درست اور حقیقت پسندانہ نکتہ نظر:
                  </span>
                  <p className="text-sm text-white font-medium leading-relaxed">
                    {activeReframedOutput || selectedDistortion.cbtReframe}
                  </p>
                </div>

                {/* Neurological Mechanism */}
                <div
                  className={`mt-4 p-3.5 rounded-xl border text-xs ${
                    isCosmic
                      ? 'bg-teal-950/70 border-teal-500/40 text-teal-200'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block mb-1">
                    دماغی میکانزم (Neurological Underpinning):
                  </span>
                  <p className="leading-relaxed">{selectedDistortion.mechanism}</p>
                </div>
              </div>

              {/* Audio Listen & Reset */}
              <div className={`pt-4 border-t flex items-center justify-between ${isCosmic ? 'border-indigo-500/25' : 'border-sky-100'}`}>
                <button
                  onClick={handleListenReframe}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                    isSpeakingReframe
                      ? 'bg-rose-500 text-white shadow-rose-500/30'
                      : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-500/25'
                  }`}
                >
                  {isSpeakingReframe ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>آواز بند کریں (Stop Voice)</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-200" />
                      <span>آڈیو اصلاح سنیں (Listen to Audio)</span>
                    </>
                  )}
                </button>

                {userCustomThought && (
                  <button
                    onClick={() => {
                      setUserCustomThought('');
                      setActiveReframedOutput(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    ری سیٹ کریں (Reset)
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
        <div className="space-y-6 relative z-10">
          {/* Models Grid Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PSYCHOLOGY_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedModel.id === model.id
                    ? isCosmic
                      ? 'bg-gradient-to-br from-indigo-900/90 to-purple-900/90 border-2 border-cyan-400 text-white shadow-md shadow-cyan-500/25'
                      : 'bg-sky-50 border-2 border-sky-300 shadow-sm text-slate-800'
                    : isCosmic
                    ? 'bg-slate-900/80 border-indigo-500/30 text-slate-300 hover:text-white hover:border-cyan-400/50'
                    : 'bg-slate-50 border-slate-200/70 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 block mb-1">
                  {model.field}
                </span>
                <h4 className="text-sm font-bold leading-snug">{model.title}</h4>
                <p className="text-[11px] text-teal-300 mt-0.5">{model.titleUrdu}</p>
                <p className="text-[10px] opacity-70 mt-1">بانی: {model.founder}</p>
              </button>
            ))}
          </div>

          {/* Model Deep Dive Card */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border space-y-6 shadow-xl ${
              isCosmic
                ? 'bg-gradient-to-br from-[#0b173e]/90 via-[#0f214e]/85 to-[#161240]/90 border-sky-400/40 text-slate-100'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b ${isCosmic ? 'border-sky-500/25' : 'border-slate-200'}`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${isCosmic ? 'bg-sky-950/80 text-cyan-300 border-sky-400/40' : 'bg-sky-50 text-sky-700 border-sky-100'}`}>
                    {selectedModel.field}
                  </span>
                  <span className={`text-xs ${isCosmic ? 'text-slate-300' : 'text-slate-500'}`}>
                    بانی: {selectedModel.founder}
                  </span>
                </div>
                <h3 className={`text-xl font-bold ${isCosmic ? 'text-white' : 'text-slate-700'}`}>
                  {selectedModel.title} •{' '}
                  <span className="text-teal-300 font-light text-base">{selectedModel.titleUrdu}</span>
                </h3>
              </div>
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-medium self-start sm:self-auto ${isCosmic ? 'bg-teal-950/90 border-teal-400/40 text-teal-300' : 'bg-white border-slate-200 text-teal-700'}`}>
                دماغی سرکٹ: {selectedModel.brainRegion}
              </div>
            </div>

            {/* Core Scientific Insight */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-cyan-400" />
                بنیادی سائنسی نکتہ (Core Scientific Principle)
              </h4>
              <p
                className={`text-sm leading-relaxed p-4 rounded-2xl border ${
                  isCosmic
                    ? 'bg-gradient-to-br from-[#081d33]/90 to-[#0a2745]/90 border-sky-400/35 text-slate-100'
                    : 'bg-white border-slate-200/80 text-slate-700'
                }`}
              >
                {selectedModel.coreInsight}
              </p>
            </div>

            {/* Practical Application */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-teal-400" />
                روزمرہ زندگی میں عملی اطلاق (How to Apply)
              </h4>
              <p
                className={`text-sm leading-relaxed p-4 rounded-2xl border ${
                  isCosmic
                    ? 'bg-gradient-to-br from-[#082626]/90 to-[#0c3333]/90 border-teal-400/35 text-slate-100'
                    : 'bg-white border-slate-200/80 text-slate-700'
                }`}
              >
                {selectedModel.practicalApplication}
              </p>
            </div>

            {/* Golden Takeaway */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                isCosmic
                  ? 'bg-gradient-to-r from-amber-950/60 to-orange-950/50 border-amber-500/40 text-amber-200'
                  : 'bg-sky-50 border-sky-100 text-slate-700'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block mb-0.5">
                  کلینیکل اصول (Clinical Rule of Thumb)
                </span>
                <p className="text-sm font-semibold">"{selectedModel.takeaway}"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CLINICAL SELF-ASSESSMENTS (GAD-7 & RRS) */}
      {/* ========================================================================= */}
      {activeTab === 'assessments' && (
        <div className="space-y-6 relative z-10">
          {/* Assessment Switcher */}
          <div className="flex gap-2">
            <button
              onClick={() => setAssessmentType('gad7')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                assessmentType === 'gad7'
                  ? isCosmic
                    ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25 border-cyan-400/50'
                    : 'bg-gradient-to-r from-sky-400 to-teal-300 text-white shadow-xs border-transparent'
                  : isCosmic
                  ? 'bg-slate-900/80 border-indigo-500/30 text-slate-300 hover:text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800'
              }`}
            >
              GAD-7 Anxiety Screening (بے چینی کا پیمانہ)
            </button>
            <button
              onClick={() => setAssessmentType('rrs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                assessmentType === 'rrs'
                  ? isCosmic
                    ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25 border-cyan-400/50'
                    : 'bg-gradient-to-r from-sky-400 to-teal-300 text-white shadow-xs border-transparent'
                  : isCosmic
                  ? 'bg-slate-900/80 border-indigo-500/30 text-slate-300 hover:text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800'
              }`}
            >
              RRS Rumination Index (اوور تھنکنگ انڈیکس)
            </button>
          </div>

          {/* GAD-7 QUESTIONNAIRE */}
          {assessmentType === 'gad7' && (
            <div
              className={`p-5 sm:p-7 rounded-3xl border space-y-6 shadow-xl ${
                isCosmic
                  ? 'bg-gradient-to-br from-[#0a1639]/90 via-[#0e1d4b]/85 to-[#15113d]/90 border-indigo-500/35 text-slate-100'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div>
                <h3 className={`text-base sm:text-lg font-bold ${isCosmic ? 'text-white' : 'text-slate-700'}`}>
                  GAD-7 Generalized Anxiety Scale (بے چینی کی جانچ)
                </h3>
                <p className={`text-xs mt-0.5 ${isCosmic ? 'text-slate-300' : 'text-slate-500'}`}>
                  گزشتہ ۲ ہفتوں کے دوران، آپ کو درج ذیل کیفیات کا کتنی بار سامنا رہا؟
                </p>
              </div>

              <div className="space-y-3.5">
                {GAD7_QUESTIONS.map((q) => {
                  const currentAnswer = gad7Answers[q.id];
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCosmic
                          ? 'bg-slate-900/85 border-indigo-500/30 text-slate-100 shadow-md'
                          : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
                      }`}
                    >
                      <div className="max-w-md">
                        <span className={`text-xs font-semibold block ${isCosmic ? 'text-white' : 'text-slate-700'}`}>
                          {q.id}. {q.question}
                        </span>
                        <span className="text-[11px] text-teal-300 font-medium block mt-0.5">
                          {q.questionUrdu}
                        </span>
                      </div>

                      {/* 4 Point Scale Buttons */}
                      <div className="flex gap-1.5">
                        {[
                          { label: 'بالکل نہیں', score: 0 },
                          { label: 'کچھ دن', score: 1 },
                          { label: 'اکثر دن', score: 2 },
                          { label: 'تقریباً روزانہ', score: 3 },
                        ].map((opt) => (
                          <button
                            key={opt.score}
                            onClick={() => {
                              setGad7Answers((prev) => ({ ...prev, [q.id]: opt.score }));
                              setGad7Submitted(false);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                              currentAnswer === opt.score
                                ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold border-cyan-400 shadow-md shadow-cyan-500/25'
                                : isCosmic
                                ? 'bg-slate-950/70 border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400/50'
                                : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-transparent'
                            }`}
                          >
                            {opt.score} - {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit / Score Button */}
              <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t ${isCosmic ? 'border-indigo-500/25' : 'border-slate-200'}`}>
                <span className={`text-xs ${isCosmic ? 'text-slate-400' : 'text-slate-500'}`}>
                  مکمل سوالات: {Object.keys(gad7Answers).length} از {GAD7_QUESTIONS.length}
                </span>

                <button
                  disabled={Object.keys(gad7Answers).length < GAD7_QUESTIONS.length}
                  onClick={() => setGad7Submitted(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs transition-all shadow-md shadow-cyan-500/25 cursor-pointer"
                >
                  سکور اور نتیجہ حاصل کریں (Calculate Score)
                </button>
              </div>

              {/* Result Display */}
              {gad7Submitted && (
                <div
                  className={`p-5 rounded-2xl border space-y-3 animate-fade-in shadow-xl ${
                    isCosmic
                      ? 'bg-gradient-to-br from-[#0e173d]/90 to-[#181144]/90 border-cyan-400/40 text-slate-100'
                      : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300">
                        GAD-7 کلینیکل انزائٹی سکور
                      </span>
                      <h4 className={`text-2xl font-extrabold ${isCosmic ? 'text-white' : 'text-slate-700'}`}>
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

                  <p className={`text-xs leading-relaxed pt-2 border-t ${isCosmic ? 'border-indigo-500/25 text-slate-200' : 'border-slate-100 text-slate-600'}`}>
                    <strong className="text-cyan-300 font-semibold">نفسیاتی تجویز:</strong>{' '}
                    {getGad7Interpretation(calculateGad7Score()).advice}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* RRS RUMINATION SCALE */}
          {assessmentType === 'rrs' && (
            <div
              className={`p-5 sm:p-7 rounded-3xl border space-y-6 shadow-xl ${
                isCosmic
                  ? 'bg-gradient-to-br from-[#0a1639]/90 via-[#0e1d4b]/85 to-[#15113d]/90 border-indigo-500/35 text-slate-100'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div>
                <h3 className={`text-base sm:text-lg font-bold ${isCosmic ? 'text-white' : 'text-slate-700'}`}>
                  RRS Rumination Scale (اوور تھنکنگ انڈیکس)
                </h3>
                <p className={`text-xs mt-0.5 ${isCosmic ? 'text-slate-300' : 'text-slate-500'}`}>
                  آپ بار بار دہرائے جانے والے خیالات اور خود احتسابی کا کس قدر تجربہ کرتے ہیں؟
                </p>
              </div>

              <div className="space-y-3.5">
                {RRS_QUESTIONS.map((q) => {
                  const currentAnswer = rrsAnswers[q.id];
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCosmic
                          ? 'bg-slate-900/85 border-indigo-500/30 text-slate-100 shadow-md'
                          : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
                      }`}
                    >
                      <div className="max-w-md">
                        <span className={`text-xs font-semibold block ${isCosmic ? 'text-white' : 'text-slate-700'}`}>
                          {q.id}. {q.question}
                        </span>
                        <span className="text-[11px] text-teal-300 font-medium block mt-0.5">
                          {q.questionUrdu}
                        </span>
                      </div>

                      {/* 4 Point Scale Buttons */}
                      <div className="flex gap-1.5">
                        {[
                          { label: 'شاذ و نادر', score: 1 },
                          { label: 'کبھی کبھار', score: 2 },
                          { label: 'اکثر', score: 3 },
                          { label: 'ہمیشہ', score: 4 },
                        ].map((opt) => (
                          <button
                            key={opt.score}
                            onClick={() => {
                              setRrsAnswers((prev) => ({ ...prev, [q.id]: opt.score }));
                              setRrsSubmitted(false);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                              currentAnswer === opt.score
                                ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold border-cyan-400 shadow-md shadow-cyan-500/25'
                                : isCosmic
                                ? 'bg-slate-950/70 border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400/50'
                                : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-transparent'
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
              <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t ${isCosmic ? 'border-indigo-500/25' : 'border-slate-200'}`}>
                <span className={`text-xs ${isCosmic ? 'text-slate-400' : 'text-slate-500'}`}>
                  مکمل سوالات: {Object.keys(rrsAnswers).length} از {RRS_QUESTIONS.length}
                </span>

                <button
                  disabled={Object.keys(rrsAnswers).length < RRS_QUESTIONS.length}
                  onClick={() => setRrsSubmitted(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs transition-all shadow-md shadow-cyan-500/25 cursor-pointer"
                >
                  اوور تھنکنگ سکور معلوم کریں (Analyze Score)
                </button>
              </div>

              {/* Result Display */}
              {rrsSubmitted && (
                <div
                  className={`p-5 rounded-2xl border space-y-3 animate-fade-in shadow-xl ${
                    isCosmic
                      ? 'bg-gradient-to-br from-[#0e173d]/90 to-[#181144]/90 border-cyan-400/40 text-slate-100'
                      : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300">
                        اوور تھنکنگ و گردشِ فکر کا سکور
                      </span>
                      <h4 className={`text-2xl font-extrabold ${isCosmic ? 'text-white' : 'text-slate-700'}`}>
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

                  <p className={`text-xs leading-relaxed pt-2 border-t ${isCosmic ? 'border-indigo-500/25 text-slate-200' : 'border-slate-100 text-slate-600'}`}>
                    <strong className="text-cyan-300 font-semibold">فکری و علمی مشورہ:</strong>{' '}
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
