import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Compass, Zap, Volume2, VolumeX, ShieldCheck, ThermometerSnowflake } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface Star {
  x: number;
  y: number;
  z: number; // 1 to 3 (depth)
  baseRadius: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  color: string;
  trail: { x: number; y: number }[];
}

interface CosmicUniverseBackgroundProps {
  interactive?: boolean;
  showControlsBar?: boolean;
  onStarWish?: (message: string) => void;
}

const STAR_COLORS = [
  '#ffffff', // Supernova White
  '#e0f2fe', // Celestial Cyan White
  '#38bdf8', // Pastel Sky Cyan
  '#818cf8', // Indigo Star
  '#c084fc', // Violet Star
  '#fde68a', // Golden Amber Star
];

const WISH_AFFIRMATIONS = [
  'کائنات کا سکون آپ کے دل و دماغ میں اتر رہا ہے... (Deep peace within)',
  'جیسے ستارے چمکتے ہیں، آپ کا ذہن بھی روشن اور پرسکون ہے... (Mind clear as starlight)',
  'ہر گہرے سانس کے ساتھ تمام وسوسے اور الجھنیں ختم ہو رہی ہیں... (Letting go of overthinking)',
  'آپ اس وسیع کائنات کا ایک خوبصورت، محفوظ حصہ ہیں... (You are safe in the cosmos)',
  'پریشانیاں بادلوں کی طرح گزر جائیں گی، امید کے ستارے ہمیشہ چمکیں گے... (Calm persists forever)',
];

