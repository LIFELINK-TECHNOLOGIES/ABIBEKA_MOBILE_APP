export const BRAND = {
  primary: "#0F766E",
  secondary: "#1E3A8A",
  accent: "#22C55E",
  bg: "#04060F",
  card: "#080D1C",
  border: "rgba(255,255,255,0.06)",
  text: "#F0F4FF",
  muted: "rgba(240,244,255,0.4)",
};

export const MOODS = [
  { key: "great", emoji: "😄", label: "Great", color: "#22C55E" },
  { key: "calm", emoji: "😌", label: "Calm", color: "#0F766E" },
  { key: "okay", emoji: "😐", label: "Okay", color: "#94A3B8" },
  { key: "low", emoji: "😔", label: "Low", color: "#8B5CF6" },
  { key: "stressed", emoji: "😤", label: "Stressed", color: "#F59E0B" },
  { key: "anxious", emoji: "😰", label: "Anxious", color: "#EF4444" },
  { key: "sad", emoji: "😢", label: "Sad", color: "#6366F1" },
];

export const EMOTIONS = [
  "anxious",
  "overwhelmed",
  "lonely",
  "hopeful",
  "calm",
  "angry",
  "frustrated",
  "excited",
] as const;

export const SITUATIONS = [
  "work",
  "school",
  "family",
  "relationship",
  "health",
  "money",
  "career",
  "social",
  "unknown",
] as const;
