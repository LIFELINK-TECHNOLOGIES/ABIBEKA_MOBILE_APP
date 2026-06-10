import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  TextStyle,
  Platform,
} from "react-native";
import Colors, { ColorKey } from "../../constant/color";
import Text from "./txt";

export type SelectorVariant = "outlined" | "filled" | "underline";

export type SelectorSize = "sm" | "md" | "lg";

export type SelectorMode = "single" | "multi";

export interface SelectorOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

const SIZE_TOKENS: Record<
  SelectorSize,
  {
    paddingVertical: number;
    paddingHorizontal: number;
    borderRadius: number;
    fontSize: number;
    lineHeight: number;
    labelFontSize: number;
    helperFontSize: number;
    iconSize: number;
    chipPaddingH: number;
    chipPaddingV: number;
    chipFontSize: number;
    dropdownRadius: number;
    optionPaddingV: number;
    optionPaddingH: number;
  }
> = {
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 13,
    lineHeight: 18,
    labelFontSize: 12,
    helperFontSize: 11,
    iconSize: 16,
    chipPaddingH: 8,
    chipPaddingV: 3,
    chipFontSize: 11,
    dropdownRadius: 8,
    optionPaddingV: 10,
    optionPaddingH: 12,
  },
  md: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    fontSize: 15,
    lineHeight: 22,
    labelFontSize: 13,
    helperFontSize: 12,
    iconSize: 18,
    chipPaddingH: 10,
    chipPaddingV: 4,
    chipFontSize: 12,
    dropdownRadius: 10,
    optionPaddingV: 12,
    optionPaddingH: 14,
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 17,
    lineHeight: 26,
    labelFontSize: 14,
    helperFontSize: 13,
    iconSize: 20,
    chipPaddingH: 12,
    chipPaddingV: 5,
    chipFontSize: 13,
    dropdownRadius: 12,
    optionPaddingV: 14,
    optionPaddingH: 16,
  },
};

interface VariantConfig {
  bg: string;
  bgDisabled: string;
  border: string;
  borderFocused: string;
  borderError: string;
  borderDisabled: string;
}

