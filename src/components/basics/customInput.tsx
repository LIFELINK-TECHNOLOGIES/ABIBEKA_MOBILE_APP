import React, { forwardRef, useCallback, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Colors, { ColorKey } from "../../constant/color";
import Text from "./txt";

export type InputVariant = "outlined" | "filled" | "underline";
export type InputSize = "sm" | "md" | "lg";

const SIZE_TOKENS: Record<
  InputSize,
  {
    paddingVertical: number;
    paddingHorizontal: number;
    borderRadius: number;
    fontSize: number;
    lineHeight: number;
    labelSize: number;
    helperSize: number;
    iconSize: number;
    gap: number;
  }
> = {
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 13,
    lineHeight: 18,
    labelSize: 12,
    helperSize: 11,
    iconSize: 16,
    gap: 6,
  },
  md: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    fontSize: 15,
    lineHeight: 22,
    labelSize: 13,
    helperSize: 12,
    iconSize: 18,
    gap: 8,
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 17,
    lineHeight: 26,
    labelSize: 14,
    helperSize: 13,
    iconSize: 20,
    gap: 10,
  },
};

// ─── Variant config ────────────────────────────────────────────────────────────

interface VariantConfig {
  bg: string;
  bgDisabled: string;
  border: string;
  borderFocused: string;
  borderError: string;
  borderDisabled: string;
}

