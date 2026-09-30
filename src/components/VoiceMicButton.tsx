import React from 'react';
import { Mic, Radio } from 'lucide-react';

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
          <div className="absolute w-24 h-24 rounded-full bg-rose-300/30 animate-ping pointer-events-none" />
          <div className="absolute w-20 h-20 rounded-full bg-sky-300/40 animate-pulse pointer-events-none" />
        </>
      )}

      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label={isListening ? 'Stop listening' : 'Start speaking voice input'}
        title={isListening ? 'Listening... click to send' : 'Speak to coach (Push to Talk)'}
        className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-3xl transition-all ${
          isListening
            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200/60 ring-4 ring-rose-300/40 scale-105'
            : 'bg-gradient-to-r from-sky-400 to-teal-300 hover:from-sky-500 hover:to-teal-400 text-white font-bold shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/60 hover:scale-105 active:scale-95 animate-calm-breathe'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {isListening ? (
          <div className="flex flex-col items-center">
            <Radio className="w-6 h-6 animate-pulse" />
            <span className="text-[9px] font-bold uppercase mt-0.5 tracking-tighter">Live</span>
          </div>
        ) : (
          <Mic className="w-7 h-7" />
        )}
      </button>
    </div>
  );
};

