import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from './tokens';

export const Alert = ({ message }: { message: string }) => {
  if (!message) return null;
  return (
    <View style={styles.alertBox}>
      <View style={styles.alertPulse} />
      <Text style={styles.alertText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginTop: 10,
    borderRadius: 13,
    backgroundColor: 'rgba(239,68,68,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.18)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  alertPulse: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.red,
    flexShrink: 0,
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(239,100,100,0.95)',
    fontWeight: '600',
    lineHeight: 17,
  },
});