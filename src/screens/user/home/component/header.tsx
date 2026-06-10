import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { B } from "../../../../constant/them";

const HAS_CHECKED_IN = false;
const STREAK = 7;
const ANON_ID = "#LL-4829";

const getGreeting = () => {
  const hr = new Date().getHours();
  if (hr < 12) return "Good morning";
  if (hr < 17) return "Good afternoon";
  return "Good evening";
};

export default function Header({ anim }: { anim: Animated.Value }) {
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] });

  return (
    <Animated.View
      style={[s.wrap, { opacity: anim, transform: [{ translateY: y }] }]}
    >
      <View style={s.row}>
        <View style={{ flex: 1 }}>
          <Text style={s.greeting}>{getGreeting()}</Text>
          <Text style={s.id}>Anon {ANON_ID}</Text>
        </View>

        <View style={s.streakPill}>
          <Text style={s.streakFire}>🔥</Text>
          <Text style={s.streakNum}>{STREAK}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: { paddingVertical: 6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    fontSize: 13,
    color: B.muted,
    marginBottom: 3,
  },
  id: {
    fontSize: 24,
    fontWeight: "900",
    color: B.text,
    letterSpacing: -0.7,
  },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: B.amber + "15",
    borderWidth: 1,
    borderColor: B.amber + "30",
  },
  streakFire: { fontSize: 14 },
  streakNum: { fontSize: 14, fontWeight: "800", color: B.amber },
});