const Colors = {
  // Neutrals
  black: "#0A0A0A",
  white: "#FFFFFF",
  transparent: "transparent",

  // Grays
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",

  // Primary
  primary50: "#EFF6FF",
  primary100: "#DBEAFE",
  primary200: "#BFDBFE",
  primary300: "#93C5FD",
  primary400: "#60A5FA",
  primary500: "#3B82F6",
  primary600: "#2563EB",
  primary700: "#1D4ED8",
  primary800: "#1E40AF",
  primary900: "#1E3A8A",

  // Success
  success50: "#F0FDF4",
  success500: "#22C55E",
  success700: "#15803D",

  // Warning
  warning50: "#FFFBEB",
  warning500: "#F59E0B",
  warning700: "#B45309",

  // Error / Danger
  error50: "#FFF1F2",
  error500: "#EF4444",
  error700: "#B91C1C",

  // Text semantic aliases
  textPrimary: "#0A0A0A",
  textSecondary: "#4B5563",
  textTertiary: "#9CA3AF",
  textDisabled: "#D1D5DB",
  textInverse: "#FFFFFF",
  textLink: "#2563EB",
  textDanger: "#EF4444",
  textSuccess: "#15803D",
  textWarning: "#B45309",

  //brand colors
  brandPrimary: "#0F766E",
  brandSecondary: "#1E3A8A",
  brandThirdary: "#22C55E",
} as const;

export type ColorKey = keyof typeof Colors;

export default Colors;
