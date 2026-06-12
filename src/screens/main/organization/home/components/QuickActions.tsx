import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from './tokens';

export type QuickAction = {
  icon: string;
  label: string;
  onPress?: () => void;
};

export const QuickActions = ({ actions }: { actions: QuickAction[] }) => {
  return (
    <View style={styles.row}>
      {actions.map((a, i) => (
        <TouchableOpacity
          key={i}
          activeOpacity={0.7}
          onPress={a.onPress}
          style={[styles.actBtn, i < actions.length - 1 && { marginRight: 8 }]}
        >
          <Text style={{ fontSize: 18 }}>{a.icon}</Text>
          <Text style={styles.actLabel}>{a.label}</Text>
        </TouchableOpacity>
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
  actBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(15,118,110,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(15,118,110,0.22)',
    alignItems: 'center',
    gap: 5,
  },
  actLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.teal,
  },
});