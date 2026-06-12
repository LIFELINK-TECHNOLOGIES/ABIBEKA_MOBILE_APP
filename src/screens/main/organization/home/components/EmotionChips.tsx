import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from './tokens';

export type EmotionChip = {
  label: string;
  bg: string;
  border: string;
  color: string;
};

export const EmotionChips = ({ chips }: { chips: EmotionChip[] }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardSub}>Most logged across all departments</Text>
      <View style={styles.chips}>
        {chips.map((c, i) => (
          <View key={i} style={[styles.chip, { backgroundColor: c.bg, borderColor: c.border }]}>
            <Text style={[styles.chipText, { color: c.color }]}>{c.label}</Text>
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
  },
});