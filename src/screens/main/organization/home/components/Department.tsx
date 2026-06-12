import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from './tokens';
import { MiniBar } from './MiniBar';

export type DeptData = {
  icon: string;
  name: string;
  count: string;
  pulse: string;
  pulseColor: string;
  iconBg: string;
  iconBorder: string;
  redBorder: boolean;
  metrics: { label: string; val: string; suffix: string; valColor: string; pct: number; barColor: string }[];
};

const DeptCard = ({ dept }: { dept: DeptData }) => {
  return (
    <View
      style={[
        styles.deptCard,
        dept.redBorder && { borderColor: 'rgba(239,68,68,0.25)' },
      ]}
    >
      <View style={styles.deptRow}>
        <View style={[styles.deptIcon, { backgroundColor: dept.iconBg, borderColor: dept.iconBorder }]}>
          <Text style={{ fontSize: 16 }}>{dept.icon}</Text>
        </View>
        <Text style={styles.deptName}>{dept.name}</Text>
        <Text style={styles.deptCount}>{dept.count}</Text>
        <Text style={[styles.deptPulse, { color: dept.pulseColor }]}>{dept.pulse}</Text>
      </View>
      <View style={styles.row}>
        {dept.metrics.map((m, i) => (
          <View key={i} style={[styles.deptMetric, i < dept.metrics.length - 1 && { marginRight: 6 }]}>
            <Text style={styles.deptMetricLabel}>{m.label}</Text>
            <Text style={[styles.deptMetricVal, { color: m.valColor }]}>
              {m.val}
              <Text style={styles.deptMetricSuffix}>{m.suffix}</Text>
            </Text>
            <MiniBar pct={m.pct} color={m.barColor} height={3} />
          </View>
        ))}
      </View>
    </View>
  );
};

export const Departments = ({ depts }: { depts: DeptData[] }) => {
  return (
    <>
      {depts.map((d, i) => (
        <DeptCard key={i} dept={d} />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  deptCard: {
    marginHorizontal: 14,
    marginBottom: 8,
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 13,
  },
  deptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  deptIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  deptName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: C.text,
  },
  deptCount: {
    fontSize: 10,
    color: C.muted2,
  },
  deptPulse: {
    fontSize: 18,
    fontWeight: '900',
  },
  deptMetric: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    padding: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  deptMetricLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 0.4,
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  deptMetricVal: {
    fontSize: 13,
    fontWeight: '800',
  },
  deptMetricSuffix: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.25)',
    fontWeight: '400',
  },
});