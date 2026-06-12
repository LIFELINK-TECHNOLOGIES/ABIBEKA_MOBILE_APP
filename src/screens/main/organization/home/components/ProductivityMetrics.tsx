import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from './tokens';
import { MiniBar } from './MiniBar';

export type ProductivityMetric = {
  label: string;
  val: string;
  suffix: string;
  sub: string;
  subColor: string;
  pct: number;
  color: string;
};

export const ProductivityMetrics = ({ metrics }: { metrics: ProductivityMetric[] }) => {
  const rows = [];
  for (let i = 0; i < metrics.length; i += 2) {
    rows.push(metrics.slice(i, i + 2));
  }

  return (
    <View style={styles.prodGrid}>
      {rows.map((pair, rowIdx) => (
        <View key={rowIdx} style={styles.prodRow}>
          {pair.map((m, i) => (
            <View key={i} style={[styles.prodCard, i === 0 && { marginRight: 8 }]}>
              <Text style={styles.prodLabel}>{m.label}</Text>
              <Text style={styles.prodVal}>
                {m.val}
                <Text style={styles.prodValSuffix}>{m.suffix}</Text>
              </Text>
              <Text style={[styles.prodSub, { color: m.subColor }]}>{m.sub}</Text>
              <MiniBar pct={m.pct} color={m.color} height={4} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  prodGrid: {
    marginHorizontal: 14,
    marginTop: 10,
    gap: 8,
  },
  prodRow: {
    flexDirection: 'row',
  },
  prodCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 12,
  },
  prodLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: C.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  prodVal: {
    fontSize: 22,
    fontWeight: '900',
    color: C.text,
    letterSpacing: -0.8,
  },
  prodValSuffix: {
    fontSize: 11,
    color: C.muted,
    fontWeight: '500',
  },
  prodSub: {
    fontSize: 10,
    marginTop: 3,
  },
});