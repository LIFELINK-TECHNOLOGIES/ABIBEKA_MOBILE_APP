import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGrad,
  Path,
  Stop,
} from "react-native-svg";
import Card from "./card";
import {
  B,
  MOOD_TREND,
  MOOD_OPTIONS,
  MOOD_COLORS_TREND,
  DAY_LABELS,
  CH,
  PAD,
} from "../../../../../constant/them";
import { CARD_W } from "./layout";

export default function MoodTrendCard({ anim }: { anim: Animated.Value }) {
  const progress = useRef(new Animated.Value(0)).current;
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  useEffect(() => {
    const listener = anim.addListener(({ value }) => {
      if (value > 0.6) {
        Animated.timing(progress, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
      }
    });
    return () => anim.removeListener(listener);
  }, []);

  const chartW = CARD_W - 36 - PAD * 2;
  const stepX = chartW / (MOOD_TREND.length - 1);
  const MAX_MOOD = 4;
  const points = MOOD_TREND.map((v, i) => ({
    x: PAD + i * stepX,
    y: PAD + (v / MAX_MOOD) * (CH - PAD * 2),
    color: MOOD_COLORS_TREND[v],
    mood: MOOD_OPTIONS[v],
  }));

  const smoothPath = (() => {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      d += ` C ${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`;
    }
    return d;
  })();

  const areaPath =
    smoothPath +
    ` L ${points[points.length - 1].x} ${CH} L ${points[0].x} ${CH} Z`;

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card>
        <View style={styles.cardHead}>
          <View>
            <Text style={styles.cardTitle}>Mood Trend</Text>
            <Text style={styles.cardSub}>Last 7 days</Text>
          </View>
          <View style={styles.trendAvgPill}>
            <Text style={styles.trendAvgText}>😌 Mostly calm</Text>
          </View>
        </View>
        <View style={{ marginTop: 4 }}>
          <Svg width={CARD_W - 36} height={CH}>
            <Defs>
              <SvgGrad id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={B.primary} stopOpacity="0.25" />
                <Stop offset="100%" stopColor={B.primary} stopOpacity="0" />
              </SvgGrad>
            </Defs>
            <Path d={areaPath} fill="url(#areaGrad)" />
            <Path
              d={smoothPath}
              fill="none"
              stroke={B.primary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((p, i) => (
              <React.Fragment key={i}>
                <Circle cx={p.x} cy={p.y} r={5} fill={B.card} />
                <Circle cx={p.x} cy={p.y} r={3.5} fill={p.color} />
              </React.Fragment>
            ))}
          </Svg>
          <View style={[styles.chartXRow, { paddingHorizontal: PAD }]}>
            {DAY_LABELS.map((d, i) => (
              <Text key={i} style={styles.chartX}>
                {d}
              </Text>
            ))}
          </View>
          <View style={styles.trendLegend}>
            {points.map((p, i) => (
              <Text key={i} style={{ fontSize: 14 }}>
                {p.mood.emoji}
              </Text>
            ))}
          </View>
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
  trendAvgPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: B.primary + "35",
    backgroundColor: B.primary + "12",
  },
  trendAvgText: { fontSize: 11, color: B.primary, fontWeight: "600" },
  chartXRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  chartX: { fontSize: 10, color: B.muted2, textAlign: "center", flex: 1 },
  trendLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 6,
  },
});
