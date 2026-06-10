import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import Card from "./card";
import { B, MOOD_OPTIONS } from "../../../../constant/them";

export default function MoodCard({ anim }: { anim: Animated.Value }) {
  const [picked, setPicked] = useState(null);
  const scales = MOOD_OPTIONS.map(() => useRef(new Animated.Value(1)).current);
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  const pick = (i) => {
    setPicked(i);
    Animated.sequence([
      Animated.spring(scales[i], {
        toValue: 1.3,
        tension: 300,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scales[i], {
        toValue: 1,
        tension: 300,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card glow={picked !== null ? MOOD_OPTIONS[picked].color : undefined}>
        <View style={styles.cardHead}>
          <View>
            <Text style={styles.cardTitle}>Today's Check-in</Text>
            <Text style={styles.cardSub}>How are you feeling right now?</Text>
          </View>
          {picked !== null && (
            <View
              style={[
                styles.loggedBadge,
                {
                  backgroundColor: MOOD_OPTIONS[picked].color + "20",
                  borderColor: MOOD_OPTIONS[picked].color + "50",
                },
              ]}
            >
              <Text
                style={[
                  styles.loggedText,
                  { color: MOOD_OPTIONS[picked].color },
                ]}
              >
                Logged
              </Text>
            </View>
          )}
        </View>
        <View style={styles.moodRow}>
          {MOOD_OPTIONS.map((m, i) => (
            <Animated.View
              key={i}
              style={{ transform: [{ scale: scales[i] }] }}
            >
              <Pressable
                onPress={() => pick(i)}
                style={[
                  styles.moodPill,
                  picked === i && {
                    borderColor: m.color,
                    backgroundColor: m.color + "18",
                  },
                ]}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text
                  style={[styles.moodLabel, picked === i && { color: m.color }]}
                >
                  {m.label}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: B.text,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  cardSub: { fontSize: 12, color: B.muted },
  loggedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  loggedText: { fontSize: 11, fontWeight: "700" },
  moodRow: { flexDirection: "row", justifyContent: "space-between", gap: 6 },
  moodPill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: B.cardBorder,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  moodEmoji: { fontSize: 22, marginBottom: 5 },
  moodLabel: { fontSize: 9, color: B.muted, fontWeight: "600" },
});
