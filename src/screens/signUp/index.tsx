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
import { useNavigation } from "@react-navigation/native";

import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Path,
  Stop,
} from "react-native-svg";


const BRAND = {
  primary: "#0F766E",
  secondary: "#1E3A8A",
  accent: "#22C55E",
  bg: "#050816",
  card: "rgba(10,16,32,0.92)",
  border: "rgba(255,255,255,0.08)",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.45)",
  input: "rgba(255,255,255,0.04)",
};

// ─── Brand logo ───────────────────────────────────────────────────────────────
const BrandLogo = ({ size = 64 }: { size?: number }) => {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.05,
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
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30);
    return { x: r + (r - 2) * Math.cos(a), y: r + (r - 2) * Math.sin(a) };
  });
  const hexPath =
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <Animated.View
      style={{
        transform: [{ scale: pulse }],
        shadowColor: BRAND.primary,
        shadowRadius: 16,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 0 },
      }}
    >
      <Svg width={size} height={size}>
        <Defs>
          <SvgGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={BRAND.primary} />
            <Stop offset="100%" stopColor={BRAND.secondary} />
          </SvgGradient>
        </Defs>
        <Path d={hexPath} fill="url(#lg)" />
        <Circle cx={r} cy={r} r={r * 0.44} fill={BRAND.bg} />
        <Circle cx={r} cy={r} r={r * 0.13} fill={BRAND.accent} />
      </Svg>
    </Animated.View>
  );
};

