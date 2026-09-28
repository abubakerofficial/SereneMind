/**
 * SereneMind AI - Mental Wellness & Mindfulness Coach
 * Voice-First, Empathetic Interactive Coaching with Real-Time Personality Insights
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Send,
  RotateCcw,
  Wind,
  Eye,
  Zap,
  Heart,
  SlidersHorizontal,
  ChevronDown,
  Info,
  Mic,
} from 'lucide-react';
import { ChatMessage, CoachAssessment, ExerciseType } from './types';
import { useVoiceInput } from './hooks/useVoiceInput';
import { soundEngine } from './utils/audio';
import { ChatMessageItem } from './components/ChatMessageItem';
import { VoiceMicButton } from './components/VoiceMicButton';
import { QuickPrompts } from './components/QuickPrompts';
import { WellnessInsights } from './components/WellnessInsights';
import { BreathingExercise } from './components/BreathingExercise';
import { GroundingExercise } from './components/GroundingExercise';
import { ThoughtDefusion } from './components/ThoughtDefusion';

const INITIAL_ASSESSMENT: CoachAssessment = {
  spokenResponse: "Ready. Ask a question, request a joke, or ask for a 2-minute reset.",
  detectedArchetype: 'Mindful Companion',
  stressLevel: 2,
  overthinkingTendency: 'Balanced',
  mindfulObservation: 'Ready to execute immediately on any request.',
  suggestedExercise: 'None',
  exerciseInstruction: '',
  soothingAffirmation: 'One clear step at a time.',
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: "Ready. Ask a question, request a joke, or ask for a 2-minute reset.",
    timestamp: Date.now(),
    assessment: INITIAL_ASSESSMENT,
  },
];

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeakVoice, setAutoSpeakVoice] = useState(true);
  const [activeExercise, setActiveExercise] = useState<ExerciseType>('none');
  const [showInsightsDrawer, setShowInsightsDrawer] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<CoachAssessment>(INITIAL_ASSESSMENT);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    isSupported: isVoiceSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput();

  // Determine current system status
  const currentStatus: 'Idle' | 'Listening to you...' | 'Thinking (Fetching AI response)...' | 'Speaking...' = isListening
    ? 'Listening to you...'
    : isLoading
    ? 'Thinking (Fetching AI response)...'
    : isSpeaking
    ? 'Speaking...'
    : 'Idle';

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, interimTranscript, isSpeaking]);

  // Sync voice transcript with input field when speaking
  useEffect(() => {
    if (transcript) {
      setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  // Handle user submission
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    // Interrupt/stop any speech playing if user speaks or sends
    handleStopAudio();

    // Stop listening if user is currently speaking
    if (isListening) {
      stopListening();
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
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
        content:
          "Could you repeat that? I'm ready to answer directly.",
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
    // If audio is currently speaking, user interrupting stops audio
    if (isSpeaking) {
      handleStopAudio();
    }

    if (isListening) {
      stopListening();
      if (inputText.trim()) {
        handleSendMessage();
      }
    } else {
      startListening();
    }
  };

  const handleResetSession = () => {
    soundEngine.stopPlayback();
    setMessages(INITIAL_MESSAGES);
    setCurrentAssessment(INITIAL_ASSESSMENT);
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
          </div>
        </div>
      </header>

      {/* Main Two-Column View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex gap-6 overflow-hidden">
        {/* Left Column: Chat Conversation & Voice Interaction */}
        <section className="flex-1 flex flex-col h-[calc(100vh-130px)] bg-stone-900/40 border border-stone-800/80 rounded-3xl overflow-hidden backdrop-blur-sm relative">
          {/* Quick Practice Bar (Mobile only) */}
          <div className="flex md:hidden items-center justify-around p-2 bg-stone-950/50 border-b border-stone-800 text-xs">
            <button
              onClick={() => setActiveExercise('breathing')}
              className="flex items-center gap-1 text-emerald-400"
            >
              <Wind className="w-3.5 h-3.5" /> Breath
            </button>
            <button
              onClick={() => setActiveExercise('grounding')}
              className="flex items-center gap-1 text-sky-400"
            >
              <Eye className="w-3.5 h-3.5" /> Grounding
            </button>
            <button
              onClick={() => setActiveExercise('defusion')}
              className="flex items-center gap-1 text-purple-400"
            >
              <Zap className="w-3.5 h-3.5" /> Thought Float
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-2">
            {messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                onOpenExercise={(type) => setActiveExercise(type)}
                autoSpeak={autoSpeakVoice}
              />
            ))}

            {/* User Voice Interim Bubble while speaking */}
            {isListening && interimTranscript && (
              <div className="flex justify-end my-3 animate-pulse">
                <div className="max-w-[75%] rounded-3xl p-4 bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 text-sm italic">
                  "{interimTranscript}..."
                </div>
              </div>
            )}

            {/* AI Coach Thinking Pulse */}
            {isLoading && (
              <div className="flex items-center gap-3 my-4 animate-fade-in">
                <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md animate-pulse">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-stone-900/80 border border-stone-800 text-stone-400 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Listening empathetically &amp; formulating mindful response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice status error banner if mic error */}
          {voiceError && (
            <div className="mx-4 mb-2 p-2.5 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
              <span>{voiceError}</span>
              <button
                onClick={() => startListening()}
                className="underline font-semibold ml-2 hover:text-white"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Quick Starters if conversation is fresh */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 sm:px-6 pt-1">
              <QuickPrompts
                onSelectPrompt={(text) => handleSendMessage(text)}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Voice & Text Input Bar */}
          <div className="p-4 sm:p-5 bg-stone-950/70 border-t border-stone-800/80 backdrop-blur-md">
            {/* Status & Audio Control Banner */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    currentStatus === 'Listening to you...'
                      ? 'bg-rose-400 animate-ping'
                      : currentStatus === 'Thinking (Fetching AI response)...'
                      ? 'bg-amber-400 animate-pulse'
                      : currentStatus === 'Speaking...'
                      ? 'bg-emerald-400 animate-bounce'
                      : 'bg-stone-500'
                  }`}
                />
                <span className="text-xs font-medium text-stone-300">
                  Status: <strong className="text-stone-100">{currentStatus}</strong>
                </span>
              </div>

              {isSpeaking && (
                <button
                  type="button"
                  onClick={handleStopAudio}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-500/40 text-xs font-medium hover:bg-rose-900/60 transition-colors animate-pulse"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Audio</span>
                </button>
              )}
            </div>

            {/* Live Voice Banner while active */}
            {isListening && (
              <div className="mb-3 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-semibold text-emerald-200">
                    Listening to you... Speak your thought
                  </span>
                </div>
                <button
                  onClick={handleToggleVoice}
                  className="text-xs px-3 py-1 rounded-xl bg-emerald-500 text-stone-950 font-bold hover:bg-emerald-400"
                >
                  Send Spoken Input
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3"
            >
              {/* Voice Push to Talk Mic Button */}
              <VoiceMicButton
                isListening={isListening}
                onToggle={handleToggleVoice}
                disabled={isLoading}
              />

              {/* Text Input with send button */}
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isListening
                      ? 'Listening to your voice...'
                      : 'Speak via microphone or type your thoughts...'
                  }
                  disabled={isLoading}
                  className="w-full pl-4 pr-12 py-4 rounded-2xl bg-stone-900/90 border border-stone-800 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 text-stone-100 placeholder-stone-500 text-sm outline-none transition-all"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  aria-label="Send message"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-emerald-500 text-stone-950 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2.5 px-1">
              <span>Push mic to speak naturally • Responses are voice-optimized</span>
              <span className="hidden sm:inline">Press Enter to send</span>
            </div>
          </div>
        </section>

        {/* Right Column: Mindset & Nervous System Profile (Desktop) */}
        <aside className="w-80 xl:w-96 hidden lg:flex flex-col gap-4">
          <WellnessInsights
            assessment={currentAssessment}
            onOpenExercise={(type) => setActiveExercise(type)}
          />
        </aside>
      </main>

      {/* Mobile Drawer for Insights */}
      {showInsightsDrawer && (
        <div className="fixed inset-0 z-40 bg-stone-950/80 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-full max-w-md h-full bg-stone-900 p-6 overflow-y-auto border-l border-stone-800 animate-slide-left">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
              <h3 className="font-semibold text-stone-100">Mindset Assessment</h3>
              <button
                onClick={() => setShowInsightsDrawer(false)}
                className="text-stone-400 hover:text-stone-200 text-sm px-2 py-1 bg-stone-800 rounded-lg"
              >
                Close
              </button>
            </div>
            <WellnessInsights
              assessment={currentAssessment}
              onOpenExercise={(type) => {
                setActiveExercise(type);
                setShowInsightsDrawer(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Interactive Mindfulness Overlays */}
      {activeExercise === 'breathing' && (
        <BreathingExercise
          onClose={() => setActiveExercise('none')}
          initialPattern="4-7-8"
        />
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
