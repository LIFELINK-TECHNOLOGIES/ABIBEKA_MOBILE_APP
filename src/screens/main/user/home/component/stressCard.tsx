import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Card from "./card";
import { B, STRESS_VALS, DAY_LABELS } from "../../../../../constant/them";

const getStressLabel = (v: number) =>
  v >= 70 ? "High" : v >= 50 ? "Moderate" : "Low";

const getStressColor = (v: number, b: typeof B) =>
  v >= 70 ? b.red : v >= 50 ? b.amber : b.accent;

const current  = STRESS_VALS[STRESS_VALS.length - 1];
const prev     = STRESS_VALS[STRESS_VALS.length - 2];
const delta    = current - prev;
const avg      = Math.round(STRESS_VALS.reduce((a, b) => a + b, 0) / STRESS_VALS.length);
const peakVal  = Math.max(...STRESS_VALS);
const peakIdx  = STRESS_VALS.indexOf(peakVal);
const calmVal  = Math.min(...STRESS_VALS);
const calmIdx  = STRESS_VALS.indexOf(calmVal);
const MAX_H    = 64;

export default function StressCard({ anim }: { anim: Animated.Value }) {
  const y          = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const gaugeAnim  = useRef(new Animated.Value(0)).current;
  const barAnims   = STRESS_VALS.map(() => useRef(new Animated.Value(0)).current);

  const stressColor = getStressColor(current, B);

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
            delay: i * 55,
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

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card>
        {/* ── Header ── */}
        <View style={s.head}>
          <View>
            <Text style={s.title}>Stress Level</Text>
            <Text style={s.sub}>Today vs last 7 days</Text>
          </View>
          <View
            style={[
              s.badge,
              {
                borderColor: stressColor + "40",
                backgroundColor: stressColor + "15",
              },
            ]}
          >
            <Text style={[s.badgeText, { color: stressColor }]}>
              {getStressLabel(current)}
            </Text>
          </View>
        </View>

        {/* ── Big number ── */}
        <View style={s.bigRow}>
          <Text style={[s.bigNum, { color: stressColor }]}>{current}</Text>
          <View style={s.bigRight}>
            <Text style={[s.bigLabel, { color: stressColor + "CC" }]}>
              % today
            </Text>
            <Text style={s.bigDelta}>
              {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)} vs yesterday
            </Text>
          </View>
        </View>

        {/* ── Gauge ── */}
        <View style={s.gaugeTrack}>
          <View style={[s.gaugeSegment, { left: "0%",  width: "40%", backgroundColor: B.accent + "55" }]} />
          <View style={[s.gaugeSegment, { left: "40%", width: "30%", backgroundColor: B.amber  + "55" }]} />
          <View style={[s.gaugeSegment, { left: "70%", width: "30%", backgroundColor: B.red    + "55" }]} />
          <Animated.View
            style={[s.gaugeFill, { width: gaugeW, backgroundColor: stressColor }]}
          />
          <Animated.View
            style={[s.gaugeThumb, { left: gaugeW, borderColor: stressColor }]}
          />
        </View>
        <View style={s.gaugeLabels}>
          <Text style={s.gaugeLabelText}>Low</Text>
          <Text style={s.gaugeLabelText}>Moderate</Text>
          <Text style={s.gaugeLabelText}>High</Text>
        </View>

        {/* ── Divider ── */}
        <View style={s.divider} />

        {/* ── Bar history ── */}
        <Text style={s.historyLabel}>7-DAY HISTORY</Text>
        <View style={s.barRow}>
          {STRESS_VALS.map((v, i) => {
            const isToday = i === STRESS_VALS.length - 1;
            const c       = getStressColor(v, B);
            const h       = Math.max(4, (v / 100) * MAX_H);
            return (
              <View key={i} style={[s.barCol, { height: MAX_H }]}>
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                  <Animated.View
                    style={[
                      s.bar,
                      {
                        height: h,
                        backgroundColor: isToday ? c : c + "50",
                        borderWidth: isToday ? 1 : 0,
                        borderColor: c + "50",
                        transform: [{ scaleY: barAnims[i] }],
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    s.barLabel,
                    isToday && { color: stressColor, fontWeight: "700" },
                  ]}
                >
                  {isToday ? "Now" : DAY_LABELS[i]}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ── Stat strip ── */}
        <View style={s.statRow}>
          <View style={s.statCard}>
            <Text style={s.statLabel}>AVG THIS WEEK</Text>
            <Text style={s.statVal}>
              {avg}
              <Text style={s.statUnit}>%</Text>
            </Text>
            <Text style={s.statSub}>{getStressLabel(avg)} range</Text>
          </View>

          <View style={s.statCard}>
            <Text style={s.statLabel}>PEAK DAY</Text>
            <Text style={[s.statVal, s.statValSm]}>{DAY_LABELS[peakIdx]}</Text>
            <Text style={[s.statSub, { color: B.red + "CC" }]}>
              {peakVal}% · High
            </Text>
          </View>

          <View style={s.statCard}>
            <Text style={s.statLabel}>CALMEST DAY</Text>
            <Text style={[s.statVal, s.statValSm]}>{DAY_LABELS[calmIdx]}</Text>
            <Text style={[s.statSub, { color: B.accent + "CC" }]}>
              {calmVal}% · Low
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: B.text,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  sub: { fontSize: 12, color: B.muted },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: { fontSize: 13, fontWeight: "800" },
  bigRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    marginBottom: 18,
  },
  bigNum: {
    fontSize: 52,
    fontWeight: "900",
    letterSpacing: -2,
    lineHeight: 52,
  },
  bigRight: { paddingBottom: 6 },
  bigLabel: { fontSize: 12, fontWeight: "700", marginBottom: 3 },
  bigDelta: { fontSize: 11, color: B.muted2 },
  gaugeTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginBottom: 5,
    overflow: "visible",
    position: "relative",
    flexDirection: "row",
  },
  gaugeSegment: {
    position: "absolute",
    top: 0,
    height: "100%",
    borderRadius: 4,
  },
  gaugeFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    borderRadius: 4,
    opacity: 0.9,
  },
  gaugeThumb: {
    position: "absolute",
    top: -4,
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
    marginBottom: 18,
  },
  gaugeLabelText: { fontSize: 10, color: B.muted2 },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginBottom: 14,
  },
  historyLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: B.muted2,
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  barRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  barCol: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  bar: { width: "75%", borderRadius: 5 },
  barLabel: { fontSize: 9, color: B.muted2, marginTop: 5 },
  statRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 10,
  },
  statLabel: {
    fontSize: 9,
    color: B.muted2,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  statVal: {
    fontSize: 18,
    fontWeight: "900",
    color: B.text,
    letterSpacing: -0.5,
    marginBottom: 3,
  },
  statValSm: { fontSize: 13, paddingTop: 2 },
  statUnit: { fontSize: 11, fontWeight: "500", color: B.muted2 },
  statSub: { fontSize: 10, color: B.muted2 },
});