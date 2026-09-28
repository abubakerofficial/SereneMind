import React from 'react';
import { Mic, MicOff, Radio } from 'lucide-react';

interface VoiceMicButtonProps {
  isListening: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({
  isListening,
  onToggle,
  disabled = false,
}) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer audio pulse wave rings when active */}
      {isListening && (
        <>
          <div className="absolute w-20 h-20 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
          <div className="absolute w-16 h-16 rounded-full bg-teal-400/30 animate-pulse pointer-events-none" />
        </>
      )}

      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label={isListening ? 'Stop listening' : 'Start speaking voice input'}
        title={isListening ? 'Listening... click to send' : 'Speak to coach (Push to Talk)'}
        className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl transition-all shadow-xl ${
          isListening
            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 ring-4 ring-rose-400/40 scale-105'
            : 'bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-stone-950 font-semibold shadow-emerald-500/25 hover:scale-105 active:scale-95'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        {isListening ? (
          <div className="flex flex-col items-center">
            <Radio className="w-6 h-6 animate-pulse" />
            <span className="text-[9px] font-bold uppercase mt-0.5 tracking-tighter">Live</span>
          </div>
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};
