import React, { useState } from 'react';
import {
  Video,
  Play,
  X,
  Wind,
  Sparkles,
  Clock,
  User,
  CheckCircle2,
  ExternalLink,
  Maximize2,
  Tv,
} from 'lucide-react';

export interface MindfulVideoItem {
  id: string;
  youtubeId: string;
  title: string;
  titleUrdu: string;
  category: 'breathing' | 'meditation';
  categoryLabel: string;
  duration: string;
  teacher: string;
  badge: string;
  resolutionBadge: string;
  audioBadge: string;
  thumbnailUrl: string;
  description: string;
  guidedSteps: string[];
}

export const MINDFUL_VIDEOS: MindfulVideoItem[] = [
  // --- BREATHING VIDEOS (HD & 4K) ---
  {
    id: 'vid-478',
    youtubeId: 'gz4G31LGyog',
    title: '4-7-8 Breathing Technique: Relax Nervous System (HD)',
    titleUrdu: '۴-۷-۸ سانس کی تکنیک (اعصابی سکون - ایچ ڈی)',
    category: 'breathing',
    categoryLabel: 'Breathing Video',
    duration: '4:20',
    teacher: 'Dr. Andrew Weil & Mindful Practice',
    badge: 'Vagus Nerve Reset',
    resolutionBadge: '1080p 60fps HD',
    audioBadge: 'Studio Audio',
    thumbnailUrl: 'https://img.youtube.com/vi/gz4G31LGyog/hqdefault.jpg',
    description: 'Learn the exact tongue placement, cadence, and timing of 4-7-8 breathing in crystal-clear HD to quickly down-regulate adrenaline and enter deep rest.',
    guidedSteps: [
      'Place tip of tongue against the tissue ridge right behind upper front teeth.',
      'Exhale completely through mouth with a gentle whooshing sound.',
      'Inhale quietly through nose for 4 seconds, hold for 7 seconds, exhale audibly for 8 seconds.',
    ],
  },
  {
    id: 'vid-box',
    youtubeId: 'FJJazKtH_9I',
    title: 'Box Breathing (4-4-4-4) for Instant Calm & Focus (4K)',
    titleUrdu: 'باکس بریتھنگ (فوری ذہنی فوکس - ۴ کے الٹرا ایچ ڈی)',
    category: 'breathing',
    categoryLabel: 'Breathing Video',
    duration: '5:00',
    teacher: 'Mark Divine / SEALFIT Focus',
    badge: 'High Stress Relief',
    resolutionBadge: '4K Ultra HD',
    audioBadge: 'Dolby 320kbps',
    thumbnailUrl: 'https://img.youtube.com/vi/FJJazKtH_9I/hqdefault.jpg',
    description: 'A visual four-sided square cadence in crisp 4K Ultra HD used by elite performers to eliminate physiological panic and mental fog in seconds.',
    guidedSteps: [
      'Inhale for 4 seconds as the top side of the box expands.',
      'Hold full breath for 4 seconds across the right side.',
      'Exhale smoothly for 4 seconds down the bottom edge.',
      'Hold empty lungs for 4 seconds up the left side before repeating.',
    ],
  },
  {
    id: 'vid-belly',
    youtubeId: 'kgTL5G1ibIo',
    title: 'Diaphragmatic Belly Breathing for Deep Relaxation (HD)',
    titleUrdu: 'پیٹ اور ڈایافرام کی گہری سانس (ایچ ڈی ماسٹر)',
    category: 'breathing',
    categoryLabel: 'Breathing Video',
    duration: '6:15',
    teacher: 'Mindful Movement Clinic',
    badge: 'Core Somatic Reset',
    resolutionBadge: '1080p Full HD',
    audioBadge: 'High Fidelity',
    thumbnailUrl: 'https://img.youtube.com/vi/kgTL5G1ibIo/hqdefault.jpg',
    description: 'Re-train your body from shallow chest breathing into deep diaphragmatic expansion with cinematic clarity, releasing abdominal and shoulder tension.',
    guidedSteps: [
      'Place one hand on your chest and one on your lower abdomen.',
      'Breathe in so only your belly hand rises, while your chest remains steady.',
      'Slowly release tension through parted lips like blowing through a straw.',
    ],
  },
  {
    id: 'vid-nadi',
    youtubeId: '8VwufJrUhic',
    title: 'Alternate Nostril Breathing (Nadi Shodhana) in 4K',
    titleUrdu: 'نادی شودھن (دائیں اور بائیں سانس کا توازن - ۴ کے)',
    category: 'breathing',
    categoryLabel: 'Breathing Video',
    duration: '7:40',
    teacher: 'Yoga with Adriene',
    badge: 'Hemispheric Harmony',
    resolutionBadge: '4K Ultra HD',
    audioBadge: 'Stereo HD',
    thumbnailUrl: 'https://img.youtube.com/vi/8VwufJrUhic/hqdefault.jpg',
    description: 'Ancient pranayama technique recorded in high-definition nature setting that balances both brain hemispheres, clearing mental chatter.',
    guidedSteps: [
      'Use right thumb to close right nostril; inhale slowly through left nostril.',
      'Close left nostril with ring finger; release thumb and exhale through right.',
      'Inhale right, switch, and exhale left to complete one full cycle.',
    ],
  },
  {
    id: 'vid-wimhof',
    youtubeId: 'tybOi4hjZFQ',
    title: 'Guided Wim Hof Method Breathing in 4K Ultra HD',
    titleUrdu: 'وم ہوف بریتھنگ میتھڈ (توانائی اور آکسیجن - ۴ کے)',
    category: 'breathing',
    categoryLabel: 'Breathing Video',
    duration: '11:00',
    teacher: 'Wim Hof Official Channel',
    badge: 'Immune & Energy Reset',
    resolutionBadge: '4K Ultra HD',
    audioBadge: '320 kbps Studio',
    thumbnailUrl: 'https://img.youtube.com/vi/tybOi4hjZFQ/hqdefault.jpg',
    description: 'Full guided round of deep rhythmic breathing and breath retention to alkaline the body, boost cellular oxygen, and eliminate anxiety.',
    guidedSteps: [
      'Take 30 deep conscious breaths through the mouth into belly and chest.',
      'Exhale unforced, then hold breath on empty lungs for 1 minute.',
      'Inhale deeply and hold for 15 seconds before beginning the next round.',
    ],
  },

  // --- MEDITATION VIDEOS (HD & 4K) ---
  {
    id: 'vid-overthinking-med',
    youtubeId: 'inpok4MKVLM',
    title: '10-Minute Guided Meditation to Stop Overthinking (HD)',
    titleUrdu: '۱۰ منٹ میڈیٹیشن (اوور تھنکنگ کا خاتمہ - ایچ ڈی)',
    category: 'meditation',
    categoryLabel: 'Meditation Video',
    duration: '10:15',
    teacher: 'Goodful Mindfulness Coach',
    badge: 'Quieting Racing Thoughts',
    resolutionBadge: '1080p 60fps HD',
    audioBadge: 'Calm Narration HD',
    thumbnailUrl: 'https://img.youtube.com/vi/inpok4MKVLM/hqdefault.jpg',
    description: 'A gentle, studio-narrated guided meditation that teaches you how to step outside obsessive mental loops and anchor yourself in the sensations of the present moment.',
    guidedSteps: [
      'Acknowledge that thoughts are just mental weather passing through a vast blue sky.',
      'Gently redirect attention from thoughts to the sensation of air touching your nostrils.',
      'When your mind wanders, smile internally and return without judgment.',
    ],
  },
  {
    id: 'vid-body-scan',
    youtubeId: 'u4gZgnCy5ew',
    title: 'Full Body Scan Meditation for Deep Tension Release (4K)',
    titleUrdu: 'باڈی اسکین میڈیٹیشن (جسمانی کھچاؤ سے نجات - ۴ کے)',
    category: 'meditation',
    categoryLabel: 'Meditation Video',
    duration: '12:30',
    teacher: 'The Mindful Movement',
    badge: 'Somatic Muscle Release',
    resolutionBadge: '4K Ultra HD',
    audioBadge: 'Dolby Spatial',
    thumbnailUrl: 'https://img.youtube.com/vi/u4gZgnCy5ew/hqdefault.jpg',
    description: 'Systematically travel through your crown, forehead, jaw, neck, shoulders, and legs with pristine 4K visuals to dissolve hidden chronic tension.',
    guidedSteps: [
      'Rest comfortably on a chair or cushion with arms resting naturally.',
      'Send warm attention to your forehead and jaw, consciously letting them soften.',
      'Progress down to chest, back, and fingertips, visualizing tension leaving as warm vapor.',
    ],
  },
  {
    id: 'vid-sleep-nidra',
    youtubeId: '7T08VABG0t4',
    title: 'Deep Sleep & Relaxation Yoga Nidra with 4K Galaxy Visuals',
    titleUrdu: 'پرسکون نیند اور ریلیکسیشن یوگا نیدرا (۴ کے گلیکسی)',
    category: 'meditation',
    categoryLabel: 'Meditation Video',
    duration: '15:20',
    teacher: 'The Honest Guys Studio',
    badge: 'Delta Sleep Induction',
    resolutionBadge: '4K Ultra HD',
    audioBadge: 'Delta Waves HD',
    thumbnailUrl: 'https://img.youtube.com/vi/7T08VABG0t4/hqdefault.jpg',
    description: 'A hypnotic, gentle studio voice paired with 4K galaxy visuals that takes brainwaves from restless beta down to delta sleep waves for deep rest.',
    guidedSteps: [
      'Dim lights and lie on your back with eyes gently shut.',
      'Follow the spoken guidance without trying to concentrate or force sleep.',
      'Allow your consciousness to hover effortlessly between wakefulness and dream state.',
    ],
  },
  {
    id: 'vid-zen-nature',
    youtubeId: '1ZYbU8csArM',
    title: '4K Japanese Zen Garden & Water Stream Meditation',
    titleUrdu: '۴ کے جاپانی زین گارڈن اور چشمہ (خاموشی اور سکون)',
    category: 'meditation',
    categoryLabel: 'Meditation Video',
    duration: '20:00',
    teacher: 'Johnnie Lawson Nature HD',
    badge: 'Pure Nature Silence',
    resolutionBadge: '4K 60fps Cinema',
    audioBadge: 'Binaural Stream HD',
    thumbnailUrl: 'https://img.youtube.com/vi/1ZYbU8csArM/hqdefault.jpg',
    description: 'Immersive 4K high-resolution visual meditation of bamboo fountains, moss stones, and pristine stream sounds for unshakeable mental silence.',
    guidedSteps: [
      'Focus visual attention gently on the ripple of flowing water on the screen.',
      'Match your breath to the sound of each drop splashing on the stone basin.',
      'Let thoughts float away like leaves down a crystal-clear mountain stream.',
    ],
  },
  {
    id: 'vid-loving-kindness',
    youtubeId: '-d_AA9H4z9U',
    title: 'Loving-Kindness (Metta) Emotional Healing Meditation (HD)',
    titleUrdu: 'محبت اور شفقت کی میڈیٹیشن (اندرونی اطمینان - ایچ ڈی)',
    category: 'meditation',
    categoryLabel: 'Meditation Video',
    duration: '8:45',
    teacher: 'Headspace Guided Studio',
    badge: 'Emotional Healing',
    resolutionBadge: '1080p Full HD',
    audioBadge: 'Studio Master',
    thumbnailUrl: 'https://img.youtube.com/vi/-d_AA9H4z9U/hqdefault.jpg',
    description: 'Transform self-criticism, worry, and social anxiety into unconditional inner peace and empathetic warmth for yourself and others.',
    guidedSteps: [
      'Place a warm hand flat over your center chest / heart space.',
      'Whisper silently: "May I be peaceful. May I be safe. May I live with ease."',
      'Radiate that same wish outward to loved ones, acquaintances, and the wider world.',
    ],
  },
];

