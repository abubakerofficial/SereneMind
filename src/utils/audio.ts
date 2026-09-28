/**
 * SereneMind Audio Utilities:
 * 1. Web Audio API chime synthesis for meditation/breathing intervals
 * 2. PCM/Audio decoding for Gemini Flash Lite TTS
 * 3. Browser SpeechSynthesis fallback
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private isCurrentlySpeaking: boolean = false;

  get isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }

  private getAudioContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a soft, calming bell chime for breathing guides
  playCalmChime(type: 'inhale' | 'hold' | 'exhale' | 'finish' = 'inhale') {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freqs = {
        inhale: 432, // Healing frequency A4
        hold: 528,   // Transformation / Solfeggio
        exhale: 396,  // Grounding
        finish: 639,  // Harmony
      };

      const freq = freqs[type] || 432;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Soft harmonic overtone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);

      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

      osc.connect(gain);
      osc2.connect(gain2);
      gain.connect(ctx.destination);
      gain2.connect(ctx.destination);

      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 2.3);
      osc2.stop(ctx.currentTime + 2.3);
    } catch {
      // AudioContext may be blocked before user gesture; safe ignore
    }
  }

  // Play PCM 24kHz audio from Gemini TTS
  async playBase64PCM(base64Data: string, sampleRate = 24000): Promise<void> {
    this.stopPlayback();

    const ctx = this.getAudioContext();
    const binary = atob(base64Data);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // Convert raw 16-bit PCM bytes to float32
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }

    const audioBuffer = ctx.createBuffer(1, float32.length, sampleRate);
    audioBuffer.getChannelData(0).set(float32);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    this.currentSource = source;
    this.isCurrentlySpeaking = true;

    return new Promise((resolve) => {
      source.onended = () => {
        if (this.currentSource === source) {
          this.currentSource = null;
        }
        this.isCurrentlySpeaking = false;
        resolve();
      };
      source.start(0);
    });
  }

  stopPlayback() {
    this.isCurrentlySpeaking = false;
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch {
        // Ignored
      }
      this.currentSource = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Play voice with Web Speech Synthesis (reliable fallback)
  speakFallback(text: string, onEnd?: () => void): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }
    this.stopPlayback();

    const cleanText = text.replace(/[*_#`~[\]]/g, '').trim();
    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // natural speaking pace
    utterance.pitch = 1.0;

    // Pick a natural gentle voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        (v.name.includes('Natural') ||
          v.name.includes('Samantha') ||
          v.name.includes('Google') ||
          v.name.includes('Karen') ||
          v.name.includes('Serena')) &&
        v.lang.startsWith('en')
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.isCurrentlySpeaking = true;

    const handleFinished = () => {
      this.isCurrentlySpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onend = handleFinished;
    utterance.onerror = handleFinished;

    window.speechSynthesis.speak(utterance);
    return true;
  }
}

export const soundEngine = new SoundEngine();
