import { CognitiveDistortion, PsychologyModel, AssessmentQuestion } from '../types';

export const COGNITIVE_DISTORTIONS: CognitiveDistortion[] = [
  {
    id: 'catastrophizing',
    name: 'Catastrophizing',
    nameUrdu: 'طوفان کھڑا کرنا (سب سے برا انجام فرض کرنا)',
    definition: 'Assuming that the worst-case scenario is not only possible, but virtually guaranteed to occur.',
    exampleThought: '"I made a minor mistake on that project; now I will definitely be fired and my entire career is ruined."',
    cbtReframe: 'Mistakes are common occurrences in professional life, not automatic career terminations. Even if correction is needed, I have the competence to resolve it step-by-step.',
    socraticQuestions: [
      'What is the actual statistical probability of the absolute worst outcome happening?',
      'If the worst case did happen, what concrete steps would I take to survive and navigate it?',
      'What is the most likely, realistic middle-ground outcome?',
    ],
    mechanism: 'Amygdala hyper-arousal projecting ancient evolutionary predator threat onto modern non-lethal situations.',
  },
  {
    id: 'mind-reading',
    name: 'Mind Reading',
    nameUrdu: 'دوسروں کے ذہن کا منفی قیاس کرنا',
    definition: 'Believing you know what other people are thinking about you, almost always projecting negative or contemptuous judgments.',
    exampleThought: '"They didn’t reply to my message within 10 minutes; they must be angry with me or secretly dislike me."',
    cbtReframe: 'People have complex, busy lives filled with competing priorities and distractions that have nothing to do with me. Delay in responding is evidence of their busy schedule, not their opinion of my worth.',
    socraticQuestions: [
      'Do I possess concrete telepathic proof of what this person is thinking right now?',
      'What are three alternative, benevolent reasons for their silence (e.g., meeting, driving, family)?',
      'Have I ever delayed replying to someone without hating them?',
    ],
    mechanism: 'Social threat monitoring stemming from ancestral tribal exclusion fears.',
  },
  {
    id: 'all-or-nothing',
    name: 'All-or-Nothing Thinking',
    nameUrdu: 'بلیک اینڈ وائٹ سوچ (یا کمال یا ناکامی)',
    definition: 'Viewing situations in polarized, black-and-white categories. If your performance falls short of absolute perfection, you evaluate yourself as a total failure.',
    exampleThought: '"I skipped my meditation session today, so my entire wellness routine is broken and there’s no point trying anymore."',
    cbtReframe: 'Progress is cyclical and cumulative, not binary. One missed session out of seven is an 85% success rate, which is still excellent momentum.',
    socraticQuestions: [
      'Does nature or reality ever operate in 100% black or 100% white extremes?',
      'If a friend missed one day of exercise, would I tell them they are an irredeemable failure?',
      'What shade of grey exists between complete perfection and complete failure here?',
    ],
    mechanism: 'Ego preservation through cognitive simplification to avoid sitting with complex ambiguity.',
  },
  {
    id: 'emotional-reasoning',
    name: 'Emotional Reasoning',
    nameUrdu: 'جذباتی استدلال (احساس کو حقیقت سمجھنا)',
    definition: 'Assuming that because you feel a certain intense negative emotion, it must reflect the objective external reality.',
    exampleThought: '"I feel overwhelmed and anxious about tomorrow’s meeting, which proves it is going to be a complete disaster."',
    cbtReframe: 'Emotions are physiological signals and neurochemical weather, not prophetic crystal balls. Feeling nervous merely indicates I care about doing well.',
    socraticQuestions: [
      'Has there ever been a time when I felt intense anxiety beforehand, but the actual event went smoothly?',
      'Can an emotion change without any facts in the physical room changing?',
      'Am I confusing an internal physical sensation (elevated heart rate) with an external fact?',
    ],
    mechanism: 'Limbic system primacy overriding prefrontal cortex objective data evaluation.',
  },
  {
    id: 'mental-filtering',
    name: 'Mental Filtering',
    nameUrdu: 'صرف منفی پہلو پر نظر رکھنا',
    definition: 'Picking out a single negative detail and dwelling on it exclusively, blinding you to all positive feedback and successes.',
    exampleThought: '"Ten people gave glowing feedback on my presentation, but one person asked a sharp question; I completely botched it."',
    cbtReframe: 'Constructive questions are normal discourse. Over-focusing on the single challenging inquiry invalidates the unanimous praise from the other ten listeners.',
    socraticQuestions: [
      'What positive or neutral evidence am I actively discarding or refusing to acknowledge?',
      'Am I looking at this situation through a microscope on flaws and a telescope on other people’s strengths?',
      'How would an objective, disinterested judge view the whole picture?',
    ],
    mechanism: 'Evolutionary negativity bias prioritizing threat detection over celebration of safety.',
  },
  {
    id: 'should-statements',
    name: 'Should & Must Statements',
    nameUrdu: 'سخت شرائط (مجھے ایسا ہی کرنا چاہیے تھا)',
    definition: 'Trying to motivate yourself with rigid "shoulds", "musts", and "oughts", resulting in constant guilt, frustration, and resentment.',
    exampleThought: '"I should be completely calm by now; I must never feel anxious after reading so much psychology."',
    cbtReframe: 'I am a human being with a living autonomic nervous system. Expecting immunity from stress is unrealistic. I prefer to remain calm, but experiencing tension is completely normal.',
    socraticQuestions: [
      'Where is it written in universal law that I must never experience human emotions?',
      'Does berating myself with "shoulds" genuinely create calm, or does it add a second layer of self-criticism?',
      'Can I replace "I must" with "I would prefer, but I can handle what is"?',
    ],
    mechanism: 'Internalized perfectionist super-ego demands generating unnecessary second-arrow suffering.',
  },
];

