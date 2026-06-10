import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Card from "./card";
import { B } from "../../../../constant/them";

// ─── Replace with your store/context later ────────────────────────────────────
const HAS_CHECKED_IN = false;

type DayStatus = "checked" | "today" | "future" | "missed";
const WEEK: { label: string; status: DayStatus }[] = [
  { label: "M", status: "checked" },
  { label: "T", status: "checked" },
  { label: "W", status: "checked" },
  { label: "T", status: "checked" },
  { label: "F", status: "today" },
  { label: "S", status: "future" },
  { label: "S", status: "future" },
];

const StreakStrip = () => (
  <View style={s.stripWrap}>
    <View style={s.dayLabels}>
      {WEEK.map((d, i) => (
        <Text
          key={i}
          style={[
            s.dayLabel,
            d.status === "checked" && { color: B.accent },
            d.status === "today" && {
              color: HAS_CHECKED_IN ? B.accent : B.primary,
              fontWeight: "700",
            },
          ]}
        >
          {d.label}
        </Text>
      ))}
    </View>
    <View style={s.dotRow}>
      {WEEK.map((d, i) => (
        <View
          key={i}
          style={[
            s.dot,
            d.status === "checked" && { backgroundColor: B.accent },
            d.status === "today" && {
              backgroundColor: HAS_CHECKED_IN ? B.accent : B.primary,
            },
            (d.status === "future" || d.status === "missed") && {
              backgroundColor: "rgba(255,255,255,0.07)",
            },
          ]}
        />
      ))}
    </View>
  </View>
);

export default function CheckInCard({ anim }: { anim: Animated.Value }) {
  const navigation = useNavigation<any>();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  useEffect(() => {
    if (HAS_CHECKED_IN) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 950,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 950,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const checkedCount = WEEK.filter((d) => d.status === "checked").length;

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card
        style={[
          s.card,
          HAS_CHECKED_IN
            ? { borderColor: B.accent + "35" }
            : { borderColor: B.primary + "40" },
        ]}
      >
        <View
          style={[
            s.topLine,
            { backgroundColor: HAS_CHECKED_IN ? B.accent : B.primary },
          ]}
        />

        <View style={s.body}>
          <View
            style={[
              s.iconWrap,
              HAS_CHECKED_IN
                ? {
                    backgroundColor: B.accent + "18",
                    borderColor: B.accent + "30",
                  }
                : {
                    backgroundColor: B.primary + "18",
                    borderColor: B.primary + "30",
                  },
            ]}
          >
            <Text style={{ fontSize: 20 }}>
              {HAS_CHECKED_IN ? "✅" : "✨"}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={s.title}>Daily check-in</Text>
            <Text style={s.sub}>
              {HAS_CHECKED_IN
                ? "Done for today · see you tomorrow"
                : "Takes 30 sec · due today"}
            </Text>
          </View>

          {HAS_CHECKED_IN ? (
            <View style={s.doneBadge}>
              <Text style={s.doneBadgeText}>✓ Done</Text>
            </View>
          ) : (
            <View style={s.streakCount}>
              <Text style={s.streakNum}>{checkedCount}</Text>
              <Text style={s.streakLabel}>this wk</Text>
            </View>
          )}
        </View>

        <StreakStrip />

        {!HAS_CHECKED_IN && (
          <Pressable
            onPress={() => navigation.navigate("CheckIn")}
            style={s.cta}
          >
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Text style={s.ctaText}>✦ Check in now →</Text>
            </Animated.View>
          </Pressable>
        )}
      </Card>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: { padding: 0, overflow: "hidden" },
  topLine: { height: 2, width: "100%", opacity: 0.8 },
  body: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    paddingBottom: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: B.text,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  sub: { fontSize: 11, color: B.muted },
  doneBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: B.accent + "18",
    borderWidth: 1,
    borderColor: B.accent + "35",
  },
  doneBadgeText: { fontSize: 11, fontWeight: "700", color: B.accent },
  streakCount: { alignItems: "center" },
  streakNum: {
    fontSize: 20,
    fontWeight: "900",
    color: B.primary,
    letterSpacing: -1,
  },
  streakLabel: { fontSize: 9, color: B.muted, fontWeight: "600" },
  stripWrap: { paddingHorizontal: 14, paddingBottom: 10 },
  dayLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  dayLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.2)",
    width: 26,
    textAlign: "center",
  },
  dotRow: { flexDirection: "row", justifyContent: "space-between" },
  dot: { width: 26, height: 6, borderRadius: 3 },
  cta: {
    marginHorizontal: 14,
    marginBottom: 14,
    height: 38,
    borderRadius: 12,
    backgroundColor: B.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { fontSize: 13, fontWeight: "800", color: "#fff" },
});