import React from 'react';
import { View, StyleSheet } from 'react-native';

export const MiniBar = ({
  pct,
  color,
  height = 4,
}: {
  pct: number;
  color: string;
  height?: number;
}) => (
  <View style={[styles.barTrack, { height }]}>
    <View
      style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: color, height }]}
    />
  </View>
);

const styles = StyleSheet.create({
  barTrack: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  barFill: {
    borderRadius: 4,
  },
});