import { BookItem } from '../types';

export const MINDFUL_BOOKS: BookItem[] = [
  // --- OVERTHINKING BOOKS ---
  {
    id: 'stop-overthinking',
    title: 'Stop Overthinking',
    author: 'Nick Trenton',
    category: 'overthinking',
    categoryLabel: 'Overthinking Relief',
    readTime: '6 min summary',
    gradient: 'from-emerald-950 via-stone-900 to-teal-950 border-emerald-500/30',
    badge: '#1 Bestseller on Rumination',
    tagline: '23 techniques to relieve stress, stop negative spirals, and declutter your mind.',
    corePhilosophy:
      'Overthinking is not a personality trait; it is an emotional coping mechanism triggered by fear of unknown outcomes. When we treat thoughts as hypotheses rather than facts, rumination loses its gravitational pull.',
    actionableExercises: [
      '5-15 Rule: Schedule a dedicated 15-minute "worry window" every day at 4 PM. If a catastrophic thought enters before that, postpone it to your window.',
      'Brain Dump Inventory: Write out racing thoughts uncensored on paper. Separate them into two columns: "Things I can control today" vs "Things out of my reach".',
      'The 5-4-3-2-1 Somatic Break: The moment mental spirals start, name 5 things you can see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste to forcibly disengage the cortex loop.',
    ],
    goldenQuote:
      '“Overthinking is the art of creating problems that were never there in the first place.”',
  },
  {
    id: 'dont-believe-everything-you-think',
    title: "Don't Believe Everything You Think",
    author: 'Joseph Nguyen',
    category: 'overthinking',
    categoryLabel: 'Overthinking Relief',
    readTime: '5 min summary',
    gradient: 'from-amber-950 via-stone-900 to-stone-900 border-amber-500/30',
    badge: 'Mental Liberation',
    tagline: 'Why your thinking is the beginning and end of suffering.',
    corePhilosophy:
      'There is a profound distinction between Thinking and Thought. Thought is a natural, intuitive whisper of inspiration. Thinking is the obsessive, repetitive analysis we apply on top of it. Suffering only begins when we attach stories to our thoughts.',
    actionableExercises: [
      'Observe the Space: Notice the 2-second silence between your in-breath and your next spontaneous thought.',
      'The Labeling Technique: When a thought arises saying "You will fail", mentally whisper "Just a story, not reality" without fighting it.',
      'Unconditional Presence: Spend 10 continuous minutes performing an everyday action (like drinking tea or washing hands) with 100% sensory attention.',
    ],
    goldenQuote:
      '“You do not need to fix your thoughts. You only need to stop believing every story they tell you.”',
  },
  {
    id: 'the-overthinking-cure',
    title: 'The Overthinking Cure',
    author: 'Nick Trenton',
    category: 'overthinking',
    categoryLabel: 'Overthinking Relief',
    readTime: '6 min summary',
    gradient: 'from-purple-950 via-stone-900 to-stone-900 border-purple-500/30',
    badge: 'Cognitive Reframing',
    tagline: 'How to stay in the present and stop your brain from replaying every conversation.',
    corePhilosophy:
      'Analysis paralysis and social rumination stem from a perfectionist ego demanding certainty. The cure is emotional detachment and adopting an experimental mindset where mistakes are treated as data, not identity.',
    actionableExercises: [
      'The Worst-Case Decatastrophizing: Write the absolute worst outcome. Ask: "Can I survive this? Yes. What would be my step 1?" Facing the phantom fear destroys its power.',
      'Interrupt the Replay: When your mind replays an awkward conversation, physically stand up, stretch your arms upward, and change your physical room.',
      'Good Enough Rule: Commit to making non-vital decisions (what to wear, what to eat, initial email drafts) in under 60 seconds.',
    ],
    goldenQuote:
      '“You cannot think your way out of an overthinking problem. You must act your way into clarity.”',
  },
  {
    id: 'rewire-your-anxious-brain',
    title: 'Rewire Your Anxious Brain',
    author: 'Catherine M. Pittman & Elizabeth M. Karle',
    category: 'overthinking',
    categoryLabel: 'Overthinking Relief',
    readTime: '7 min summary',
    gradient: 'from-rose-950 via-stone-900 to-stone-900 border-rose-500/30',
    badge: 'Neuroscience of Worry',
    tagline: 'How to use the neuroscience of fear to end anxiety, panic, and obsessive worry.',
    corePhilosophy:
      'Anxiety travels through two distinct neurological pathways: the Cortex (logic, memory, rumination) and the Amygdala (raw physical fight-or-flight). Cortex worry responds to cognitive restructuring, but Amygdala panic responds only to deep somatic breathing.',
    actionableExercises: [
      '4-7-8 Parasympathetic Vagus Trigger: Slow, extended exhales send an undeniable biological signal to the amygdala that no physical predator exists.',
      'Progressive Muscle Release: Squeeze fists for 5 seconds, then deliberately exhale and let them drop like dead weight.',
      'Cortex Thought Challenging: Ask: "What hard evidence proves this worry? What evidence proves the opposite?"',
    ],
    goldenQuote:
      '“Your amygdala cannot listen to words or logic. It only listens to the cadence of your breath and the tension in your muscles.”',
  },

  // --- MEDITATION BOOKS ---
  {
    id: 'the-miracle-of-mindfulness',
    title: 'The Miracle of Mindfulness',
    author: 'Thich Nhat Hanh',
    category: 'meditation',
    categoryLabel: 'Meditation & Breath',
    readTime: '6 min summary',
    gradient: 'from-emerald-950 via-stone-900 to-teal-950 border-teal-500/30',
    badge: 'Zen Classic',
    tagline: 'A manual on meditation, breath awareness, and the art of fully awakening.',
    corePhilosophy:
      'Mindfulness is not an escape from life; it is diving completely into the only moment we ever possess. Washing dishes is not a chore to get finished; it is a sacred meditation in warm water, soap, and touch.',
    actionableExercises: [
      'The Half-Smile: Allow a gentle, almost invisible smile to settle on your lips during stressful tasks; it physically softens facial muscles.',
      'Counting Breaths: Count from 1 to 10 on each in-out breath cycle. If your mind drifts to a worry, begin back at 1 with gentle self-forgiveness.',
      'Mindful Walking: Match each step to your breath—three steps on the inhale, three steps on the exhale.',
    ],
    goldenQuote:
      '“Smile, breathe, and go slowly. There is nowhere else you need to be than right here.”',
  },
  {
    id: 'wherever-you-go-there-you-are',
    title: 'Wherever You Go, There You Are',
    author: 'Jon Kabat-Zinn',
    category: 'meditation',
    categoryLabel: 'Meditation & Breath',
    readTime: '7 min summary',
    gradient: 'from-sky-950 via-stone-900 to-stone-900 border-sky-500/30',
    badge: 'Mindfulness-Based Stress Reduction',
    tagline: 'Mindfulness meditation in everyday life from the founder of MBSR.',
    corePhilosophy:
      'Meditation is not about getting somewhere else or wiping out thoughts. It is about allowing things to be exactly as they are without demanding that reality conform to our immediate desires.',
    actionableExercises: [
      'Non-Doing Practice: Spend 5 minutes sitting in a chair doing absolutely nothing. Refuse to produce, solve, or fix.',
      'Mountain Meditation: Picture yourself as a massive mountain. Seasons change, storms rage across your peaks, but your foundational base remains immovable.',
      'Loving-Kindness Glance: Look around the room and silently wish peace and safety to every living person you see.',
    ],
    goldenQuote:
      '“You can’t stop the waves, but you can learn to surf.”',
  },
  {
    id: 'real-happiness',
    title: 'Real Happiness: The Power of Meditation',
    author: 'Sharon Salzberg',
    category: 'meditation',
    categoryLabel: 'Meditation & Breath',
    readTime: '6 min summary',
    gradient: 'from-fuchsia-950 via-stone-900 to-stone-900 border-fuchsia-500/30',
    badge: '28-Day Meditation Program',
    tagline: 'Practical tools to cultivate concentration, mindfulness, and loving kindness.',
    corePhilosophy:
      'The magic of meditation is not unbroken concentration. The actual magic happens at the exact second you realize your mind wandered and you gently return to the breath without self-criticism.',
    actionableExercises: [
      'The Gentle Return: Treat your wandering mind like a beloved puppy. Pick it up gently and bring it back to the cushion.',
      'Body Scan Reset: Shift attention from the crown of your head to the soles of your feet, acknowledging sensations without judging them.',
      'Metta Phrase: Silently repeat: "May I be peaceful. May I be healthy. May I live with ease."',
    ],
    goldenQuote:
      '“Concentration is the art of letting go of everything else so that you can dwell entirely in one thing.”',
  },
  {
    id: 'ten-percent-happier',
    title: '10% Happier',
    author: 'Dan Harris',
    category: 'meditation',
    categoryLabel: 'Meditation & Breath',
    readTime: '5 min summary',
    gradient: 'from-cyan-950 via-stone-900 to-stone-900 border-cyan-500/30',
    badge: 'Skeptic’s Guide',
    tagline: 'How taming the voice in your head reduces stress without losing your edge.',
    corePhilosophy:
      'You don’t have to believe in mysticism or wear robes. Meditation is simply strength training for your prefrontal cortex. It builds a crucial 2-second buffer between emotional impulse and external reaction.',
    actionableExercises: [
      'The Responsive Pause: Before replying to an infuriating email or comment, take one full deliberate breath.',
      'Notice the Insatiable Ego: Observe how your inner voice is always narrating, complaining, or wanting things to be different.',
      'Daily 5-Minute Micro-Rep: Sit for 5 minutes each morning focusing purely on breath sensation at the tip of the nose.',
    ],
    goldenQuote:
      '“Mindfulness is the ability to recognize what is happening in your mind right now without getting carried away by it.”',
  },

  // --- MENTAL CLARITY & INNER PEACE BOOKS ---
  {
    id: 'the-power-of-now',
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    category: 'clarity',
    categoryLabel: 'Mental Clarity & Peace',
    readTime: '8 min summary',
    gradient: 'from-amber-950 via-stone-900 to-yellow-950 border-amber-500/30',
    badge: 'Global Spiritual Bestseller',
    tagline: 'A guide to spiritual enlightenment and freeing yourself from the psychological past and future.',
    corePhilosophy:
      'Almost all psychological suffering exists in psychological time: regret and guilt anchored in the past, or worry and anticipation projected into the future. In the pure present moment, there are no problems, only situations to be addressed or accepted.',
    actionableExercises: [
      'Inner Body Awareness: Close your eyes and feel the subtle energy vibrating in your hands and feet right now.',
      'The "What is missing right now?" Question: Ask yourself: "What is lacking at this exact 1-second interval?" (Nothing is lacking).',
      'Watch the Thinker: Step back and witness the voice inside your head as if you are a curious bystander.',
    ],
    goldenQuote:
      '“Unease, anxiety, tension, stress, worry—all forms of fear—are caused by too much future, and not enough presence.”',
  },
  {
    id: 'clear-thinking',
    title: 'Clear Thinking',
    author: 'Shane Parrish',
    category: 'clarity',
    categoryLabel: 'Mental Clarity & Peace',
    readTime: '7 min summary',
    gradient: 'from-blue-950 via-stone-900 to-stone-900 border-blue-500/30',
    badge: 'Cognitive Mastery',
    tagline: 'Turning ordinary moments into extraordinary results and mental discipline.',
    corePhilosophy:
      'Our minds are hardwired to respond to emotional defaults: the emotion default, the ego default, the social default, and the inertia default. Clear thinkers build automatic safeguards to prevent knee-jerk reactions.',
    actionableExercises: [
      'The Second-Order Question: Ask: "And then what?" before taking any impulse action.',
      'Inversion Thinking: Instead of asking "How do I make my life peaceful?", ask "What habits guarantee my life will be chaotic and stressed?" and eliminate them.',
      'Margin of Safety: Leave 15 minutes of buffer between every calendar event to prevent stress accumulation.',
    ],
    goldenQuote:
      '“Mental clarity is not about knowing everything; it is about keeping emotions from hijacking simple decisions.”',
  },
  {
    id: 'deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'clarity',
    categoryLabel: 'Mental Clarity & Peace',
    readTime: '6 min summary',
    gradient: 'from-indigo-950 via-stone-900 to-stone-900 border-indigo-500/30',
    badge: 'Focus & Productivity',
    tagline: 'Rules for focused success and calm confidence in a hyper-distracted world.',
    corePhilosophy:
      'Constant context switching fragments attention and fuels continuous low-grade anxiety. Embracing periods of deep, uninterrupted focus calms the nervous system and creates fulfilling, meaningful work.',
    actionableExercises: [
      '90-Minute Focus Sprint: Put your phone in another room, close all tabs except one, and work with zero distraction.',
      'Shutdown Ritual: At the end of the workday, review tomorrow’s top priority, close your laptop, and say aloud: "Shutdown complete."',
      'Embrace Boredom: When standing in an elevator or waiting in line, resist reaching for your phone. Let your brain be idle.',
    ],
    goldenQuote:
      '“A life lived focused is a life lived well, filled with calm and purposeful achievement.”',
  },
  {
    id: 'practicing-mindfulness',
    title: 'Practicing Mindfulness',
    author: 'Matthew Sockolov',
    category: 'clarity',
    categoryLabel: 'Mental Clarity & Peace',
    readTime: '5 min summary',
    gradient: 'from-emerald-950 via-stone-900 to-stone-900 border-emerald-500/30',
    badge: '75 Daily Meditations',
    tagline: '75 essential meditations to reduce stress, improve mental health, and find peace.',
    corePhilosophy:
      'Mindfulness does not require an hour on a cushion. Short, consistent 3-minute practices scattered throughout the day permanently alter brain circuitry and lower baseline cortisol levels.',
    actionableExercises: [
      'The 3-Breath Grounder: Take 3 conscious breaths before eating, before sending an email, and before unlocking your front door.',
      'Sound Bath Listening: Close your eyes and listen to ambient sounds without naming what creates them.',
      'Self-Compassion Hand on Heart: Place your warm palm flat against your chest during emotional distress to trigger oxytocin release.',
    ],
    goldenQuote:
      '“Small moments of awareness, repeated throughout the day, transform how you experience your entire life.”',
  },

  // --- PSYCHOLOGY & COGNITIVE SCIENCE BOOKS ---
  {
    id: 'feeling-good',
    title: 'Feeling Good: The New Mood Therapy',
    author: 'David D. Burns, M.D.',
    category: 'psychology',
    categoryLabel: 'Clinical Psychology & CBT',
    readTime: '8 min summary',
    gradient: 'from-amber-950 via-stone-900 to-yellow-950 border-amber-500/30',
    badge: 'Clinical CBT Gold Standard',
    tagline: 'The clinically proven drug-free treatment for depression, anxiety, and cognitive distortions.',
    corePhilosophy:
      'Our feelings are not caused by external events; they are produced exclusively by our cognitions (internal dialogue). When we systematically identify and refute cognitive distortions (all-or-nothing thinking, catastrophizing, emotional reasoning), emotional distress lifts naturally.',
    actionableExercises: [
      'The Triple-Column Technique: Divide a page into: 1) Automatic Negative Thought, 2) Cognitive Distortion, and 3) Rational Response.',
      'Daily Mood Log: Rate your distress from 0-100%, write the triggering event, dismantle the negative beliefs, and re-rate the emotion.',
      'Examine the Evidence: Treat negative predictions as hypotheses in a laboratory rather than established truth.',
    ],
    goldenQuote:
      '“You feel the way you think. Change the perception, and you immediately change the emotional biochemistry.”',
  },
  {
    id: 'thinking-fast-and-slow',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'psychology',
    categoryLabel: 'Behavioral Psychology',
    readTime: '8 min summary',
    gradient: 'from-teal-950 via-stone-900 to-stone-900 border-teal-500/30',
    badge: 'Nobel Prize in Economics',
    tagline: 'Two systems drive the way we think: System 1 (fast, intuitive, emotional) and System 2 (slow, deliberative, logical).',
    corePhilosophy:
      'System 1 operates automatically and involuntarily, generating intuitive impressions, fear reactions, and cognitive biases like loss aversion and availability heuristics. Overthinking happens when System 2 is tricked into rationalizing System 1’s primal emotional fears.',
    actionableExercises: [
      'Pre-Mortem Analysis: Before committing to an emotionally charged choice, imagine you are one year in the future and it failed catastrophically. Write out why.',
      'Slow Down the Default: Whenever you feel an urgent impulse to react, enforce a mandatory 10-minute cooling period to allow System 2 to boot up.',
      'Check the Availability Heuristic: Ask yourself: "Is this outcome genuinely probable, or is it just vivid and fresh in my memory?"',
    ],
    goldenQuote:
      '“A reliable way to make people believe in falsehoods is frequent repetition, because familiarity is not easily distinguished from truth.”',
  },
  {
    id: 'the-body-keeps-the-score',
    title: 'The Body Keeps the Score',
    author: 'Bessel van der Kolk, M.D.',
    category: 'psychology',
    categoryLabel: 'Neuroscience & Somatics',
    readTime: '9 min summary',
    gradient: 'from-rose-950 via-stone-900 to-stone-900 border-rose-500/30',
    badge: 'Trauma & Mind-Body Neuroscience',
    tagline: 'Brain, mind, and body in the healing of trauma, chronic anxiety, and stress.',
    corePhilosophy:
      'Trauma and chronic stress do not merely exist as memories; they imprint physically into the autonomic nervous system, tightening muscles, blunting digestion, and hyper-sensitizing the amygdala. Talk therapy alone cannot cure somatic distress—healing requires bottom-up body work.',
    actionableExercises: [
      'Interoceptive Check-in: Notice without words where tension lives in your body—throat, chest, gut, or jaw—and breathe directly into it.',
      'Heart Rate Variability (HRV) Breathing: Breathe in for 5 seconds and out for 5 seconds (6 breaths/minute) to harmonize heart-brain resonance.',
      'Rhythmic Somatic Movement: Engage in rhythmic walking, dance, or gentle stretching to discharge stuck sympathetic arousal.',
    ],
    goldenQuote:
      '“As long as you keep keeping secrets and suppressing information, you are fundamentally at war with yourself.”',
  },
  {
    id: 'mans-search-for-meaning',
    title: "Man's Search for Meaning",
    author: 'Viktor E. Frankl',
    category: 'psychology',
    categoryLabel: 'Existential Psychology',
    readTime: '7 min summary',
    gradient: 'from-purple-950 via-stone-900 to-stone-900 border-purple-500/30',
    badge: 'Logotherapy Masterwork',
    tagline: 'The classic tribute to hope from the Holocaust, discovering purpose in suffering.',
    corePhilosophy:
      'Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom. Those who have a "why" to live can bear almost any "how".',
    actionableExercises: [
      'The Space of Choice: When faced with an irritating person or event, pause for 3 seconds to consciously choose your dignified response.',
      'Meaning Reframe: Ask: "What is this difficult situation demanding of me? How can I respond with character?"',
      'Tragic Optimism: Turn suffering into human achievement, guilt into positive change, and transience into responsible action.',
    ],
    goldenQuote:
      '“When we are no longer able to change a situation, we are challenged to change ourselves.”',
  },
];

