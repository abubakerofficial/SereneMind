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
  private idleSuspendTimer: any = null;

  get isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }

  private getAudioContext(): AudioContext {
    if (this.idleSuspendTimer) {
      clearTimeout(this.idleSuspendTimer);
      this.idleSuspendTimer = null;
    }
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private scheduleIdleSuspend(delayMs = 2500) {
    if (this.isAmbientActive || this.isCurrentlySpeaking) return;
    if (this.idleSuspendTimer) clearTimeout(this.idleSuspendTimer);
    this.idleSuspendTimer = setTimeout(() => {
      if (this.ctx && this.ctx.state === 'running' && !this.isAmbientActive && !this.isCurrentlySpeaking) {
        this.ctx.suspend().catch(() => {});
      }
    }, delayMs);
  }

  // Play celestial shooting star wishing chime
  playShootingStarChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      // Magical twinkling arpeggio (E6, G#6, B6, E7)
      const freqs = [1318.51, 1661.22, 1975.53, 2637.02];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.3);
      });
      this.scheduleIdleSuspend(3000);
    } catch {}
  }

  // Play celebratory calm completion music when practice finishes
  playCompletionMusic() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      // Soothing Cmaj9 arpeggio: C4, E4, G4, B4, D5, C5
      const notes = [
        { freq: 261.63, time: 0.0, dur: 3.2, gain: 0.12 },
        { freq: 329.63, time: 0.35, dur: 3.0, gain: 0.10 },
        { freq: 392.0, time: 0.7, dur: 2.8, gain: 0.09 },
        { freq: 493.88, time: 1.05, dur: 2.6, gain: 0.08 },
        { freq: 587.33, time: 1.4, dur: 2.5, gain: 0.07 },
        { freq: 523.25, time: 1.75, dur: 3.0, gain: 0.11 },
      ];

      notes.forEach(({ freq, time, dur, gain: noteGain }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        // Soft harmonic
        const osc2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, now + time);

        g.gain.setValueAtTime(0, now + time);
        g.gain.linearRampToValueAtTime(noteGain, now + time + 0.12);
        g.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

        g2.gain.setValueAtTime(0, now + time);
        g2.gain.linearRampToValueAtTime(noteGain * 0.25, now + time + 0.1);
        g2.gain.exponentialRampToValueAtTime(0.0001, now + time + dur * 0.8);

        osc.connect(g);
        osc2.connect(g2);
        g.connect(ctx.destination);
        g2.connect(ctx.destination);

        osc.start(now + time);
        osc2.start(now + time);
        osc.stop(now + time + dur + 0.1);
        osc2.stop(now + time + dur + 0.1);
      });
    } catch {
      // AudioContext blocked before gesture
    }
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

  private ambientNodes: {
    gainNode: GainNode | null;
    oscillators: OscillatorNode[];
    sources: AudioBufferSourceNode[];
    intervals: any[];
  } = {
    gainNode: null,
    oscillators: [],
    sources: [],
    intervals: [],
  };
  private currentAmbientTrack: string | null = null;
  private currentAmbientVolume: number = 0.4;

  get isAmbientActive(): boolean {
    return this.currentAmbientTrack !== null;
  }

  get ambientTrack(): string | null {
    return this.currentAmbientTrack;
  }

  get ambientVolume(): number {
    return this.currentAmbientVolume;
  }

  setAmbientVolume(vol: number) {
    this.currentAmbientVolume = Math.max(0, Math.min(1, vol));
    if (this.ambientNodes.gainNode && this.ctx) {
      this.ambientNodes.gainNode.gain.setValueAtTime(this.currentAmbientVolume, this.ctx.currentTime);
    }
  }

  stopAmbientSound() {
    this.ambientNodes.intervals.forEach((id) => clearInterval(id));
    this.ambientNodes.intervals = [];

    this.ambientNodes.oscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.ambientNodes.oscillators = [];

    this.ambientNodes.sources.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch {}
    });
    this.ambientNodes.sources = [];

    if (this.ambientNodes.gainNode) {
      try {
        this.ambientNodes.gainNode.disconnect();
      } catch {}
      this.ambientNodes.gainNode = null;
    }

    this.currentAmbientTrack = null;
  }

  startAmbientSound(
    trackId: '432hz' | 'singing-bowls' | 'rain' | 'ocean' | 'theta' | 'piano-strings' | 'cosmic-universe',
    volume = 0.4
  ) {
    this.stopAmbientSound();
    try {
      const ctx = this.getAudioContext();
      this.currentAmbientVolume = volume;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);
      this.ambientNodes.gainNode = masterGain;
      this.currentAmbientTrack = trackId;

      if (trackId === 'piano-strings') {
        // Celestial ambient piano & strings chord progression (Fmaj7 -> Am -> G -> C)
        const chordNotes = [
          [174.61, 220.0, 261.63, 329.63], // Fmaj7
          [220.0, 261.63, 329.63, 440.0],  // Am
          [196.0, 246.94, 293.66, 392.0],  // G
          [261.63, 329.63, 392.0, 523.25], // Cmaj
        ];

        let chordIndex = 0;
        const playNextChord = () => {
          if (!this.ctx || this.currentAmbientTrack !== 'piano-strings') return;
          const now = this.ctx.currentTime;
          const currentNotes = chordNotes[chordIndex];
          chordIndex = (chordIndex + 1) % chordNotes.length;

          currentNotes.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const g = this.ctx!.createGain();
            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.15);

            g.gain.setValueAtTime(0, now + idx * 0.15);
            g.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + idx * 0.15 + 0.3);
            g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 4.8);

            osc.connect(g);
            g.connect(masterGain);
            osc.start(now + idx * 0.15);
            osc.stop(now + idx * 0.15 + 5.0);
          });
        };

        playNextChord();
        const intervalId = setInterval(playNextChord, 4500);
        this.ambientNodes.intervals.push(intervalId);
      } else if (trackId === '432hz') {
        // Deep 432 Hz Solfeggio healing chord (432Hz root, 216Hz sub, 648Hz 5th harmonic)
        const freqs = [108, 216, 432, 648];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = idx === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Gentle vibrato LFO
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.08 + idx * 0.02, ctx.currentTime);
          lfoGain.gain.setValueAtTime(0.8, ctx.currentTime);
          lfo.connect(osc.frequency);
          lfo.start();
          this.ambientNodes.oscillators.push(lfo);

          const baseGain = idx === 2 ? 0.12 : 0.06;
          g.gain.setValueAtTime(baseGain, ctx.currentTime);
          osc.connect(g);
          g.connect(masterGain);
          osc.start();
          this.ambientNodes.oscillators.push(osc);
        });
      } else if (trackId === 'singing-bowls') {
        // Resonant Tibetan Bowls Simulation
        const bowlFreqs = [136.1, 272.2, 408.3, 544.4];
        bowlFreqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Slow beating pulsation
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.15 + idx * 0.05, ctx.currentTime);
          lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
          lfo.connect(osc.frequency);
          lfo.start();
          this.ambientNodes.oscillators.push(lfo);

          g.gain.setValueAtTime(0.08 / (idx + 1), ctx.currentTime);
          osc.connect(g);
          g.connect(masterGain);
          osc.start();
          this.ambientNodes.oscillators.push(osc);
        });
      } else if (trackId === 'rain') {
        // Synthesize rain using pink/filtered noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.08;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
        this.ambientNodes.sources.push(whiteNoise);
      } else if (trackId === 'ocean') {
        // Ocean swell simulation with moving resonant filter
        const bufferSize = ctx.sampleRate * 3;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, ctx.currentTime);

        // Slow 0.12 Hz LFO (8 second wave cycle)
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
        lfoGain.gain.setValueAtTime(450, ctx.currentTime);
        lfo.connect(filter.frequency);
        lfo.start();
        this.ambientNodes.oscillators.push(lfo);

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
        this.ambientNodes.sources.push(noise);
      } else if (trackId === 'theta') {
        // Theta 4Hz binaural wave (108Hz carrier + 112Hz companion)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        oscL.type = 'sine';
        oscR.type = 'sine';
        oscL.frequency.setValueAtTime(108, ctx.currentTime);
        oscR.frequency.setValueAtTime(112, ctx.currentTime); // 4Hz difference = Theta state

        const gL = ctx.createGain();
        const gR = ctx.createGain();
        gL.gain.setValueAtTime(0.09, ctx.currentTime);
        gR.gain.setValueAtTime(0.09, ctx.currentTime);

        oscL.connect(gL);
        oscR.connect(gR);
        gL.connect(masterGain);
        gR.connect(masterGain);

        oscL.start();
        oscR.start();
        this.ambientNodes.oscillators.push(oscL, oscR);
      } else if (trackId === 'cosmic-universe') {
        // Deep space cosmic resonance: Sub 54Hz drone, 108Hz carrier, 216Hz & 432Hz ethereal harmonics with slow cosmic phasing
        const cosmicFreqs = [54, 108, 216, 432, 648];
        cosmicFreqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx === 0 ? 'sine' : idx === 1 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Deep cosmic slow drifting LFO
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.04 + idx * 0.015, ctx.currentTime);
          lfoGain.gain.setValueAtTime(freq * 0.02, ctx.currentTime);
          lfo.connect(osc.frequency);
          lfo.start();
          this.ambientNodes.oscillators.push(lfo);

          const baseVol = idx === 0 ? 0.09 : idx === 1 ? 0.07 : idx === 3 ? 0.06 : 0.03;
          gain.gain.setValueAtTime(baseVol, ctx.currentTime);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start();
          this.ambientNodes.oscillators.push(osc);
        });
      }
    } catch {
      // AudioContext policy
    }
  }

  // Play voice with Web Speech Synthesis (bilingual: Urdu and English)
  speakFallback(text: string, onEnd?: () => void): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }
    this.stopPlayback();

    const cleanText = text.replace(/[*_#`~[\]]/g, '').trim();
    if (!cleanText) return false;

    const isUrdu = /[\u0600-\u06FF]/.test(cleanText);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = isUrdu ? 0.92 : 0.95; // natural speaking pace
    utterance.pitch = isUrdu ? 0.95 : 1.0;
    utterance.lang = isUrdu ? 'ur-PK' : 'en-US';

    // Pick ideal voice based on detected language
    const voices = window.speechSynthesis.getVoices();
    if (isUrdu) {
      const urduVoice =
        voices.find((v) => v.lang.startsWith('ur') || v.name.toLowerCase().includes('urdu')) ||
        voices.find((v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')) ||
        voices.find((v) => v.lang.startsWith('ar') || v.lang.startsWith('fa'));
      if (urduVoice) {
        utterance.voice = urduVoice;
      }
    } else {
      const englishVoice =
        voices.find(
          (v) =>
            (v.name.includes('Natural') ||
              v.name.includes('Samantha') ||
              v.name.includes('Google') ||
              v.name.includes('Karen') ||
              v.name.includes('Serena')) &&
            v.lang.startsWith('en')
        ) || voices.find((v) => v.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
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
