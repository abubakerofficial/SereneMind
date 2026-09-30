"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Phone, PhoneOff, Sparkles, Shield, AlertCircle, X, Sun, Waves } from 'lucide-react';

const EXACT_SAFARI_PERMISSION_MESSAGE =
  "Microphone permission denied. Please tap the 'aA' icon in your Safari address bar and allow microphone access specifically for this website.";

export default function VoiceAgent({ theme = 'universe' }: { theme?: 'universe' | 'sunrise' }) {
  const [isActive, setIsActive] = useState(false);
  const [statusText, setStatusText] = useState("مدد کے لیے بٹن دبائیں (Talk with Abu Bakar)");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastReply, setLastReply] = useState('');
  const [browserSupportError, setBrowserSupportError] = useState<string | null>(null);
  const [safariPermissionDenied, setSafariPermissionDenied] = useState(false);

  const recognitionRef = useRef<any>(null);
  const isPermissionDeniedRef = useRef(false);

  useEffect(() => {
    // براؤزر کا فری وائس انجن چیک کریں
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ur-PK, en-US'; // اردو اور انگلش دونوں سمجھے گا
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          isPermissionDeniedRef.current = false;
          setSafariPermissionDenied(false);
          setStatusText("ابوبکر آپ کی بات سن رہا ہے... (Listening)");
        };

        recognition.onresult = async (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (!transcript) return;

          setStatusText(`آپ نے کہا: "${transcript}" — ابوبکر سوچ رہا ہے...`);

          try {
            const res = await fetch("/api/gemini", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: transcript }),
            });
            const data = await res.json();

            if (data.reply) {
              setStatusText("ابوبکر بول رہا ہے... (Speaking)");
              setLastReply(data.reply);
              speakText(data.reply);
            }
          } catch (e) {
            setStatusText("کنکشن کا مسئلہ آیا۔ دوبارہ دبائیں۔");
            setIsActive(false);
            setIsSpeaking(false);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition event error:", event?.error);
          const errorType = event?.error;

          if (
            errorType === 'not-allowed' ||
            errorType === 'service-not-allowed' ||
            errorType === 'permission-denied'
          ) {
            isPermissionDeniedRef.current = true;
            setStatusText(EXACT_SAFARI_PERMISSION_MESSAGE);
            setSafariPermissionDenied(true);
          } else if (errorType !== 'no-speech') {
            setStatusText("آواز صاف نہیں آئی۔ دوبارہ کوشش کریں۔");
          }

          setIsActive(false);
          setIsSpeaking(false);
        };

        recognition.onend = () => {
          setIsActive(false);
          if (!isPermissionDeniedRef.current && !window.speechSynthesis?.speaking) {
            setStatusText("مدد کے لیے بٹن دبائیں (Talk with Abu Bakar)");
          }
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.error("Error initializing SpeechRecognition:", err);
      }
    } else {
      setStatusText("آپ کا براؤزر وائس سپورٹ نہیں کرتا۔ گوگل کروم یا ایج استعمال کریں۔");
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setIsActive(false);
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ur-PK';
      utterance.rate = 0.95;
      utterance.pitch = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find(
        (v) => v.lang.includes('ur') || v.lang.includes('hi') || v.lang.includes('ar')
      );
      if (matchVoice) {
        utterance.voice = matchVoice;
      }

      utterance.onend = () => {
        setIsActive(false);
        setIsSpeaking(false);
        if (!isPermissionDeniedRef.current) {
          setStatusText("مدد کے لیے بٹن دبائیں (Talk with Abu Bakar)");
        }
      };

      utterance.onerror = () => {
        setIsActive(false);
        setIsSpeaking(false);
        if (!isPermissionDeniedRef.current) {
          setStatusText("مدد کے لیے بٹن دبائیں (Talk with Abu Bakar)");
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      setIsActive(false);
      setIsSpeaking(false);
    }
  };

  const handleToggle = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    console.log("Button clicked!", { currentState: isActive });

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition is not supported in this browser.");
      const errorMsg =
        "Your browser does not support voice features. Please use Google Chrome or Edge.";
      setBrowserSupportError(errorMsg);
      setStatusText("آپ کا براؤزر وائس سپورٹ نہیں کرتا۔ برائے مہربانی گوگل کروم یا ایج استعمال کریں۔");
      setIsActive(false);
      return;
    }

    if (isActive) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsActive(false);
      setIsSpeaking(false);
      setStatusText("مدد کے لیے بٹن دبائیں (Talk with Abu Bakar)");
    } else {
      isPermissionDeniedRef.current = false;
      setIsActive(true);
      setStatusText("مائیکروفون شروع ہو رہا ہے... بولنا شروع کریں (Listening)");

      if (navigator?.mediaDevices?.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            stream.getTracks().forEach((track) => track.stop());
            isPermissionDeniedRef.current = false;
            setSafariPermissionDenied(false);
            try {
              recognitionRef.current?.start();
            } catch (err) {
              console.warn("Recognition start after stream:", err);
            }
          })
          .catch((err) => {
            console.warn("getUserMedia permission error:", err);
            if (
              err?.name === 'NotAllowedError' ||
              err?.name === 'PermissionDeniedError' ||
              err?.name === 'SecurityError'
            ) {
              isPermissionDeniedRef.current = true;
              setStatusText(EXACT_SAFARI_PERMISSION_MESSAGE);
              setSafariPermissionDenied(true);
              setIsActive(false);
            } else {
              try {
                recognitionRef.current?.start();
              } catch (_) {}
            }
          });
      } else {
        try {
          recognitionRef.current?.start();
        } catch (err) {
          console.warn("Direct recognition start error:", err);
        }
      }
    }
  };

  return (
    <div
      className={`relative z-20 flex flex-col items-center justify-center p-7 sm:p-10 rounded-3xl w-full max-w-xl mx-auto my-6 select-none overflow-hidden transition-all duration-500 ${
        theme === 'universe'
          ? 'bg-slate-900/80 backdrop-blur-xl border border-indigo-500/30 text-white shadow-2xl shadow-indigo-950/60'
          : 'bg-white rounded-3xl shadow-sm border border-slate-100 text-slate-700'
      }`}
    >
      {/* Background Glows (Cosmic Nebula or Calm Sunrise) */}
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

      {/* Header Tagline & Badge */}
      <div className="flex items-center gap-2 mb-3 pointer-events-none">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${
            theme === 'universe'
              ? 'bg-indigo-950/90 text-cyan-300 border border-indigo-500/40'
              : 'bg-sky-50 text-sky-700 border border-sky-100'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{theme === 'universe' ? 'Cosmic Voice Companion (کائناتی آواز)' : 'Calm Sunrise Voice Companion'}</span>
        </span>
        <span
          className={`text-[11px] font-medium hidden sm:inline ${
            theme === 'universe' ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          · 100% Free Gemini Engine
        </span>
      </div>

      <h3
        className={`text-xl sm:text-2xl font-bold text-center mb-1.5 tracking-tight pointer-events-none ${
          theme === 'universe' ? 'text-white' : 'text-slate-700'
        }`}
      >
        Live Voice Call with Abu Bakar
      </h3>
      <p
        className={`text-xs sm:text-sm text-center mb-7 max-w-md leading-relaxed pointer-events-none ${
          theme === 'universe' ? 'text-slate-300' : 'text-slate-500'
        }`}
      >
        A calm, uplifting sanctuary to gently dissolve overthinking and depression. Speak naturally in Urdu or English.
      </p>

      {/* Browser Support Error Notification */}
      {browserSupportError && (
        <div className="w-full mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 shadow-xs relative z-50 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800">براؤزر سپورٹ الرٹ</p>
            <p className="text-[11px] text-amber-700 mt-0.5">{browserSupportError}</p>
          </div>
          <button
            type="button"
            onClick={() => setBrowserSupportError(null)}
            className="text-amber-500 hover:text-amber-800 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Safari Microphone Permission Denied Instruction Banner */}
      {safariPermissionDenied && (
        <div className="w-full mb-6 p-4.5 rounded-2xl bg-amber-50/95 border-2 border-amber-300 text-amber-900 text-xs shadow-sm relative z-50 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200 mb-2.5">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-amber-200 border border-amber-300 font-mono text-xs font-black text-amber-800 tracking-wider">
                aA
              </span>
              <span>iOS Safari Microphone Guide</span>
            </div>
            <button
              type="button"
              onClick={() => setSafariPermissionDenied(false)}
              className="text-amber-600 hover:text-amber-900 p-1 cursor-pointer"
              title="Close guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="font-medium text-xs text-amber-800 mb-2.5 leading-relaxed">
            Safari needs microphone permission in Website Settings. Please follow these quick steps:
          </p>

          <ol className="space-y-1.5 text-xs text-slate-700 pl-4 list-decimal leading-relaxed">
            <li>
              Look at your Safari address bar and tap the <strong>&lsquo;aA&rsquo;</strong> icon.
            </li>
            <li>
              Tap <strong>&ldquo;Website Settings&rdquo;</strong> (یا ویب سائٹ کی ترتیبات).
            </li>
            <li>
              Find <strong>Microphone</strong> and set it to <strong>&ldquo;Allow&rdquo;</strong>.
            </li>
            <li>
              Tap <strong>Done</strong>, then tap the soothing <strong>&ldquo;Talk Now&rdquo;</strong> button below to start.
            </li>
          </ol>
        </div>
      )}

      {/* Main Calling Button with Breathing / Pulse Animation & Soft Glow */}
      <div
        onClick={handleToggle}
        className={`relative z-50 cursor-pointer w-40 h-40 rounded-full flex items-center justify-center mb-6 transition-all duration-700 ${
          isActive
            ? 'bg-rose-50 border-2 border-rose-300 scale-105 shadow-xl shadow-rose-200/60'
            : 'bg-sky-50/70 border border-sky-100 hover:border-sky-300/80 shadow-md'
        }`}
      >
        {/* Breathing outer halo */}
        <div
          className={`absolute inset-0 rounded-full pointer-events-none transition-all duration-1000 ${
            isActive
              ? 'animate-ping bg-rose-200/40'
              : 'animate-calm-breathe bg-sky-200/30'
          }`}
        />

        <button
          type="button"
          onClick={handleToggle}
          className={`relative z-50 cursor-pointer w-32 h-32 rounded-full text-white font-bold transition-all flex flex-col items-center justify-center gap-1.5 transform active:scale-95 ${
            isActive
              ? 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-lg shadow-rose-200/60'
              : 'bg-gradient-to-r from-sky-400 to-teal-300 hover:from-sky-500 hover:to-teal-400 shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/60 animate-calm-breathe'
          }`}
          title={isActive ? "End Voice Call" : "Start Live Voice Call"}
          aria-label={isActive ? "End Call" : "Talk Now"}
        >
          {isActive ? (
            <>
              <PhoneOff className="w-8 h-8 pointer-events-none animate-pulse" />
              <span className="text-xs tracking-wider uppercase font-black pointer-events-none">End Call</span>
            </>
          ) : (
            <>
              <Phone className="w-8 h-8 pointer-events-none" />
              <span className="text-xs tracking-wider uppercase font-extrabold pointer-events-none">Talk Now</span>
            </>
          )}
        </button>
      </div>

      {/* Status indicator box */}
      <div className="relative z-30 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 max-w-md w-full justify-center shadow-xs">
        {isActive && (
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              isSpeaking ? 'bg-teal-500 animate-bounce' : 'bg-sky-500 animate-ping'
            }`}
          />
        )}
        <p
          className={`text-xs sm:text-sm font-medium text-center leading-relaxed ${
            safariPermissionDenied ? 'text-amber-800' : 'text-slate-700'
          }`}
        >
          {statusText}
        </p>
      </div>

      {/* Last spoken response subtitle preview */}
      {lastReply && isActive && (
        <div className="mt-3.5 w-full p-3 rounded-2xl bg-sky-50/70 border border-sky-100 text-sky-900 text-xs sm:text-sm text-center italic animate-fade-in line-clamp-2">
          &ldquo;{lastReply}&rdquo;
        </div>
      )}

      {/* Uplifting Footer reassurance */}
      <div className="flex items-center gap-2.5 text-xs text-slate-500 mt-5 pointer-events-none">
        <span className="flex items-center gap-1.5 font-medium text-sky-700">
          <Shield className="w-3.5 h-3.5 text-sky-500" />
          100% Free Lifetime Voice
        </span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span>A warm, safe space for your mind</span>
      </div>
    </div>
  );
}

export { VoiceAgent };
