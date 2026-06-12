import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from './tokens';

export type HeadlineStat = {
  label: string;
  val: string;
  valSuffix?: string;
  sub: string;
  subColor: string;
};

export const HeadlineStats = ({ stats }: { stats: HeadlineStat[] }) => {
  return (
    <View style={styles.row}>
      {stats.map((s, i) => (
        <View key={i} style={[styles.hlCard, i < stats.length - 1 && { marginRight: 8 }]}>
          <Text style={styles.hlLabel}>{s.label}</Text>
          <Text style={styles.hlVal}>
            {s.val}
            {s.valSuffix ? <Text style={styles.hlValSuffix}>{s.valSuffix}</Text> : null}
          </Text>
          <Text style={[styles.hlSub, { color: s.subColor }]}>{s.sub}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginTop: 10,
  },
  hlCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 12,
  },
  hlLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: C.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  hlVal: {
    fontSize: 26,
    fontWeight: '900',
    color: C.text,
    letterSpacing: -1,
    lineHeight: 28,
  },
  hlValSuffix: {
    fontSize: 11,
    color: C.muted,
    fontWeight: '500',
  },
  hlSub: {
    fontSize: 10,
    marginTop: 4,
  },
});