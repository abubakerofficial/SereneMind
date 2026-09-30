"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Phone, PhoneOff, Sparkles, AlertCircle, Globe, Volume2, VolumeX, Sun, Mic, Send, RefreshCw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

const EXACT_SAFARI_PERMISSION_MESSAGE =
  "Microphone permission denied. Please tap the 'aA' icon in your Safari address bar and allow microphone access specifically for this website.";

const SAMPLE_VOICE_PROMPTS = [
  { urdu: 'مجھے بہت اوورتھنکنگ ہو رہی ہے، کیا کروں؟', eng: 'How to calm severe overthinking?' },
  { urdu: 'ذہن کو پرسکون کرنے کا طریقہ بتائیں', eng: 'Give me a fast way to find inner peace.' },
  { urdu: 'گھبراہٹ اور بے چینی سے کیسے نکلیں؟', eng: 'How do I overcome anxiety and stress?' },
  { urdu: 'رات کو نیند نہیں آ رہی، ذہن چل رہا ہے', eng: 'I cannot sleep because my mind is racing.' },
];

export function VoiceAgent({ theme = 'universe' }: { theme?: 'universe' | 'sunrise' }) {
  const [isActive, setIsActive] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'ur-PK' | 'en-US'>('ur-PK');
  const [statusText, setStatusText] = useState("مائیکروفون پر ٹیپ کریں اور بولیں (Tap to Speak)");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [lastUserQuery, setLastUserQuery] = useState('');
  const [lastReply, setLastReply] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [browserSupportError, setBrowserSupportError] = useState<string | null>(null);
  const [safariPermissionDenied, setSafariPermissionDenied] = useState(false);
  const [customTextInput, setCustomTextInput] = useState('');

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<any>(null);
  const accumulatedTextRef = useRef('');

  // Stop mic and audio visualization
  const stopAudioCapture = useCallback(() => {
    isListeningRef.current = false;
    setIsActive(false);

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }

    setAudioLevel(0);
  }, []);

  // Send collected prompt to Gemini AI
  const sendPromptToAI = useCallback(
    async (textToSend: string) => {
      const cleanText = textToSend.trim();
      if (!cleanText) return;

      stopAudioCapture();
      setLastUserQuery(cleanText);
      setLiveTranscript('');
      accumulatedTextRef.current = '';
      setIsThinking(true);
      setStatusText(
        selectedLang === 'ur-PK'
          ? `آپ نے کہا: "${cleanText}" — ابوبکر سوچ رہا ہے...`
          : `You said: "${cleanText}" — Abu Bakar is thinking...`
      );

      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: cleanText }),
        });
        const data = await res.json();

        setIsThinking(false);
        if (data.reply) {
          setLastReply(data.reply);
          setStatusText(
            selectedLang === 'ur-PK'
              ? 'ابوبکر بول رہا ہے... (Speaking Urdu)'
              : 'Abu Bakar is speaking... (Speaking English)'
          );
          setIsSpeaking(true);
          soundEngine.speakFallback(data.reply, () => {
            setIsSpeaking(false);
            setStatusText(
              selectedLang === 'ur-PK'
                ? 'مدد کے لیے دوبارہ مائیک دبائیں (Ready)'
                : 'Tap mic to talk again (Ready)'
            );
          });
        }
      } catch (e) {
        setIsThinking(false);
        setStatusText('کنکشن کا مسئلہ آیا۔ براہِ کرم دوبارہ بولیں۔');
      }
    },
    [selectedLang, stopAudioCapture]
  );

  // Start real microphone audio meter
  const startAudioMeter = useCallback(async () => {
    try {
      if (!navigator?.mediaDevices?.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateMeter = () => {
        if (!isListeningRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };
      updateMeter();
    } catch (err: any) {
      console.warn('Microphone stream error:', err);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setSafariPermissionDenied(true);
        setStatusText(EXACT_SAFARI_PERMISSION_MESSAGE);
      }
    }
  }, []);

  // Initialize Speech Recognition
  const startListening = useCallback(async () => {
    soundEngine.stopPlayback();
    setIsSpeaking(false);
    accumulatedTextRef.current = '';
    setLiveTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setBrowserSupportError('آپ کا براؤزر وائس سپورٹ نہیں کرتا۔ کروم یا ایج استعمال کریں۔');
      setStatusText('آپ کا براؤزر وائس سپورٹ نہیں کرتا۔');
      return;
    }

    try {
      isListeningRef.current = true;
      setIsActive(true);
      setStatusText(
        selectedLang === 'ur-PK'
          ? 'مائیکروفون فعال ہے... اب بولنا شروع کریں (Listening)'
          : 'Listening... speak now in English'
      );

      await startAudioMeter();

      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang;
      recognition.continuous = true; // Stay alive continuously while user speaks
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setSafariPermissionDenied(false);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += trans;
          } else {
            interim += trans;
          }
        }

        const currentText = final || interim;
        if (currentText) {
          accumulatedTextRef.current = (accumulatedTextRef.current + ' ' + final).trim() || interim;
          setLiveTranscript(accumulatedTextRef.current || interim);
          setStatusText(`سن رہا ہوں: "${accumulatedTextRef.current || interim}"`);

          // Auto-send after 2 seconds of silence once speech is detected
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (accumulatedTextRef.current.trim() && isListeningRef.current) {
              sendPromptToAI(accumulatedTextRef.current);
            }
          }, 2200);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event?.error);
        if (
          event?.error === 'not-allowed' ||
          event?.error === 'service-not-allowed' ||
          event?.error === 'permission-denied'
        ) {
          setSafariPermissionDenied(true);
          setStatusText(EXACT_SAFARI_PERMISSION_MESSAGE);
          stopAudioCapture();
        } else if (event?.error === 'no-speech') {
          // Do NOT crash or stop if user paused for 1 second; keep listening
          if (isListeningRef.current && !accumulatedTextRef.current) {
            setStatusText(
              selectedLang === 'ur-PK'
                ? 'مائیکروفون فعال ہے، براہِ کرم بولیں... (Listening)'
                : 'Listening... speak into your microphone'
            );
          }
        }
      };

      recognition.onend = () => {
        // If still marked as active, restart seamlessly
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch (_) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Recognition start exception:', err);
      stopAudioCapture();
    }
  }, [selectedLang, sendPromptToAI, startAudioMeter, stopAudioCapture]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudioCapture();
      soundEngine.stopPlayback();
    };
  }, [stopAudioCapture]);

  const handleToggle = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (isActive || isSpeaking) {
      if (accumulatedTextRef.current.trim()) {
        sendPromptToAI(accumulatedTextRef.current);
      } else {
        stopAudioCapture();
        soundEngine.stopPlayback();
        setIsSpeaking(false);
        setStatusText('مدد کے لیے مائیک دبائیں (Tap to Speak)');
      }
    } else {
      startListening();
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTextInput.trim()) return;
    sendPromptToAI(customTextInput);
    setCustomTextInput('');
  };

  return (
    <div
      className={`relative z-20 flex flex-col items-center justify-center p-5 sm:p-8 rounded-3xl w-full max-w-xl mx-auto my-4 select-none overflow-hidden transition-all duration-500 ${
        theme === 'universe'
          ? 'bg-slate-900/90 backdrop-blur-xl border border-indigo-500/35 text-white shadow-2xl shadow-indigo-950/70'
          : 'bg-white rounded-3xl shadow-sm border border-slate-100 text-slate-700'
      }`}
    >
      {/* Background Glows */}
      <div
        className={`absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-opacity duration-1000 ${
          theme === 'universe'
            ? 'bg-indigo-600/30 opacity-90'
            : isActive
            ? 'bg-sky-200/50 opacity-100'
            : 'bg-amber-100/60 opacity-80'
        }`}
      />
      <div
        className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-opacity duration-1000 ${
          theme === 'universe'
            ? 'bg-cyan-600/30 opacity-90'
            : isActive
            ? 'bg-teal-200/50 opacity-100'
            : 'bg-sky-100/60 opacity-80'
        }`}
      />

      {/* Header & Language Switcher */}
      <div className="w-full flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${
              theme === 'universe'
                ? 'bg-indigo-950/90 text-cyan-300 border border-indigo-500/40'
                : 'bg-sky-50 text-sky-700 border border-sky-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>لائیو جیمنی وائس (100% Free Live Voice)</span>
          </span>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950/70 border border-indigo-500/30 text-xs">
          <button
            onClick={() => {
              setSelectedLang('ur-PK');
              if (isActive) stopAudioCapture();
            }}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              selectedLang === 'ur-PK'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇵🇰 اردو (Urdu)
          </button>
          <button
            onClick={() => {
              setSelectedLang('en-US');
              if (isActive) stopAudioCapture();
            }}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              selectedLang === 'en-US'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌐 English
          </button>
        </div>
      </div>

      <h3
        className={`text-xl sm:text-2xl font-extrabold text-center mb-1 tracking-tight ${
          theme === 'universe' ? 'text-white' : 'text-slate-700'
        }`}
      >
        {selectedLang === 'ur-PK' ? 'ابوبکر سے لائیو بول کر بات کریں' : 'Live Voice Call with Abu Bakar'}
      </h3>
      <p
        className={`text-xs text-center mb-4 max-w-md leading-relaxed ${
          theme === 'universe' ? 'text-slate-300' : 'text-slate-500'
        }`}
      >
        {selectedLang === 'ur-PK'
          ? 'مائیکروفون پر کلک کریں اور کھل کر بولیں۔ اے آئی آپ کی بات سن کر فوری اور تفصیلی صوتی جواب دے گا۔'
          : 'Speak naturally in English or Urdu. The AI listens continuously and responds with natural voice.'}
      </p>

      {/* Browser Support / Safari Warning */}
      {browserSupportError && (
        <div className="w-full mb-3 p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs flex items-start gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{browserSupportError}</p>
          </div>
        </div>
      )}

      {/* Interactive Microphone Button with Live Wave Audio Visualizer */}
      <div className="relative my-3 flex flex-col items-center justify-center">
        {/* Pulsing rings based on real audio level */}
        {isActive && (
          <>
            <div
              className="absolute rounded-full bg-cyan-400/30 transition-all duration-75 pointer-events-none"
              style={{
                width: `${100 + audioLevel * 1.2}px`,
                height: `${100 + audioLevel * 1.2}px`,
              }}
            />
            <div
              className="absolute rounded-full bg-indigo-500/25 transition-all duration-100 pointer-events-none"
              style={{
                width: `${85 + audioLevel * 0.8}px`,
                height: `${85 + audioLevel * 0.8}px`,
              }}
            />
          </>
        )}

        <button
          onClick={handleToggle}
          className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
            isSpeaking
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white ring-4 ring-emerald-400/40 animate-pulse'
              : isThinking
              ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white ring-4 ring-amber-400/40 animate-spin'
              : isActive
              ? 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white ring-4 ring-rose-400/40 scale-105'
              : theme === 'universe'
              ? 'bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 hover:scale-105 active:scale-95 text-white shadow-cyan-500/30 border border-cyan-300/40'
              : 'bg-gradient-to-tr from-sky-400 to-teal-400 text-white shadow-sky-400/30 hover:scale-105'
          }`}
          title={isActive ? 'بولنا مکمل کریں (Send)' : 'بولنا شروع کریں (Speak)'}
        >
          {isSpeaking ? (
            <Volume2 className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
          ) : isThinking ? (
            <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 animate-spin" />
          ) : isActive ? (
            <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
          ) : (
            <Phone className="w-8 h-8 sm:w-10 sm:h-10" />
          )}
          <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">
            {isSpeaking ? 'بول رہا ہے' : isThinking ? 'سوچ رہا ہے' : isActive ? 'سن رہا ہے' : 'بولیں (Talk)'}
          </span>
        </button>

        {/* Live Audio Level Indicator Bar */}
        {isActive && (
          <div className="mt-3 flex items-center gap-1">
            <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">مائیک کا سگنل:</span>
            <div className="w-24 h-2 rounded-full bg-slate-950 border border-cyan-500/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-75"
                style={{ width: `${Math.max(10, audioLevel)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Real-time Status Caption */}
      <div
        className={`w-full text-center px-4 py-2.5 my-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
          isSpeaking
            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
            : isThinking
            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse'
            : isActive
            ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
            : theme === 'universe'
            ? 'bg-slate-950/60 text-slate-300 border border-indigo-500/20'
            : 'bg-slate-50 text-slate-600 border border-slate-200'
        }`}
      >
        {statusText}
      </div>

      {/* Live Transcript or Complete Button */}
      {isActive && liveTranscript && (
        <div className="w-full flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-950/80 border border-cyan-400/40 text-xs">
          <p className="text-cyan-200 truncate flex-1">"{liveTranscript}"</p>
          <button
            onClick={() => sendPromptToAI(liveTranscript)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold flex items-center gap-1 shadow-md cursor-pointer shrink-0"
          >
            <span>ارسال کریں (Send)</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* User Query & Abu Bakar Reply Dialogue Box */}
      {(lastUserQuery || lastReply) && !isActive && (
        <div className="w-full space-y-2 mt-2 pt-2 border-t border-indigo-500/20 text-xs">
          {lastUserQuery && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/30 text-cyan-200">
              <span className="font-bold text-slate-400 block mb-0.5">آپ کی بات (You said):</span>
              <p className="text-sm font-medium">"{lastUserQuery}"</p>
            </div>
          )}
          {lastReply && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/90 to-slate-900/90 border border-cyan-400/40 text-slate-100 shadow-md">
              <span className="font-bold text-cyan-300 block mb-0.5 flex items-center justify-between">
                <span>ابوبکر کا جواب (Abu Bakar):</span>
                {isSpeaking && <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />}
              </span>
              <p className="text-sm leading-relaxed">{lastReply}</p>
            </div>
          )}
        </div>
      )}

      {/* Fast Text Input Fallback (اگر بولنا نہ چاہیں تو ٹائپ بھی کر سکتے ہیں) */}
      <form onSubmit={handleTextSubmit} className="w-full mt-3 flex items-center gap-2">
        <input
          type="text"
          value={customTextInput}
          onChange={(e) => setCustomTextInput(e.target.value)}
          placeholder={selectedLang === 'ur-PK' ? 'یا یہاں سوال لکھ کر بھیجیں...' : 'Or type your question here...'}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-indigo-500/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Voice Starters */}
      <div className="w-full mt-4 space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 block text-right">
          فوری موضوعات (یا مائیک دبا کر بات کریں):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SAMPLE_VOICE_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => sendPromptToAI(selectedLang === 'ur-PK' ? p.urdu : p.eng)}
              className="p-2 text-left rounded-xl bg-slate-950/50 hover:bg-indigo-950/80 border border-indigo-500/25 hover:border-cyan-400/40 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer truncate"
            >
              {selectedLang === 'ur-PK' ? p.urdu : p.eng}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VoiceAgent;
