/**
 * SereneMind AI - Mental Wellness & Voice Mindfulness Coach
 * 1. Front: Breathing Practice (سانسوں کی پریکٹس) - with completion celebration music!
 * 2. Calming Soundscapes & Music (پرسکون موسیقی) - 432Hz, Tibetan Bowls, Rain, Ocean
 * 3. Guided Videos (ویڈیوز) - Certified Breathing & Meditation video lessons
 * 4. Mindfulness Exercises & Stress Profile
 * 5. Comprehensive Books Library on Overthinking & Meditation (کتب خانہ)
 * 6. Bottom: Live Voice Coach & Spoken Assistant (لائیو وائس اسسٹنٹ)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Wind,
  Eye,
  Zap,
  SlidersHorizontal,
  Play,
  Square,
  HelpCircle,
  BookOpen,
  Mic,
  Music,
  Video,
} from 'lucide-react';
import { ChatMessage, CoachAssessment, ExerciseType } from './types';
import { useVoiceInput } from './hooks/useVoiceInput';
import { soundEngine } from './utils/audio';
import { VoiceMicButton } from './components/VoiceMicButton';
import { QuickPrompts } from './components/QuickPrompts';
import { WellnessInsights } from './components/WellnessInsights';
import { BreathingExercise } from './components/BreathingExercise';
import { GroundingExercise } from './components/GroundingExercise';
import { ThoughtDefusion } from './components/ThoughtDefusion';
import { BooksLibrary } from './components/BooksLibrary';
import { AmbientMusicPlayer } from './components/AmbientMusicPlayer';
import { MindfulVideos } from './components/MindfulVideos';

const INITIAL_ASSESSMENT: CoachAssessment = {
  spokenResponse: "Ready. Tap the microphone below to speak, start 4-7-8 breathing on front, or explore meditation videos, soundscapes, and books above.",
  detectedArchetype: 'Mindful Companion',
  stressLevel: 2,
  overthinkingTendency: 'Balanced',
  mindfulObservation: 'Ready to execute immediately on any request via voice.',
  suggestedExercise: 'None',
  exerciseInstruction: '',
  soothingAffirmation: 'One clear step at a time.',
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: "Ready. Tap the microphone below to speak, start 4-7-8 breathing on front, or explore meditation videos, soundscapes, and books above.",
    timestamp: Date.now(),
    assessment: INITIAL_ASSESSMENT,
  },
];

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeakVoice, setAutoSpeakVoice] = useState(true);
  const [activeExercise, setActiveExercise] = useState<ExerciseType>('none');
  const [showInsightsDrawer, setShowInsightsDrawer] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<CoachAssessment>(INITIAL_ASSESSMENT);
  const [lastUserSpoken, setLastUserSpoken] = useState<string>('');

  const breathSectionRef = useRef<HTMLDivElement>(null);
  const musicSectionRef = useRef<HTMLDivElement>(null);
  const videosSectionRef = useRef<HTMLDivElement>(null);
  const exercisesSectionRef = useRef<HTMLDivElement>(null);
  const booksSectionRef = useRef<HTMLDivElement>(null);
  const voiceSectionRef = useRef<HTMLDivElement>(null);

  // Stop speaking audio helper
  const handleStopAudio = () => {
    soundEngine.stopPlayback();
    setIsSpeaking(false);
  };

  // Voice Input hook
  const {
    isListening,
    transcript,
    interimTranscript,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput();

  // Determine current system status
  const currentStatus: 'Idle' | 'Listening...' | 'Thinking...' | 'Speaking...' = isListening
    ? 'Listening...'
    : isLoading
    ? 'Thinking...'
    : isSpeaking
    ? 'Speaking...'
    : 'Idle';

  // When speech transcript finalizes, send to coach
  useEffect(() => {
    if (transcript && transcript.trim()) {
      handleSendPrompt(transcript.trim());
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  // Handle prompt submission (voice or quick button)
  const handleSendPrompt = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    handleStopAudio();

    if (isListening) {
      stopListening();
    }

    setLastUserSpoken(text);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userState: {
            currentMood: currentAssessment.detectedArchetype,
            activeExercise: activeExercise,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Coach service connection failed');
      }

      const data: CoachAssessment = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.spokenResponse,
        timestamp: Date.now(),
        assessment: data,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentAssessment(data);

      // Auto-play voice if enabled
      if (autoSpeakVoice) {
        setIsSpeaking(true);
        soundEngine.speakFallback(data.spokenResponse, () => {
          setIsSpeaking(false);
        });
      }
    } catch (err: any) {
      console.error('Coaching request error:', err);
      const fallbackMsg: ChatMessage = {
        id: `fallback-${Date.now()}`,
        role: 'assistant',
        content: "Could you repeat that? I'm ready to answer directly.",
        timestamp: Date.now(),
        assessment: {
          ...currentAssessment,
        },
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (autoSpeakVoice) {
        setIsSpeaking(true);
        soundEngine.speakFallback(fallbackMsg.content, () => {
          setIsSpeaking(false);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoice = () => {
    if (isSpeaking) {
      handleStopAudio();
    }

    if (isListening) {
      stopListening();
      const spoken = (interimTranscript || transcript).trim();
      if (spoken) {
        handleSendPrompt(spoken);
        resetTranscript();
      }
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleReplayCurrentResponse = () => {
    if (currentAssessment.spokenResponse) {
      setIsSpeaking(true);
      soundEngine.speakFallback(currentAssessment.spokenResponse, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleResetSession = () => {
    soundEngine.stopPlayback();
    soundEngine.stopAmbientSound();
    setIsSpeaking(false);
    setMessages(INITIAL_MESSAGES);
    setCurrentAssessment(INITIAL_ASSESSMENT);
    setLastUserSpoken('');
    resetTranscript();
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans relative selection:bg-emerald-500 selection:text-stone-950">
      {/* Serene Ambient Background Gradients */}
      <div className="fixed top-[-10%] left-[20%] w-[550px] h-[550px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-[45%] right-[10%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[10%] w-[450px] h-[450px] bg-sky-600/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-stone-950/85 backdrop-blur-md border-b border-stone-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-stone-100 tracking-tight">
                  SereneMind <span className="text-emerald-400 font-light">AI</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  سانس، موسیقی اور کتب
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-0.5">
                <span className="font-semibold text-emerald-400">By Abubakar</span>
                <span className="text-stone-600">•</span>
                <span className="text-stone-400">Mental Wellness &amp; Mindfulness</span>
              </div>
            </div>
          </div>

          {/* Quick Section Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 p-1 bg-stone-900/90 rounded-2xl border border-stone-800 text-xs">
            <button
              onClick={() => scrollToSection(breathSectionRef)}
              className="px-3 py-1.5 rounded-xl font-medium text-stone-300 hover:text-emerald-300 hover:bg-stone-800/80 transition-all flex items-center gap-1.5"
            >
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
              <span>سانس (Breath)</span>
            </button>
            <button
              onClick={() => scrollToSection(musicSectionRef)}
              className="px-3 py-1.5 rounded-xl font-medium text-stone-300 hover:text-emerald-300 hover:bg-stone-800/80 transition-all flex items-center gap-1.5"
            >
              <Music className="w-3.5 h-3.5 text-emerald-400" />
              <span>موسیقی (Music)</span>
            </button>
            <button
              onClick={() => scrollToSection(videosSectionRef)}
              className="px-3 py-1.5 rounded-xl font-medium text-stone-300 hover:text-emerald-300 hover:bg-stone-800/80 transition-all flex items-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span>ویڈیوز (Videos)</span>
            </button>
            <button
              onClick={() => scrollToSection(booksSectionRef)}
              className="px-3 py-1.5 rounded-xl font-medium text-stone-300 hover:text-emerald-300 hover:bg-stone-800/80 transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>کتب خانہ (Books)</span>
            </button>
            <button
              onClick={() => scrollToSection(voiceSectionRef)}
              className="px-3 py-1.5 rounded-xl font-medium text-stone-300 hover:text-emerald-300 hover:bg-stone-800/80 transition-all flex items-center gap-1.5"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              <span>لائیو وائس (Live Voice)</span>
            </button>
          </nav>

          {/* Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Auto-Voice Speak Toggle */}
            <button
              onClick={() => {
                const nextState = !autoSpeakVoice;
                setAutoSpeakVoice(nextState);
                if (!nextState) soundEngine.stopPlayback();
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-medium border transition-all ${
                autoSpeakVoice
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-300'
              }`}
              title={autoSpeakVoice ? 'AI Voice will speak responses' : 'AI Voice is muted'}
            >
              {autoSpeakVoice ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{autoSpeakVoice ? 'Voice Active' : 'Muted'}</span>
            </button>

            {/* Reset Session */}
            <button
              onClick={handleResetSession}
              className="p-2 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
              title="Reset conversation and state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
        
        {/* ========================================================================= */}
        {/* 1. FRONT & CENTER: BREATHING PRACTICE (سانسوں کی پریکٹس فرنٹ پر) */}
        {/* ========================================================================= */}
        <section ref={breathSectionRef} className="scroll-mt-24 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-100 tracking-tight">
                  Guided Breathwork Sanctuary <span className="text-emerald-400 font-light">(سانسوں کی پریکٹس)</span>
                </h2>
                <p className="text-xs text-stone-400">
                  Direct somatic vagus nerve reset to instantly break acute overthinking and anxiety. Celebratory calm music plays upon completion!
                </p>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto font-medium">
              Front &amp; Interactive
            </span>
          </div>

          {/* Embedded Full-Featured Breathing Sanctuary */}
          <div className="w-full flex justify-center">
            <BreathingExercise embedded={true} initialPattern="4-7-8" />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. CALMING SOUNDSCAPES & AMBIENT MUSIC (پرسکون موسیقی) */}
        {/* ========================================================================= */}
        <div ref={musicSectionRef} className="scroll-mt-24">
          <AmbientMusicPlayer />
        </div>

        {/* ========================================================================= */}
        {/* 3. GUIDED BREATHING & MEDITATION VIDEOS (ویڈیوز) */}
        {/* ========================================================================= */}
        <div ref={videosSectionRef} className="scroll-mt-24">
          <MindfulVideos />
        </div>

        {/* ========================================================================= */}
        {/* 4. MINDFULNESS PRACTICES & NERVOUS SYSTEM INSIGHTS */}
        {/* ========================================================================= */}
        <section ref={exercisesSectionRef} className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2.5 px-1">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-100 tracking-tight">
                Somatic Anchors &amp; Mindset Profile <span className="text-teal-400 font-light">(دیگر مشقیں)</span>
              </h2>
              <p className="text-xs text-stone-400">
                Sensory grounding, cognitive defusion, and live tension assessment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Exercise 1: 5-4-3-2-1 Sensory Grounding */}
            <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800/90 backdrop-blur-md flex flex-col justify-between h-full shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-sky-950/80 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-stone-100">5-4-3-2-1 Sensory Grounding</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-500/30">
                    حسی اینکر
                  </span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed mt-2">
                  Anchor attention to 5 sight, 4 touch, 3 sound, 2 smell, and 1 taste objects to physically interrupt the brain's alarm center.
                </p>
              </div>
              <button
                onClick={() => setActiveExercise('grounding')}
                className="mt-6 w-full py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch 5-4-3-2-1 Practice</span>
              </button>
            </div>

            {/* Exercise 2: Thought Defusion (Release Loop) */}
            <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800/90 backdrop-blur-md flex flex-col justify-between h-full shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-stone-100">Thought Defusion</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                    خیالات کی رہائی
                  </span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed mt-2">
                  Visualize obsessive thought balloons detaching from your mind and floating gently away into the wide open sky.
                </p>
              </div>
              <button
                onClick={() => setActiveExercise('defusion')}
                className="mt-6 w-full py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Release Loop</span>
              </button>
            </div>

            {/* Live Profile & Stress Load */}
            <div className="h-full">
              <WellnessInsights
                assessment={currentAssessment}
                onOpenExercise={(type) => setActiveExercise(type)}
              />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. BOOKS LIBRARY: OVERTHINKING, MEDITATION & MENTAL CLARITY (کتب خانہ) */}
        {/* ========================================================================= */}
        <div ref={booksSectionRef} className="scroll-mt-24">
          <BooksLibrary />
        </div>

        {/* ========================================================================= */}
        {/* 6. LIVE VOICE COACH & ASSISTANT (لائیو چیٹ / وائس کا ائیکن نیچے لے جاؤ) */}
        {/* ========================================================================= */}
        <section ref={voiceSectionRef} className="scroll-mt-24 space-y-6 pt-6 border-t border-stone-800/80">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-100 tracking-tight">
                  Live Voice Coach &amp; Spoken Support <span className="text-emerald-400 font-light">(لائیو وائس اسسٹنٹ)</span>
                </h2>
                <p className="text-xs text-stone-400">
                  Tap microphone below to speak naturally. Empathetic guidance spoken back immediately.
                </p>
              </div>
            </div>
            <span className="text-[11px] px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-400">
              Live Voice Station
            </span>
          </div>

          {/* Central Voice Resonance Box */}
          <div className="bg-stone-900/50 border border-stone-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-950/80 border border-stone-800 text-xs text-stone-300 mb-6 shadow-sm">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  currentStatus === 'Listening...'
                    ? 'bg-rose-400 animate-ping'
                    : currentStatus === 'Thinking...'
                    ? 'bg-amber-400 animate-pulse'
                    : currentStatus === 'Speaking...'
                    ? 'bg-emerald-400 animate-bounce'
                    : 'bg-emerald-500'
                }`}
              />
              <span className="font-semibold">
                {currentStatus === 'Listening...'
                  ? 'Listening to your voice... (سن رہا ہوں)'
                  : currentStatus === 'Thinking...'
                  ? 'Thinking & formulating clear answer...'
                  : currentStatus === 'Speaking...'
                  ? 'Coach Speaking... (بول رہا ہے)'
                  : 'Voice Coach Ready (مائیکروفون پر بولیں)'}
              </span>
            </div>

            {/* Glowing Resonance Circle & Large Voice Mic */}
            <div className="relative my-4 flex items-center justify-center">
              <div
                className={`absolute w-44 h-44 rounded-full transition-all duration-700 pointer-events-none ${
                  isListening
                    ? 'bg-rose-500/20 scale-125 animate-pulse'
                    : isSpeaking
                    ? 'bg-emerald-500/25 scale-120 animate-ping'
                    : isLoading
                    ? 'bg-amber-500/20 scale-110 animate-spin'
                    : 'bg-emerald-500/10 scale-100'
                }`}
              />

              <div
                className={`absolute w-32 h-32 rounded-full border border-dashed transition-all duration-500 pointer-events-none ${
                  isListening
                    ? 'border-rose-400/50 animate-spin'
                    : isSpeaking
                    ? 'border-emerald-400/60 animate-pulse'
                    : 'border-emerald-500/20'
                }`}
              />

              <div className="relative z-10 p-2">
                <VoiceMicButton
                  isListening={isListening}
                  onToggle={handleToggleVoice}
                  disabled={isLoading}
                />
              </div>
            </div>

            <p className="text-xs text-stone-400 mt-2 max-w-sm">
              {isListening
                ? 'Tap the red button when finished speaking to submit your voice'
                : 'Tap microphone to speak your question or thoughts. Zero typing needed.'}
            </p>

            {voiceError && (
              <div className="mt-3 p-2.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                {voiceError}
              </div>
            )}

            {isListening && interimTranscript && (
              <div className="mt-4 w-full max-w-lg p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-sm italic animate-fade-in">
                "{interimTranscript}..."
              </div>
            )}

            {lastUserSpoken && !isListening && (
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-950/60 border border-stone-800/80 text-xs text-stone-400">
                <span className="text-emerald-400 font-medium">You asked:</span>
                <span className="text-stone-200 truncate max-w-xs">"{lastUserSpoken}"</span>
              </div>
            )}
          </div>

          {/* Active Spoken Guidance Card */}
          <div className="bg-stone-900/60 border border-stone-800/90 rounded-3xl p-6 sm:p-7 backdrop-blur-md relative shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800/80 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-200">Coach Spoken Guidance</h3>
                  <span className="text-[11px] text-stone-400">Direct response &amp; mindful clarity</span>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-2">
                {isSpeaking ? (
                  <button
                    onClick={handleStopAudio}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-500/40 text-xs font-medium hover:bg-rose-900/60 transition-colors animate-pulse"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Audio</span>
                  </button>
                ) : (
                  <button
                    onClick={handleReplayCurrentResponse}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700/80 text-stone-300 hover:text-emerald-300 border border-stone-700/60 text-xs font-medium transition-colors"
                    title="Listen to response again"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Listen</span>
                  </button>
                )}
              </div>
            </div>

            <blockquote className="text-stone-100 text-base sm:text-lg font-normal leading-relaxed my-2">
              "{currentAssessment.spokenResponse}"
            </blockquote>
          </div>

          {/* Quick Voice Starters */}
          <div className="bg-stone-900/40 border border-stone-800/80 rounded-3xl p-5 backdrop-blur-sm">
            <QuickPrompts
              onSelectPrompt={(text) => handleSendPrompt(text)}
              disabled={isLoading}
            />
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-850/80 bg-stone-950/90 py-6 px-4 text-center text-xs text-stone-500">
        <p className="flex items-center justify-center gap-2 text-stone-400">
          <span className="font-medium text-stone-300">SereneMind AI</span>
          <span className="text-stone-600">•</span>
          <span className="text-emerald-400 font-semibold">Crafted by Abubakar</span>
          <span className="text-stone-600">•</span>
          <span>Peace &amp; Mindfulness Sanctuary</span>
        </p>
      </footer>

      {/* Interactive Mindfulness Modals (if launched from buttons) */}
      {activeExercise === 'breathing' && (
        <BreathingExercise onClose={() => setActiveExercise('none')} />
      )}

      {activeExercise === 'grounding' && (
        <GroundingExercise onClose={() => setActiveExercise('none')} />
      )}

      {activeExercise === 'defusion' && (
        <ThoughtDefusion onClose={() => setActiveExercise('none')} />
      )}
    </div>
  );
}
