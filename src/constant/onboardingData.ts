export interface SlideItem {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
  bgAccent: string;
}

export const SLIDES: SlideItem[] = [
  {
    id: "1",
    eyebrow: "WELCOME TO ABIBEKA",
    title: "Your feelings\nare safe here",
    subtitle:
      "Express how you truly feel at work  anonymously, without fear. No names, no judgment, just honest wellbeing support.",
    accent: "#2563EB",
    bgAccent: "#EFF6FF",
  },
  {
    id: "2",
    eyebrow: "EMOTIONAL AI",
    title: "Talk to ABIBEKA AI\nthat listens",
    subtitle:
      "Our emotionally intelligent AI holds space for you  in English, French, or Nigerian Pidgin. Available whenever you need it.",
    accent: "#7C3AED",
    bgAccent: "#F5F3FF",
  },
  {
    id: "3",
    eyebrow: "MOOD TRACKING",
    title: "Understand your\nemotional rhythm",
    subtitle:
      "Daily check-ins reveal patterns  stress, burnout signals, mood trends — giving you clear visibility into your inner state.",
    accent: "#059669",
    bgAccent: "#ECFDF5",
  },
  {
    id: "4",
    eyebrow: "PRIVACY FIRST",
    title: "Your identity stays\nyours, always",
    subtitle:
      "Your emotional data is encrypted and stored separately from any identifying information.",
    accent: "#8B5CF6",
    bgAccent: "#F5F3FF",
  },
];
