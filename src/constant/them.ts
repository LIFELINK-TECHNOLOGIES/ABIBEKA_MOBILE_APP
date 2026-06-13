export const B = {
  primary: "#0F766E",
  secondary: "#1E3A8A",
  accent: "#22C55E",
  bg: "#04060F",
  card: "#080D1C",
  cardBorder: "rgba(255,255,255,0.06)",
  cardGlow: "rgba(15,118,110,0.08)",
  text: "#F0F4FF",
  muted: "rgba(240,244,255,0.4)",
  muted2: "rgba(240,244,255,0.18)",
  amber: "#F59E0B",
  red: "#EF4444",
  violet: "#8B5CF6",
};

export const MOOD_OPTIONS = [
  { key: "great", emoji: "😊", label: "Great", color: B.accent },
  { key: "calm", emoji: "😌", label: "Calm", color: B.primary },
  { key: "okay", emoji: "😐", label: "Okay", color: "#94A3B8" },
  { key: "low", emoji: "😔", label: "Low", color: B.violet },
  { key: "stressed", emoji: "😤", label: "Stressed", color: B.amber },
];

export const MOOD_TREND = [2, 0, 1, 3, 4, 2, 1];
export const STRESS_VALS = [42, 58, 50, 74, 68, 55, 44];
export const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
export const EMOTIONS = [
  { key: "calm", label: "Calm", pct: 36, color: B.primary },
  { key: "happy", label: "Happy", pct: 28, color: B.accent },
  { key: "stressed", label: "Stressed", pct: 22, color: B.amber },
  { key: "anxious", label: "Anxious", pct: 14, color: B.red },
];

export const MOOD_COLORS_TREND = [
  B.accent,
  B.primary,
  "#94A3B8",
  B.violet,
  B.amber,
];

export const CH = 110; // chart height
export const PAD = 16; // chart padding