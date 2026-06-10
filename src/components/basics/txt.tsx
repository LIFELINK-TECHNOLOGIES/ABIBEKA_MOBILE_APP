import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from "react-native";
import Colors, { ColorKey } from "../../constant/color";

const SIZE_MAP = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 34,
  "5xl": 40,
  "6xl": 48,
} as const;

export type TextSize = keyof typeof SIZE_MAP;

const LINE_HEIGHT_MAP: Record<TextSize, number> = {
  xs: 16,
  sm: 18,
  md: 22,
  lg: 26,
  xl: 28,
  "2xl": 32,
  "3xl": 38,
  "4xl": 44,
  "5xl": 52,
  "6xl": 60,
};

const WEIGHT_MAP = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
} as const;

export type TextVariant = keyof typeof WEIGHT_MAP;
export type TextAlign = "left" | "center" | "right" | "justify";
export type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";

export interface TextProps extends Omit<RNTextProps, "style"> {
  variant?: TextVariant;
  size?: TextSize;
  color?: ColorKey | (string & {});
  align?: TextAlign;
  transform?: TextTransform;
  tracking?: number;

  style?: TextStyle | TextStyle[];
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  disabled?: boolean;
}

// ─── Component ─────────────────────────────────────────────────────────────────

const Text: React.FC<TextProps> = ({
  variant = "regular",
  size = "md",
  color = "textPrimary",
  align,
  transform,
  tracking,
  italic = false,
  underline = false,
  strikethrough = false,
  disabled = false,
  style,
  children,
  ...rest
}) => {
  const resolvedColor =
    color in Colors ? Colors[color as ColorKey] : (color as string);

  const textDecoration: TextStyle["textDecorationLine"] =
    underline && strikethrough
      ? "underline line-through"
      : underline
        ? "underline"
        : strikethrough
          ? "line-through"
          : "none";

  const composedStyle: TextStyle = {
    fontSize: SIZE_MAP[size],
    lineHeight: LINE_HEIGHT_MAP[size],
    fontWeight: WEIGHT_MAP[variant],
    color: resolvedColor,
    ...(align && { textAlign: align }),
    ...(transform && { textTransform: transform }),
    ...(tracking !== undefined && { letterSpacing: tracking }),
    ...(italic && { fontStyle: "italic" }),
    textDecorationLine: textDecoration,
    ...(disabled && { opacity: 0.4 }),
  };

  return (
    <RNText
      allowFontScaling={false} // Disable OS font scaling for consistency
      style={[
        composedStyle,
        ...(Array.isArray(style) ? style : style ? [style] : []),
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export default Text;
