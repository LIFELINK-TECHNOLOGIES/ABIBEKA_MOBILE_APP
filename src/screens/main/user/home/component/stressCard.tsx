import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Card from "./card";
import { B, STRESS_VALS, DAY_LABELS } from "../../../../../constant/them";

export default function StressCard({ anim }: { anim: Animated.Value }) {
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const barAnims = STRESS_VALS.map(() => useRef(new Animated.Value(0)).current);
  const gaugeAnim = useRef(new Animated.Value(0)).current;

  const current = STRESS_VALS[STRESS_VALS.length - 1];
  const stressColor =
    current >= 70 ? B.red : current >= 50 ? B.amber : B.accent;

  useEffect(() => {
    const listener = anim.addListener(({ value }) => {
      if (value > 0.6) {
        Animated.timing(gaugeAnim, {
          toValue: current / 100,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
        barAnims.forEach((a, i) =>
          Animated.spring(a, {
            toValue: 1,
            delay: i * 50,
            tension: 60,
            friction: 9,
            useNativeDriver: true,
          }).start(),
        );
      }
    });
    return () => anim.removeListener(listener);
  }, []);

  const gaugeW = gaugeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });
  const MAX_H = 56;

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card>
        <View style={styles.cardHead}>
          <View>
            <Text style={styles.cardTitle}>Stress Level</Text>
            <Text style={styles.cardSub}>Today vs last 7 days</Text>
          </View>
          <View
            style={[
              styles.stressBadge,
              {
                borderColor: stressColor + "50",
                backgroundColor: stressColor + "15",
              },
            ]}
          >
            <Text style={[styles.stressBadgeNum, { color: stressColor }]}>
              {current}%
            </Text>
          </View>
        </View>
        <View style={styles.gaugeTrack}>
          <View
            style={[
              styles.gaugeSegment,
              { backgroundColor: B.accent + "60", left: "0%", width: "40%" },
            ]}
          />
          <View
            style={[
              styles.gaugeSegment,
              { backgroundColor: B.amber + "60", left: "40%", width: "30%" },
            ]}
          />
          <View
            style={[
              styles.gaugeSegment,
              { backgroundColor: B.red + "60", left: "70%", width: "30%" },
            ]}
          />
          <Animated.View
            style={[
              styles.gaugeFill,
              { width: gaugeW, backgroundColor: stressColor },
            ]}
          />
          <Animated.View
            style={[
              styles.gaugeThumb,
              { left: gaugeW, borderColor: stressColor },
            ]}
          />
        </View>
        <View style={styles.gaugeLabels}>
          <Text style={styles.gaugeLabelText}>Low</Text>
          <Text style={styles.gaugeLabelText}>Moderate</Text>
          <Text style={styles.gaugeLabelText}>High</Text>
        </View>
        <View style={styles.miniBarRow}>
          {STRESS_VALS.map((v, i) => {
            const h = (v / 100) * MAX_H;
            const c = v >= 70 ? B.red : v >= 50 ? B.amber : B.accent;
            return (
              <View key={i} style={[styles.miniBarCol, { height: MAX_H }]}>
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                  <Animated.View
                    style={[
                      styles.miniBar,
                      {
                        height: h,
                        backgroundColor:
                          i === STRESS_VALS.length - 1 ? c : c + "55",
                        transform: [{ scaleY: barAnims[i] }],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.miniBarLabel}>{DAY_LABELS[i]}</Text>
              </View>
            );
          })}
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
  stressBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  stressBadgeNum: { fontSize: 16, fontWeight: "800" },
  gaugeTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginBottom: 6,
    overflow: "visible",
    position: "relative",
    flexDirection: "row",
  },
  gaugeSegment: {
    position: "absolute",
    top: 0,
    height: "100%",
    borderRadius: 5,
  },
  gaugeFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    borderRadius: 5,
    opacity: 0.85,
  },
  gaugeThumb: {
    position: "absolute",
    top: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: B.card,
    borderWidth: 2,
    marginLeft: -8,
  },
  gaugeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  gaugeLabelText: { fontSize: 10, color: B.muted2 },
  miniBarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  miniBarCol: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  miniBar: { width: 22, borderRadius: 5 },
  miniBarLabel: { fontSize: 9, color: B.muted2, marginTop: 5 },
});
