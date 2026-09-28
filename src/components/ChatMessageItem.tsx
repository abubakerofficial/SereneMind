import React, { useState } from 'react';
import { ChatMessage, ExerciseType } from '../types';
import { Sparkles, User, Volume2, VolumeX, Wind, Eye, Zap, Play } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ChatMessageItemProps {
  message: ChatMessage;
  onOpenExercise: (type: ExerciseType) => void;
  autoSpeak?: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onOpenExercise,
}) => {
  const isAssistant = message.role === 'assistant';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayVoice = async () => {
    if (isPlayingAudio) {
      soundEngine.stopPlayback();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);

    // If message already has Gemini TTS base64 cached
    if (message.audioBase64) {
      try {
        await soundEngine.playBase64PCM(message.audioBase64);
        setIsPlayingAudio(false);
        return;
      } catch (err) {
        console.warn('PCM playback failed, falling back to speech synthesis', err);
      }
    }

    // Try fetching TTS from backend or use browser SpeechSynthesis
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message.content }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          message.audioBase64 = data.audio;
          await soundEngine.playBase64PCM(data.audio);
          setIsPlayingAudio(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Native browser speech synthesis fallback
    soundEngine.speakFallback(message.content, () => {
      setIsPlayingAudio(false);
    });
  };

  const getExerciseBadge = (exerciseName?: string) => {
    if (!exerciseName || exerciseName.toLowerCase() === 'none') return null;
    const lower = exerciseName.toLowerCase();
    if (lower.includes('breath') || lower.includes('4-7-8') || lower.includes('box')) {
      return {
        type: 'breathing' as ExerciseType,
        label: exerciseName,
        icon: Wind,
        color: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40',
      };
    }
    if (lower.includes('ground') || lower.includes('5-4-3-2-1') || lower.includes('sensory')) {
      return {
        type: 'grounding' as ExerciseType,
        label: exerciseName,
        icon: Eye,
        color: 'bg-sky-950/40 text-sky-300 border-sky-500/30 hover:bg-sky-900/40',
      };
    }
    if (lower.includes('thought') || lower.includes('defusion') || lower.includes('cloud')) {
      return {
        type: 'defusion' as ExerciseType,
        label: exerciseName,
        icon: Zap,
        color: 'bg-purple-950/40 text-purple-300 border-purple-500/30 hover:bg-purple-900/40',
      };
    }
    return {
      type: 'breathing' as ExerciseType,
      label: exerciseName,
      icon: Wind,
      color: 'bg-teal-950/40 text-teal-300 border-teal-500/30 hover:bg-teal-900/40',
    };
  };

  const exerciseBadge = isAssistant && message.assessment?.suggestedExercise
    ? getExerciseBadge(message.assessment.suggestedExercise)
    : null;

  return (
    <div
      className={`flex gap-3 sm:gap-4 my-4 animate-fade-in ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Coach Avatar */}
      {isAssistant && (
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600/40 to-teal-500/40 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-stone-400 mt-1 font-medium">Coach</span>
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 shadow-lg transition-all ${
          isAssistant
            ? 'bg-stone-900/80 backdrop-blur-md border border-emerald-500/20 text-stone-100 rounded-tl-sm'
            : 'bg-emerald-600 text-stone-950 rounded-tr-sm font-medium shadow-emerald-950/20'
        }`}
      >
        {/* Message Text */}
        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap selection:bg-emerald-300 selection:text-stone-900">
          {message.content}
        </p>

        {/* Coach Actions & Insights Footer */}
        {isAssistant && (
          <div className="mt-3 pt-3 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePlayVoice}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-emerald-300 text-xs font-medium transition-colors"
                title={isPlayingAudio ? 'Stop speaking' : 'Listen with AI Voice'}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Play Voice</span>
                  </>
                )}
              </button>

              {message.assessment?.stressLevel && (
                <span className="text-[11px] px-2 py-0.5 rounded-lg bg-stone-950/60 text-stone-400 border border-stone-800">
                  Stress: {message.assessment.stressLevel}/10
                </span>
              )}
            </div>

            {/* Quick Practice Trigger Badge */}
            {exerciseBadge && (
              <button
                type="button"
                onClick={() => onOpenExercise(exerciseBadge.type)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold transition-all ${exerciseBadge.color}`}
              >
                <exerciseBadge.icon className="w-3.5 h-3.5" />
                <span>Begin {exerciseBadge.label}</span>
              </button>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`text-[10px] mt-1.5 ${
            isAssistant ? 'text-stone-500' : 'text-stone-900/70 text-right'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 shadow-md">
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-stone-400 mt-1 font-medium">You</span>
        </div>
      )}
    </div>
  );
};