export const MindfulVideos: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'breathing' | 'meditation'>('all');
  const [activeVideo, setActiveVideo] = useState<MindfulVideoItem | null>(null);

  const filteredVideos = MINDFUL_VIDEOS.filter((vid) => {
    if (selectedCategory === 'all') return true;
    return vid.category === selectedCategory;
  });

  return (
    <section className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-7 shadow-sm text-slate-700 relative">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 shadow-xs">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-700 tracking-tight">
                4K &amp; HD Guided Videos Sanctuary
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                ایچ ڈی ویڈیوز
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-teal-700 border border-slate-200 hidden sm:inline">
                4K Ultra HD • 1080p 60fps
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Certified high-definition video masterclasses for 4-7-8 breathing, diaphragmatic breathwork, Wim Hof, and mindfulness meditation.
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/70 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-sky-400 to-teal-300 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All HD Videos ({MINDFUL_VIDEOS.length})
          </button>
          <button
            onClick={() => setSelectedCategory('breathing')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'breathing'
                ? 'bg-gradient-to-r from-sky-400 to-teal-300 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>HD Breathing ({MINDFUL_VIDEOS.filter((v) => v.category === 'breathing').length})</span>
          </button>
          <button
            onClick={() => setSelectedCategory('meditation')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'meditation'
                ? 'bg-gradient-to-r from-sky-400 to-teal-300 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>HD Meditation ({MINDFUL_VIDEOS.filter((v) => v.category === 'meditation').length})</span>
          </button>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className="group cursor-pointer rounded-2xl bg-white border border-slate-100 hover:border-sky-300 p-3.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md flex flex-col justify-between shadow-xs"
          >
            <div>
              {/* Real HD YouTube Thumbnail with Badges */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-100 border border-slate-200">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                  }}
                />

                {/* Gradient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />

                {/* Center Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-400 to-teal-300 text-white flex items-center justify-center shadow-lg shadow-sky-200/50 group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Resolution Badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/95 text-[9px] font-mono font-bold text-sky-700 border border-slate-200 flex items-center gap-1 shadow-xs">
                  <Tv className="w-3 h-3 text-sky-600" />
                  {video.resolutionBadge}
                </span>

                {/* Duration Badge */}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/90 text-[10px] font-mono font-bold text-white border border-slate-800 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sky-300" />
                  {video.duration}
                </span>
              </div>

              {/* Title & Teacher */}
              <h3 className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-sky-600 transition-colors leading-snug line-clamp-2">
                {video.title}
              </h3>
              <p className="text-[11px] text-teal-600 font-medium mt-0.5">
                {video.titleUrdu}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                <User className="w-3 h-3 text-slate-400" />
                {video.teacher}
              </p>

              {/* Description */}
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {video.description}
              </p>
            </div>

            {/* Bottom Action */}
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-sky-600 group-hover:text-sky-700 flex items-center gap-1">
                Watch in HD
                <Play className="w-3 h-3 fill-current ml-0.5 text-sky-500" />
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200">
                {video.audioBadge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player in Full HD */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-y-auto p-5 sm:p-7 text-slate-700 shadow-2xl relative space-y-5">
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors z-20 cursor-pointer"
              title="Close HD Video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                  {activeVideo.categoryLabel}
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                  {activeVideo.resolutionBadge}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {activeVideo.duration}
                </span>
                <span className="text-xs text-sky-600 font-medium">
                  • {activeVideo.audioBadge}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-700 tracking-tight pr-10">
                {activeVideo.title}
              </h2>
              <p className="text-xs text-teal-600 font-medium mt-0.5">
                {activeVideo.titleUrdu} • Guided by {activeVideo.teacher}
              </p>
            </div>

            {/* Responsive HD Video Player Embed */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-200 shadow-lg">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&vq=hd1080&rel=0&modestbranding=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                Step-by-Step Exercise Instructions (رہنمائی)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activeVideo.guidedSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <a
                href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-sky-600 flex items-center gap-1 transition-colors"
              >
                <span>Watch on YouTube in 4K / HD</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setActiveVideo(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close HD Video
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
