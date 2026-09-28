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
  thumbnailGradient: string;
  description: string;
  guidedSteps: string[];
}

export const MINDFUL_VIDEOS: MindfulVideoItem[] = [
  // --- BREATHING VIDEOS ---
  {
    id: 'vid-478',
    youtubeId: 'gz4G31LGyog',
    title: '4-7-8 Breathing Technique: Relax Nervous System',
    titleUrdu: '۴-۷-۸ سانس کی تکنیک (اعصابی سکون)',
    category: 'breathing',
    categoryLabel: 'Breathing Video',
    duration: '4:20',
    teacher: 'Dr. Andrew Weil & Mindful Practice',
    badge: 'Vagus Nerve Reset',
    thumbnailGradient: 'from-emerald-950 via-teal-950 to-stone-900 border-emerald-500/30',
    description: 'Learn the exact tongue placement, cadence, and timing of 4-7-8 breathing to quickly down-regulate adrenaline and enter deep rest.',
    guidedSteps: [
      'Place tip of tongue against the tissue ridge right behind upper front teeth.',
      'Exhale completely through mouth with a gentle whooshing sound.',
      'Inhale quietly through nose for 4 seconds, hold for 7 seconds, exhale audibly for 8 seconds.',
    ],
  },
  {
    id: 'vid-box',
    youtubeId: 'FJJazKtH_9I',
    title: 'Box Breathing (4-4-4-4) for Instant Calm & Focus',
    titleUrdu: 'باکس بریتھنگ (فوری ذہنی فوکس)',
    category: 'breathing',
    categoryLabel: 'Breathing Video',
    duration: '5:00',
    teacher: 'Mark Divine / SEALFIT Focus',
    badge: 'High Stress Relief',
    thumbnailGradient: 'from-sky-950 via-cyan-950 to-stone-900 border-sky-500/30',
    description: 'A visual four-sided square cadence used by elite performers to eliminate physiological panic and mental fog in seconds.',
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
    title: 'Diaphragmatic Belly Breathing for Deep Relaxation',
    titleUrdu: 'پیٹ اور ڈایافرام کی گہری سانس',
    category: 'breathing',
    categoryLabel: 'Breathing Video',
    duration: '6:15',
    teacher: 'Mindful Movement Clinic',
    badge: 'Core Somatic Reset',
    thumbnailGradient: 'from-teal-950 via-emerald-950 to-stone-900 border-teal-500/30',
    description: 'Re-train your body from shallow chest breathing into deep diaphragmatic expansion, releasing abdominal and shoulder tension.',
    guidedSteps: [
      'Place one hand on your chest and one on your lower abdomen.',
      'Breathe in so only your belly hand rises, while your chest remains steady.',
      'Slowly release tension through parted lips like blowing through a straw.',
    ],
  },
  {
    id: 'vid-nadi',
    youtubeId: '8VwufJrUhic',
    title: 'Alternate Nostril Breathing (Nadi Shodhana)',
    titleUrdu: 'نادی شودھن (دائیں اور بائیں سانس کا توازن)',
    category: 'breathing',
    categoryLabel: 'Breathing Video',
    duration: '7:40',
    teacher: 'Yoga with Adriene',
    badge: 'Hemispheric Harmony',
    thumbnailGradient: 'from-indigo-950 via-purple-950 to-stone-900 border-indigo-500/30',
    description: 'Ancient pranayama technique that balances the sympathetic and parasympathetic nervous systems, clearing mental chatter.',
    guidedSteps: [
      'Use right thumb to close right nostril; inhale slowly through left nostril.',
      'Close left nostril with ring finger; release thumb and exhale through right.',
      'Inhale right, switch, and exhale left to complete one full cycle.',
    ],
  },

  // --- MEDITATION VIDEOS ---
  {
    id: 'vid-overthinking-med',
    youtubeId: 'inpok4MKVLM',
    title: '10-Minute Guided Meditation to Stop Overthinking',
    titleUrdu: '۱۰ منٹ میڈیٹیشن (اوور تھنکنگ کا خاتمہ)',
    category: 'meditation',
    categoryLabel: 'Meditation Video',
    duration: '10:15',
    teacher: 'Goodful Mindfulness Coach',
    badge: 'Quieting Racing Thoughts',
    thumbnailGradient: 'from-amber-950 via-stone-900 to-emerald-950 border-amber-500/30',
    description: 'A gentle guided meditation that teaches you how to step outside obsessive mental loops and anchor yourself in the sensations of the present moment.',
    guidedSteps: [
      'Acknowledge that thoughts are just mental weather passing through a vast blue sky.',
      'Gently redirect attention from thoughts to the sensation of air touching your nostrils.',
      'When your mind wanders, smile internally and return without judgment.',
    ],
  },
  {
    id: 'vid-body-scan',
    youtubeId: 'u4gZgnCy5ew',
    title: 'Full Body Scan Meditation for Deep Tension Release',
    titleUrdu: 'باڈی اسکین میڈیٹیشن (جسمانی کھچاؤ سے نجات)',
    category: 'meditation',
    categoryLabel: 'Meditation Video',
    duration: '12:30',
    teacher: 'The Mindful Movement',
    badge: 'Somatic Muscle Release',
    thumbnailGradient: 'from-rose-950 via-purple-950 to-stone-900 border-rose-500/30',
    description: 'Systematically travel through your crown, forehead, jaw, neck, shoulders, and legs to dissolve hidden chronic tension.',
    guidedSteps: [
      'Rest comfortably on a chair or cushion with arms resting naturally.',
      'Send warm attention to your forehead and jaw, consciously letting them soften.',
      'Progress down to chest, back, and fingertips, visualizing tension leaving as warm vapor.',
    ],
  },
  {
    id: 'vid-loving-kindness',
    youtubeId: '-d_AA9H4z9U',
    title: 'Loving-Kindness (Metta) Meditation for Emotional Calm',
    titleUrdu: 'محبت اور شفقت کی میڈیٹیشن (اندرونی اطمینان)',
    category: 'meditation',
    categoryLabel: 'Meditation Video',
    duration: '8:45',
    teacher: 'Headspace Guided Series',
    badge: 'Emotional Healing',
    thumbnailGradient: 'from-pink-950 via-stone-900 to-rose-950 border-pink-500/30',
    description: 'Transform self-criticism, worry, and social anxiety into unconditional inner peace and empathetic warmth for yourself and others.',
    guidedSteps: [
      'Place a warm hand flat over your center chest / heart space.',
      'Whisper silently: "May I be peaceful. May I be safe. May I live with ease."',
      'Radiate that same wish outward to loved ones, acquaintances, and the wider world.',
    ],
  },
  {
    id: 'vid-sleep-nidra',
    youtubeId: '7T08VABG0t4',
    title: 'Deep Sleep & Relaxation Yoga Nidra Meditation',
    titleUrdu: 'پرسکون نیند اور ریلیکسیشن یوگا نیدرا',
    category: 'meditation',
    categoryLabel: 'Meditation Video',
    duration: '15:20',
    teacher: 'The Honest Guys',
    badge: 'Delta Sleep Induction',
    thumbnailGradient: 'from-blue-950 via-indigo-950 to-stone-900 border-blue-500/30',
    description: 'A hypnotic, gentle cadence that takes brainwaves from restless beta down to delta sleep waves for deep, uninterrupted night rest.',
    guidedSteps: [
      'Dim lights and lie on your back with eyes gently shut.',
      'Follow the spoken guidance without trying to concentrate or force sleep.',
      'Allow your consciousness to hover effortlessly between wakefulness and dream state.',
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
    <section className="bg-stone-900/50 border border-stone-800/90 rounded-3xl p-5 sm:p-7 backdrop-blur-md shadow-2xl relative">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-950/50">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-stone-100 tracking-tight">
                Guided Breathing &amp; Meditation Videos
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                ویڈیوز
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Certified visual step-by-step video guides for 4-7-8 breathwork, diaphragmatic breathing, and mindfulness meditation.
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-950/70 rounded-2xl border border-stone-800 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            All Videos ({MINDFUL_VIDEOS.length})
          </button>
          <button
            onClick={() => setSelectedCategory('breathing')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'breathing'
                ? 'bg-emerald-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Breathing Videos (سانس)</span>
          </button>
          <button
            onClick={() => setSelectedCategory('meditation')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'meditation'
                ? 'bg-emerald-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Meditation Videos (میڈیٹیشن)</span>
          </button>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className={`group cursor-pointer rounded-2xl bg-gradient-to-br ${video.thumbnailGradient} border p-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:border-emerald-500/40 flex flex-col justify-between`}
          >
            <div>
              {/* Video Thumbnail Fake/Card Header */}
              <div className="relative aspect-video rounded-xl bg-stone-950/80 border border-stone-800/80 overflow-hidden mb-3 flex items-center justify-center shadow-inner group-hover:border-emerald-500/30 transition-colors">
                {/* Play Button Overlay */}
                <div className="w-11 h-11 rounded-full bg-emerald-500/90 text-stone-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-stone-950/90 text-[10px] font-mono font-bold text-stone-200 border border-stone-800 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  {video.duration}
                </span>

                {/* Category Badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-stone-950/80 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  {video.category === 'breathing' ? 'سانس کی ویڈیو' : 'میڈیٹیشن'}
                </span>
              </div>

              {/* Title & Teacher */}
              <h3 className="text-sm font-bold text-stone-100 group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                {video.title}
              </h3>
              <p className="text-[11px] text-emerald-400/90 font-medium mt-0.5">
                {video.titleUrdu}
              </p>
              <p className="text-xs text-stone-400 flex items-center gap-1 mt-1 font-medium">
                <User className="w-3 h-3 text-stone-500" />
                {video.teacher}
              </p>

              {/* Description */}
              <p className="text-xs text-stone-300/85 mt-2 line-clamp-2 leading-relaxed">
                {video.description}
              </p>
            </div>

            {/* Bottom Action */}
            <div className="pt-3 mt-3 border-t border-stone-800/60 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1">
                Watch Guided Video
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-900/90 text-stone-400 border border-stone-800">
                {video.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-900 border border-stone-700/80 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 text-stone-100 shadow-2xl relative space-y-5">
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 p-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-100 transition-colors z-20"
              title="Close Video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  {activeVideo.categoryLabel}
                </span>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-500" />
                  {activeVideo.duration}
                </span>
                <span className="text-xs text-emerald-400 font-medium">
                  • {activeVideo.badge}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-100 tracking-tight pr-10">
                {activeVideo.title}
              </h2>
              <p className="text-xs text-emerald-400/90 font-medium mt-0.5">
                {activeVideo.titleUrdu} • Guided by {activeVideo.teacher}
              </p>
            </div>

            {/* Responsive Embedded Video Player (Safe YouTube Embed with Privacy) */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Step-by-Step Exercise Instructions (رہنمائی)
              </h4>
              <div className="space-y-2">
                {activeVideo.guidedSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-stone-950/60 border border-stone-800/80 text-xs text-stone-200 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-800">
              <a
                href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-stone-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setActiveVideo(null)}
                className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
