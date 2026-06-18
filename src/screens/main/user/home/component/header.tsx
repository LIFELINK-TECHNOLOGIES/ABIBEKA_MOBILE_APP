import React from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../../../../../utils/i18n";
import { useAuthStore } from "../../../../../store/authStore";
import { B } from "../../../../../constant/them";

const LANGUAGES = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "pcm", label: "PCM", flag: "🇳🇬" },
];

const getGreeting = () => {
  const hr = new Date().getHours();
  if (hr < 12) return "Good morning";
  if (hr < 17) return "Good afternoon";
  return "Good evening";
};

export default function Header({ anim }: { anim: Animated.Value }) {
  const { i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] });

  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  return (
    <Animated.View
      style={[s.wrap, { opacity: anim, transform: [{ translateY: y }] }]}
    >
      {/* Top row: greeting + logout */}
      <View style={s.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.greeting}>{getGreeting()}</Text>
          {/* <Text style={s.name} numberOfLines={1}>
            {user?.fullName || user?.organization || "User"}
          </Text> */}
        </View>

        <Pressable onPress={handleLogout} style={s.logoutBtn} hitSlop={8}>
          <Text style={s.logoutIcon}>⎋</Text>
          <Text style={s.logoutText}>Log out</Text>
        </Pressable>
      </View>

      {/* Bottom row: language pills */}
      <View style={s.langRow}>
        {LANGUAGES.map((lang) => {
          const active = i18n.language === lang.code;
          return (
            <Pressable
              key={lang.code}
              onPress={() => changeLanguage(lang.code)}
              style={[s.langPill, active && s.langPillActive]}
            >
              <Text style={s.langFlag}>{lang.flag}</Text>
              <Text style={[s.langLabel, active && s.langLabelActive]}>
                {lang.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: { paddingVertical: 6, gap: 14 },

  // Top row
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    fontSize: 20,
    color: B.muted,
    marginBottom: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: "900",
    color: B.text,
    letterSpacing: -0.7,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,80,80,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,80,80,0.18)",
  },
  logoutIcon: {
    fontSize: 14,
    color: "#FF6B6B",
  },
  logoutText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FF6B6B",
  },

  // Language row
  langRow: {
    flexDirection: "row",
    gap: 8,
  },
  langPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  langPillActive: {
    borderColor: B.primary,
    backgroundColor: B.primary + "18",
  },
  langFlag: { fontSize: 12 },
  langLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: B.muted,
    letterSpacing: 0.4,
  },
  langLabelActive: {
    color: B.primary,
  },
});