export const PSYCHOLOGY_MODELS: PsychologyModel[] = [
  {
    id: 'polyvagal-theory',
    title: 'The Polyvagal Theory',
    titleUrdu: 'پولی ویگل تھیوری (تین اعصابی کیفیات)',
    founder: 'Dr. Stephen Porges',
    field: 'Neurobiology & Autonomic Science',
    coreInsight:
      'The human autonomic nervous system has three evolutionary hierarchical circuits: 1) Ventral Vagal (Safe & Social - calm heart rate, connection), 2) Sympathetic (Fight or Flight - adrenaline, panic, racing thoughts), and 3) Dorsal Vagal (Shutdown / Freeze - numbness, exhaustion, despair).',
    practicalApplication:
      'When in acute overthinking (Sympathetic), logic fails because blood flow is diverted away from the prefrontal cortex. You must use somatic vagus nerve stimulation (slow 4-7-8 exhales, hums, cold water on face) before cognitive reframing can work.',
    brainRegion: 'Vagus Nerve (Cranial Nerve X) & Brainstem',
    takeaway: 'Physiology precedes psychology: Regulate the body before trying to reason with the mind.',
  },
  {
    id: 'cbt-beck',
    title: 'Cognitive Behavioral Triangle',
    titleUrdu: 'سی بی ٹی تکون (سوچ، جذبہ اور عمل)',
    founder: 'Dr. Aaron T. Beck',
    field: 'Clinical Cognitive Psychology',
    coreInsight:
      'Thoughts, Feelings, and Behaviors form a continuously interacting triad. An external situation does not directly cause emotional distress; rather, your cognitive appraisal (automatic thought) generates the emotional sensation, which then dictates your behavior.',
    practicalApplication:
      'You cannot directly order an emotion to vanish, but by identifying and reframing the intermediate thought ("Is this thought accurate?"), the resulting emotion and physiological arousal automatically normalize.',
    brainRegion: 'Dorsolateral Prefrontal Cortex vs Amygdala',
    takeaway: 'Change your cognitive interpretation, and your autonomic chemistry follows.',
  },
  {
    id: 'act-defusion',
    title: 'Acceptance & Commitment (ACT)',
    titleUrdu: 'قبولیت اور کمٹمنٹ تھیوری (فکری لچک)',
    founder: 'Dr. Steven C. Hayes',
    field: 'Contextual Behavioral Science',
    coreInsight:
      'Psychological suffering arises not from having unwanted thoughts, but from "Cognitive Fusion"—treating thoughts as objective reality—and experiential avoidance (fighting thoughts). Psychological flexibility means accepting internal sensations while taking values-based action.',
    practicalApplication:
      'Use defusion phrases: Instead of saying "I am broken", reframe to "I am having the thought that I am broken." This creates a crucial 2-inch psychological distance between the observer and the mental content.',
    brainRegion: 'Default Mode Network (DMN) Decoupling',
    takeaway: 'You do not need to control or silence your mind to live a meaningful, courageous life.',
  },
  {
    id: 'neuroplasticity-hebb',
    title: 'Neuroplasticity & Hebb’s Law',
    titleUrdu: 'نیوروپلاسٹی سٹی (دماغ کے راستوں کی تبدیلی)',
    founder: 'Donald Hebb & Modern Neuroscience',
    field: 'Neuroplasticity & Brain Circuitry',
    coreInsight:
      '“Neurons that fire together, wire together.” Every time you indulge a worry spiral, you reinforce the synaptic myelin pathway for rumination. Conversely, every time you deliberately pause, take a deep breath, and reframe, you carve out a new neural pathway for resilience.',
    practicalApplication:
      'Breaking overthinking requires approximately 21 to 60 days of deliberate somatic interruption. The initial resistance you feel is merely biological friction of old pathways demanding blood flow.',
    brainRegion: 'Synaptic Plasticity & Hippocampal Remodeling',
    takeaway: 'Your brain is not fixed concrete; it is living clay continuously shaped by your chosen focus.',
  },
];

