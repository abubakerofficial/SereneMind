import { useState, useEffect, useRef, useCallback } from 'react';

export type SpeechLanguage = 'ur-PK' | 'en-US' | 'auto';
export type DetectedLanguage = 'ur' | 'en' | 'roman-ur';

interface UseVoiceInputOptions {
  language?: SpeechLanguage;
  onResult?: (finalTranscript: string, detectedLang: DetectedLanguage) => void;
}

// Client-side fast language identification helper
export function detectScriptLanguage(text: string): DetectedLanguage {
  const trimmed = text.trim();
  if (!trimmed) return 'ur';

  // 1. Check for Urdu / Arabic Unicode script
  if (/[\u0600-\u06FF]/.test(trimmed)) {
    return 'ur';
  }

  // 2. Check for common Roman Urdu / Hindi keywords
  const romanUrduKeywords = [
    'kya', 'hai', 'hain', 'mein', 'main', 'mujhe', 'mera', 'meri', 'mere',
    'nahi', 'nahin', 'hota', 'hoti', 'hote', 'raha', 'rahi', 'rahe',
    'kaise', 'kaisay', 'bohot', 'bohat', 'bhot', 'tension', 'pareshan',
    'pareshani', 'sukoon', 'dil', 'dimag', 'dimagh', 'neend', 'aati',
    'shukriya', 'karein', 'karo', 'batayein', 'batao', 'soch', 'overthinking'
  ];

  const words = trimmed.toLowerCase().split(/\s+/);
  const matchedWords = words.filter((w) => romanUrduKeywords.includes(w));

  if (matchedWords.length >= 2 || (matchedWords.length === 1 && words.length <= 3)) {
    return 'roman-ur';
  }

  return 'en';
}

export function useVoiceInput(options?: UseVoiceInputOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SpeechLanguage>(
    options?.language || 'ur-PK'
  );
  const [detectedLanguage, setDetectedLanguage] = useState<DetectedLanguage>('ur');

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Safe ignore
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const startListening = useCallback(
    (langOverride?: SpeechLanguage) => {
      setError(null);
      if (typeof window === 'undefined') return;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError('آپ کا براؤزر وائس ان پٹ سپورٹ نہیں کرتا۔ برائے مہربانی کروم یا ایج استعمال کریں۔');
        return;
      }

      try {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (_) {}
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        // Determine recognition language: if auto, prefer 'ur-PK' which also captures English phonemes well
        const prefLang = langOverride || selectedLanguage || 'ur-PK';
        recognition.lang = prefLang === 'auto' ? 'ur-PK' : prefLang;

        recognition.onstart = () => {
          isListeningRef.current = true;
          setIsListening(true);
          setError(null);
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
            const detected = detectScriptLanguage(currentText);
            setDetectedLanguage(detected);
          }

          if (final) {
            setTranscript((prev) => {
              const updated = prev ? `${prev} ${final.trim()}` : final.trim();
              const lang = detectScriptLanguage(updated);
              setDetectedLanguage(lang);
              if (options?.onResult) {
                options.onResult(updated, lang);
              }
              return updated;
            });
          }
          setInterimTranscript(interim);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event?.error);
          if (event.error === 'not-allowed') {
            setError('مائیکروفون کی اجازت نہیں ملی۔ براؤزر میں مائیک کی اجازت آن کریں۔ (Microphone access denied)');
            isListeningRef.current = false;
            setIsListening(false);
          } else if (event.error === 'no-speech') {
            // Brief pause: keep waiting
            return;
          } else if (event.error === 'language-not-supported') {
            // Fallback to English
            recognition.lang = 'en-US';
            try {
              recognition.start();
              return;
            } catch (_) {}
          } else {
            setError(`وائس نوٹ: ${event.error || 'آواز دوبارہ ریکارڈ کریں'}`);
            isListeningRef.current = false;
            setIsListening(false);
          }
        };

        recognition.onend = () => {
          if (isListeningRef.current) {
            try {
              recognition.start();
            } catch (_) {}
          } else {
            setIsListening(false);
            setInterimTranscript('');
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        setError(err?.message || 'مائیکروفون شروع نہیں ہو سکا');
        isListeningRef.current = false;
        setIsListening(false);
      }
    },
    [options, selectedLanguage]
  );

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignored
        }
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    detectedLanguage,
    error,
    isSupported,
    selectedLanguage,
    setSelectedLanguage,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  };
}
export default useVoiceInput;
