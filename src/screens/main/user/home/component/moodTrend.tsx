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

  // moodTrend is always the rolling last 7 days server-side regardless of
  // `range`, so we don't need to pass 7 here — default range lets this
  // share a cache entry with other dashboard widgets instead of firing a
  // second network request for overlapping data.
  const { data, isLoading } = useMoodDashboard();

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

  // `daily[i].mood` is already on the same 0-4 scale as MOOD_OPTIONS
  // (backend's MOODS array has 5 entries, index 0 = best) — no remapping needed.
  const moodIndices = daily.map((d) => d.mood);
  const dayLabels = daily.map((d) => getDayLabel(d.date));

  const avgMood = moodIndices.reduce((a, b) => a + b, 0) / moodIndices.length;
  const bestIdx = moodIndices.indexOf(Math.min(...moodIndices)); // lowest index = best mood
  const lowIdx = moodIndices.indexOf(Math.max(...moodIndices)); // highest index = worst mood

  const chartW = CARD_W - 36 - PAD * 2;
  const stepX = moodIndices.length > 1 ? chartW / (moodIndices.length - 1) : 0;
  const MAX_MOOD = 4;

  // Only flag a point as "today" if its date actually IS today — the
  // backend only returns days that have a check-in, so the last item in
  // `daily` isn't necessarily today if the user hasn't checked in yet.
  const todayStr = new Date().toDateString();

  const points = moodIndices.map((v, i) => ({
    x: PAD + i * stepX,
    y: PAD + (v / MAX_MOOD) * (CH - PAD * 2),
    color: MOOD_COLORS_TREND[v],
    mood: MOOD_OPTIONS[v],
    isToday: new Date(daily[i].date).toDateString() === todayStr,
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

  // Highlight the most recent point on the chart, but only pulse/label it
  // as "today" if it genuinely is today's check-in.
  const latestPoint = points[points.length - 1];
  const isLatestToday = latestPoint.isToday;

  const avgMoodOpt = MOOD_OPTIONS[Math.round(avgMood)] ?? MOOD_OPTIONS[2];
  const bestMoodOpt = MOOD_OPTIONS[moodIndices[bestIdx]];
  const lowMoodOpt = MOOD_OPTIONS[moodIndices[lowIdx]];

  // avgMood is on the 0-4 index scale where 0 = best, so invert it before
  // scaling to a "higher is better" /10 display.
  const avgScoreOutOf10 = ((MAX_MOOD - avgMood) / MAX_MOOD) * 10;

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

            {/* Today pulse ring — only rendered if the latest point is genuinely today */}
            {isLatestToday && (
              <Circle
                cx={latestPoint.x}
                cy={latestPoint.y}
                r={7}
                fill="none"
                stroke={latestPoint.color}
                strokeWidth={1.5}
                strokeOpacity={0.45}
              />
            )}
          </Svg>

          {/* X-axis labels */}
          <View style={[s.xRow, { paddingHorizontal: PAD }]}>
            {dayLabels.map((d, i) => (
              <Text
                key={i}
                style={[
                  s.xLabel,
                  points[i].isToday && s.xLabelToday,
                ]}
              >
                {points[i].isToday ? t('home.today') : d}
              </Text>
            ))}
          </View>

          {/* Emoji row — now with the mood name underneath each emoji so
              people don't have to guess what it means */}
          <View style={[s.emojiRow, { paddingHorizontal: PAD }]}>
            {points.map((p, i) => (
              <View key={i} style={s.emojiCol}>
                <Text style={s.emoji}>
                  {p.mood?.emoji ?? "😐"}
                </Text>
                <Text
                  style={s.emojiLabel}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  {p.mood ? t(`home.moods.${p.mood.key}`) : ""}
                </Text>
              </View>
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
              {avgScoreOutOf10.toFixed(1)}
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
    marginBottom: 14,
  },
  emojiCol: {
    flex: 1,
    alignItems: "center",
  },
  emoji: {
    fontSize: 13,
    textAlign: "center",
  },
  emojiLabel: {
    fontSize: 8,
    lineHeight: 9,
    color: B.muted2,
    textAlign: "center",
    marginTop: 2,
    maxWidth: "100%",
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