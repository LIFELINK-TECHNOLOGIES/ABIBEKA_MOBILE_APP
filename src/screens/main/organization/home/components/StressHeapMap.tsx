import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from './tokens';

export type HeatDay = {
  day: string;
  bg: string;
};

export const StressHeatmap = ({ days }: { days: HeatDay[] }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardSub}>Team stress pattern across the week</Text>
      <View style={[styles.row, { marginTop: 10, justifyContent: 'space-between' }]}>
        {days.map((d, i) => (
          <View key={i} style={styles.heatCol}>
            <View style={[styles.heatCell, { backgroundColor: d.bg }]} />
            <Text style={styles.heatLabel}>{d.day}</Text>
          </View>
        ))}
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
  cardSub: {
    fontSize: 10,
    color: C.muted2,
  },
  row: {
    flexDirection: 'row',
  },
  heatCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  heatCell: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 7,
  },
  heatLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.2)',
  },
});