import React, { useEffect, useMemo, useRef } from "react";
import { ActivityIndicator, Animated, Easing, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Card from "./card";
import { B, DAY_LABELS } from "../../../../../constant/them";
import { useMoodDashboard } from "../../../../../api/hooks/shared/moodEntry";

type StressLevel = "calm" | "moderate" | "high";

// Fallback classifier — only needed where the backend doesn't give us a
// classification directly (the weekly avg/percentage has no per-entry tag).
const classify = (pct: number): StressLevel =>
  pct >= 70 ? "high" : pct >= 50 ? "moderate" : "calm";

const getColorForLevel = (level: StressLevel, b: typeof B) =>
  level === "high" ? b.red : level === "moderate" ? b.amber : b.accent;

// Backend uses "calm", i18n keys use "low" — bridge the two.
const levelKey = (level: StressLevel) => (level === "calm" ? "low" : level);

const getDayLabel = (dateStr: string): string => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  return days[new Date(dateStr).getDay()];
};

const MAX_H = 64;
const MAX_BARS = 7;

type WeekSlot = {
  date: string;
  label: string;
  value: number; // 0-100 stress percentage; 0 if no check-in that day
  classification: StressLevel | null; // null = no check-in logged
  hasEntry: boolean;
};

export default function StressCard({ anim }: { anim: Animated.Value }) {
  const { t } = useTranslation();
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const gaugeAnim = useRef(new Animated.Value(0)).current;

  const barAnimsRef = useRef<Animated.Value[]>([]);
  if (barAnimsRef.current.length < MAX_BARS) {
    for (let i = barAnimsRef.current.length; i < MAX_BARS; i++) {
      barAnimsRef.current.push(new Animated.Value(0));
    }
  }
  const barAnims = barAnimsRef.current;

  // stress/moodTrend/emotionBreakdown are always rolling-7-day regardless of
  // `range`, so the `7` here is just for clarity / cache-key consistency —
  // it doesn't change what this slice of the response contains.
  const { data, isLoading } = useMoodDashboard(7);

  const stress = data?.data?.stress;
  const daily = stress?.daily ?? [];

  const stressVals = daily.map((d) => Math.round(d.value * 10));
  const dayClassifications = daily.map((d) => d.classification);

  const current = stressVals.length > 0 ? stressVals[stressVals.length - 1] : 0;
  const currentLevel: StressLevel =
    dayClassifications.length > 0
      ? dayClassifications[dayClassifications.length - 1]
      : classify(current);

  const prev = stressVals.length > 1 ? stressVals[stressVals.length - 2] : current;
  const delta = current - prev;

  // Use the backend's own weekly percentage instead of re-averaging locally.
  const avg = stress ? Math.round(stress.percentage) : 0;
  const avgLevel = classify(avg);

  // peakDay/calmestDay now carry their own real classification — no more
  // hardcoding "high"/"low" regardless of the actual value.
  const peakDay = stress?.peakDay ?? null;
  const calmestDay = stress?.calmestDay ?? null;
  const peakVal = peakDay ? Math.round(peakDay.value * 10) : 0;
  const calmVal = calmestDay ? Math.round(calmestDay.value * 10) : 0;
  const peakLabel = peakDay ? getDayLabel(peakDay.date) : "–";
  const calmLabel = calmestDay ? getDayLabel(calmestDay.date) : "–";
  const peakLevel: StressLevel = peakDay?.classification ?? "high";
  const calmLevel: StressLevel = calmestDay?.classification ?? "calm";

  const stressColor = getColorForLevel(currentLevel, B);

  // ── Fixed 7-day window (today + 6 days back) ──────────────────────────
  // The backend only returns days that actually have a check-in, so a week
  // with gaps would otherwise render fewer than 7 bars and look sparse/broken
  // (justify-content: space-between spreads a handful of bars across the
  // whole row). Building a constant 7-slot window and filling gaps with a
  // muted placeholder keeps the chart visually stable no matter how many
  // days the user actually logged.
  const weekWindow: WeekSlot[] = useMemo(() => {
    const slots: WeekSlot[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();

      const match = daily.find((entry) => new Date(entry.date).toDateString() === key);

      slots.push({
        date: d.toISOString(),
        label: getDayLabel(d.toISOString()),
        value: match ? Math.round(match.value * 10) : 0,
        classification: match ? match.classification : null,
        hasEntry: !!match,
      });
    }
    return slots;
  }, [daily]);

  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!isLoading && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;

      Animated.timing(gaugeAnim, {
        toValue: current / 100,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();

      // Animate actual height (not scaleY) so each bar grows up from the
      // baseline correctly. RN scales transforms from the element's center
      // by default, which made bars appear to float/shrink toward their
      // own middle instead of growing from the bottom — height animation
      // doesn't have that problem, at the cost of needing useNativeDriver: false.
      weekWindow.forEach((_, i) =>
        Animated.spring(barAnims[i], {
          toValue: 1,
          delay: i * 55,
          tension: 60,
          friction: 9,
          useNativeDriver: false,
        }).start(),
      );
    }
  }, [isLoading]);

  const gaugeW = gaugeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

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

  if (stressVals.length === 0) {
    return (
      <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
        <Card>
          <View style={s.head}>
            <View>
              <Text style={s.title}>{t('home.stressLevel')}</Text>
              <Text style={s.sub}>{t('home.todayVsLast7')}</Text>
            </View>
          </View>
          <View style={{ paddingVertical: 30, alignItems: "center" }}>
            <Text style={{ color: B.muted, fontSize: 13 }}>
              No data yet — complete a check-in
            </Text>
          </View>
        </Card>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card>
        {/* ── Header ── */}
        <View style={s.head}>
          <View>
            <Text style={s.title}>{t('home.stressLevel')}</Text>
            <Text style={s.sub}>{t('home.todayVsLast7')}</Text>
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
              {t(`home.stressLevels.${levelKey(currentLevel)}`)}
            </Text>
          </View>
        </View>

        {/* ── Big number ── */}
        <View style={s.bigRow}>
          <Text style={[s.bigNum, { color: stressColor }]}>{current}</Text>
          <View style={s.bigRight}>
            <Text style={[s.bigLabel, { color: stressColor + "CC" }]}>
              {t('home.percentToday')}
            </Text>
            <Text style={s.bigDelta}>
              {delta >= 0 ? "↑" : "↓"} {t('home.vsYesterday', { value: Math.abs(delta) })}
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
          <Text style={s.gaugeLabelText}>{t('home.stressLevels.low')}</Text>
          <Text style={s.gaugeLabelText}>{t('home.stressLevels.moderate')}</Text>
          <Text style={s.gaugeLabelText}>{t('home.stressLevels.high')}</Text>
        </View>

        {/* ── Divider ── */}
        <View style={s.divider} />

        {/* ── Bar history ── */}
        <Text style={s.historyLabel}>{t('home.sevenDayHistory')}</Text>
        <View style={s.barRow}>
          {weekWindow.map((slot, i) => {
            const isToday = i === weekWindow.length - 1;
            const level = slot.classification ?? classify(slot.value);
            const c = getColorForLevel(level, B);
            const h = slot.hasEntry ? Math.max(4, (slot.value / 100) * MAX_H) : 3;
            const barColor = slot.hasEntry ? (isToday ? c : c + "50") : "rgba(255,255,255,0.10)";

            return (
              <View key={slot.date} style={[s.barCol, { height: MAX_H }]}>
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                  <Animated.View
                    style={[
                      s.bar,
                      {
                        height: barAnims[i].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, h],
                        }),
                        backgroundColor: barColor,
                        borderWidth: isToday && slot.hasEntry ? 1 : 0,
                        borderColor: c + "50",
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    s.barLabel,
                    isToday && { color: stressColor, fontWeight: "700" },
                    !slot.hasEntry && { opacity: 0.5 },
                  ]}
                >
                  {isToday ? t('home.now') : slot.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ── Stat strip ── */}
        <View style={s.statRow}>
          <View style={s.statCard}>
            <Text style={s.statLabel}>{t('home.avgThisWeek')}</Text>
            <Text style={s.statVal}>
              {avg}
              <Text style={s.statUnit}>%</Text>
            </Text>
            <Text style={s.statSub}>{t('home.rangeSuffix', { level: t(`home.stressLevels.${levelKey(avgLevel)}`) })}</Text>
          </View>

          <View style={s.statCard}>
            <Text style={s.statLabel}>{t('home.peakDay')}</Text>
            <Text style={[s.statVal, s.statValSm]}>{peakLabel}</Text>
            <Text style={[s.statSub, { color: getColorForLevel(peakLevel, B) + "CC" }]}>
              {peakVal}% · {t(`home.stressLevels.${levelKey(peakLevel)}`)}
            </Text>
          </View>

          <View style={s.statCard}>
            <Text style={s.statLabel}>{t('home.calmestDay')}</Text>
            <Text style={[s.statVal, s.statValSm]}>{calmLabel}</Text>
            <Text style={[s.statSub, { color: getColorForLevel(calmLevel, B) + "CC" }]}>
              {calmVal}% · {t(`home.stressLevels.${levelKey(calmLevel)}`)}
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