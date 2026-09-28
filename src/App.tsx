/**
 * SereneMind AI - Mental Wellness & Voice Mindfulness Coach
 * Voice-First, Empathetic Interactive Coaching with Real-Time Mindset Insights & Practices
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Wind,
  Eye,
  Zap,
  SlidersHorizontal,
  Download,
  Play,
  Square,
  HelpCircle,
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

const INITIAL_ASSESSMENT: CoachAssessment = {
  spokenResponse: "Ready. Tap the microphone to speak, ask for a 2-minute reset, or choose a practice below.",
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
    content: "Ready. Tap the microphone to speak, ask for a 2-minute reset, or choose a practice below.",
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
    setIsSpeaking(false);
    setMessages(INITIAL_MESSAGES);
    setCurrentAssessment(INITIAL_ASSESSMENT);
    setLastUserSpoken('');
    resetTranscript();
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans relative selection:bg-emerald-500 selection:text-stone-950">
      {/* Serene Ambient Gradient Orbs */}
      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[15%] w-[450px] h-[450px] bg-teal-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed top-[40%] right-[5%] w-[350px] h-[350px] bg-sky-600/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-stone-950/80 backdrop-blur-md border-b border-stone-800/80 px-4 sm:px-8 py-3.5">
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
                  Voice Coach
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Empathetic guidance • Overthinking relief • Gentle mindfulness
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Practice Shortcuts */}
            <div className="hidden md:flex items-center gap-1.5 p-1 bg-stone-900/90 rounded-2xl border border-stone-800">
              <button
                onClick={() => setActiveExercise('breathing')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-300 hover:text-emerald-300 hover:bg-stone-800/80 transition-all"
              >
                <Wind className="w-3.5 h-3.5 text-emerald-400" />
                <span>Breathe (4-7-8)</span>
              </button>
              <button
                onClick={() => setActiveExercise('grounding')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-300 hover:text-sky-300 hover:bg-stone-800/80 transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <span>5-4-3-2-1</span>
              </button>
              <button
                onClick={() => setActiveExercise('defusion')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-300 hover:text-purple-300 hover:bg-stone-800/80 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>Release Loop</span>
              </button>
            </div>

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

            {/* Mobile Insight Toggle */}
            <button
              onClick={() => setShowInsightsDrawer(!showInsightsDrawer)}
              className="lg:hidden p-2 rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-emerald-400 transition-colors"
              title="Toggle Mindset Insights"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Reset Session */}
            <button
              onClick={handleResetSession}
              className="p-2 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
              title="Reset conversation and state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Download Project ZIP */}
            <a
              href="/serenemind-ai.zip"
              download="serenemind-ai.zip"
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 hover:text-emerald-100 transition-all shadow-sm shadow-emerald-950/40"
              title="Download Full Project ZIP File"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Download ZIP</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 overflow-y-auto">
        {/* Left Column: Voice Coach Sanctuary & Practice Hub (No Chat Input) */}
        <section className="flex-1 flex flex-col gap-6">
          {/* Practice Shortcuts on Mobile */}
          <div className="flex md:hidden items-center justify-around p-2.5 bg-stone-900/70 border border-stone-800/80 rounded-2xl text-xs">
            <button
              onClick={() => setActiveExercise('breathing')}
              className="flex items-center gap-1 text-emerald-400 font-medium"
            >
              <Wind className="w-3.5 h-3.5" /> 4-7-8 Breath
            </button>
            <button
              onClick={() => setActiveExercise('grounding')}
              className="flex items-center gap-1 text-sky-400 font-medium"
            >
              <Eye className="w-3.5 h-3.5" /> 5-4-3-2-1
            </button>
            <button
              onClick={() => setActiveExercise('defusion')}
              className="flex items-center gap-1 text-purple-400 font-medium"
            >
              <Zap className="w-3.5 h-3.5" /> Release Loop
            </button>
          </div>

          {/* Voice Coach Centerpiece Orb */}
          <div className="bg-stone-900/40 border border-stone-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden flex flex-col items-center text-center shadow-xl">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-950/70 border border-stone-800 text-xs text-stone-300 mb-6">
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
              <span className="font-medium">
                {currentStatus === 'Listening...'
                  ? 'Listening to you... Speak now'
                  : currentStatus === 'Thinking...'
                  ? 'Thinking & formulating direct answer...'
                  : currentStatus === 'Speaking...'
                  ? 'Coach Speaking...'
                  : 'Voice Coach Ready'}
              </span>
            </div>

            {/* Glowing Interactive Voice Resonance Circle */}
            <div className="relative my-4 flex items-center justify-center">
              {/* Outer Animated Glow Ring */}
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

              {/* Large Voice Microphone Action Button */}
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
                : 'Tap microphone to speak naturally. Answers are spoken aloud immediately.'}
            </p>

            {/* Voice Error notice if any */}
            {voiceError && (
              <div className="mt-3 p-2.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                {voiceError}
              </div>
            )}

            {/* Live interim spoken transcript preview */}
            {isListening && interimTranscript && (
              <div className="mt-4 w-full max-w-lg p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-sm italic animate-fade-in">
                "{interimTranscript}..."
              </div>
            )}

            {/* Last User Spoken Bubble if exists */}
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

            {/* Response Text */}
            <blockquote className="text-stone-100 text-base sm:text-lg font-normal leading-relaxed my-2">
              "{currentAssessment.spokenResponse}"
            </blockquote>

            {/* Suggested Practice Action if available */}
            {currentAssessment.suggestedExercise && currentAssessment.suggestedExercise !== 'None' && (
              <div className="mt-5 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-200 block">
                      Recommended Practice: {currentAssessment.suggestedExercise}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {currentAssessment.exerciseInstruction || 'Follow the guided interactive rhythm'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const ex = currentAssessment.suggestedExercise.toLowerCase();
                    if (ex.includes('breath') || ex.includes('4-7-8')) setActiveExercise('breathing');
                    else if (ex.includes('ground') || ex.includes('5-4-3-2-1')) setActiveExercise('grounding');
                    else if (ex.includes('defusion') || ex.includes('loop')) setActiveExercise('defusion');
                    else setActiveExercise('breathing');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition-all shadow-md shrink-0"
                >
                  Start Practice Now
                </button>
              </div>
            )}
          </div>

          {/* Quick Voice Starters & Common Questions */}
          <div className="bg-stone-900/30 border border-stone-800/80 rounded-3xl p-5 backdrop-blur-sm">
            <QuickPrompts
              onSelectPrompt={(text) => handleSendPrompt(text)}
              disabled={isLoading}
            />
          </div>

          {/* Interactive Practices Suite */}
          <div className="bg-stone-900/30 border border-stone-800/80 rounded-3xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Interactive Mindfulness Exercises</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card 1: 4-7-8 Breathing */}
              <button
                onClick={() => setActiveExercise('breathing')}
                className="flex flex-col text-left p-4 rounded-2xl bg-stone-900/70 hover:bg-stone-850 border border-stone-800 hover:border-emerald-500/40 transition-all group shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                  <Wind className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-stone-100 group-hover:text-emerald-300">
                  4-7-8 Breathing
                </h4>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                  Slow the heart rate and calm the autonomic nervous system in 2 minutes.
                </p>
                <span className="text-[11px] text-emerald-400 font-semibold mt-3 flex items-center gap-1">
                  Launch Exercise →
                </span>
              </button>

              {/* Card 2: 5-4-3-2-1 Sensory Grounding */}
              <button
                onClick={() => setActiveExercise('grounding')}
                className="flex flex-col text-left p-4 rounded-2xl bg-stone-900/70 hover:bg-stone-850 border border-stone-800 hover:border-sky-500/40 transition-all group shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-sky-950/80 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-105 transition-transform">
                  <Eye className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-stone-100 group-hover:text-sky-300">
                  5-4-3-2-1 Grounding
                </h4>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                  Anchor attention to sight, touch, sound, and smell to halt mental panic.
                </p>
                <span className="text-[11px] text-sky-400 font-semibold mt-3 flex items-center gap-1">
                  Launch Exercise →
                </span>
              </button>

              {/* Card 3: Thought Defusion */}
              <button
                onClick={() => setActiveExercise('defusion')}
                className="flex flex-col text-left p-4 rounded-2xl bg-stone-900/70 hover:bg-stone-850 border border-stone-800 hover:border-purple-500/40 transition-all group shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-stone-100 group-hover:text-purple-300">
                  Release Loop
                </h4>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                  Visualize obsessive thought balloons floating gently away into clear open space.
                </p>
                <span className="text-[11px] text-purple-400 font-semibold mt-3 flex items-center gap-1">
                  Launch Exercise →
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Mindset & Nervous System Profile */}
        <aside className="w-full lg:w-80 xl:w-96 flex flex-col gap-4">
          <WellnessInsights
            assessment={currentAssessment}
            onOpenExercise={(type) => setActiveExercise(type)}
          />

          {/* Quick Help Card */}
          <div className="p-4 rounded-2xl bg-stone-900/40 border border-stone-800/60 text-xs text-stone-400 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              SereneMind AI is 100% voice-driven. Tap the microphone anytime to speak, or tap any prompt to trigger guidance instantly.
            </p>
          </div>
        </aside>
      </main>

      {/* Interactive Mindfulness Modals */}
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
