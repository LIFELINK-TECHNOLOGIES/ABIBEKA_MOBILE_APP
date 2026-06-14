import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGrad,
  Path,
  Stop,
} from "react-native-svg";
import { useTranslation } from "react-i18next";
import Card from "./card";
import {
  B,
  MOOD_OPTIONS,
  MOOD_COLORS_TREND,
  DAY_LABELS,
  CH,
  PAD,
} from "../../../../../constant/them";
import { CARD_W } from "./layout";
import { useMoodDashboard } from "../../../../../api/hooks/shared/moodEntry"

// ─── Map AssessmentScreen's 7-point mood scale (0-6) to home's 5-point scale (0-4) ──
// AssessmentScreen MOODS: 0 Great, 1 Calm, 2 Okay, 3 Sad, 4 Tearful, 5 Frustrated, 6 Overwhelmed
// Home MOOD_OPTIONS:      0 Great, 1 Calm, 2 Okay, 3 Low,  4 Stressed
const mapMoodTo5Scale = (mood7: number): number => {
  const map: Record<number, number> = {
    0: 0, // Great -> Great
    1: 1, // Calm -> Calm
    2: 2, // Okay -> Okay
    3: 3, // Sad -> Low
    4: 3, // Tearful -> Low
    5: 4, // Frustrated -> Stressed
    6: 4, // Overwhelmed -> Stressed
  };
  return map[mood7] ?? 2;
};

// Get short day label (M, T, W, T, F, S, S) from an ISO date string
const getDayLabel = (dateStr: string): string => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  return days[new Date(dateStr).getDay()];
};

export default function MoodTrendCard({ anim }: { anim: Animated.Value }) {
  const { t } = useTranslation();
  const progress = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  const { data, isLoading } = useMoodDashboard(7); // last 7 days

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

  if (isLoading) {
    return (
      <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
        <Card>
          <View style={{ paddingVertical: 40, alignItems: "center" }}>
            <ActivityIndicator color={B.primary} />
          </View>
        </Card>
      </Animated.View>
    );
  }

  const daily = data?.data?.moodTrend?.daily ?? [];

  // No check-ins yet — show empty state
  if (daily.length === 0) {
    return (
      <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
        <Card>
          <View style={s.head}>
            <View>
              <Text style={s.title}>{t('home.moodTrend')}</Text>
              <Text style={s.sub}>{t('home.last7Days')}</Text>
            </View>
          </View>
          <View style={{ paddingVertical: 30, alignItems: "center" }}>
            <Text style={{ color: B.muted, fontSize: 13 }}>
              No check-ins yet this week
            </Text>
          </View>
        </Card>
      </Animated.View>
    );
  }

  // Build a 7-slot array (Mon-Sun), filling gaps with null for missing days
  const moodTrend5Scale = daily.map((d) => mapMoodTo5Scale(d.mood));
  const dayLabels = daily.map((d) => getDayLabel(d.date));

  const avgMood = moodTrend5Scale.reduce((a, b) => a + b, 0) / moodTrend5Scale.length;
  const bestIdx = moodTrend5Scale.indexOf(Math.min(...moodTrend5Scale)); // lowest index = best mood
  const lowIdx = moodTrend5Scale.indexOf(Math.max(...moodTrend5Scale)); // highest index = worst mood

  const chartW = CARD_W - 36 - PAD * 2;
  const stepX = moodTrend5Scale.length > 1 ? chartW / (moodTrend5Scale.length - 1) : 0;
  const MAX_MOOD = 4;

  const points = moodTrend5Scale.map((v, i) => ({
    x: PAD + i * stepX,
    y: PAD + (v / MAX_MOOD) * (CH - PAD * 2),
    color: MOOD_COLORS_TREND[v],
    mood: MOOD_OPTIONS[v],
    isToday: i === moodTrend5Scale.length - 1,
  }));

  const smoothPath = (() => {
    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }
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
  const avgMoodOpt = MOOD_OPTIONS[Math.round(avgMood)] ?? MOOD_OPTIONS[2];
  const bestMoodOpt = MOOD_OPTIONS[moodTrend5Scale[bestIdx]];
  const lowMoodOpt = MOOD_OPTIONS[moodTrend5Scale[lowIdx]];

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card>
        {/* ── Header ── */}
        <View style={s.head}>
          <View>
            <Text style={s.title}>{t('home.moodTrend')}</Text>
            <Text style={s.sub}>{t('home.last7Days')}</Text>
          </View>
          <View style={s.avgPill}>
            <Text style={s.avgPillText}>
              {avgMoodOpt?.emoji ?? "😌"} {t('home.mostly', {
                mood: avgMoodOpt ? t(`home.moods.${avgMoodOpt.key}`).toLowerCase() : t('home.moods.calm').toLowerCase()
              })}
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
            {dayLabels.map((d, i) => (
              <Text
                key={i}
                style={[
                  s.xLabel,
                  i === dayLabels.length - 1 && s.xLabelToday,
                ]}
              >
                {i === dayLabels.length - 1 ? t('home.today') : d}
              </Text>
            ))}
          </View>

          {/* Emoji row */}
          <View style={[s.emojiRow, { paddingHorizontal: PAD }]}>
            {points.map((p, i) => (
              <Text key={i} style={s.emoji}>
                {p.mood?.emoji ?? "😐"}
              </Text>
            ))}
          </View>
        </View>

        {/* ── Divider ── */}
        <View style={s.divider} />

        {/* ── Stat strip ── */}
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statLabel}>{t('home.avgMood')}</Text>
            <Text style={s.statVal}>
              {(avgMood * 2.5).toFixed(1)}
              <Text style={s.statUnit}>/10</Text>
            </Text>
            <Text style={[s.statSub, { color: B.accent }]}>{t('home.thisWeekArrow')}</Text>
          </View>

          <View style={s.statCard}>
            <Text style={s.statLabel}>{t('home.bestDay')}</Text>
            <Text style={[s.statVal, s.statValSm]}>
              {dayLabels[bestIdx]}
            </Text>
            <Text style={s.statSub}>
              {bestMoodOpt?.emoji}{" "}
              {bestMoodOpt ? t(`home.moods.${bestMoodOpt.key}`) : ""}
            </Text>
          </View>

          <View style={s.statCard}>
            <Text style={s.statLabel}>{t('home.lowDay')}</Text>
            <Text style={[s.statVal, s.statValSm]}>
              {dayLabels[lowIdx]}
            </Text>
            <Text style={s.statSub}>
              {lowMoodOpt?.emoji}{" "}
              {lowMoodOpt ? t(`home.moods.${lowMoodOpt.key}`) : ""}
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