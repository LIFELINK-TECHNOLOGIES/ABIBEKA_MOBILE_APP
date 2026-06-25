import React, { useCallback } from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Colors, { ColorKey } from "../../constant/color";
import Text, { TextSize, TextVariant } from "./txt";

export type BtnVariant = "filled" | "outlined" | "ghost" | "danger" | "success";

export type BtnSize = "xs" | "sm" | "md" | "lg";

const SIZE_TOKENS: Record<
  BtnSize,
  {
    paddingVertical: number;
    paddingHorizontal: number;
    borderRadius: number;
    textSize: TextSize;
    textVariant: TextVariant;
    iconSize: number;
    gap: number;
    loaderSize: number;
  }
> = {
  xs: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    textSize: "xs",
    textVariant: "semibold",
    iconSize: 14,
    gap: 4,
    loaderSize: 12,
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    textSize: "sm",
    textVariant: "semibold",
    iconSize: 16,
    gap: 6,
    loaderSize: 14,
  },
  md: {
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 10,
    textSize: "md",
    textVariant: "semibold",
    iconSize: 18,
    gap: 8,
    loaderSize: 16,
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    textSize: "lg",
    textVariant: "semibold",
    iconSize: 20,
    gap: 8,
    loaderSize: 18,
  },
  xl: {
    paddingVertical: 17,
    paddingHorizontal: 32,
    borderRadius: 14,
    textSize: "xl",
    textVariant: "bold",
    iconSize: 22,
    gap: 10,
    loaderSize: 20,
  },
};

// ─── Variant color config ──────────────────────────────────────────────────────

interface VariantConfig {
  bg: string;
  bgPressed: string;
  bgDisabled: string;
  text: string;
  textDisabled: string;
  borderColor: string;
  borderColorDisabled: string;
  loaderColor: string;
}

const VARIANT_CONFIG: Record<BtnVariant, VariantConfig> = {
  filled: {
    bg: Colors.brandPrimary,
    bgPressed: Colors.brandPrimaryDark,
    bgDisabled: Colors.gray200,
    text: Colors.white,
    textDisabled: Colors.gray400,
    borderColor: Colors.transparent,
    borderColorDisabled: Colors.transparent,
    loaderColor: Colors.white,
  },
  outlined: {
    bg: Colors.transparent,
    bgPressed: Colors.brandPrimaryFaded,
    bgDisabled: Colors.transparent,
    text: Colors.brandPrimary,
    textDisabled: Colors.gray400,
    borderColor: Colors.brandPrimary,
    borderColorDisabled: Colors.gray300,
    loaderColor: Colors.brandPrimary,
  },
  ghost: {
    bg: Colors.transparent,
    bgPressed: Colors.gray100,
    bgDisabled: Colors.transparent,
    text: Colors.brandPrimary,
    textDisabled: Colors.gray400,
    borderColor: Colors.transparent,
    borderColorDisabled: Colors.transparent,
    loaderColor: Colors.brandPrimary,
  },
  danger: {
    bg: Colors.error500,
    bgPressed: Colors.error700,
    bgDisabled: Colors.gray200,
    text: Colors.white,
    textDisabled: Colors.gray400,
    borderColor: Colors.transparent,
    borderColorDisabled: Colors.transparent,
    loaderColor: Colors.white,
  },
  success: {
    bg: Colors.success500,
    bgPressed: Colors.success700,
    bgDisabled: Colors.gray200,
    text: Colors.white,
    textDisabled: Colors.gray400,
    borderColor: Colors.transparent,
    borderColorDisabled: Colors.transparent,
    loaderColor: Colors.white,
  },
};

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface BtnProps extends Omit<PressableProps, "style" | "disabled"> {
  variant?: BtnVariant;

  size?: BtnSize;
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
  style?: ViewStyle | ViewStyle[];
  labelStyle?: TextStyle;
  bgColor?: ColorKey | (string & {});
  textColor?: ColorKey | (string & {});
  borderRadius?: number;
  borderColor?: ColorKey | (string & {});
  borderWidth?: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const resolveColor = (value: string): string =>
  value in Colors ? Colors[value as ColorKey] : value;

// ─── Component ─────────────────────────────────────────────────────────────────

const Btn: React.FC<BtnProps> = ({
  variant = "filled",
  size = "md",
  label,
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  style,
  labelStyle,
  bgColor,
  textColor,
  borderColor,
  borderWidth,
  borderRadius,
  onPress,
  children,
  ...rest
}) => {
  const tokens = SIZE_TOKENS[size];
  const config = VARIANT_CONFIG[variant];
  const isDisabled = disabled || loading;

  // ── Resolved colors ──────────────────────────────────────────────────────────
  const resolvedBg = bgColor
    ? resolveColor(bgColor)
    : isDisabled
      ? config.bgDisabled
      : config.bg;

  const resolvedText = textColor
    ? resolveColor(textColor)
    : isDisabled
      ? config.textDisabled
      : config.text;

  const resolvedBorder = borderColor
    ? resolveColor(borderColor)
    : isDisabled
      ? config.borderColorDisabled
      : config.borderColor;

  const resolvedBorderWidth =
    borderWidth !== undefined ? borderWidth : variant === "outlined" ? 1.5 : 0;

  // ── Pressable feedback ───────────────────────────────────────────────────────
  const getPressedBg = useCallback(
    (pressed: boolean) => {
      if (bgColor) return resolveColor(bgColor);
      if (isDisabled) return config.bgDisabled;
      return pressed ? config.bgPressed : config.bg;
    },
    [bgColor, isDisabled, config],
  );

  // ── Container style ──────────────────────────────────────────────────────────
  const containerStyle = (pressed: boolean): ViewStyle => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: fullWidth ? "stretch" : "flex-start",
    gap: tokens.gap,
    paddingVertical: iconOnly
      ? tokens.paddingHorizontal / 2
      : tokens.paddingVertical,
    paddingHorizontal: iconOnly
      ? tokens.paddingHorizontal / 2
      : tokens.paddingHorizontal,
    borderRadius:
      borderRadius !== undefined ? borderRadius : tokens.borderRadius,
    backgroundColor: getPressedBg(pressed),
    borderWidth: resolvedBorderWidth,
    borderColor: resolvedBorder,
    opacity: isDisabled ? 0.6 : 1,
  });

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        containerStyle(pressed),
        ...(Array.isArray(style) ? style : style ? [style] : []),
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size={tokens.loaderSize} color={resolvedText} />
      ) : (
        <>
          {!iconOnly && leftIcon && (
            <View style={{ width: tokens.iconSize, height: tokens.iconSize }}>
              {leftIcon}
            </View>
          )}

          {iconOnly ? (
            <View style={{ width: tokens.iconSize, height: tokens.iconSize }}>
              {leftIcon ?? rightIcon ?? children}
            </View>
          ) : (
            <>
              {label ? (
                <Text
                  variant={tokens.textVariant}
                  size={tokens.textSize}
                  color={resolvedText}
                  style={labelStyle}
                >
                  {label}
                </Text>
              ) : (
                children
              )}
            </>
          )}

          {!iconOnly && rightIcon && (
            <View style={{ width: tokens.iconSize, height: tokens.iconSize }}>
              {rightIcon}
            </View>
          )}
        </>
      )}
    </Pressable>
  );
};

export default Btn;
