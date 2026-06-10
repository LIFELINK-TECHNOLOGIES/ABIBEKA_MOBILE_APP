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
} from "../../../../constant/them";
import { CARD_W } from "./layout";

// ─── Derived stats from trend data ───────────────────────────────────────────
const avgMood = (MOOD_TREND.reduce((a, b) => a + b, 0) / MOOD_TREND.length);
const bestIdx = MOOD_TREND.indexOf(Math.max(...MOOD_TREND));
const lowIdx  = MOOD_TREND.indexOf(Math.min(...MOOD_TREND));

export default function MoodTrendCard({ anim }: { anim: Animated.Value }) {
  const progress = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
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

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    return () => anim.removeListener(listener);
  }, []);

  const chartW = CARD_W - 36 - PAD * 2;
  const stepX  = chartW / (MOOD_TREND.length - 1);
  const MAX_MOOD = 4;

  const points = MOOD_TREND.map((v, i) => ({
    x: PAD + i * stepX,
    y: PAD + ((MAX_MOOD - v) / MAX_MOOD) * (CH - PAD * 2),
    color: MOOD_COLORS_TREND[v],
    mood: MOOD_OPTIONS[v],
    isToday: i === MOOD_TREND.length - 1,
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

  const todayPoint = points[points.length - 1];

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card>
        {/* ── Header ── */}
        <View style={s.head}>
          <View>
            <Text style={s.title}>Mood Trend</Text>
            <Text style={s.sub}>Last 7 days</Text>
          </View>
          <View style={s.avgPill}>
            <Text style={s.avgPillText}>
              {MOOD_OPTIONS[Math.round(avgMood)]?.emoji ?? "😌"} Mostly{" "}
              {MOOD_OPTIONS[Math.round(avgMood)]?.label?.toLowerCase() ?? "calm"}
            </Text>
          </View>
        </View>

        {/* ── Chart ── */}
        <View style={{ marginTop: 4 }}>
          <Svg width={CARD_W - 36} height={CH}>
            <Defs>
              <SvgGrad id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%"   stopColor={B.primary} stopOpacity="0.2" />
                <Stop offset="100%" stopColor={B.primary} stopOpacity="0"   />
              </SvgGrad>
            </Defs>

            {/* Area fill */}
            <Path d={areaPath} fill="url(#areaGrad)" />

            {/* Line */}
            <Path
              d={smoothPath}
              fill="none"
              stroke={B.primary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dots */}
            {points.map((p, i) => (
              <React.Fragment key={i}>
                <Circle cx={p.x} cy={p.y} r={5}   fill={B.card} />
                <Circle cx={p.x} cy={p.y} r={3.5} fill={p.color} />
              </React.Fragment>
            ))}

            {/* Today pulse ring — rendered on top */}
            <Circle
              cx={todayPoint.x}
              cy={todayPoint.y}
              r={7}
              fill="none"
              stroke={todayPoint.color}
              strokeWidth={1.5}
              strokeOpacity={0.45}
            />
          </Svg>

          {/* X-axis labels */}
          <View style={[s.xRow, { paddingHorizontal: PAD }]}>
            {DAY_LABELS.map((d, i) => (
              <Text
                key={i}
                style={[
                  s.xLabel,
                  i === DAY_LABELS.length - 1 && s.xLabelToday,
                ]}
              >
                {i === DAY_LABELS.length - 1 ? "Today" : d}
              </Text>
            ))}
          </View>

          {/* Emoji row */}
          <View style={[s.emojiRow, { paddingHorizontal: PAD }]}>
            {points.map((p, i) => (
              <Text key={i} style={s.emoji}>
                {p.mood.emoji}
              </Text>
            ))}
          </View>
        </View>

        {/* ── Divider ── */}
        <View style={s.divider} />

        {/* ── Stat strip ── */}
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statLabel}>AVG MOOD</Text>
            <Text style={s.statVal}>
              {(avgMood * 2.5).toFixed(1)}
              <Text style={s.statUnit}>/10</Text>
            </Text>
            <Text style={[s.statSub, { color: B.accent }]}>↑ this week</Text>
          </View>

          <View style={s.statCard}>
            <Text style={s.statLabel}>BEST DAY</Text>
            <Text style={[s.statVal, s.statValSm]}>
              {DAY_LABELS[bestIdx]}
            </Text>
            <Text style={s.statSub}>
              {MOOD_OPTIONS[MOOD_TREND[bestIdx]]?.emoji}{" "}
              {MOOD_OPTIONS[MOOD_TREND[bestIdx]]?.label}
            </Text>
          </View>

          <View style={s.statCard}>
            <Text style={s.statLabel}>LOW DAY</Text>
            <Text style={[s.statVal, s.statValSm]}>
              {DAY_LABELS[lowIdx]}
            </Text>
            <Text style={s.statSub}>
              {MOOD_OPTIONS[MOOD_TREND[lowIdx]]?.emoji}{" "}
              {MOOD_OPTIONS[MOOD_TREND[lowIdx]]?.label}
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
  avgPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: B.primary + "35",
    backgroundColor: B.primary + "12",
  },
  avgPillText: { fontSize: 11, color: B.primary, fontWeight: "600" },
  xRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  xLabel: {
    fontSize: 10,
    color: B.muted2,
    textAlign: "center",
    flex: 1,
  },
  xLabelToday: {
    color: B.primary,
    fontWeight: "700",
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 16,
  },
  emoji: {
    fontSize: 13,
    textAlign: "center",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
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
  statValSm: {
    fontSize: 13,
    paddingTop: 2,
  },
  statUnit: {
    fontSize: 11,
    fontWeight: "500",
    color: B.muted2,
  },
  statSub: {
    fontSize: 10,
    color: B.muted2,
  },
});