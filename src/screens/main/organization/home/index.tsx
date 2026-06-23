import React from 'react';
import { View, ScrollView, Text, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
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

import { useOrgDashboard, OrgDashboardRaw } from '../../../../api/hooks/organization/useOrgStats';

// ─── Static data ──────────────────────────────────────────────────────────────
const QUICK_ACTIONS: QuickAction[] = [
  { icon: '📣', label: 'Announce' },
  { icon: '📅', label: 'Schedule' },
  { icon: '📊', label: 'Report'   },
  { icon: '⚙️', label: 'Settings' },
];

// ─── Transform helpers ────────────────────────────────────────────────────────
const pulseColor = (score: number) =>
  score >= 70 ? C.green : score >= 50 ? C.amber : C.red;

const goodColor = (pct: number) =>
  pct >= 65 ? C.green : pct >= 40 ? C.amber : C.red;

const badColor = (pct: number) =>
  pct <= 30 ? C.green : pct <= 55 ? C.amber : C.red;

const pulseStatus = (score: number) => {
  if (score >= 80) return { label: 'Excellent 🚀',        color: C.green };
  if (score >= 65) return { label: 'Good 👍',              color: C.green };
  if (score >= 50) return { label: 'Moderate ⚡',          color: C.amber };
  return               { label: 'Needs attention ⚠️',    color: C.red   };
};

const DEPT_ICONS: Record<string, string> = {
  engineer: '💻', design: '🎨', product: '🧩', sales: '📈',
  marketing: '📣', hr: '🤝', finance: '💰', legal: '⚖️',
  ops: '⚙️', data: '📊', support: '🎧', general: '🏢',
};
const deptIcon = (name: string) => {
  const key = Object.keys(DEPT_ICONS).find((k) => name.toLowerCase().includes(k));
  return key ? DEPT_ICONS[key] : '🏢';
};

const EMOTION_EMOJI: Record<string, string> = {
  Calm: '😌', Stressed: '😬', Anxious: '😰', Overwhelmed: '😵',
  Grateful: '🙏', Motivated: '🙌', Tired: '😴', Happy: '😊',
  Sad: '😔', Focused: '🎯', Burned: '🔥', Overthinking: '💭',
};
const emojiFor = (e: string) =>
  EMOTION_EMOJI[e] ??
  EMOTION_EMOJI[Object.keys(EMOTION_EMOJI).find((k) => e.includes(k)) ?? ''] ??
  '💬';

const CHIP_PALETTES = [
  { bg: 'rgba(15,118,110,0.1)',  border: 'rgba(15,118,110,0.28)',  color: '#5DCAA5' },
  { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.28)',  color: C.amber   },
  { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.28)', color: '#A78BFA' },
  { bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.28)',   color: C.green   },
  { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.28)',   color: '#F87171' },
  { bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.28)', color: '#38BDF8' },
];

const heatBg = (intensity: number) => {
  if (intensity <= 0.2) return `rgba(34,197,94,${(0.1 + intensity * 0.6).toFixed(2)})`;
  if (intensity <= 0.5) return `rgba(245,158,11,${(0.1 + intensity * 0.5).toFixed(2)})`;
  return `rgba(239,68,68,${(0.1 + intensity * 0.6).toFixed(2)})`;
};

// ─── Main transform ───────────────────────────────────────────────────────────
const buildDashboardProps = (raw: OrgDashboardRaw) => {
  const {
    totalEmployees, departmentCount, totalCheckInsToday, checkInRate,
    goodLevel, moodDistribution, departments, topEmotions, stressHeatmap,
    alertDept, alertStressChange,
  } = raw;

  const checkedInDepts  = departments.filter((d) => d.checkedInToday > 0);
  const totalCI         = checkedInDepts.reduce((s, d) => s + d.checkedInToday, 0);
  const weightedMood    = totalCI > 0
    ? checkedInDepts.reduce((s, d) => s + d.avgMood   * d.checkedInToday, 0) / totalCI : 0;
  const weightedEnergy  = totalCI > 0
    ? checkedInDepts.reduce((s, d) => s + d.avgEnergy * d.checkedInToday, 0) / totalCI : 0;

  const burnoutRisk     = moodDistribution.stressed;
  const absenteeismRisk = 100 - checkInRate;
  const ps              = pulseStatus(goodLevel);

  const alertMessage = alertDept && alertStressChange !== null
    ? `${alertDept} stress ${alertStressChange > 0 ? 'up' : 'down'} ${Math.abs(alertStressChange)}% this week · consider a check-in`
    : alertDept
      ? `${alertDept} has the highest stress level this week`
      : 'No significant stress alerts this week 🎉';

  const headlineStats: HeadlineStat[] = [
    {
      label: 'Total employees', val: `${totalEmployees}`,
      sub: `across ${departmentCount} dept${departmentCount !== 1 ? 's' : ''}`,
      subColor: C.muted,
    },
    {
      label: 'Checked in today', val: `${totalCheckInsToday}`,
      valSuffix: `/${totalEmployees}`,
      sub: `↑ ${checkInRate}% rate`,
      subColor: checkInRate >= 60 ? C.green : C.amber,
    },
    {
      label: 'Active today', val: `${totalCheckInsToday}`,
      sub: '● checked in', subColor: C.teal,
    },
  ];

  const pulse = {
    score: goodLevel, status: ps.label, statusColor: ps.color,
    delta: `${goodLevel >= 65 ? '↑' : '↓'} wellness score`,
  };

  const productivity: ProductivityMetric[] = [
    {
      label: 'Avg mood score', val: weightedMood.toFixed(1), suffix: '/10',
      sub: weightedMood >= 6.5 ? '↑ healthy range' : '↓ below average',
      subColor: weightedMood >= 6.5 ? C.green : C.red,
      pct: Math.round((weightedMood / 10) * 100),
      color: goodColor(Math.round((weightedMood / 10) * 100)),
    },
    {
      label: 'Burnout risk', val: `${burnoutRisk}`, suffix: '%',
      sub: burnoutRisk >= 40 ? '↑ high — act now' : burnoutRisk >= 25 ? '↑ moderate risk' : '→ low risk',
      subColor: badColor(burnoutRisk), pct: burnoutRisk, color: badColor(burnoutRisk),
    },
    {
      label: 'Energy level', val: weightedEnergy.toFixed(1), suffix: '/10',
      sub: weightedEnergy >= 6 ? '→ stable' : '↓ low energy',
      subColor: weightedEnergy >= 6 ? C.muted : C.red,
      pct: Math.round((weightedEnergy / 10) * 100),
      color: goodColor(Math.round((weightedEnergy / 10) * 100)),
    },
    {
      label: 'Absenteeism risk', val: `${absenteeismRisk}`, suffix: '%',
      sub: absenteeismRisk >= 50 ? '↑ watch closely' : '→ acceptable',
      subColor: badColor(absenteeismRisk), pct: absenteeismRisk, color: badColor(absenteeismRisk),
    },
  ];

  const moods: MoodItem[] = [
    { name: '😌 Calm',     pct: moodDistribution.calm,     color: C.teal    },
    { name: '😤 Stressed', pct: moodDistribution.stressed, color: C.amber   },
    { name: '😊 Great',    pct: moodDistribution.great,    color: C.green   },
    { name: '😔 Low',      pct: moodDistribution.low,      color: '#8B5CF6' },
    { name: '😐 Okay',     pct: moodDistribution.okay,     color: '#94A3B8' },
  ].filter((m) => m.pct > 0);

  const depts: DeptData[] = departments.map((d) => {
    const pc   = pulseColor(d.pulseScore);
    const icon = deptIcon(d.name);
    const isRed = d.pulseScore < 50;
    return {
      icon, name: d.name,
      count: `${d.memberCount} member${d.memberCount !== 1 ? 's' : ''}`,
      pulse: `${d.pulseScore}`,
      pulseColor: pc,
      iconBg:     isRed ? 'rgba(239,68,68,0.1)'  : 'rgba(15,118,110,0.1)',
      iconBorder: isRed ? 'rgba(239,68,68,0.2)'  : 'rgba(15,118,110,0.2)',
      redBorder:  isRed,
      metrics: [
        {
          label: 'Mood',     val: `${d.avgMood}`,      suffix: '/10',
          valColor: goodColor(Math.round((d.avgMood   / 10) * 100)),
          pct: Math.round((d.avgMood / 10) * 100),
          barColor: goodColor(Math.round((d.avgMood   / 10) * 100)),
        },
        {
          label: 'Stress',   val: `${d.avgStress}`,    suffix: '%',
          valColor: badColor(d.avgStress), pct: d.avgStress, barColor: badColor(d.avgStress),
        },
        {
          label: 'Check-in', val: `${d.checkedInToday}`, suffix: `/${d.memberCount}`,
          valColor: C.text,
          pct: d.memberCount > 0 ? Math.round((d.checkedInToday / d.memberCount) * 100) : 0,
          barColor: C.teal,
        },
        {
          label: 'Energy',   val: `${d.avgEnergy}`,    suffix: '/10',
          valColor: goodColor(Math.round((d.avgEnergy / 10) * 100)),
          pct: Math.round((d.avgEnergy / 10) * 100),
          barColor: goodColor(Math.round((d.avgEnergy / 10) * 100)),
        },
      ],
    };
  });

  const emotionChips: EmotionChip[] = topEmotions.map((e, i) => ({
    label: `${emojiFor(e.emotion)} ${e.emotion} · ${e.pct}%`,
    ...CHIP_PALETTES[i % CHIP_PALETTES.length],
  }));

  const heatmapDays: HeatDay[] = stressHeatmap.map((d) => ({
    day: d.day, bg: heatBg(d.intensity),
  }));

  return { alertMessage, headlineStats, pulse, productivity, moods, depts, emotionChips, heatmapDays };
};

// ─── Shared dashboard content ─────────────────────────────────────────────────
// Extracted to avoid duplicating the full JSX tree for the stale-data case.
const DashboardContent = ({
  raw,
  built,
}: {
  raw: OrgDashboardRaw;
  built: ReturnType<typeof buildDashboardProps>;
}) => (
  <>
    <Header data={{
      departmentCount: raw.departmentCount,
      employeeCount:   raw.totalEmployees,
    }} />

    <Alert message={built.alertMessage} />

    <SectionLabel label="OVERVIEW" />
    <HeadlineStats stats={built.headlineStats} />

    <SectionLabel label="TEAM PULSE" />
    <PulseCard data={built.pulse} />

    <SectionLabel label="PRODUCTIVITY METRICS" />
    <ProductivityMetrics metrics={built.productivity} />

    <SectionLabel label="MOOD DISTRIBUTION" />
    <MoodDistribution moods={built.moods} />

    <SectionLabel label="DEPARTMENTS" />
    <Departments depts={built.depts} />

    <SectionLabel label="TOP EMOTIONS THIS WEEK" />
    <EmotionChips chips={built.emotionChips} />

    <SectionLabel label="STRESS HEATMAP · BY DAY" />
    <StressHeatmap days={built.heatmapDays} />

    <View style={{ height: 40 }} />
  </>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const {
    data: raw,
    isLoading,
    isError,
    refreshing,
    onRefresh,
    isOffline,
    isShowingStale,
  } = useOrgDashboard();

  const isEmpty = !isLoading && !isError && (!raw || raw.departments.length === 0);
  const built   = raw ? buildDashboardProps(raw) : null;

  // Fallback header props when no real data is available
  const fallbackHeader = { departmentCount: 0, employeeCount: 0 };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* ── Offline banner ──────────────────────────────────────────────── */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>
            📡 You're offline — showing cached data
          </Text>
        </View>
      )}

      {/* ── Stale / refreshing banner ───────────────────────────────────── */}
      {!isOffline && isShowingStale && (
        <View style={styles.staleBanner}>
          <Text style={styles.staleBannerText}>⟳ Refreshing dashboard…</Text>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={C.teal}
            colors={[C.teal]}
            progressBackgroundColor={C.surface ?? '#0F1628'}
          />
        }
      >
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>9:41</Text>
          <Text style={styles.statusText}>●●●</Text>
        </View>

        {/* ── First-load skeleton — only when no cached data ────────────── */}
        {isLoading && !raw && <DashboardSkeleton />}

        {/* ── Error state — always show header for context ──────────────── */}
        {isError && !raw && (
          <>
            <Header data={fallbackHeader} />
            <View style={styles.errorWrap}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Dashboard unavailable</Text>
              <Text style={styles.errorSub}>
                We couldn't fetch your team's data.{'\n'}
                Check your connection and try again.
              </Text>
              <Text style={styles.errorRetry} onPress={onRefresh}>
                ↻  Tap to retry
              </Text>
            </View>
          </>
        )}

        {/* ── Empty state — always show header for context ──────────────── */}
        {isEmpty && (
          <>
            <Header data={fallbackHeader} />
            <EmptyState />
          </>
        )}

        {/* ── Fresh data ────────────────────────────────────────────────── */}
        {!isLoading && !isError && !isEmpty && built && raw && (
          <DashboardContent raw={raw} built={built} />
        )}

        {/* ── Stale cached data shown while refetching ──────────────────── */}
        {(isLoading || isError) && raw && built && (
          <DashboardContent raw={raw} built={built} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:      { flex: 1, backgroundColor: C.bg },
  scroll:        { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingBottom: 20 },

  // Banners
  offlineBanner: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(239,68,68,0.2)',
    paddingVertical: 7,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  offlineBannerText: { fontSize: 12, color: '#F87171', fontWeight: '600' },
  staleBanner: {
    backgroundColor: 'rgba(245,158,11,0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245,158,11,0.18)',
    paddingVertical: 5,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  staleBannerText: { fontSize: 11, color: '#F59E0B', fontWeight: '600' },

  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  statusText: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },

  // Error state
  errorWrap: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
    gap: 10,
  },
  errorIcon:  { fontSize: 44, marginBottom: 4 },
  errorTitle: { fontSize: 16, color: 'rgba(255,255,255,0.75)', fontWeight: '700' },
  errorSub:   {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorRetry: {
    marginTop: 6,
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '700',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(15,118,110,0.35)',
    borderRadius: 20,
    overflow: 'hidden',
  },

  surface: { backgroundColor: '#0F1628' },
});