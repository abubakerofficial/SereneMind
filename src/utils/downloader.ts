/**
 * Generates an actual downloadable WAV audio file of 432 Hz Solfeggio healing harmonics.
 * Works natively in any modern browser without external servers.
 */
export function download432HzAudio(durationSeconds = 15, filename = 'SereneMind-432Hz-Healing-Audio.wav') {
  const sampleRate = 44100;
  const numChannels = 2;
  const totalSamples = sampleRate * durationSeconds;
  const audioBuffer = new Float32Array(totalSamples);

  // Synthesize 432Hz fundamental + 216Hz subharmonic + 648Hz gentle harmonic
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const wave1 = Math.sin(2 * Math.PI * 432 * t) * 0.4;
    const wave2 = Math.sin(2 * Math.PI * 216 * t) * 0.25;
    const wave3 = Math.sin(2 * Math.PI * 648 * t) * 0.15;
    
    // Smooth fade-in and fade-out envelope
    let envelope = 1.0;
    if (t < 2.0) {
      envelope = t / 2.0;
    } else if (t > durationSeconds - 2.0) {
      envelope = (durationSeconds - t) / 2.0;
    }

    audioBuffer[i] = (wave1 + wave2 + wave3) * envelope;
  }

  // Convert to 16-bit PCM WAV
  const buffer = new ArrayBuffer(44 + totalSamples * 2 * numChannels);
  const view = new DataView(buffer);

  function writeString(offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  // RIFF Chunk Descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + totalSamples * 2 * numChannels, true);
  writeString(8, 'WAVE');

  // fmt sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // SubChunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * numChannels * 2, true); // ByteRate
  view.setUint16(32, numChannels * 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample (16 bits)

  // data sub-chunk
  writeString(36, 'data');
  view.setUint32(40, totalSamples * 2 * numChannels, true);

  // Write interleaved PCM audio samples
  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const s = Math.max(-1, Math.min(1, audioBuffer[i]));
    const sampleVal = s < 0 ? s * 0x8000 : s * 0x7FFF;
    // Left channel
    view.setInt16(offset, sampleVal, true);
    offset += 2;
    // Right channel
    view.setInt16(offset, sampleVal, true);
    offset += 2;
  }

  const blob = new Blob([view], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads complete Psychology & Mindfulness Handbook (Offline Guide)
 */
export function downloadPsychologyHandbook() {
  const content = `=====================================================
SERENEMIND AI - COMPLETE PSYCHOLOGY & MINDFULNESS GUIDE
Created by Abubakar & Mohsin
Offline Mental Wellness & Resilience Handbook
=====================================================

1. 4-7-8 BREATHWORK (THE NATURAL TRANQUILIZER)
-----------------------------------------------------
Mechanism: Down-regulates sympathetic nervous system (fight-or-flight)
and stimulates the vagus nerve to slow heart rate.

- INHALE quietly through your nose for 4 seconds.
- HOLD your breath comfortably for 7 seconds.
- EXHALE slowly and audibly through your mouth for 8 seconds.
- Repeat for 4 to 8 cycles.

2. COGNITIVE BEHAVIORAL THERAPY (CBT) REFRAIMING
-----------------------------------------------------
Core Principle: You feel what you think. Events don't cause stress;
your cognitive interpretation generates the emotion.

Common Distortions to Watch For:
- Catastrophizing: Assuming the absolute worst is inevitable.
  Reframe: "Mistakes are manageable; what is the realistic middle outcome?"
- Mind Reading: Believing others are negatively judging you.
  Reframe: "People are focused on their own lives; I have no telepathic proof."
- All-or-Nothing: Thinking if it isn't flawless, it's a failure.
  Reframe: "Progress is cumulative, not binary perfection."
- Emotional Reasoning: Confusing an internal feeling with external facts.
  Reframe: "Anxiety is adrenaline weather, not a prophecy of disaster."

3. THE POLYVAGAL THEORY (NERVOUS SYSTEM REGULATION)
-----------------------------------------------------
- Ventral Vagal: Safe, Social, Calm, Connected.
- Sympathetic: High alert, Racing thoughts, Adrenaline, Muscle tension.
- Dorsal Vagal: Shutdown, Numbness, Exhaustion.
Reset Tip: Cold water on face, 4-7-8 exhales, and singing/humming stimulate
the vagus nerve back into Ventral Vagal safety.

4. 5-4-3-2-1 SENSORY GROUNDING (INTERRUPT OVERTHINKING)
-----------------------------------------------------
- 5 things you can SEE around you.
- 4 things you can physically TOUCH.
- 3 distinct sounds you can HEAR.
- 2 scents you can SMELL.
- 1 positive taste you can TASTE or grateful breath you can take.

5. RECOMMENDED PSYCHOLOGY CLASSICS
-----------------------------------------------------
- Feeling Good: The New Mood Therapy by David D. Burns, M.D.
- Thinking, Fast and Slow by Daniel Kahneman
- The Body Keeps the Score by Bessel van der Kolk, M.D.
- Man's Search for Meaning by Viktor E. Frankl

=====================================================
SereneMind AI • Crafted by Abubakar & Mohsin
Website: https://ais-pre-r3krmsc3z62vp4n75r3wes-351990971577.asia-east1.run.app
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SereneMind-Psychology-Mindfulness-Guide.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a direct offline Android Launcher shortcut (.html) that directly opens SereneMind
 */
export function downloadAndroidWebShortcut() {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-r3krmsc3z62vp4n75r3wes-351990971577.asia-east1.run.app';
  const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SereneMind AI - Quick Launcher</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#022c22">
  <meta http-equiv="refresh" content="0; url=${currentUrl}">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0c0a09; color: #ecfdf5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; text-align: center; }
    .card { background: #1c1917; border: 1px solid #059669; border-radius: 24px; padding: 32px 24px; max-width: 400px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    h2 { margin: 0 0 8px 0; color: #34d399; font-size: 24px; }
    p { color: #a8a29e; font-size: 14px; margin-bottom: 24px; }
    a { display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; box-sizing: border-box; background: #10b981; color: #022c22; font-weight: bold; text-decoration: none; padding: 14px 20px; border-radius: 14px; font-size: 15px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>SereneMind AI</h2>
    <p>Infinix & Android Quick Offline Launcher<br>Crafted by Abubakar & Mohsin</p>
    <a href="${currentUrl}">🚀 Open SereneMind AI App</a>
  </div>
  <script>window.location.replace("${currentUrl}");</script>
</body>
</html>`;

  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SereneMind-Infinix-Shortcut.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
