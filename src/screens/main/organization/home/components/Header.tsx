import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from './tokens';

type HeaderData = {
  orgName: string;
  departmentCount: number;
  employeeCount: number;
  role: string;
};

export const Header = ({ data }: { data: HeaderData }) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.orgName}>{data.orgName}</Text>
        <Text style={styles.orgMeta}>
          {data.departmentCount} departments · {data.employeeCount} employees · {data.role}
        </Text>
      </View>
      <View style={styles.avatar}>
        <Text style={styles.avatarIcon}>🏢</Text>
      </View>
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: 'rgba(15,118,110,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(15,118,110,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: { fontSize: 20 },
});