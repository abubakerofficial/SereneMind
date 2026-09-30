import { useState, useEffect, useRef, useCallback } from 'react';

export type SpeechLanguage = 'ur-PK' | 'en-US' | 'hi-IN';

interface UseVoiceInputOptions {
  language?: SpeechLanguage;
  onResult?: (finalTranscript: string) => void;
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
        // Accurate BCP 47 language code: 'ur-PK' for Urdu, 'en-US' for English
        const activeLang = langOverride || selectedLanguage || 'ur-PK';
        recognition.lang = activeLang;

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

          if (final) {
            setTranscript((prev) => {
              const updated = prev ? `${prev} ${final.trim()}` : final.trim();
              if (options?.onResult) {
                options.onResult(updated);
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
            // Normal brief pause: do NOT abort listening, keep waiting for speech
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
          isListeningRef.current = false;
          setIsListening(false);
          setInterimTranscript('');
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
