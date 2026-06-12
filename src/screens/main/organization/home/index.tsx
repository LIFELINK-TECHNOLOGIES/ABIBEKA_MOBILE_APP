import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, SafeAreaView } from 'react-native';
import { C } from './components/tokens';

import { Header } from './components/Header';
import { Alert } from './components/Alert';
import { SectionLabel } from './components/SectionLabel';
import { HeadlineStats, HeadlineStat } from './components/HeadlineStats';
import { PulseCard } from './components/PulseCard';
import { ProductivityMetrics, ProductivityMetric } from './components/ProductivityMetrics';
import { MoodDistribution, MoodItem } from './components/MoodDistribution';
import { Departments, DeptData } from './components/Department';
import { EmotionChips, EmotionChip } from './components/EmotionChips';
import { StressHeatmap, HeatDay } from './components/StressHeapMap';
import { QuickActions, QuickAction } from './components/QuickActions';

import { DashboardSkeleton } from './components/DashboardSkeleton';
import { EmptyState } from './components/Empty';

// ─── Dashboard data shape ──────────────────────────────────────────────────────
type DashboardData = {
  header: {
    orgName: string;
    departmentCount: number;
    employeeCount: number;
    role: string;
  };
  alertMessage: string;
  headlineStats: HeadlineStat[];
  pulse: { score: number; status: string; statusColor: string; delta: string };
  productivity: ProductivityMetric[];
  moods: MoodItem[];
  departments: DeptData[];
  emotionChips: EmotionChip[];
  heatmapDays: HeatDay[];
  quickActions: QuickAction[];
};

