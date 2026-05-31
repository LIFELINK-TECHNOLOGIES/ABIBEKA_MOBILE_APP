export type Mood =
  | "great"
  | "calm"
  | "okay"
  | "low"
  | "stressed"
  | "anxious"
  | "sad";

export type Emotion =
  | "anxious"
  | "overwhelmed"
  | "lonely"
  | "hopeful"
  | "calm"
  | "angry"
  | "frustrated"
  | "excited";

export type Situation =
  | "work"
  | "school"
  | "family"
  | "relationship"
  | "health"
  | "money"
  | "career"
  | "social"
  | "unknown";

export interface AssessmentAnswer {
  mood: Mood | null;
  emotions: Emotion[];
  energy: number;
  stress: number;
  situations: Situation[];
  answers: Record<string, string>;
}
