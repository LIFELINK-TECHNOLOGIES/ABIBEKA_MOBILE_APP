import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { B } from "../../../../../constant/them";

export default function Header({ anim }: { anim: Animated.Value }) {
  const dot = useRef(new Animated.Value(0.4)).current;
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const hr = new Date().getHours();
  const greet =
    hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

  return (
    <Animated.View
      style={[styles.header, { opacity: anim, transform: [{ translateY: y }] }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.headerGreet}>{greet} 👋</Text>
        <Text style={styles.headerId}>Anon · #LL-4829</Text>
      </View>
      <View style={styles.streakPill}>
        <Text style={styles.streakFire}>🔥</Text>
        <Text style={styles.streakNum}>7</Text>
      </View>
      <View style={styles.pendingPill}>
        <Animated.View style={[styles.pendingDot, { opacity: dot }]} />
        <Text style={styles.pendingText}>Pending</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  headerGreet: { fontSize: 13, color: B.muted, marginBottom: 3 },
  headerId: {
    fontSize: 22,
    fontWeight: "800",
    color: B.text,
    letterSpacing: -0.6,
  },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F59E0B18",
    borderWidth: 1,
    borderColor: "#F59E0B30",
  },
  streakFire: { fontSize: 14 },
  streakNum: { fontSize: 14, fontWeight: "800", color: B.amber },
  pendingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F59E0B12",
    borderWidth: 1,
    borderColor: "#F59E0B30",
  },
  pendingDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: B.amber,
  },
  pendingText: { fontSize: 11, fontWeight: "700", color: B.amber },
});
