import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from './tokens';
import { MiniBar } from './MiniBar';

type PulseData = {
  score: number;
  status: string;
  statusColor: string;
  delta: string;
};

export const PulseCard = ({ data }: { data: PulseData }) => {
  return (
    <View style={styles.card}>
      <View style={styles.pulseRow}>
        <Text style={styles.pulseNum}>
          {data.score}
          <Text style={styles.pulseNumSuffix}>/100</Text>
        </Text>
        <View style={styles.pulseMeta}>
          <Text style={styles.pulseTitle}>OVERALL PULSE SCORE</Text>
          <Text style={[styles.pulseStatus, { color: data.statusColor }]}>{data.status}</Text>
          <Text style={styles.pulseDelta}>{data.delta}</Text>
        </View>
      </View>
      <MiniBar pct={data.score} color={C.teal} height={7} />
      <View style={[styles.row, { marginTop: 6, justifyContent: 'space-between' }]}>
        <Text style={styles.rangeLabel}>🔴 Critical {'<'}30</Text>
        <Text style={styles.rangeLabel}>🟡 Fair 30–59</Text>
        <Text style={styles.rangeLabel}>🟢 Good 60+</Text>
      </View>
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
  row: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginTop: 10,
  },
  pulseRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
    marginBottom: 14,
  },
  pulseNum: {
    fontSize: 64,
    fontWeight: '900',
    color: C.teal,
    letterSpacing: -3,
    lineHeight: 68,
  },
  pulseNumSuffix: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.2)',
  },
  pulseMeta: {
    paddingBottom: 8,
  },
  pulseTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  pulseStatus: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 3,
  },
  pulseDelta: {
    fontSize: 11,
    color: C.muted2,
  },
  rangeLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.2)',
  },
});