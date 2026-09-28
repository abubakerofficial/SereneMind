export interface CoachAssessment {
  spokenResponse: string;
  detectedArchetype: string;
  stressLevel: number;
  overthinkingTendency: 'Mild' | 'Moderate' | 'High' | 'Critical' | 'Balanced';
  mindfulObservation: string;
  suggestedExercise: string;
  exerciseInstruction?: string;
  soothingAffirmation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  assessment?: Partial<CoachAssessment>;
  audioBase64?: string;
}

export type ExerciseType = 'breathing' | 'grounding' | 'defusion' | 'none';

export interface BreathingPatternConfig {
  id: '4-7-8' | 'box' | 'calm';
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdPost?: number;
  cycles: number;
  benefits: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  category: 'overthinking' | 'meditation' | 'clarity' | 'psychology';
  categoryLabel: string;
  readTime: string;
  gradient: string;
  badge: string;
  tagline: string;
  corePhilosophy: string;
  actionableExercises: string[];
  goldenQuote: string;
}

export interface CognitiveDistortion {
  id: string;
  name: string;
  nameUrdu: string;
  definition: string;
  exampleThought: string;
  cbtReframe: string;
  socraticQuestions: string[];
  mechanism: string;
}

export interface PsychologyModel {
  id: string;
  title: string;
  titleUrdu: string;
  founder: string;
  field: string;
  coreInsight: string;
  practicalApplication: string;
  brainRegion: string;
  takeaway: string;
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  questionUrdu: string;
}


