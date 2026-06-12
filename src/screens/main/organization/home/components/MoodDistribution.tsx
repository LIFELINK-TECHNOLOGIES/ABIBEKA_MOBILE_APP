import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from './tokens';

export type MoodItem = {
  name: string;
  pct: number;
  color: string;
};

export const MoodDistribution = ({ moods }: { moods: MoodItem[] }) => {
  return (
    <View style={styles.card}>
      <View style={{ marginBottom: 14 }}>
        <Text style={styles.cardTitle}>How the team feels</Text>
        <Text style={styles.cardSub}>This week · all check-ins</Text>
      </View>
      {moods.map((m, i) => (
        <View key={i} style={[styles.moodRow, i < moods.length - 1 && { marginBottom: 9 }]}>
          <Text style={styles.moodName}>{m.name}</Text>
          <View style={[styles.barTrack, { flex: 1, height: 6, marginHorizontal: 8 }]}>
            <View style={[styles.barFill, { width: `${m.pct}%` as any, backgroundColor: m.color, height: 6 }]} />
          </View>
          <Text style={styles.moodPct}>{m.pct}%</Text>
        </View>
      ))}
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
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 10,
    color: C.muted2,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodName: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    width: 80,
    flexShrink: 0,
  },
  moodPct: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    width: 28,
    textAlign: 'right',
    fontWeight: '700',
  },
  barTrack: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    borderRadius: 4,
  },
});