// ─── Reusable Animated Input Field ───────────────────────────────────────────
const InputField = ({
  label,
  value,
  onChangeText,
  secure = false,
  icon,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  secure?: boolean;
  icon: string;
}) => {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [BRAND.border, BRAND.primary],
  });
  const bgColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [BRAND.input, "rgba(15,118,110,0.08)"],
  });
  const iconColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.22)", BRAND.primary],
  });

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Animated.View
        style={[styles.inputWrap, { borderColor, backgroundColor: bgColor }]}
      >
        <Animated.Text style={[styles.inputIcon, { color: iconColor }]}>
          {icon}
        </Animated.Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure && !show}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={label}
          placeholderTextColor="rgba(255,255,255,0.18)"
          style={styles.input}
          autoCapitalize="none"
        />
        {secure && (
          <Pressable onPress={() => setShow((v) => !v)} hitSlop={8}>
            <Text style={styles.showText}>{show ? "Hide" : "Show"}</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
};

// ─── Main Signup Screen Component ────────────────────────────────────────────
interface SignUpScreenProps {
  onSignInPress?: () => void;
}

export default function SignUpScreen({ onSignInPress }: SignUpScreenProps) {
  const navigation = useNavigation();

  // Flow State Switch: 'user' | 'org'
  const [accountType, setAccountType] = useState<"user" | "org">("user");

  // Shared Data States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Account Specific States
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [taxId, setTaxId] = useState("");

  // Staggered Entry Animation Hooks
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const formShiftAnim = useRef(new Animated.Value(1)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Soft content switch animation logic when context shifts
  const handleAccountTypeChange = (type: "user" | "org") => {
    if (type === accountType) return;
    Animated.sequence([
      Animated.timing(formShiftAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAccountType(type);
      Animated.timing(formShiftAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSignUp = () => {
    Animated.sequence([
      Animated.spring(btnScale, {
        toValue: 0.96,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(btnScale, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start(() => 
     navigation.navigate("Home"));
  };

  const contentTranslateY = formShiftAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

  return (
    <View style={styles.root}>
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
            {/* Header Element */}
            <Animated.View style={[styles.logoBlock, { opacity: fadeAnim }]}>
              <BrandLogo size={52} />
              <View style={{ marginLeft: 14 }}>
                <Text style={styles.wordmark}>Abibeka</Text>
                <Text style={styles.wordmarkSub}>Create Secure Workspace</Text>
              </View>
            </Animated.View>

            <Animated.View
              style={[{ opacity: fadeAnim }, { marginBottom: 20 }]}
            >
              <Text style={styles.pageTitle}>Get Started</Text>
              <Text style={styles.pageSub}>
                Configure identity encryption keys
              </Text>
            </Animated.View>

            {/* Type Switcher (Segmented Pill Layout) */}
            <Animated.View
              style={[styles.switchContainer, { opacity: fadeAnim }]}
            >
              <Pressable
                style={[
                  styles.switchTab,
                  accountType === "user" && styles.switchTabActive,
                ]}
                onPress={() => handleAccountTypeChange("user")}
              >
                <Text
                  style={[
                    styles.switchText,
                    accountType === "user" && styles.switchTextActive,
                  ]}
                >
                  Individual
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.switchTab,
                  accountType === "org" && styles.switchTabActive,
                ]}
                onPress={() => handleAccountTypeChange("org")}
              >
                <Text
                  style={[
                    styles.switchText,
                    accountType === "org" && styles.switchTextActive,
                  ]}
                >
                  Organization
                </Text>
              </Pressable>
            </Animated.View>

            {/* Card Shell */}
            <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
              <View style={styles.cardLeftAccent} />

              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>
                  {accountType === "user"
                    ? "Personal Account Space"
                    : "Enterprise Tenant Node"}
                </Text>
              </View>

              {/* Dynamic Animated Data Form */}
              <Animated.View
                style={{
                  opacity: formShiftAnim,
                  transform: [{ translateY: contentTranslateY }],
                }}
              >
                {accountType === "user" ? (
                  <View>
                    <InputField
                      label="Full Name"
                      value={fullName}
                      onChangeText={setFullName}
                      icon="👤"
                    />
                    <InputField
                      label="Email Address"
                      value={email}
                      onChangeText={setEmail}
                      icon="✉"
                    />
                  </View>
                ) : (
                  <View>
                    <InputField
                      label="Organization Name"
                      value={orgName}
                      onChangeText={setOrgName}
                      icon="🏢"
                    />
                    <InputField
                      label="Corporate Business Email"
                      value={email}
                      onChangeText={setEmail}
                      icon="✉"
                    />
                    <InputField
                      label="Tax ID / Registration Number"
                      value={taxId}
                      onChangeText={setTaxId}
                      icon="📜"
                    />
                  </View>
                )}

                <InputField
                  label="Vault Access Password"
                  value={password}
                  onChangeText={setPassword}
                  icon="⚿"
                  secure
                />
              </Animated.View>

              {/* Register Callout Action */}
              <Animated.View
                style={{ marginTop: 12, transform: [{ scale: btnScale }] }}
              >
                <TouchableOpacity
                  onPress={handleSignUp}
                  activeOpacity={0.88}
                  style={styles.btn}
                >
                  <Text style={styles.btnText}>Generate Credentials</Text>
                  <View style={styles.btnDot} />
                </TouchableOpacity>
              </Animated.View>

              {/* Encrypted Protection Meta Node Footer */}
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <View
                    style={[styles.metaDot, { backgroundColor: BRAND.accent }]}
                  />
                  <Text style={styles.metaText}>
                    Zero Knowledge Architecture
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Account Switch Redirection Footer */}
            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
              <Text style={styles.footerText}>Already tracking accounts?</Text>
              <Pressable onPress={onSignInPress} hitSlop={10}>
                <Text style={styles.footerLink}> Sign In</Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ─── Layout Styling Blocks ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BRAND.bg },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  logoBlock: { flexDirection: "row", alignItems: "center", marginBottom: 28 },
  wordmark: {
    fontSize: 22,
    fontWeight: "800",
    color: BRAND.text,
    letterSpacing: -0.5,
  },
  wordmarkSub: { fontSize: 11, color: BRAND.muted, marginTop: 2 },
  pageTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: BRAND.text,
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  pageSub: { fontSize: 14, color: BRAND.muted },

  // Account Flow Segment Selector Toggle
  switchContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: BRAND.border,
    marginBottom: 20,
  },
  switchTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  switchTabActive: {
    backgroundColor: BRAND.primary,
    shadowColor: BRAND.primary,
    shadowRadius: 8,
    shadowOpacity: 0.3,
  },
  switchText: {
    fontSize: 13,
    fontWeight: "600",
    color: BRAND.muted,
  },
  switchTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // Main Card Assembly Frame
  card: {
    backgroundColor: BRAND.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BRAND.border,
    padding: 24,
    paddingLeft: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowRadius: 30,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
  },
  cardLeftAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: BRAND.primary,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(15,118,110,0.25)",
    backgroundColor: "rgba(15,118,110,0.1)",
    marginBottom: 20,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BRAND.accent,
    marginRight: 7,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: BRAND.primary,
    letterSpacing: 0.3,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  inputWrap: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  inputIcon: { fontSize: 15, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: BRAND.text },
  showText: { fontSize: 11, fontWeight: "700", color: BRAND.primary },
  btn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: BRAND.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BRAND.primary,
    shadowRadius: 16,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
  },
  btnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.2,
  },
  btnDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: BRAND.accent,
    marginLeft: 10,
  },
  metaRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaDot: { width: 5, height: 5, borderRadius: 99, marginRight: 6 },
  metaText: { fontSize: 11, color: "rgba(255,255,255,0.28)" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  footerText: { fontSize: 13, color: BRAND.muted },
  footerLink: { fontSize: 13, fontWeight: "800", color: BRAND.primary },
});