// ─── Mock fetch — swap with real API call ──────────────────────────────────────
const MOCK_DATA: DashboardData = {
  header: { orgName: 'Acme Corp', departmentCount: 4, employeeCount: 48, role: 'Admin' },
  alertMessage: 'Engineering stress up 31% this week · consider a check-in',
  headlineStats: [
    { label: 'Total employees', val: '48', sub: 'across 4 depts', subColor: C.muted },
    { label: 'Checked in today', val: '31', valSuffix: '/48', sub: '↑ 65% rate', subColor: C.green },
    { label: 'Active now', val: '12', sub: '● online', subColor: C.teal },
  ],
  pulse: { score: 74, status: 'Good 👍', statusColor: C.green, delta: '↑ +6 pts vs last week' },
  productivity: [
    { label: 'Avg focus score', val: '7.2', suffix: '/10', sub: '↑ +0.6 this week', subColor: C.green, pct: 72, color: C.green },
    { label: 'Burnout risk', val: '24', suffix: '%', sub: '↑ moderate risk', subColor: C.amber, pct: 24, color: C.amber },
    { label: 'Energy level', val: '6.1', suffix: '/10', sub: '→ stable', subColor: C.muted, pct: 61, color: C.teal },
    { label: 'Absenteeism risk', val: '18', suffix: '%', sub: '↑ watch closely', subColor: C.red, pct: 18, color: C.red },
  ],
  moods: [
    { name: '😌 Calm', pct: 42, color: C.teal },
    { name: '😤 Stressed', pct: 28, color: C.amber },
    { name: '😊 Great', pct: 18, color: C.green },
    { name: '😔 Low', pct: 8, color: C.purple },
    { name: '😐 Okay', pct: 4, color: '#94A3B8' },
  ],
  departments: [
    {
      icon: '💻', name: 'Engineering', count: '14 members', pulse: '42',
      pulseColor: C.red, iconBg: 'rgba(239,68,68,0.1)', iconBorder: 'rgba(239,68,68,0.2)', redBorder: true,
      metrics: [
        { label: 'Mood', val: '4.8', suffix: '/10', valColor: C.red, pct: 48, barColor: C.red },
        { label: 'Stress', val: '78', suffix: '%', valColor: C.red, pct: 78, barColor: C.red },
        { label: 'Check-in', val: '9', suffix: '/14', valColor: C.text, pct: 64, barColor: C.teal },
        { label: 'Energy', val: '5.1', suffix: '/10', valColor: C.amber, pct: 51, barColor: C.amber },
      ],
    },
    {
      icon: '🎨', name: 'Design', count: '8 members', pulse: '81',
      pulseColor: C.green, iconBg: 'rgba(15,118,110,0.1)', iconBorder: 'rgba(15,118,110,0.2)', redBorder: false,
      metrics: [
        { label: 'Mood', val: '8.1', suffix: '/10', valColor: C.green, pct: 81, barColor: C.green },
        { label: 'Stress', val: '32', suffix: '%', valColor: C.green, pct: 32, barColor: C.green },
        { label: 'Check-in', val: '7', suffix: '/8', valColor: C.text, pct: 87, barColor: C.teal },
        { label: 'Energy', val: '7.8', suffix: '/10', valColor: C.green, pct: 78, barColor: C.green },
      ],
    },
    {
      icon: '📈', name: 'Sales', count: '16 members', pulse: '58',
      pulseColor: C.amber, iconBg: 'rgba(245,158,11,0.1)', iconBorder: 'rgba(245,158,11,0.2)', redBorder: false,
      metrics: [
        { label: 'Mood', val: '6.2', suffix: '/10', valColor: C.text, pct: 62, barColor: C.amber },
        { label: 'Stress', val: '61', suffix: '%', valColor: C.amber, pct: 61, barColor: C.amber },
        { label: 'Check-in', val: '10', suffix: '/16', valColor: C.text, pct: 62, barColor: C.teal },
        { label: 'Energy', val: '6.5', suffix: '/10', valColor: C.text, pct: 65, barColor: C.amber },
      ],
    },
    {
      icon: '🤝', name: 'HR', count: '10 members', pulse: '76',
      pulseColor: C.green, iconBg: 'rgba(139,92,246,0.1)', iconBorder: 'rgba(139,92,246,0.2)', redBorder: false,
      metrics: [
        { label: 'Mood', val: '7.6', suffix: '/10', valColor: C.green, pct: 76, barColor: C.green },
        { label: 'Stress', val: '38', suffix: '%', valColor: C.green, pct: 38, barColor: C.green },
        { label: 'Check-in', val: '8', suffix: '/10', valColor: C.text, pct: 80, barColor: C.teal },
        { label: 'Energy', val: '7.2', suffix: '/10', valColor: C.green, pct: 72, barColor: C.green },
      ],
    },
  ],
  emotionChips: [
    { label: '😌 Calm · 38%', bg: 'rgba(15,118,110,0.1)', border: 'rgba(15,118,110,0.28)', color: '#5DCAA5' },
    { label: '😬 Stressed · 24%', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.28)', color: C.amber },
    { label: '💭 Overthinking · 18%', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.28)', color: '#A78BFA' },
    { label: '🙌 Motivated · 12%', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.28)', color: C.green },
    { label: '😰 Anxious · 8%', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.28)', color: '#F87171' },
  ],
  heatmapDays: [
    { day: 'Mon', bg: 'rgba(34,197,94,0.22)' },
    { day: 'Tue', bg: 'rgba(245,158,11,0.30)' },
    { day: 'Wed', bg: 'rgba(245,158,11,0.18)' },
    { day: 'Thu', bg: 'rgba(239,68,68,0.42)' },
    { day: 'Fri', bg: 'rgba(245,158,11,0.28)' },
    { day: 'Sat', bg: 'rgba(34,197,94,0.12)' },
    { day: 'Sun', bg: 'rgba(34,197,94,0.08)' },
  ],
  quickActions: [
    { icon: '📣', label: 'Announce' },
    { icon: '📅', label: 'Schedule' },
    { icon: '📊', label: 'Report' },
    { icon: '⚙️', label: 'Settings' },
  ],
};

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        // Replace with real API call, e.g.:
        // const res = await api.get('/dashboard');
        // if (mounted) setData(res.data);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (mounted) setData(MOCK_DATA);
      } catch (err) {
        if (mounted) setData(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  const isEmpty = !isLoading && (!data || data.headlineStats.every((s) => s.val === '0'));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status row */}
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>9:41</Text>
          <Text style={styles.statusText}>●●●</Text>
        </View>

        {isLoading && <DashboardSkeleton />}

        {!isLoading && isEmpty && <EmptyState />}

        {!isLoading && !isEmpty && data && (
          <>
            <Header data={data.header} />
            <Alert message={data.alertMessage} />

            <SectionLabel label="OVERVIEW" />
            <HeadlineStats stats={data.headlineStats} />

            <SectionLabel label="TEAM PULSE" />
            <PulseCard data={data.pulse} />

            <SectionLabel label="PRODUCTIVITY METRICS" />
            <ProductivityMetrics metrics={data.productivity} />

            <SectionLabel label="MOOD DISTRIBUTION" />
            <MoodDistribution moods={data.moods} />

            <SectionLabel label="DEPARTMENTS" />
            <Departments depts={data.departments} />

            <SectionLabel label="TOP EMOTIONS THIS WEEK" />
            <EmotionChips chips={data.emotionChips} />

            <SectionLabel label="STRESS HEATMAP · BY DAY" />
            <StressHeatmap days={data.heatmapDays} />

            <SectionLabel label="QUICK ACTIONS" />
            <QuickActions actions={data.quickActions} />

            <View style={{ height: 40 }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 0,
  },
  statusText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
  },
});