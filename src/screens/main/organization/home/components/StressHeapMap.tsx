import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { C } from './tokens';

export type HeatLevel = 'calm' | 'moderate' | 'high';

export type HeatDay = {
  day: string;       // e.g. "Mon"
  bg: string;          // cell color — kept so existing callers don't break
  value?: number;       // 0–100 stress intensity. Optional: enables bar-height encoding
  level?: HeatLevel;     // optional: powers the legend
  isToday?: boolean;
};

const LEVEL_LABELS: Record<HeatLevel, string> = {
  calm: 'Calm',
  moderate: 'Moderate',
  high: 'High',
};

const LEVEL_ORDER: HeatLevel[] = ['calm', 'moderate', 'high'];
const TRACK_H = 56;

type StressHeatmapProps = {
  days: HeatDay[];
  title?: string;
};

export const StressHeatmap = ({ days, title = 'Stress pattern' }: StressHeatmapProps) => {
  const hasValues = days.length > 0 && days.every((d) => typeof d.value === 'number');

  // Build the legend from whatever levels are actually present in the data,
  // using each day's own `bg` rather than a hardcoded palette — so the
  // legend always matches the colors actually shown, however the caller
  // chose to compute them.
  const legend = LEVEL_ORDER
    .map((level) => {
      const match = days.find((d) => d.level === level);
      return match ? { level, color: match.bg } : null;
    })
    .filter((x): x is { level: HeatLevel; color: string } => x !== null);

  // Peak-day callout — gives the card a takeaway instead of a pattern to
  // squint at. Only shown when we actually have magnitudes to compare.
  const peak = hasValues
    ? [...days].sort((a, b) => (b.value ?? 0) - (a.value ?? 0))[0]
    : null;

  // Staggered entrance, matching the bar-reveal language already used
  // elsewhere in the app (StressCard's 7-day history).
  const barAnimsRef = useRef<Animated.Value[]>([]);
  if (barAnimsRef.current.length < days.length) {
    for (let i = barAnimsRef.current.length; i < days.length; i++) {
      barAnimsRef.current.push(new Animated.Value(0));
    }
  }
  const barAnims = barAnimsRef.current;

  useEffect(() => {
    days.forEach((_, i) =>
      Animated.timing(barAnims[i], {
        toValue: 1,
        duration: 420,
        delay: i * 60,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(),
    );
  }, [days.length]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>THIS WEEK</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.cardSub}>Team stress intensity across the week</Text>
        </View>

        {peak && typeof peak.value === 'number' && (
          <View style={styles.peakPill}>
            <Text style={styles.peakLabel}>Peak</Text>
            <Text style={styles.peakValue}>
              {peak.day} · {Math.round(peak.value)}%
            </Text>
          </View>
        )}
      </View>

      <View style={styles.heatRow}>
        {days.map((d, i) => {
          const fillPct = hasValues ? Math.max(6, Math.round(d.value ?? 0)) : 100;
          const isPeak = peak?.day === d.day && hasValues;

          return (
            <View key={`${d.day}-${i}`} style={styles.col}>
              <View
                style={styles.cellTrack}
                accessibilityLabel={
                  hasValues
                    ? `${d.day}, ${Math.round(d.value ?? 0)} percent${d.level ? `, ${LEVEL_LABELS[d.level]}` : ''}`
                    : d.day
                }
              >
                <Animated.View
                  style={[
                    styles.cellFill,
                    {
                      backgroundColor: d.bg,
                      height: barAnims[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', `${fillPct}%`],
                      }),
                      borderWidth: d.isToday ? 1.5 : 0,
                      borderColor: 'rgba(255,255,255,0.4)',
                    },
                  ]}
                />
              </View>

              {hasValues && (
                <Text style={[styles.valueLabel, isPeak && styles.valueLabelPeak]}>
                  {Math.round(d.value ?? 0)}
                </Text>
              )}

              <Text style={[styles.dayLabel, d.isToday && styles.dayLabelToday]}>
                {d.day}
              </Text>
              {d.isToday && <View style={styles.todayDot} />}
            </View>
          );
        })}
      </View>

      {legend.length > 0 && (
        <View style={styles.legendRow}>
          {legend.map((l) => (
            <View key={l.level} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: l.color }]} />
              <Text style={styles.legendLabel}>{LEVEL_LABELS[l.level]}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginTop: 10,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 10,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: C.muted2,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.2,
  },
  cardSub: {
    fontSize: 11,
    color: C.muted2,
    marginTop: 3,
  },
  peakPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    alignItems: 'flex-end',
  },
  peakLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#EF4444',
    opacity: 0.8,
    marginBottom: 1,
  },
  peakValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
  },
  heatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  cellTrack: {
    width: '100%',
    height: TRACK_H,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  cellFill: {
    width: '100%',
    borderRadius: 8,
  },
  valueLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: C.muted2,
    marginTop: 6,
  },
  valueLabelPeak: {
    color: '#EF4444',
  },
  dayLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 2,
  },
  dayLabelToday: {
    color: C.text,
    fontWeight: '800',
  },
  todayDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.text,
    marginTop: 4,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendLabel: {
    fontSize: 10,
    color: C.muted2,
    fontWeight: '600',
  },
});