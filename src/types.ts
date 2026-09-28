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