const VARIANT_CONFIG: Record<SelectorVariant, VariantConfig> = {
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

const resolveColor = (value: string): string =>
  value in Colors ? Colors[value as ColorKey] : value;

export interface SelectorProps<T = string> {
  options: SelectorOption<T>[];
  value?: T | T[];
  onChange?: (value: T | T[]) => void;
  mode?: SelectorMode;
  variant?: SelectorVariant;
  size?: SelectorSize;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  disabled?: boolean;
  searchable?: boolean;
  maxSelected?: number;
  fullWidth?: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
  triggerStyle?: ViewStyle;
  dropdownStyle?: ViewStyle;
  optionStyle?: ViewStyle;
  labelStyle?: TextStyle;
  helperStyle?: TextStyle;
  placeholderColor?: ColorKey | (string & {});
  borderColor?: ColorKey | (string & {});
  bgColor?: ColorKey | (string & {});
  borderRadius?: number;
  borderWidth?: number;
  maxDropdownHeight?: number;
  renderOption?: (
    option: SelectorOption<T>,
    isSelected: boolean,
  ) => React.ReactNode;
  renderChip?: (
    option: SelectorOption<T>,
    onRemove: () => void,
  ) => React.ReactNode;
  keyExtractor?: (option: SelectorOption<T>) => string;
}

function Selector<T = string>({
  options,
  value,
  onChange,
  mode = "single",
  variant = "outlined",
  size = "md",
  label,
  placeholder = "Select...",
  helperText,
  errorText,
  disabled = false,
  searchable = false,
  maxSelected,
  fullWidth = true,
  containerStyle,
  triggerStyle,
  dropdownStyle,
  optionStyle,
  labelStyle,
  helperStyle,
  placeholderColor,
  borderColor,
  bgColor,
  borderRadius,
  borderWidth,
  maxDropdownHeight = 240,
  renderOption,
  renderChip,
  keyExtractor,
}: SelectorProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const tokens = SIZE_TOKENS[size];
  const config = VARIANT_CONFIG[variant];
  const hasError = Boolean(errorText);
  const isFocused = open;

  const selectedValues: T[] =
    mode === "multi"
      ? Array.isArray(value)
        ? value
        : value !== undefined
          ? [value]
          : []
      : value !== undefined
        ? [value as T]
        : [];

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

  const resolvedBorderWidth =
    borderWidth !== undefined ? borderWidth : variant === "filled" ? 0 : 1.5;

  const resolvedBorderRadius =
    borderRadius !== undefined ? borderRadius : tokens.borderRadius;

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

  const filteredOptions =
    searchable && search.trim()
      ? options.filter((o) =>
          o.label.toLowerCase().includes(search.trim().toLowerCase()),
        )
      : options;

  const getOptionLabel = useCallback(
    (val: T): string =>
      options.find((o) => o.value === val)?.label ?? String(val),
    [options],
  );

  const isSelected = useCallback(
    (val: T) => selectedValues.some((s) => s === val),
    [selectedValues],
  );

  const handleSelect = useCallback(
    (val: T) => {
      if (mode === "single") {
        onChange?.(val);
        setOpen(false);
        setSearch("");
        return;
      }
      const already = isSelected(val);
      if (already) {
        onChange?.(selectedValues.filter((s) => s !== val) as T[]);
      } else {
        if (maxSelected && selectedValues.length >= maxSelected) return;
        onChange?.([...selectedValues, val] as T[]);
      }
    },
    [mode, isSelected, selectedValues, onChange, maxSelected],
  );

  const handleRemoveChip = useCallback(
    (val: T) => {
      onChange?.(selectedValues.filter((s) => s !== val) as T[]);
    },
    [selectedValues, onChange],
  );

  const handleOpen = () => {
    if (disabled) return;
    setOpen(true);
  };

  const defaultKeyExtractor = (o: SelectorOption<T>) =>
    keyExtractor ? keyExtractor(o) : String(o.value);

  const ChevronIcon = () => (
    <View
      style={{
        width: tokens.iconSize,
        height: tokens.iconSize,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: tokens.iconSize * 0.55,
          height: tokens.iconSize * 0.55,
          borderRightWidth: 1.5,
          borderBottomWidth: 1.5,
          borderColor: disabled ? Colors.textDisabled : Colors.textSecondary,
          transform: [{ rotate: open ? "-135deg" : "45deg" }],
          marginTop: open ? 4 : -4,
        }}
      />
    </View>
  );

  const CheckIcon = () => (
    <View
      style={{
        width: 16,
        height: 16,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 10,
          height: 6,
          borderLeftWidth: 2,
          borderBottomWidth: 2,
          borderColor: Colors.brandPrimary,
          transform: [{ rotate: "-45deg" }],
          marginTop: -3,
        }}
      />
    </View>
  );

  const renderTriggerContent = () => {
    if (mode === "multi" && selectedValues.length > 0) {
      return (
        <View
          style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 6 }}
        >
          {selectedValues.map((val) => {
            const opt = options.find((o) => o.value === val);
            if (!opt) return null;
            if (renderChip) return renderChip(opt, () => handleRemoveChip(val));
            return (
              <View
                key={defaultKeyExtractor(opt)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Colors.brandPrimaryFaded,
                  borderRadius: tokens.borderRadius - 2,
                  paddingHorizontal: tokens.chipPaddingH,
                  paddingVertical: tokens.chipPaddingV,
                  gap: 4,
                }}
              >
                <Text size="xs" variant="medium" color="brandPrimary">
                  {opt.label}
                </Text>
                <Pressable
                  onPress={() => handleRemoveChip(val)}
                  hitSlop={6}
                  disabled={disabled}
                >
                  <Text size="xs" variant="bold" color="brandPrimary">
                    ×
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      );
    }

    const displayLabel =
      mode === "single" && selectedValues.length > 0
        ? getOptionLabel(selectedValues[0])
        : null;

    return (
      <Text
        size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"}
        variant="regular"
        color={
          displayLabel
            ? disabled
              ? "textDisabled"
              : "textPrimary"
            : "textTertiary"
        }
        style={{ flex: 1 }}
        numberOfLines={1}
      >
        {displayLabel ?? placeholder}
      </Text>
    );
  };

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
      {label && (
        <Text
          size="sm"
          variant="medium"
          color={
            hasError ? "error500" : isFocused ? "brandPrimary" : "textSecondary"
          }
          style={[{ marginBottom: 5 }, labelStyle]}
        >
          {label}
        </Text>
      )}

      <Pressable
        onPress={handleOpen}
        accessibilityRole="combobox"
        accessibilityState={{ expanded: open, disabled }}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: resolvedBg,
            paddingHorizontal: tokens.paddingHorizontal,
            paddingVertical: tokens.paddingVertical,
            gap: 8,
            opacity: disabled ? 0.6 : 1,
          },
          wrapperBorderStyle,
          triggerStyle,
        ]}
      >
        {renderTriggerContent()}
        <ChevronIcon />
      </Pressable>

      {(helperText || errorText) && (
        <Text
          size="xs"
          variant="regular"
          color={hasError ? "error500" : "textTertiary"}
          style={[{ marginTop: 4 }, helperStyle]}
        >
          {errorText ?? helperText}
        </Text>
      )}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setOpen(false);
          setSearch("");
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setOpen(false);
            setSearch("");
          }}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.25)" }}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  {
                    position: "absolute",
                    left: 16,
                    right: 16,
                    top: "30%",
                    backgroundColor: Colors.white,
                    borderRadius: tokens.dropdownRadius,
                    overflow: "hidden",
                    ...Platform.select({
                      ios: {
                        shadowColor: Colors.black,
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.12,
                        shadowRadius: 20,
                      },
                      android: { elevation: 10 },
                    }),
                  },
                  dropdownStyle,
                ]}
              >
                {searchable && (
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.gray200,
                      paddingHorizontal: tokens.optionPaddingH,
                      paddingVertical: 8,
                    }}
                  >
                    <TextInput
                      value={search}
                      onChangeText={setSearch}
                      placeholder="Search..."
                      placeholderTextColor={Colors.textTertiary}
                      allowFontScaling={false}
                      autoFocus
                      style={{
                        fontSize: tokens.fontSize,
                        color: Colors.textPrimary,
                        paddingVertical: 6,
                      }}
                    />
                  </View>
                )}

                <FlatList
                  data={filteredOptions}
                  keyExtractor={defaultKeyExtractor}
                  style={{ maxHeight: maxDropdownHeight }}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item, index }) => {
                    const selected = isSelected(item.value);
                    const isLast = index === filteredOptions.length - 1;

                    if (renderOption) {
                      return (
                        <Pressable
                          onPress={() =>
                            !item.disabled && handleSelect(item.value)
                          }
                          disabled={item.disabled}
                        >
                          {renderOption(item, selected)}
                        </Pressable>
                      );
                    }

                    return (
                      <Pressable
                        onPress={() =>
                          !item.disabled && handleSelect(item.value)
                        }
                        disabled={item.disabled}
                        style={({ pressed }) => [
                          {
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingVertical: tokens.optionPaddingV,
                            paddingHorizontal: tokens.optionPaddingH,
                            backgroundColor: pressed
                              ? Colors.gray50
                              : selected
                                ? Colors.brandPrimaryFaded
                                : Colors.white,
                            borderBottomWidth: isLast ? 0 : 1,
                            borderBottomColor: Colors.gray100,
                            opacity: item.disabled ? 0.4 : 1,
                          },
                          optionStyle,
                        ]}
                      >
                        <Text
                          size={
                            size === "sm" ? "sm" : size === "lg" ? "lg" : "md"
                          }
                          variant={selected ? "semibold" : "regular"}
                          color={
                            selected
                              ? "brandPrimary"
                              : item.disabled
                                ? "textDisabled"
                                : "textPrimary"
                          }
                        >
                          {item.label}
                        </Text>
                        {selected && <CheckIcon />}
                      </Pressable>
                    );
                  }}
                  ListEmptyComponent={
                    <View
                      style={{
                        padding: tokens.optionPaddingH * 1.5,
                        alignItems: "center",
                      }}
                    >
                      <Text size="sm" color="textTertiary">
                        No options found
                      </Text>
                    </View>
                  }
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

export default Selector;