export const CosmicUniverseBackground: React.FC<CosmicUniverseBackgroundProps> = ({
  interactive = true,
  showControlsBar = true,
  onStarWish,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const animFrameRef = useRef<number | null>(null);
  const isLaunchingRef = useRef(false);
  const isVisibleRef = useRef(true);

  // Auto-detect mobile devices for optimal cooling & smoothness
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [coolModeEnabled, setCoolModeEnabled] = useState(true); // Default ON for zero-heat performance
  const [starCount, setStarCount] = useState(48);
  const [constellationsEnabled, setConstellationsEnabled] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(0.8);
  const [cosmicSoundActive, setCosmicSoundActive] = useState(false);
  const [lastAffirmation, setLastAffirmation] = useState<string | null>(null);

  useEffect(() => {
    const isMobile =
      typeof window !== 'undefined'
        ? window.innerWidth <= 850 ||
          'ontouchstart' in window ||
          (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)
        : false;

    setIsMobileDevice(isMobile);
    if (isMobile) {
      setStarCount(45);
      setConstellationsEnabled(false);
    } else {
      setStarCount(90);
      setConstellationsEnabled(true);
    }
  }, []);

  // Initialize lightweight stars
  const initStars = useCallback((width: number, height: number, count: number) => {
    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      const z = Math.random() * 2 + 1; // 1 to 3
      const baseRadius = (Math.random() * 1.2 + 0.4) / (4 - z);
      const baseAlpha = Math.random() * 0.5 + 0.35;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        baseRadius,
        radius: baseRadius,
        alpha: baseAlpha,
        baseAlpha,
        twinkleSpeed: Math.random() * 0.02 + 0.006,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.1 * z,
        vy: (Math.random() - 0.5) * 0.08 * z,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      });
    }
    starsRef.current = stars;
  }, []);

  // Launch a realistic shooting star across the cosmic sky
  const launchShootingStar = useCallback((isManual = false) => {
    if (isLaunchingRef.current) return;
    isLaunchingRef.current = true;
    setTimeout(() => {
      isLaunchingRef.current = false;
    }, 500);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const startX = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
    const startY = Math.random() * (canvas.height * 0.35);
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.25; // ~45 deg downward
    const speed = Math.random() * 8 + 11;

    shootingStarsRef.current.push({
      x: startX,
      y: startY,
      length: Math.random() * 60 + 60,
      speed,
      angle,
      opacity: 1,
      color: Math.random() > 0.4 ? '#38bdf8' : '#fef08a',
      trail: [],
    });

    // Only play audio synthesizer on user-triggered wish (saves phone battery & CPU)
    if (isManual) {
      soundEngine.playShootingStarChime();
      const affirmation = WISH_AFFIRMATIONS[Math.floor(Math.random() * WISH_AFFIRMATIONS.length)];
      setLastAffirmation(affirmation);
      if (onStarWish) onStarWish(affirmation);

      setTimeout(() => {
        setLastAffirmation(null);
      }, 4500);
    }
  }, [onStarWish]);

  // Main high-performance canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    initStars(width, height, starCount);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars(width, height, starCount);
    };

    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let nextShootingStarTime = Date.now() + 6000;
    let lastFrameTime = performance.now();
    const targetInterval = coolModeEnabled ? 22 : 16;

    const render = (now: number) => {
      // Pause rendering when tab is in background or phone is locked
      if (!isVisibleRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const elapsed = now - lastFrameTime;
      if (elapsed < targetInterval) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min(elapsed / 16.667, 1.8);
      lastFrameTime = now;

      // Clear Canvas efficiently (CSS background handles nebula gradients)
      ctx.clearRect(0, 0, width, height);

      const stars = starsRef.current;
      const mouse = mouseRef.current;

      // Batch Render Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        star.twinklePhase += star.twinkleSpeed * speedMultiplier * dt;
        star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.3;
        star.alpha = Math.max(0.12, Math.min(0.95, star.alpha));

        star.x += star.vx * speedMultiplier * dt;
        star.y += star.vy * speedMultiplier * dt;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Desktop mouse attraction only
        if (mouse.active) {
          const dx = mouse.x - star.x;
          const dy = mouse.y - star.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 14400) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 120) * 0.25;
            star.x += (dx / dist) * force;
            star.y += (dy / dist) * force;
          }
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();

        if (!isMobileDevice && star.z > 2.6) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha * 0.18;
          ctx.fill();
        }
      }

      // Constellations
      if (constellationsEnabled && !coolModeEnabled) {
        ctx.lineWidth = 0.5;
        const limit = Math.min(stars.length, 40);
        for (let i = 0; i < limit; i += 3) {
          const s1 = stars[i];
          const s2 = stars[(i + 1) % limit];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 6400) {
            const dist = Math.sqrt(distSq);
            ctx.strokeStyle = '#38bdf8';
            ctx.globalAlpha = (1 - dist / 80) * 0.15;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }
      }

      // Automatic visual shooting star (silent & lightweight)
      if (Date.now() > nextShootingStarTime) {
        launchShootingStar(false);
        nextShootingStarTime = Date.now() + Math.random() * 7000 + 5000;
      }

      // Update & Draw Shooting Stars
      const shootingStars = shootingStarsRef.current;
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];

        s.x += Math.cos(s.angle) * s.speed * dt;
        s.y += Math.sin(s.angle) * s.speed * dt;
        s.opacity -= 0.02 * dt;

        s.trail.unshift({ x: s.x, y: s.y });
        if (s.trail.length > 14) s.trail.pop();

        if (s.opacity <= 0 || s.x < 0 || s.x > width || s.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        ctx.strokeStyle = `rgba(56, 189, 248, ${s.opacity * 0.6})`;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.globalAlpha = s.opacity;

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = s.opacity;
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // Desktop mouse listeners only
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    if (interactive && !isMobileDevice) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    const handleCustomTrigger = () => {
      launchShootingStar(true);
    };
    window.addEventListener('launch-shooting-star', handleCustomTrigger);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('launch-shooting-star', handleCustomTrigger);
      if (interactive && !isMobileDevice) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [initStars, starCount, constellationsEnabled, speedMultiplier, interactive, launchShootingStar, coolModeEnabled, isMobileDevice]);

  // Toggle ambient deep-space cosmic sound
  const handleToggleCosmicSound = () => {
    if (cosmicSoundActive) {
      soundEngine.stopAmbientSound();
      setCosmicSoundActive(false);
    } else {
      soundEngine.startAmbientSound('cosmic-universe', 0.4);
      setCosmicSoundActive(true);
    }
  };

  return (
    <>
      {/* GPU-Accelerated Static Nebula Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-[#050814]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(49, 46, 129, 0.22) 0%, transparent 60%),
            radial-gradient(circle at 80% 65%, rgba(14, 116, 144, 0.18) 0%, transparent 55%),
            radial-gradient(circle at 50% 85%, rgba(88, 28, 135, 0.14) 0%, transparent 50%)
          `,
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      {/* Lightweight Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        aria-hidden="true"
      />

      {/* Floating Starlight Wish Affirmation Notification */}
      {lastAffirmation && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-slate-900/95 border border-cyan-400/40 text-cyan-200 text-xs sm:text-sm font-medium shadow-2xl backdrop-blur-xl animate-fade-in flex items-center gap-2 pointer-events-none">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>{lastAffirmation}</span>
        </div>
      )}

      {/* Cosmic Navigation & Universe Controls Widget */}
      {showControlsBar && (
        <aside
          aria-label="Cosmic Universe Controls"
          className="fixed bottom-20 lg:bottom-5 right-3 lg:right-4 z-40 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#090e24]/90 backdrop-blur-xl border border-indigo-500/30 shadow-2xl shadow-indigo-950/80 text-xs text-slate-300 animate-fade-in select-none"
        >
          {/* Make a Wish / Launch Shooting Star */}
          <button
            onClick={() => launchShootingStar(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold transition-all shadow-md shadow-cyan-500/25 active:scale-95 cursor-pointer"
            title="Launch a shooting star & make a mindful wish (خواہش کا تارا چمکائیں)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">خواہش کا تارا</span>
            <span className="sm:hidden">تارا</span>
          </button>

          {/* Smart Cool / Battery Saver Mode */}
          <button
            onClick={() => setCoolModeEnabled(!coolModeEnabled)}
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
              coolModeEnabled
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={coolModeEnabled ? 'اسمارٹ کولنگ فعال ہے (Zero Lag & Zero Heat Mode)' : 'کولنگ موڈ آن کریں'}
            aria-label="Smart Cooling Mode"
          >
            <ThermometerSnowflake className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline text-[10px] font-bold">کول موڈ</span>
          </button>

          {/* Toggle Constellations */}
          <button
            onClick={() => setConstellationsEnabled(!constellationsEnabled)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              constellationsEnabled
                ? 'bg-indigo-950/80 text-cyan-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={constellationsEnabled ? 'جھرمٹ فعال ہیں' : 'جھرمٹ بند'}
            aria-label="Toggle Constellations"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Cosmic Sound Frequency Toggle */}
          <button
            onClick={handleToggleCosmicSound}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              cosmicSoundActive
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 animate-pulse'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={cosmicSoundActive ? 'کائناتی آواز جاری ہے' : 'کائناتی 432Hz آواز چلائیں'}
            aria-label="Toggle Cosmic Sound Frequency"
          >
            {cosmicSoundActive ? <Volume2 className="w-4 h-4 text-cyan-300" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </aside>
      )}
    </>
  );
};

export default CosmicUniverseBackground;
