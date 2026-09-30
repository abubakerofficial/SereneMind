/**
 * SereneMind AI - Mental Wellness & Voice Mindfulness Coach
 * Calm Sunrise Theme: Uplifting, Bright, Airy, and Warm.
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
  Play,
  Square,
  BookOpen,
  Mic,
  Music,
  Video,
  Brain,
  Download,
  Sun,
  Heart,
  Moon,
  Stars,
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
import { PsychologyHub } from './components/PsychologyHub';
import { PWAInstallButton } from './components/PWAInstallButton';
import { DownloadModal } from './components/DownloadModal';
import { DownloadHub } from './components/DownloadHub';
import { OfflineIndicator } from './components/OfflineIndicator';
import { MobileQuickInstallBar } from './components/MobileQuickInstallBar';
import { MobileNativeDock } from './components/MobileNativeDock';
import { MobileRealAppIndicator } from './components/MobileRealAppIndicator';
import VoiceAgent from './components/VoiceAgent';
import { SereneMindLogo } from './components/SereneMindLogo';
import { CosmicUniverseBackground } from './components/CosmicUniverseBackground';
import { CosmicSanctuary } from './components/CosmicSanctuary';

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
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<CoachAssessment>(INITIAL_ASSESSMENT);
  const [lastUserSpoken, setLastUserSpoken] = useState<string>('');
  const [theme, setTheme] = useState<'universe' | 'sunrise'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('serenemind_theme');
      if (saved === 'sunrise' || saved === 'universe') return saved;
    }
    return 'universe'; // Default to animated cosmic universe with stars
  });

  const cosmicSectionRef = useRef<HTMLDivElement>(null);
  const breathSectionRef = useRef<HTMLDivElement>(null);
  const musicSectionRef = useRef<HTMLDivElement>(null);
  const videosSectionRef = useRef<HTMLDivElement>(null);
  const psychologySectionRef = useRef<HTMLDivElement>(null);
  const downloadSectionRef = useRef<HTMLDivElement>(null);
  const exercisesSectionRef = useRef<HTMLDivElement>(null);
  const booksSectionRef = useRef<HTMLDivElement>(null);
  const voiceSectionRef = useRef<HTMLDivElement>(null);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'universe' ? 'sunrise' : 'universe';
      if (typeof window !== 'undefined') {
        localStorage.setItem('serenemind_theme', next);
      }
      return next;
    });
  };

  const handleTriggerShootingStar = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('launch-shooting-star'));
    }
  };

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
    <div
      className={`min-h-screen flex flex-col font-sans relative transition-colors duration-700 ${
        theme === 'universe'
          ? 'bg-[#060814] text-slate-100 selection:bg-indigo-500 selection:text-white'
          : 'bg-slate-50 text-slate-700 selection:bg-sky-200 selection:text-slate-800'
      }`}
    >
      {/* Dynamic Animated Cosmic Universe or Calm Sunrise Background */}
      {theme === 'universe' ? (
        <CosmicUniverseBackground
          interactive={true}
          showControlsBar={true}
        />
      ) : (
        <>
          <div className="fixed top-[-10%] left-[20%] w-[550px] h-[550px] bg-sky-200/40 rounded-full blur-[140px] pointer-events-none" />
          <div className="fixed top-[45%] right-[10%] w-[500px] h-[500px] bg-amber-100/50 rounded-full blur-[130px] pointer-events-none" />
          <div className="fixed bottom-[-10%] left-[10%] w-[450px] h-[450px] bg-teal-100/40 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}

      {/* Top Navigation Bar */}
      <header
        className={`sticky top-0 z-40 transition-colors duration-500 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-sm ${
          theme === 'universe'
            ? 'bg-[#0b0f24]/85 border-b border-indigo-500/20 text-slate-100 shadow-indigo-950/40'
            : 'bg-white/85 border-b border-slate-100 text-slate-700 shadow-slate-200/40'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl p-1 flex items-center justify-center transition-all ${
                theme === 'universe'
                  ? 'bg-slate-900 border border-indigo-500/40 shadow-md shadow-indigo-500/20'
                  : 'bg-white border border-slate-100 shadow-sm shadow-sky-100/50'
              }`}
            >
              <SereneMindLogo size={36} withContainer={false} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className={`font-bold text-lg tracking-tight ${
                    theme === 'universe' ? 'text-white' : 'text-slate-700'
                  }`}
                >
                  SereneMind{' '}
                  <span className={theme === 'universe' ? 'text-cyan-400 font-light' : 'text-sky-600 font-light'}>
                    AI
                  </span>
                </h1>
                {theme === 'universe' ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-950 text-cyan-300 border border-indigo-500/40 flex items-center gap-1 shadow-xs">
                    <Stars className="w-3 h-3 text-amber-300 animate-spin" />
                    Cosmic Universe
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                    Calm Sunrise
                  </span>
                )}
              </div>
              <div
                className={`flex items-center gap-1.5 text-[11px] mt-0.5 ${
                  theme === 'universe' ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                <span className={theme === 'universe' ? 'font-semibold text-cyan-400' : 'font-semibold text-sky-600'}>
                  By Abubakar &amp; Mohsin
                </span>
                <span className="opacity-40">•</span>
                <span>Mindfulness &amp; Cosmic Serenity</span>
              </div>
            </div>
          </div>

          {/* Quick Section Navigation Links */}
          <nav
            className={`hidden xl:flex items-center gap-1 p-1 rounded-2xl border text-xs transition-colors ${
              theme === 'universe'
                ? 'bg-slate-900/80 border-indigo-500/30'
                : 'bg-slate-100/80 border-slate-200/70'
            }`}
          >
            <button
              onClick={() => scrollToSection(cosmicSectionRef)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                theme === 'universe'
                  ? 'text-cyan-300 hover:text-white hover:bg-indigo-950/80'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-white'
              }`}
            >
              <Stars className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>کائنات (Universe)</span>
            </button>
            <button
              onClick={() => scrollToSection(breathSectionRef)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                theme === 'universe'
                  ? 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-white'
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-sky-400" />
              <span>سانس (Breath)</span>
            </button>
            <button
              onClick={() => scrollToSection(musicSectionRef)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                theme === 'universe'
                  ? 'text-slate-300 hover:text-teal-300 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-white'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-teal-400" />
              <span>موسیقی (Music)</span>
            </button>
            <button
              onClick={() => scrollToSection(videosSectionRef)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                theme === 'universe'
                  ? 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-white'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-amber-400" />
              <span>ویڈیوز (Videos)</span>
            </button>
            <button
              onClick={() => scrollToSection(psychologySectionRef)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                theme === 'universe'
                  ? 'text-slate-300 hover:text-indigo-300 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>علمِ نفسیات (Psychology)</span>
            </button>
            <button
              onClick={() => scrollToSection(booksSectionRef)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                theme === 'universe'
                  ? 'text-slate-300 hover:text-sky-300 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>کتب خانہ (Books)</span>
            </button>
            <button
              onClick={() => scrollToSection(voiceSectionRef)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                theme === 'universe'
                  ? 'text-slate-300 hover:text-rose-300 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-rose-400" />
              <span>لائیو وائس (Live Voice)</span>
            </button>
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                theme === 'universe'
                  ? 'text-cyan-300 bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/40'
                  : 'text-sky-700 bg-sky-50 hover:bg-sky-100/80 border border-sky-200'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>ڈاؤن لوڈ (Download)</span>
            </button>
          </nav>

          {/* Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Universe vs Sunrise Theme Switcher Button */}
            <button
              onClick={handleToggleTheme}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                theme === 'universe'
                  ? 'bg-gradient-to-r from-indigo-900/90 to-purple-900/90 text-cyan-300 border-indigo-500/40 hover:border-cyan-400 shadow-md shadow-indigo-950/60'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
              title={theme === 'universe' ? 'Active: Cosmic Universe with animated stars. Tap for Calm Sunrise.' : 'Active: Calm Sunrise. Tap for Cosmic Universe with animated stars.'}
            >
              {theme === 'universe' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span className="hidden sm:inline">Universe (ستارے)</span>
                  <span className="sm:hidden">Cosmic</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Sunrise (طلوعِ آفتاب)</span>
                  <span className="sm:hidden">Day</span>
                </>
              )}
            </button>

            {/* Install / Download PWA Button */}
            <PWAInstallButton onOpenModal={() => setIsDownloadModalOpen(true)} />

            {/* Auto-Voice Speak Toggle */}
            <button
              onClick={() => {
                const nextState = !autoSpeakVoice;
                setAutoSpeakVoice(nextState);
                if (!nextState) soundEngine.stopPlayback();
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-medium border transition-all cursor-pointer ${
                theme === 'universe'
                  ? autoSpeakVoice
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-xs'
                    : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-slate-200'
                  : autoSpeakVoice
                  ? 'bg-sky-50 text-sky-700 border-sky-200 shadow-xs'
                  : 'bg-white text-slate-500 border-slate-200 hover:text-slate-700'
              }`}
              title={autoSpeakVoice ? 'AI Voice will speak responses' : 'AI Voice is muted'}
            >
              {autoSpeakVoice ? (
                <Volume2 className={`w-4 h-4 ${theme === 'universe' ? 'text-cyan-400' : 'text-sky-600'}`} />
              ) : (
                <VolumeX className="w-4 h-4 opacity-60" />
              )}
              <span className="hidden sm:inline">{autoSpeakVoice ? 'Voice Active' : 'Muted'}</span>
            </button>

            {/* Reset Session */}
            <button
              onClick={handleResetSession}
              className={`p-2 rounded-2xl border transition-colors cursor-pointer ${
                theme === 'universe'
                  ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-100'
                  : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700'
              }`}
              title="Reset conversation and state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
        {/* ========================================================================= */}
        {/* 0. COSMIC UNIVERSE & LIVING STARFIELD SANCTUARY (کائنات اور ستارے) */}
        {/* ========================================================================= */}
        <div ref={cosmicSectionRef} className="scroll-mt-24">
          <CosmicSanctuary
            onTriggerShootingStar={handleTriggerShootingStar}
            isCosmicTheme={theme === 'universe'}
            onToggleTheme={handleToggleTheme}
          />
        </div>

        {/* ========================================================================= */}
        {/* 1. FRONT & CENTER: BREATHING PRACTICE (سانسوں کی پریکٹس فرنٹ پر) */}
        {/* ========================================================================= */}
        <section ref={breathSectionRef} className="scroll-mt-24 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-xl ${
                  theme === 'universe' ? 'bg-indigo-950 text-cyan-400 border border-indigo-500/30' : 'bg-sky-100 text-sky-600'
                }`}
              >
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-bold tracking-tight ${
                    theme === 'universe' ? 'text-white' : 'text-slate-700'
                  }`}
                >
                  Guided Breathwork Sanctuary <span className={theme === 'universe' ? 'text-cyan-400 font-light' : 'text-sky-600 font-light'}>(سانسوں کی پریکٹس)</span>
                </h2>
                <p className={`text-xs sm:text-sm ${theme === 'universe' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Direct somatic vagus nerve reset to instantly break acute overthinking and anxiety. Celebratory calm music plays upon completion!
                </p>
              </div>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full self-start sm:self-auto font-medium ${
                theme === 'universe'
                  ? 'bg-indigo-950/80 text-cyan-300 border border-indigo-500/40'
                  : 'bg-sky-50 text-sky-700 border border-sky-100'
              }`}
            >
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
            <div
              className={`p-2 rounded-xl ${
                theme === 'universe'
                  ? 'bg-teal-950 text-teal-300 border border-teal-500/40 shadow-xs'
                  : 'bg-teal-100 text-teal-600'
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2
                className={`text-xl sm:text-2xl font-bold tracking-tight ${
                  theme === 'universe' ? 'text-white' : 'text-slate-700'
                }`}
              >
                Somatic Anchors &amp; Mindset Profile <span className={theme === 'universe' ? 'text-teal-400 font-light' : 'text-teal-600 font-light'}>(دیگر مشقیں)</span>
              </h2>
              <p className={`text-xs sm:text-sm ${theme === 'universe' ? 'text-slate-300' : 'text-slate-500'}`}>
                Sensory grounding, cognitive defusion, and live tension assessment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Exercise 1: 5-4-3-2-1 Sensory Grounding (Celestial Sapphire) */}
            <div
              className={`p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between h-full ${
                theme === 'universe'
                  ? 'bg-gradient-to-br from-[#091f42]/90 via-[#0a2754]/85 to-[#0b1b3b]/90 border border-sky-400/35 text-slate-100 shadow-xl shadow-sky-950/50'
                  : 'bg-white border border-slate-100 shadow-sm text-slate-700'
              }`}
            >
              <div>
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${
                    theme === 'universe'
                      ? 'bg-sky-900/60 border border-sky-400/50 text-cyan-300 shadow-xs'
                      : 'bg-sky-50 border border-sky-100 text-sky-600'
                  }`}
                >
                  <Eye className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-base font-bold ${theme === 'universe' ? 'text-white' : 'text-slate-700'}`}>
                    5-4-3-2-1 Sensory Grounding
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      theme === 'universe'
                        ? 'bg-sky-950/80 text-cyan-300 border border-sky-400/40'
                        : 'bg-sky-50 text-sky-700 border border-sky-100'
                    }`}
                  >
                    حسی اینکر
                  </span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed mt-2 ${theme === 'universe' ? 'text-slate-200' : 'text-slate-500'}`}>
                  Anchor attention to 5 sight, 4 touch, 3 sound, 2 smell, and 1 taste objects to physically interrupt the brain's alarm center.
                </p>
              </div>
              <button
                onClick={() => setActiveExercise('grounding')}
                className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-white font-bold text-xs shadow-md shadow-sky-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch 5-4-3-2-1 Practice</span>
              </button>
            </div>

            {/* Exercise 2: Thought Defusion (Celestial Amethyst) */}
            <div
              className={`p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between h-full ${
                theme === 'universe'
                  ? 'bg-gradient-to-br from-[#230d3d]/90 via-[#2a104a]/85 to-[#1a0a33]/90 border border-fuchsia-400/35 text-slate-100 shadow-xl shadow-purple-950/50'
                  : 'bg-white border border-slate-100 shadow-sm text-slate-700'
              }`}
            >
              <div>
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${
                    theme === 'universe'
                      ? 'bg-purple-900/60 border border-purple-400/50 text-fuchsia-300 shadow-xs'
                      : 'bg-teal-50 border border-teal-100 text-teal-600'
                  }`}
                >
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-base font-bold ${theme === 'universe' ? 'text-white' : 'text-slate-700'}`}>
                    Thought Defusion
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      theme === 'universe'
                        ? 'bg-purple-950/80 text-fuchsia-300 border border-purple-400/40'
                        : 'bg-teal-50 text-teal-700 border border-teal-100'
                    }`}
                  >
                    خیالات کی رہائی
                  </span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed mt-2 ${theme === 'universe' ? 'text-slate-200' : 'text-slate-500'}`}>
                  Visualize obsessive thought balloons detaching from your mind and floating gently away into the wide open sky.
                </p>
              </div>
              <button
                onClick={() => setActiveExercise('defusion')}
                className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-white font-bold text-xs shadow-md shadow-purple-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
                theme={theme}
              />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. PSYCHOLOGY & COGNITIVE SCIENCE SANCTUARY (CBT REFRAME & ASSESSMENTS) */}
        {/* ========================================================================= */}
        <div ref={psychologySectionRef} className="scroll-mt-24">
          <PsychologyHub theme={theme} />
        </div>

        {/* ========================================================================= */}
        {/* 6. DOWNLOAD APP & OFFLINE MEDIA HUB (تمام ڈیوائسز کے لیے ڈاؤن لوڈ) */}
        {/* ========================================================================= */}
        <div ref={downloadSectionRef} className="scroll-mt-24">
          <DownloadHub onOpenDownloadModal={() => setIsDownloadModalOpen(true)} theme={theme} />
        </div>

        {/* ========================================================================= */}
        {/* 7. BOOKS LIBRARY: OVERTHINKING, MEDITATION & MENTAL CLARITY (کتب خانہ) */}
        {/* ========================================================================= */}
        <div ref={booksSectionRef} className="scroll-mt-24">
          <BooksLibrary theme={theme} />
        </div>

        {/* ========================================================================= */}
        {/* 8. LIVE VOICE COACH & ASSISTANT (لائیو چیٹ / وائس کا ائیکن نیچے لے جاؤ) */}
        {/* ========================================================================= */}
        <section ref={voiceSectionRef} className="scroll-mt-24 space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-xl border ${
                  theme === 'universe'
                    ? 'bg-indigo-950/80 border-indigo-400/40 text-cyan-300'
                    : 'bg-sky-100 text-sky-600 border-sky-200'
                }`}
              >
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-bold tracking-tight ${
                    theme === 'universe' ? 'text-white' : 'text-slate-700'
                  }`}
                >
                  Live Voice Coach &amp; Spoken Support{' '}
                  <span className={theme === 'universe' ? 'text-cyan-300 font-light' : 'text-sky-600 font-light'}>
                    (لائیو وائس اسسٹنٹ)
                  </span>
                </h2>
                <p className={`text-xs sm:text-sm ${theme === 'universe' ? 'text-slate-300' : 'text-slate-500'}`}>
                  مائیکروفون پر کلک کریں اور قدرتی انداز میں بات کریں۔ ابو بکر آپ کی رہنمائی کے لیے ہمہ وقت حاضر ہیں۔
                </p>
              </div>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium border ${
                theme === 'universe'
                  ? 'bg-indigo-950/80 border-indigo-400/40 text-cyan-300 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              وائس اسٹیشن (Live Voice)
            </span>
          </div>

          {/* Real-time Voice Agent (Direct Voice Call with Abu Bakar) */}
          <VoiceAgent theme={theme} />

          {/* Central Voice Resonance Box */}
          <div
            className={`rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col items-center text-center transition-all ${
              theme === 'universe'
                ? 'bg-gradient-to-br from-[#0c163d]/90 via-[#10204d]/85 to-[#161242]/90 backdrop-blur-xl border border-indigo-400/35 text-slate-100 shadow-2xl shadow-indigo-950/60'
                : 'bg-white border border-slate-100 text-slate-700 shadow-sm'
            }`}
          >
            {/* Status Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs mb-6 shadow-xs border ${
                theme === 'universe'
                  ? 'bg-slate-950/80 border-indigo-500/40 text-cyan-300'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  currentStatus === 'Listening...'
                    ? 'bg-rose-400 animate-ping'
                    : currentStatus === 'Thinking...'
                    ? 'bg-amber-400 animate-pulse'
                    : currentStatus === 'Speaking...'
                    ? 'bg-teal-400 animate-bounce'
                    : 'bg-cyan-400'
                }`}
              />
              <span className="font-semibold">
                {currentStatus === 'Listening...'
                  ? 'Listening to your voice... (سن رہا ہوں)'
                  : currentStatus === 'Thinking...'
                  ? 'Thinking & formulating clear answer... (سوچ رہا ہوں)'
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
                    ? 'bg-teal-500/25 scale-120 animate-ping'
                    : isLoading
                    ? 'bg-amber-500/20 scale-110 animate-spin'
                    : 'bg-cyan-500/20 scale-100 animate-calm-breathe'
                }`}
              />

              <div
                className={`absolute w-32 h-32 rounded-full border border-dashed transition-all duration-500 pointer-events-none ${
                  isListening
                    ? 'border-rose-400/60 animate-spin'
                    : isSpeaking
                    ? 'border-teal-400/60 animate-pulse'
                    : 'border-cyan-400/40'
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

            <p className={`text-xs sm:text-sm mt-2 max-w-sm ${theme === 'universe' ? 'text-slate-300' : 'text-slate-500'}`}>
              {isListening
                ? 'جب آپ بول چکیں تو آواز جمع کروانے کے لیے سرخ بٹن دبائیں'
                : 'بولنے کے لیے مائیکروفون دبائیں۔ ٹائپنگ کی بالکل ضرورت نہیں۔'}
            </p>

            {voiceError && (
              <div className="mt-3 p-2.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs">
                {voiceError}
              </div>
            )}

            {isListening && interimTranscript && (
              <div className="mt-4 w-full max-w-lg p-3 rounded-2xl bg-cyan-950/70 border border-cyan-400/40 text-cyan-200 text-sm italic animate-fade-in shadow-md">
                "{interimTranscript}..."
              </div>
            )}

            {lastUserSpoken && !isListening && (
              <div
                className={`mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs ${
                  theme === 'universe'
                    ? 'bg-indigo-950/80 border-indigo-500/40 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <span className="text-cyan-400 font-semibold">آپ نے پوچھا:</span>
                <span className="text-slate-100 truncate max-w-xs">"{lastUserSpoken}"</span>
              </div>
            )}
          </div>

          {/* Active Spoken Guidance Card */}
          <div
            className={`rounded-3xl p-6 sm:p-7 relative shadow-xl transition-all duration-300 ${
              theme === 'universe'
                ? 'bg-gradient-to-br from-[#120e3a]/92 via-[#19114a]/88 to-[#0f173f]/92 border border-violet-400/40 text-slate-100 shadow-violet-950/60'
                : 'bg-white border border-slate-100 text-slate-700 shadow-sm'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b mb-4 ${
                theme === 'universe' ? 'border-violet-500/25' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-xs ${
                    theme === 'universe'
                      ? 'bg-violet-950/80 border-violet-400/40 text-violet-300'
                      : 'bg-sky-50 border-sky-100 text-sky-600'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3
                    className={`text-sm font-semibold ${
                      theme === 'universe' ? 'text-white' : 'text-slate-700'
                    }`}
                  >
                    Coach Spoken Guidance (رہنمائی و گفتگو)
                  </h3>
                  <span
                    className={`text-xs ${
                      theme === 'universe' ? 'text-violet-200/80' : 'text-slate-500'
                    }`}
                  >
                    براہِ راست صوتی جواب اور ذہنی یکسوئی
                  </span>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-2">
                {isSpeaking ? (
                  <button
                    onClick={handleStopAudio}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white border border-rose-400 text-xs font-medium transition-colors animate-pulse cursor-pointer shadow-md shadow-rose-500/30"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>آواز بند کریں</span>
                  </button>
                ) : (
                  <button
                    onClick={handleReplayCurrentResponse}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer shadow-sm ${
                      theme === 'universe'
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-violet-400/40'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-sky-700 border-slate-200'
                    }`}
                    title="Listen to response again"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-cyan-300" />
                    <span>دوبارہ سنیں</span>
                  </button>
                )}
              </div>
            </div>

            <blockquote
              className={`text-base sm:text-lg font-normal leading-relaxed my-2 ${
                theme === 'universe' ? 'text-slate-100' : 'text-slate-700'
              }`}
            >
              "{currentAssessment.spokenResponse}"
            </blockquote>
          </div>

          {/* Quick Voice Starters */}
          <div
            className={`rounded-3xl p-5 shadow-xl transition-all duration-300 ${
              theme === 'universe'
                ? 'bg-gradient-to-br from-[#0c183d]/92 via-[#0e214d]/88 to-[#15123f]/92 border border-cyan-400/35 text-slate-100 shadow-cyan-950/50'
                : 'bg-white border border-slate-100 shadow-sm'
            }`}
          >
            <QuickPrompts
              onSelectPrompt={(text) => handleSendPrompt(text)}
              disabled={isLoading}
              theme={theme}
            />
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer
        className={`border-t py-6 px-4 text-center text-xs transition-colors duration-500 ${
          theme === 'universe'
            ? 'border-indigo-500/25 bg-gradient-to-r from-[#040614] via-[#090e24] to-[#040614] text-slate-300'
            : 'border-slate-100 bg-white text-slate-500'
        }`}
      >
        <p className="flex items-center justify-center gap-2">
          <span className={`font-medium ${theme === 'universe' ? 'text-white' : 'text-slate-700'}`}>
            SereneMind AI (ذہنی سکون)
          </span>
          <span className={theme === 'universe' ? 'text-indigo-400' : 'text-slate-300'}>•</span>
          <span className={theme === 'universe' ? 'text-cyan-300 font-semibold' : 'text-sky-600 font-semibold'}>
            ابو بکر اور محسن کی تخلیق
          </span>
          <span className={theme === 'universe' ? 'text-indigo-400' : 'text-slate-300'}>•</span>
          <span>{theme === 'universe' ? '🌌 کائناتی وسعت و ستارے (Cosmic Sanctuary)' : '🌅 طلوعِ آفتاب (Sunrise Sanctuary)'}</span>
        </p>
      </footer>

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

      {/* Download Center Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* Offline Connectivity Notification */}
      <OfflineIndicator />

      {/* Floating Mobile Install Bar */}
      <MobileQuickInstallBar onOpenModal={() => setIsDownloadModalOpen(true)} />
    </div>
  );
}
