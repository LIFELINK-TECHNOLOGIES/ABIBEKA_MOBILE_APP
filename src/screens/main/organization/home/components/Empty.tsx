import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { C } from './tokens';

type EmptyStateProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyState = ({
  title = 'No data yet',
  message = 'Once your team starts checking in, their wellbeing data will show up here.',
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>📊</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.actionBtn} onPress={onAction} activeOpacity={0.8}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(15,118,110,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(15,118,110,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: { fontSize: 28 },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: C.text,
    marginBottom: 6,
  },
  message: {
    fontSize: 12,
    color: C.muted2,
    textAlign: 'center',
    lineHeight: 18,
  },
  actionBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(15,118,110,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(15,118,110,0.22)',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.teal,
  },
});