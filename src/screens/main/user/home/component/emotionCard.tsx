import React from "react";
import { ActivityIndicator, Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Text as SvgText } from "react-native-svg";
import { useTranslation } from "react-i18next";
import Card from "./card";
import { B } from "../../../../../constant/them";
import { useMoodDashboard } from "../../../../../api/hooks/shared/moodEntry"

interface EmotionItem {
  key: string;
  label: string;
  pct: number;
  color: string;
}

export default function EmotionCard({ anim }: { anim: Animated.Value }) {
  const { t } = useTranslation();
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const SIZE = 130;
  const cx = SIZE / 2,
    cy = SIZE / 2,
    R = 46,
    SW = 18;

  const { data, isLoading } = useMoodDashboard(30); // last 30 days for a stable breakdown

  const breakdown = data?.data?.emotionBreakdown;

  // Map backend's fixed categories to the same shape EMOTIONS used to have
  const EMOTIONS: EmotionItem[] = breakdown
    ? [
        { key: "calm", label: "Calm", pct: breakdown.calmLevel, color: B.primary },
        { key: "happy", label: "Happy", pct: breakdown.happyLevel, color: B.accent },
        { key: "stressed", label: "Stressed", pct: breakdown.stressLevel, color: B.amber },
        { key: "anxious", label: "Anxious", pct: breakdown.anxietyLevel, color: B.red },
      ]
    : [];

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

  const hasData = EMOTIONS.some((e) => e.pct > 0);

  if (!hasData) {
    return (
      <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
        <Card>
          <Text style={styles.cardTitle}>{t('home.emotionBreakdown')}</Text>
          <View style={{ paddingVertical: 30, alignItems: "center" }}>
            <Text style={{ color: B.muted, fontSize: 13 }}>
              No emotion data yet — complete a check-in
            </Text>
          </View>
        </Card>
      </Animated.View>
    );
  }

  let cum = 0;
  const arcs = EMOTIONS.map((e) => {
    const pct = e.pct / 100;
    const start = cum * 2 * Math.PI - Math.PI / 2;
    const end = (cum + pct) * 2 * Math.PI - Math.PI / 2;
    cum += pct;
    const x1 = cx + R * Math.cos(start);
    const y1 = cy + R * Math.sin(start);
    const x2 = cx + R * Math.cos(end);
    const y2 = cy + R * Math.sin(end);
    const lg = pct > 0.5 ? 1 : 0;
    return { ...e, d: `M ${x1} ${y1} A ${R} ${R} 0 ${lg} 1 ${x2} ${y2}` };
  });

  // Dominant = highest percentage category
  const dominant = EMOTIONS.reduce((a, b) => (b.pct > a.pct ? b : a));

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card>
        <Text style={styles.cardTitle}>{t('home.emotionBreakdown')}</Text>
        <Text style={[styles.cardSub, { marginBottom: 18 }]}>
          {t('home.thisMonthTracked', { count: EMOTIONS.length })}
        </Text>
        <View style={styles.donutRow}>
          <Svg width={SIZE} height={SIZE}>
            <Circle
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke={B.cardBorder}
              strokeWidth={SW + 2}
            />
            {arcs.map((arc, i) =>
              arc.pct > 0 ? (
                <Path
                  key={i}
                  d={arc.d}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={SW}
                  strokeLinecap="butt"
                />
              ) : null
            )}
            <Circle cx={cx} cy={cy} r={R - SW / 2 - 4} fill={B.card} />
            <SvgText
              x={cx}
              y={cy - 8}
              textAnchor="middle"
              fill={B.text}
              fontSize={12}
              fontWeight="800"
            >
              {dominant.pct}%
            </SvgText>
            <SvgText
              x={cx}
              y={cy + 10}
              textAnchor="middle"
              fill="rgba(240,244,255,0.45)"
              fontSize={10}
            >
              {t(`home.emotions.${dominant.key}`)}
            </SvgText>
          </Svg>
          <View style={styles.donutLegend}>
            {EMOTIONS.map((e, i) => (
              <View key={i} style={styles.donutLegendRow}>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <View
                      style={[styles.legendDot, { backgroundColor: e.color }]}
                    />
                    <Text style={styles.legendLabel}>{t(`home.emotions.${e.key}`)}</Text>
                    <Text style={[styles.legendPct, { color: e.color }]}>
                      {e.pct}%
                    </Text>
                  </View>
                  <View style={styles.legendTrack}>
                    <View
                      style={[
                        styles.legendFill,
                        { width: `${e.pct}%`, backgroundColor: e.color },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: B.text,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  cardSub: { fontSize: 12, color: B.muted },
  donutRow: { flexDirection: "row", alignItems: "center", gap: 18 },
  donutLegend: { flex: 1, gap: 12 },
  donutLegendRow: {},
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 12, color: B.muted, flex: 1 },
  legendPct: { fontSize: 12, fontWeight: "700" },
  legendTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.07)",
    overflow: "hidden",
  },
  legendFill: { height: 3, borderRadius: 2 },
});