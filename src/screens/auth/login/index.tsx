import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Path,
  Stop,
} from "react-native-svg";

import { MechBackground } from "../../../components/ui/background";

const { width: W } = Dimensions.get("window");

const BRAND = {
  primary: "#0F766E",
  secondary: "#1E3A8A",
  accent: "#22C55E",

  bg: "#050816",
  card: "rgba(10,16,32,0.82)",
  border: "rgba(255,255,255,0.08)",

  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.55)",

  input: "rgba(255,255,255,0.04)",
};

// ─────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────

const BrandLogo = ({ size = 72 }: { size?: number }) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.04,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const r = size / 2;

  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);

    return {
      x: r + (r - 2) * Math.cos(angle),
      y: r + (r - 2) * Math.sin(angle),
    };
  });

  const hexPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <Animated.View
      style={{
        transform: [{ scale: pulse }],
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={BRAND.primary} />
            <Stop offset="100%" stopColor={BRAND.secondary} />
          </SvgGradient>
        </Defs>

        <Path d={`${hexPath} Z`} fill="url(#grad)" />

        <Circle cx={r} cy={r} r={r * 0.44} fill={BRAND.bg} />

        <Circle cx={r} cy={r} r={r * 0.12} fill={BRAND.accent} />
      </Svg>
    </Animated.View>
  );
};

// ─────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────

interface InputProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  secure?: boolean;
  icon: string;
}

const InputField = ({
  label,
  value,
  onChangeText,
  secure,
  icon,
}: InputProps) => {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);

  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: focused ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.06)", BRAND.primary],
  });

  const bgColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [BRAND.input, "rgba(15,118,110,0.10)"],
  });

  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={styles.inputLabel}>{label}</Text>

      <Animated.View
        style={[
          styles.inputWrap,
          {
            borderColor,
            backgroundColor: bgColor,
          },
        ]}
      >
        <Text style={styles.inputIcon}>{icon}</Text>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure && !show}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={label}
          placeholderTextColor="rgba(255,255,255,0.22)"
          style={styles.input}
          autoCapitalize="none"
        />

        {secure && (
          <Pressable onPress={() => setShow((v) => !v)}>
            <Text style={styles.showText}>{show ? "Hide" : "Show"}</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
};

// ─────────────────────────────────────────
// SCREEN
// ─────────────────────────────────────────

interface LoginScreenProps {
  onLogin?: () => void;
  onForgotPass?: () => void;
  onSignUp?: () => void;
}

export default function LoginScreen({
  onLogin,
  onForgotPass,
  onSignUp,
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(40)).current;

  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.timing(slide, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = () => {
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.96,
        useNativeDriver: true,
      }),

      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onLogin?.();
    });
  };

  return (
    <MechBackground reticleSize={165} showLabels>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={{
                opacity: fade,
                transform: [{ translateY: slide }],
              }}
            >
              {/* HEADER */}
              <View style={styles.header}>
                <BrandLogo />

                <Text style={styles.brand}>LifeLink</Text>

                <Text style={styles.subtitle}>
                  Secure mental wellness platform
                </Text>
              </View>

              {/* CARD */}
              <View style={styles.card}>
                {/* TOP LINE */}
                <LinearGradient
                  colors={[BRAND.primary, BRAND.secondary, "transparent"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cardTopLine}
                />

                {/* BADGE */}
                <View style={styles.badge}>
                  <View style={styles.badgeDot} />

                  <Text style={styles.badgeText}>Protected Session</Text>
                </View>

                {/* TITLE */}
                <Text style={styles.title}>Welcome Back</Text>

                <Text style={styles.desc}>
                  Continue your wellness journey securely.
                </Text>

                {/* INPUTS */}
                <View style={{ marginTop: 28 }}>
                  <InputField
                    label="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    icon="✉"
                  />

                  <InputField
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secure
                    icon="⚿"
                  />
                </View>

                {/* FORGOT */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onForgotPass}
                  style={styles.forgotWrap}
                >
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>

                {/* BUTTON */}
                <Animated.View
                  style={{
                    transform: [{ scale: buttonScale }],
                  }}
                >
                  <TouchableOpacity activeOpacity={0.9} onPress={handleLogin}>
                    <LinearGradient
                      colors={[BRAND.primary, BRAND.secondary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>Sign In</Text>

                      <View style={styles.buttonDot} />
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>

                {/* META */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <View
                      style={[
                        styles.metaIndicator,
                        { backgroundColor: BRAND.accent },
                      ]}
                    />

                    <Text style={styles.metaText}>Encrypted</Text>
                  </View>

                  <View style={styles.metaItem}>
                    <View
                      style={[
                        styles.metaIndicator,
                        { backgroundColor: BRAND.primary },
                      ]}
                    />

                    <Text style={styles.metaText}>Private Identity</Text>
                  </View>
                </View>
              </View>

              {/* FOOTER */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>

                <TouchableOpacity onPress={onSignUp}>
                  <Text style={styles.footerLink}> Create Account</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </MechBackground>
  );
}

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  header: {
    alignItems: "center",
    marginBottom: 34,
  },

  brand: {
    marginTop: 16,
    fontSize: 32,
    fontWeight: "800",
    color: BRAND.text,
    letterSpacing: -1,
  },

  subtitle: {
    marginTop: 6,
    color: BRAND.muted,
    fontSize: 14,
  },

  card: {
    backgroundColor: BRAND.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: BRAND.border,
    overflow: "hidden",
    padding: 24,

    shadowColor: BRAND.primary,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.24,
    shadowRadius: 24,

    elevation: 10,
  },

  cardTopLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",

    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 999,

    backgroundColor: "rgba(15,118,110,0.12)",

    borderWidth: 1,
    borderColor: "rgba(15,118,110,0.24)",

    marginBottom: 22,
  },

  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: BRAND.accent,
    marginRight: 8,
  },

  badgeText: {
    color: BRAND.primary,
    fontWeight: "700",
    fontSize: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: BRAND.text,
    letterSpacing: -0.8,
  },

  desc: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: BRAND.muted,
  },

  inputLabel: {
    color: "rgba(255,255,255,0.55)",
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  inputWrap: {
    height: 58,

    borderRadius: 16,

    borderWidth: 1,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,
  },

  inputIcon: {
    fontSize: 16,
    marginRight: 12,
    color: BRAND.primary,
  },

  input: {
    flex: 1,
    color: BRAND.text,
    fontSize: 15,
  },

  showText: {
    color: BRAND.primary,
    fontWeight: "700",
    fontSize: 12,
  },

  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: 2,
    marginBottom: 28,
  },

  forgotText: {
    color: BRAND.primary,
    fontWeight: "600",
    fontSize: 13,
  },

  button: {
    height: 58,
    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    flexDirection: "row",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  buttonDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: BRAND.accent,
    marginLeft: 10,
  },

  metaRow: {
    flexDirection: "row",
    marginTop: 24,
    gap: 18,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  metaIndicator: {
    width: 6,
    height: 6,
    borderRadius: 99,
    marginRight: 6,
  },

  metaText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.38)",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },

  footerText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
  },

  footerLink: {
    color: BRAND.primary,
    fontSize: 13,
    fontWeight: "800",
  },
});
