import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Alert,
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
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../../../utils/i18n";

import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Path,
  Stop,
} from "react-native-svg";
import { useAuthStore } from "../../../store/authStore";
import { useLogin } from "../../../api/hooks/shared/useAuth";

const { width: W } = Dimensions.get("window");

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

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "pcm", label: "Pidgin", flag: "🇳🇬" },
];

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

// ─── Language selector ────────────────────────────────────────────────────────

const LangSelector = ({
  selected,
  onSelect,
  enterAnim,
}: {
  selected: string;
  onSelect: (code: string) => void;
  enterAnim: Animated.Value;
}) => {
  const slideY = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

  return (
    <Animated.View
      style={[
        styles.langRow,
        { opacity: enterAnim, transform: [{ translateY: slideY }] },
      ]}
    >
      {LANGUAGES.map((lang) => {
        const active = selected === lang.code;
        return (
          <Pressable
            key={lang.code}
            onPress={() => onSelect(lang.code)}
            style={[styles.langPill, active && styles.langPillActive]}
          >
            <Text style={styles.langFlag}>{lang.flag}</Text>
            <Text style={[styles.langLabel, active && styles.langLabelActive]}>
              {lang.label}
            </Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
};

// ─── Input field ─────────────────────────────────────────────────────────────

const InputField = ({
  label,
  value,
  onChangeText,
  secure = false,
  icon,
  enterAnim,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  secure?: boolean;
  icon: string;
  enterAnim: Animated.Value;
}) => {
  const { t } = useTranslation();
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
  const slideY = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  return (
    <Animated.View
      style={[
        { marginBottom: 16 },
        { opacity: enterAnim, transform: [{ translateY: slideY }] },
      ]}
    >
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
            <Text style={styles.showText}>{show ? t('common.hide') : t('common.show')}</Text>
          </Pressable>
        )}
      </Animated.View>
    </Animated.View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

interface LoginScreenProps {
  onLogin?: () => void;
  onForgotPass?: () => void;
}

export default function LoginScreen({
  onLogin,
  onForgotPass,
}: LoginScreenProps) {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logoAnim = useRef(new Animated.Value(0)).current;
  const headAnim = useRef(new Animated.Value(0)).current;
  const langAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const f1Anim = useRef(new Animated.Value(0)).current;
  const f2Anim = useRef(new Animated.Value(0)).current;
  const forgotAnim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;
  const metaAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  // Login mutation
  const { mutate: loginUser, isPending } = useLogin();

  // Clean Navigation trigger handler
  const handleSignUpRedirect = () => {
    // Note: Double check that your Router navigator explicitly names this path exactly "SignUp"
    navigation.navigate("SignUp");
  };

  useEffect(() => {
    Animated.stagger(70, [
      Animated.spring(logoAnim, {
        toValue: 1,
        tension: 50,
        friction: 11,
        useNativeDriver: true,
      }),
      Animated.spring(headAnim, {
        toValue: 1,
        tension: 55,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.spring(langAnim, {
        toValue: 1,
        tension: 55,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.spring(cardAnim, {
        toValue: 1,
        tension: 45,
        friction: 13,
        useNativeDriver: true,
      }),
      Animated.spring(f1Anim, {
        toValue: 1,
        tension: 55,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.spring(f2Anim, {
        toValue: 1,
        tension: 55,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.spring(forgotAnim, {
        toValue: 1,
        tension: 55,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.spring(btnAnim, {
        toValue: 1,
        tension: 55,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.spring(metaAnim, {
        toValue: 1,
        tension: 55,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.spring(footerAnim, {
        toValue: 1,
        tension: 55,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t('common.error') || "Error", t('login.fillAllFields') || "Please enter your email and password.");
      return;
    }

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
    ]).start();

    loginUser(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          onLogin?.();
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ||
            "Invalid email or password. Please try again.";
          Alert.alert(t('login.loginFailed') || "Login failed", message);
        },
      }
    );
  };

  const logoY = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-24, 0],
  });
  const cardY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [32, 0],
  });
  const headY = headAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
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
            {/* Logo + wordmark */}
            <Animated.View
              style={[
                styles.logoBlock,
                { opacity: logoAnim, transform: [{ translateY: logoY }] },
              ]}
            >
              <BrandLogo size={60} />
              <View style={{ marginLeft: 14 }}>
                <Text style={styles.wordmark}>Abibeka</Text>
                <Text style={styles.wordmarkSub}>{t('common.appTagline')}</Text>
              </View>
            </Animated.View>

            {/* Page heading */}
            <Animated.View
              style={[
                { opacity: headAnim, transform: [{ translateY: headY }] },
                { marginBottom: 20 },
              ]}
            >
              <Text style={styles.pageTitle}>{t('login.welcomeBack')}</Text>
              <Text style={styles.pageSub}>{t('login.signInToAccount')}</Text>
            </Animated.View>

            {/* Language selector */}
            <LangSelector
              selected={i18n.language}
              onSelect={changeLanguage}
              enterAnim={langAnim}
            />

            {/* Card Frame */}
            <Animated.View
              style={[
                styles.card,
                { opacity: cardAnim, transform: [{ translateY: cardY }] },
              ]}
            >
              <View style={styles.cardLeftAccent} />

              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>{t('login.protectedSession')}</Text>
              </View>

              <Text style={styles.cardTitle}>{t('login.signIn')}</Text>
              <Text style={styles.cardSub}>
                {t('login.continueJourney')}
              </Text>

              {/* Input Fields */}
              <View style={{ marginTop: 24 }}>
                <InputField
                  label={t('auth.emailAddress')}
                  value={email}
                  onChangeText={setEmail}
                  icon="✉"
                  enterAnim={f1Anim}
                />
                <InputField
                  label={t('auth.vaultPassword')}
                  value={password}
                  onChangeText={setPassword}
                  icon="⚿"
                  secure
                  enterAnim={f2Anim}
                />
              </View>

              {/* Forgot Password Row */}
              <Animated.View
                style={[styles.forgotRow, { opacity: forgotAnim }]}
              >
                <Pressable onPress={onForgotPass} hitSlop={10}>
                  <Text style={styles.forgotText}>{t('login.forgotPassword')}</Text>
                </Pressable>
              </Animated.View>

              {/* Submit Trigger Action */}
              <Animated.View
                style={{ opacity: btnAnim, transform: [{ scale: btnScale }] }}
              >
                <TouchableOpacity
                  onPress={handleLogin}
                  activeOpacity={0.88}
                  disabled={isPending}
                  style={[styles.btn, isPending && { opacity: 0.7 }]}
                >
                  <Text style={styles.btnText}>
                    {isPending ? (t('login.signingIn') || "Signing in...") : t('login.signIn')}
                  </Text>
                  {!isPending && <View style={styles.btnDot} />}
                  {isPending && <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 10 }} />}
                </TouchableOpacity>
              </Animated.View>

              {/* Security Meta Row */}
              <Animated.View style={[styles.metaRow, { opacity: metaAnim }]}>
                <View style={styles.metaItem}>
                  <View
                    style={[styles.metaDot, { backgroundColor: BRAND.accent }]}
                  />
                  <Text style={styles.metaText}>{t('login.endToEndEncrypted')}</Text>
                </View>
                <View style={styles.metaItem}>
                  <View
                    style={[styles.metaDot, { backgroundColor: BRAND.primary }]}
                  />
                  <Text style={styles.metaText}>{t('login.anonymousIdentity')}</Text>
                </View>
              </Animated.View>
            </Animated.View>

            {/* Account Switch Redirect Link Footer */}
            <Animated.View style={[styles.footer, { opacity: footerAnim }]}>
              <Text style={styles.footerText}>{t('login.newToAbibeka')}</Text>
              <Pressable onPress={handleSignUpRedirect} hitSlop={12}>
                <Text style={styles.footerLink}> {t('login.createAccount')}</Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ─── Layout Styling Elements ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BRAND.bg },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  logoBlock: { flexDirection: "row", alignItems: "center", marginBottom: 32 },
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
  langRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  langPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAND.border,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  langPillActive: {
    borderColor: BRAND.primary,
    backgroundColor: "rgba(15,118,110,0.12)",
  },
  langFlag: { fontSize: 14 },
  langLabel: { fontSize: 12, fontWeight: "600", color: BRAND.muted },
  langLabelActive: { color: BRAND.primary },
  card: {
    backgroundColor: BRAND.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BRAND.border,
    padding: 24,
    paddingLeft: 28,
    overflow: "hidden",
    zIndex: 1,
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
  cardTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: BRAND.text,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  cardSub: { fontSize: 13, color: BRAND.muted, lineHeight: 20 },
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
  forgotRow: { alignSelf: "flex-end", marginTop: 4, marginBottom: 24 },
  forgotText: { fontSize: 13, color: BRAND.primary, fontWeight: "600" },
  btn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: BRAND.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    paddingVertical: 24,
    zIndex: 10,
  },
  footerText: { fontSize: 13, color: BRAND.muted },
  footerLink: { fontSize: 13, fontWeight: "800", color: BRAND.primary },
});