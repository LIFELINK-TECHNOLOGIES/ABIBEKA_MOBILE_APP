import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { C } from './tokens';

export const SectionLabel = ({ label }: { label: string }) => (
  <Text style={styles.sectionLabel}>{label}</Text>
);

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.muted,
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
});