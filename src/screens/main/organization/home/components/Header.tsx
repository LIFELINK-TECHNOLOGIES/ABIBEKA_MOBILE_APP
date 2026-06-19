import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from './tokens';
import { useAuthStore } from "../../../../../store/authStore";

type HeaderData = {
  departmentCount: number;
  employeeCount: number;
};

export const Header = ({ data }: { data: HeaderData }) => {
  const logout = useAuthStore((s) => s.logout);
  const user   = useAuthStore((s) => s.user);

  const orgName      = user?.organization   ?? '—';
  const employeeRange = user?.employeeRange  ?? '';
  const role         = user?.role           ?? '';

  return (
    <View style={styles.header}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={styles.orgName} numberOfLines={1}>{orgName}</Text>
        <Text style={styles.orgMeta} numberOfLines={1}>
          {data.departmentCount} departments 
          {employeeRange ? ` · ${employeeRange}` : ''}
        </Text>
      </View>

      <TouchableOpacity onPress={logout} style={styles.logoutBtn} activeOpacity={0.75}>
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutLabel}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  orgName: {
    fontSize: 22,
    fontWeight: '900',
    color: C.text,
    letterSpacing: -0.6,
  },
  orgMeta: {
    fontSize: 11,
    color: C.muted2,
    marginTop: 3,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  logoutIcon: { fontSize: 14 },
  logoutLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
});