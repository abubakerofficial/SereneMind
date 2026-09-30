import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Compass, Zap, Volume2, VolumeX, Eye, Moon, Stars } from 'lucide-react';
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
  'ब्रह्मांड की शांति आपके मन में उतर रही है... (Deep peace within)',
  'जैसे तारे चमकते हैं, आपका मन भी शांत और स्पष्ट है... (Mind clear as starlight)',
  'हर सांस के साथ ओवरथिंकिंग दूर हो रही है... (Letting go of overthinking)',
  'आप इस विशाल ब्रह्मांड का एक सुंदर, सुरक्षित हिस्सा हैं... (You are safe in the cosmos)',
  'चिंताएं बादलों की तरह बह जाएंगी, सितारे हमेशा चमकेंगे... (Calm persists forever)',
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

  const [starCount, setStarCount] = useState(240);
  const [constellationsEnabled, setConstellationsEnabled] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [cosmicSoundActive, setCosmicSoundActive] = useState(false);
  const [lastAffirmation, setLastAffirmation] = useState<string | null>(null);

  // Initialize stars
  const initStars = useCallback((width: number, height: number, count: number) => {
    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      const z = Math.random() * 2 + 1; // 1 to 3
      const baseRadius = (Math.random() * 1.5 + 0.5) / (4 - z);
      const baseAlpha = Math.random() * 0.6 + 0.35;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        baseRadius,
        radius: baseRadius,
        alpha: baseAlpha,
        baseAlpha,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.15 * z,
        vy: (Math.random() - 0.5) * 0.12 * z,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      });
    }
    starsRef.current = stars;
  }, []);

  // Launch a realistic shooting star across the cosmic sky
  const launchShootingStar = useCallback((customStart?: { x: number; y: number }) => {
    if (isLaunchingRef.current) return;
    isLaunchingRef.current = true;
    setTimeout(() => {
      isLaunchingRef.current = false;
    }, 400);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const startX = customStart ? customStart.x : Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
    const startY = customStart ? customStart.y : Math.random() * (canvas.height * 0.4);

    const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.35; // Around 45 degrees downward
    const speed = Math.random() * 9 + 13;

    shootingStarsRef.current.push({
      x: startX,
      y: startY,
      length: Math.random() * 90 + 90,
      speed,
      angle,
      opacity: 1,
      color: Math.random() > 0.4 ? '#38bdf8' : '#fef08a',
      trail: [],
    });

    // Play subtle celestial chime
    soundEngine.playShootingStarChime();

    // Pick a calming affirmation
    const affirmation = WISH_AFFIRMATIONS[Math.floor(Math.random() * WISH_AFFIRMATIONS.length)];
    setLastAffirmation(affirmation);
    if (onStarWish) onStarWish(affirmation);

    setTimeout(() => {
      setLastAffirmation(null);
    }, 4500);
  }, [onStarWish]);

  // Canvas render & animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
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

    window.addEventListener('resize', handleResize);

    // Natural random shooting stars every 5-9 seconds
    let nextShootingStarTime = Date.now() + 4000;

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.667, 2);
      lastTime = now;

      // 1. Draw Deep Universe Void Background
      ctx.fillStyle = '#060814';
      ctx.fillRect(0, 0, width, height);

      // 2. Interstellar Nebula Clouds
      const grad1 = ctx.createRadialGradient(
        width * 0.2, height * 0.3, 20,
        width * 0.2, height * 0.3, width * 0.45
      );
      grad1.addColorStop(0, 'rgba(49, 46, 129, 0.22)'); // Deep indigo
      grad1.addColorStop(0.5, 'rgba(15, 23, 42, 0.12)');
      grad1.addColorStop(1, 'rgba(6, 8, 20, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.75, height * 0.6, 30,
        width * 0.75, height * 0.6, width * 0.4
      );
      grad2.addColorStop(0, 'rgba(14, 116, 144, 0.18)'); // Cyan nebula
      grad2.addColorStop(0.5, 'rgba(88, 28, 135, 0.12)'); // Violet dust
      grad2.addColorStop(1, 'rgba(6, 8, 20, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      const stars = starsRef.current;
      const mouse = mouseRef.current;

      // 3. Update & Draw Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Twinkle calculation
        star.twinklePhase += star.twinkleSpeed * speedMultiplier * dt;
        star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.35;
        star.alpha = Math.max(0.1, Math.min(1, star.alpha));

        // Subtle cosmic drifting
        star.x += star.vx * speedMultiplier * dt;
        star.y += star.vy * speedMultiplier * dt;

        // Wrap around boundaries
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Mouse gravitational attraction
        if (mouse.active) {
          const dx = mouse.x - star.x;
          const dy = mouse.y - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (1 - dist / 150) * 0.35;
            star.x += (dx / dist) * force;
            star.y += (dy / dist) * force;
            star.alpha = Math.min(1, star.alpha + 0.3);
          }
        }

        // Draw star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();

        // Extra soft starlight halo for larger stars
        if (star.z > 2.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha * 0.22;
          ctx.fill();
        }
      }

      // 4. Draw Constellations (Connecting nearby stars)
      if (constellationsEnabled) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < stars.length; i += 2) {
          const s1 = stars[i];
          for (let j = i + 1; j < Math.min(i + 8, stars.length); j++) {
            const s2 = stars[j];
            const dx = s1.x - s2.x;
            const dy = s1.y - s2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 75) {
              const lineAlpha = (1 - dist / 75) * 0.16 * Math.min(s1.alpha, s2.alpha);
              ctx.strokeStyle = '#38bdf8';
              ctx.globalAlpha = lineAlpha;
              ctx.beginPath();
              ctx.moveTo(s1.x, s1.y);
              ctx.lineTo(s2.x, s2.y);
              ctx.stroke();
            }
          }

          // Connect stars near mouse
          if (mouse.active) {
            const dx = mouse.x - s1.x;
            const dy = mouse.y - s1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
              ctx.strokeStyle = '#67e8f9';
              ctx.globalAlpha = (1 - dist / 110) * 0.3;
              ctx.beginPath();
              ctx.moveTo(s1.x, s1.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
            }
          }
        }
      }

      // 5. Update & Draw Shooting Stars (उल्कापिंड)
      if (Date.now() > nextShootingStarTime) {
        launchShootingStar();
        nextShootingStarTime = Date.now() + Math.random() * 5000 + 4000;
      }

      const shootingStars = shootingStarsRef.current;
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];

        s.x += Math.cos(s.angle) * s.speed * dt;
        s.y += Math.sin(s.angle) * s.speed * dt;
        s.opacity -= 0.016 * dt;

        s.trail.unshift({ x: s.x, y: s.y });
        if (s.trail.length > 22) s.trail.pop();

        if (s.opacity <= 0 || s.x < 0 || s.x > width || s.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        // Draw trail gradient
        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        grad.addColorStop(0.6, `rgba(56, 189, 248, ${s.opacity * 0.4})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${s.opacity})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.globalAlpha = s.opacity;

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // Bright leading head
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = s.opacity;
        ctx.fill();

        // Subtle outer glow head
        ctx.beginPath();
        ctx.arc(s.x, s.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.opacity * 0.35;
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // Mouse & Touch listeners for cosmic gravity
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd);
    }

    const handleCustomTrigger = () => {
      launchShootingStar();
    };
    window.addEventListener('launch-shooting-star', handleCustomTrigger);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('launch-shooting-star', handleCustomTrigger);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [initStars, starCount, constellationsEnabled, speedMultiplier, interactive, launchShootingStar]);

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
      {/* Background Interactive Canvas (Universe Starfield) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Floating Starlight Wish Notification */}
      {lastAffirmation && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-slate-900/90 border border-sky-400/40 text-sky-200 text-xs sm:text-sm font-medium shadow-2xl backdrop-blur-xl animate-fade-in flex items-center gap-2 pointer-events-none">
          <Stars className="w-4 h-4 text-amber-300 animate-spin" />
          <span>{lastAffirmation}</span>
        </div>
      )}

      {/* Cosmic Navigation & Universe Controls Widget */}
      {showControlsBar && (
        <aside
          aria-label="Cosmic Universe Controls"
          className="fixed bottom-5 right-4 z-40 flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-indigo-500/30 shadow-2xl shadow-indigo-950/80 text-xs text-slate-300 animate-fade-in select-none"
        >
          {/* Make a Wish / Launch Shooting Star */}
          <button
            onClick={() => launchShootingStar()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold transition-all shadow-md shadow-sky-500/25 active:scale-95 cursor-pointer"
            title="Launch a shooting star & make a mindful wish (सितारा चमकाएं)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">Make a Wish (सितारा)</span>
            <span className="sm:hidden">Wish</span>
          </button>

          {/* Toggle Constellations */}
          <button
            onClick={() => setConstellationsEnabled(!constellationsEnabled)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              constellationsEnabled
                ? 'bg-indigo-950/80 text-cyan-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={constellationsEnabled ? 'Constellations: ON (तारामंडल चालू)' : 'Constellations: OFF'}
            aria-label="Toggle Constellations"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Star Speed Toggle */}
          <button
            onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 2.5 : prev === 2.5 ? 0.4 : 1))}
            className="p-2 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
            title={`Cosmic Motion Speed: ${speedMultiplier === 0.4 ? 'Zen (धीमा)' : speedMultiplier === 1 ? 'Normal (सामान्य)' : 'Warp (तेज़)'}`}
            aria-label="Toggle Cosmic Motion Speed"
          >
            <Zap className={`w-4 h-4 ${speedMultiplier > 1 ? 'text-amber-400' : 'text-slate-400'}`} />
          </button>

          {/* Cosmic Sound Frequency Toggle */}
          <button
            onClick={handleToggleCosmicSound}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              cosmicSoundActive
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 animate-pulse'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={cosmicSoundActive ? 'Cosmic 432Hz Sound: ON (ब्रह्मांडीय ध्वनि)' : 'Play Cosmic 432Hz Sound'}
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