const VARIANT_CONFIG: Record<InputVariant, VariantConfig> = {
  outlined: {
    bg: Colors.white,
    bgDisabled: Colors.gray100,
    border: Colors.gray300,
    borderFocused: Colors.brandPrimary,
    borderError: Colors.error500,
    borderDisabled: Colors.gray200,
  },
  filled: {
    bg: Colors.gray100,
    bgDisabled: Colors.gray200,
    border: Colors.transparent,
    borderFocused: Colors.brandPrimary,
    borderError: Colors.error500,
    borderDisabled: Colors.transparent,
  },
  underline: {
    bg: Colors.transparent,
    bgDisabled: Colors.transparent,
    border: Colors.gray300,
    borderFocused: Colors.brandPrimary,
    borderError: Colors.error500,
    borderDisabled: Colors.gray200,
  },
};

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface CustomInputProps extends Omit<TextInputProps, "style"> {
  /** Visual style. Defaults to "outlined". */
  variant?: InputVariant;
  /** Size tier. Defaults to "md". */
  size?: InputSize;
  /** Floating label above the input. */
  label?: string;
  /** Helper text below the input. */
  helperText?: string;
  /** Error message — replaces helperText and activates error state. */
  errorText?: string;
  /** Disables the input. */
  disabled?: boolean;
  /** Shows a character counter using maxLength. */
  showCharCount?: boolean;
  /** Icon on the left inside the input. */
  leftIcon?: React.ReactNode;
  /** Icon or action on the right inside the input (e.g. clear, eye). */
  rightIcon?: React.ReactNode;
  /** Called when the right icon is pressed. */
  onRightIconPress?: () => void;
  /** Stretch to fill parent width. Defaults to true. */
  fullWidth?: boolean;
  /** Override the outer wrapper style. */
  containerStyle?: ViewStyle | ViewStyle[];
  /** Override the input row style. */
  inputStyle?: TextStyle;
  /** Override label text style. */
  labelStyle?: TextStyle;
  /** Override helper / error text style. */
  helperStyle?: TextStyle;
  /** Override input text color via ColorKey or raw hex. */
  textColor?: ColorKey | (string & {});
  /** Override placeholder color via ColorKey or raw hex. */
  placeholderColor?: ColorKey | (string & {});
  /** Override border color via ColorKey or raw hex (bypasses variant config). */
  borderColor?: ColorKey | (string & {});
  /** Override background color via ColorKey or raw hex. */
  bgColor?: ColorKey | (string & {});
  /** Override border radius. */
  borderRadius?: number;
  /** Border width. Defaults to 1.5 for outlined, 0 for filled, bottom-only for underline. */
  borderWidth?: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const resolveColor = (value: string): string =>
  value in Colors ? Colors[value as ColorKey] : value;

// ─── Component ─────────────────────────────────────────────────────────────────

const CustomInput = forwardRef<TextInput, CustomInputProps>(
  (
    {
      variant = "outlined",
      size = "md",
      label,
      helperText,
      errorText,
      disabled = false,
      showCharCount = false,
      leftIcon,
      rightIcon,
      onRightIconPress,
      fullWidth = true,
      containerStyle,
      inputStyle,
      labelStyle,
      helperStyle,
      textColor,
      placeholderColor,
      borderColor,
      bgColor,
      borderRadius,
      borderWidth,
      onFocus,
      onBlur,
      value,
      maxLength,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const tokens = SIZE_TOKENS[size];
    const config = VARIANT_CONFIG[variant];
    const hasError = Boolean(errorText);

    // ── Resolved colors ────────────────────────────────────────────────────────
    const resolvedBg = bgColor
      ? resolveColor(bgColor)
      : disabled
        ? config.bgDisabled
        : config.bg;

    const resolvedBorder = borderColor
      ? resolveColor(borderColor)
      : disabled
        ? config.borderDisabled
        : hasError
          ? config.borderError
          : isFocused
            ? config.borderFocused
            : config.border;

    const resolvedText = textColor
      ? resolveColor(textColor)
      : disabled
        ? Colors.textDisabled
        : Colors.textPrimary;

    const resolvedPlaceholder = placeholderColor
      ? resolveColor(placeholderColor)
      : Colors.textTertiary;

    const resolvedBorderRadius =
      borderRadius !== undefined ? borderRadius : tokens.borderRadius;

    // ── Border style per variant ───────────────────────────────────────────────
    const resolvedBorderWidth =
      borderWidth !== undefined ? borderWidth : variant === "filled" ? 0 : 1.5;

    const wrapperBorderStyle: ViewStyle =
      variant === "underline"
        ? {
            borderBottomWidth: resolvedBorderWidth || 1.5,
            borderBottomColor: resolvedBorder,
            borderRadius: 0,
          }
        : {
            borderWidth: resolvedBorderWidth,
            borderColor: resolvedBorder,
            borderRadius: resolvedBorderRadius,
          };

    // ── Handlers ───────────────────────────────────────────────────────────────
    const handleFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(false);
        onBlur?.(e);
      },
      [onBlur],
    );

    // ── Char count ─────────────────────────────────────────────────────────────
    const charCount = value ? String(value).length : 0;

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
      <View
        style={[
          { alignSelf: fullWidth ? "stretch" : "flex-start" },
          ...(Array.isArray(containerStyle)
            ? containerStyle
            : containerStyle
              ? [containerStyle]
              : []),
        ]}
      >
        {/* Label */}
        {label && (
          <Text
            size="sm"
            variant="medium"
            color={
              hasError
                ? "error500"
                : isFocused
                  ? "brandPrimary"
                  : "textSecondary"
            }
            style={[{ marginBottom: 5 }, labelStyle]}
          >
            {label}
          </Text>
        )}

        {/* Input row */}
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: resolvedBg,
              gap: tokens.gap,
              paddingHorizontal: tokens.paddingHorizontal,
            },
            wrapperBorderStyle,
          ]}
        >
          {/* Left icon */}
          {leftIcon && (
            <View
              style={{
                width: tokens.iconSize,
                height: tokens.iconSize,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {leftIcon}
            </View>
          )}

          {/* TextInput */}
          <TextInput
            ref={ref}
            value={value}
            maxLength={maxLength}
            editable={!disabled}
            allowFontScaling={false}
            placeholderTextColor={resolvedPlaceholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[
              {
                flex: 1,
                fontSize: tokens.fontSize,
                lineHeight: tokens.lineHeight,
                color: resolvedText,
                paddingVertical: tokens.paddingVertical,
                paddingHorizontal: 0,
              },
              inputStyle,
            ]}
            {...rest}
          />

          {/* Right icon */}
          {rightIcon && (
            <Pressable
              onPress={onRightIconPress}
              disabled={!onRightIconPress || disabled}
              hitSlop={8}
              style={{
                width: tokens.iconSize,
                height: tokens.iconSize,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {rightIcon}
            </Pressable>
          )}
        </View>

        {/* Footer row: helper/error + char count */}
        {(helperText || errorText || (showCharCount && maxLength)) && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            {/* Helper / error */}
            <Text
              size="xs"
              variant="regular"
              color={hasError ? "error500" : "textTertiary"}
              style={helperStyle}
            >
              {errorText ?? helperText ?? ""}
            </Text>

            {/* Char counter */}
            {showCharCount && maxLength && (
              <Text size="xs" variant="regular" color="textTertiary">
                {charCount}/{maxLength}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  },
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
