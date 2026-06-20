import { Dimensions } from "react-native";

export const { width: W } = Dimensions.get("window");
export const CARD_W = W - 40;

// ─── Brand ────────────────────────────────────────────────────────────────────

export const B = {
  primary: "#0F766E",
  secondary: "#1E3A8A",
  accent: "#22C55E",
  bg: "#04060F",
  card: "#080D1C",
  border: "rgba(255,255,255,0.07)",
  text: "#F0F4FF",
  muted: "rgba(240,244,255,0.42)",
  muted2: "rgba(240,244,255,0.18)",
  amber: "#F59E0B",
  red: "#EF4444",
  violet: "#8B5CF6",
  rose: "#F43F5E",
  sky: "#0EA5E9",
  teal: "#14B8A6",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

export const MOODS = [
  { emoji: "😄", label: "Great", sub: "Feeling fantastic", color: B.accent },
  { emoji: "😌", label: "Calm", sub: "Peaceful and settled", color: B.teal },
  { emoji: "😐", label: "Okay", sub: "Getting through it", color: "#64748B" },
  { emoji: "😔", label: "Sad", sub: "A bit down today", color: B.violet },
  { emoji: "😢", label: "Tearful", sub: "Emotions running high", color: B.sky }
];

export const EMOTIONS = [
  { label: "Anxious", color: B.amber, size: 1.2 },
  { label: "Lonely", color: B.violet, size: 1.0 },
  { label: "Hopeless", color: B.red, size: 0.9 },
  { label: "Exhausted", color: "#64748B", size: 1.3 },
  { label: "Unmotivated", color: B.rose, size: 1.1 },
  { label: "Confused", color: B.sky, size: 0.95 },
  { label: "Hopeful", color: B.accent, size: 1.15 },
  { label: "Grateful", color: B.primary, size: 1.0 },
  { label: "Calm", color: B.teal, size: 1.1 },
  { label: "Angry", color: B.red, size: 1.0 },
  { label: "Content", color: B.accent, size: 0.9 },
  { label: "Drained", color: "#475569", size: 1.2 },
];

export const SITUATIONS = [
  { emoji: "💼", label: "Work", color: B.sky },
  { emoji: "🎓", label: "School", color: B.violet },
  { emoji: "🏠", label: "Family", color: B.amber },
  { emoji: "❤️", label: "Relationship", color: B.rose },
  { emoji: "💰", label: "Money", color: B.accent },
  { emoji: "🤒", label: "Health", color: B.red },
  { emoji: "👤", label: "Growth", color: B.primary },
  { emoji: "🌍", label: "Other", color: "#64748B" },
];

export const STEP_LABEL = [
  "Let's begin",
  "Your mood",
  "Your emotions",
  "Energy check",
  "Stress check",
  "What's going on?",
  "A few questions",
  "Abibeka's insight",
  "Your journey",
];

export const TOTAL_STEPS = 7;

// ─── Contribution grid ────────────────────────────────────────────────────────

export const GRID = (() => {
  const r = (() => {
    let x = 42;
    return () => {
      x = (x * 9301 + 49297) % 233280;
      return x / 233280;
    };
  })();
  return Array.from({ length: 16 }, () =>
    Array.from({ length: 7 }, () => {
      const v = r();
      if (v < 0.18) return 0;
      if (v < 0.42) return 1;
      if (v < 0.65) return 2;
      if (v < 0.84) return 3;
      return 4;
    }),
  );
})();

export const gridColor = (v: number) => {
  if (v === 0) return "rgba(255,255,255,0.05)";
  if (v === 1) return B.accent;
  if (v === 2) return B.primary;
  if (v === 3) return B.amber;
  return B.red;
};

export const GRID_LEGEND = [
  { color: "rgba(255,255,255,0.06)", label: "Missed" },
  { color: B.accent, label: "Great day" },
  { color: B.primary, label: "Good day" },
  { color: B.amber, label: "Some stress" },
  { color: B.red, label: "High stress" },
];

// ─── Dynamic questions ────────────────────────────────────────────────────────

export type QuestionType = "tile" | "ring" | "yesno";

export interface Question {
  type: QuestionType;
  id: string;
  text: string;
  options?: string[];
  colors?: string[];
}

export const getQuestions = (
  moodIdx: number | null,
  situations: string[],
): Question[] => {
  const stressed = (moodIdx ?? 2) >= 5;
  const sad = (moodIdx ?? 2) === 3 || (moodIdx ?? 2) === 4;
  const work = situations.includes("Work");
  const relation = situations.includes("Relationship");

  const qs: Question[] = [
    {
      type: "ring",
      id: "sleep",
      text: "How has your sleep been recently?",
      options: ["Great", "Good", "Poor", "Very poor"],
    },
    {
      type: "tile",
      id: "focus",
      text: "How difficult was it to concentrate today?",
      options: ["Easy", "A little hard", "Quite hard", "Couldn't focus"],
      colors: [B.accent, B.primary, B.amber, B.red],
    },
  ];

  if (stressed || work)
    qs.push({
      type: "ring",
      id: "workload",
      text: "Is your workload feeling manageable?",
      options: ["Very much", "Mostly yes", "Struggling", "Overwhelmed"],
    });

  if (sad || relation)
    qs.push({
      type: "yesno",
      id: "support",
      text: "Have you felt supported by the people around you today?",
    });

  qs.push(
    {
      type: "tile",
      id: "improved",
      text: "Compared to yesterday, how are you feeling?",
      options: ["Much better", "Better", "About same", "Worse"],
      colors: [B.accent, B.teal, B.amber, B.red],
    },
    {
      type: "yesno",
      id: "break",
      text: "Did you take any meaningful breaks today?",
    },
  );

  return qs;
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AssessmentState {
  mood: number | null;
  emotions: string[];
  energy: number;
  stress: number;
  situations: string[];
  answers: Record<string, string>;
}