export const GAD7_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    question: 'Feeling nervous, anxious, or on edge?',
    questionUrdu: 'گھبراہٹ، بے چینی، یا غیر یقینی کا احساس ہونا؟',
  },
  {
    id: 2,
    question: 'Not being able to stop or control worrying?',
    questionUrdu: 'پریشان کن خیالات اور فکر کو روکنے یا قابو کرنے میں دشواری؟',
  },
  {
    id: 3,
    question: 'Worrying too much about different things?',
    questionUrdu: 'مختلف معاملات اور آئندہ کے حالات کے بارے میں ضرورت سے زیادہ سوچنا؟',
  },
  {
    id: 4,
    question: 'Trouble relaxing or unwinding your body?',
    questionUrdu: 'جسم اور ذہن کو پرسکون اور ریلیکس کرنے میں مشکل پیش آنا؟',
  },
  {
    id: 5,
    question: 'Being so restless that it is hard to sit still?',
    questionUrdu: 'اتنی بے چینی کہ ایک جگہ سکون سے بیٹھنا مشکل ہو؟',
  },
  {
    id: 6,
    question: 'Becoming easily annoyed, irritated, or short-tempered?',
    questionUrdu: 'چھوٹی چھوٹی باتوں پر جلدی چڑچڑاپن یا غصہ آنا؟',
  },
  {
    id: 7,
    question: 'Feeling afraid as if something awful might happen?',
    questionUrdu: 'خوف کا احساس جیسے کوئی برا واقعہ پیش آنے والا ہو؟',
  },
];

export const RRS_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    question: 'Do you replay past awkward conversations repeatedly in your head?',
    questionUrdu: 'کیا آپ ماضی کی گفتگو اور واقعات کو بار بار ذہن میں دہراتے ہیں؟',
  },
  {
    id: 2,
    question: 'Do you analyze "Why did I react that way?" for hours after an event?',
    questionUrdu: 'کیا آپ کسی واقعے کے بعد گھنٹوں سوچتے ہیں کہ مجھ سے یہ غلطی کیوں ہوئی؟',
  },
  {
    id: 3,
    question: 'Do you imagine catastrophic worst-case scenarios before taking simple actions?',
    questionUrdu: 'کیا آپ معمولی کام سے پہلے بھی سب سے برے انجام کا تصور کرنے لگتے ہیں؟',
  },
  {
    id: 4,
    question: 'Do you find it difficult to fall asleep because your mind is calculating tomorrow’s problems?',
    questionUrdu: 'کیا رات کو سوتے وقت آئندہ کے مسائل کی سوچیں نیند اڑا دیتی ہیں؟',
  },
  {
    id: 5,
    question: 'Do you believe that thinking endlessly about a problem will protect you from failure?',
    questionUrdu: 'کیا آپ کو لگتا ہے کہ مسلسل سوچتے رہنے سے آپ نقصان سے بچ جائیں گے؟',
  },
];
