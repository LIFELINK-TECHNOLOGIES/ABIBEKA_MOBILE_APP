import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#04060F',
  surface: '#0F1628',
  border: 'rgba(255,255,255,0.06)',
  text: '#F0F4FF',
  muted: 'rgba(255,255,255,0.25)',
  muted2: 'rgba(255,255,255,0.3)',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
  teal: '#0F766E',
  purple: '#8B5CF6',
};

// ─── Reusable primitives ───────────────────────────────────────────────────────
const SectionLabel = ({ label }: { label: string }) => (
  <Text style={styles.sectionLabel}>{label}</Text>
);

const MiniBar = ({
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

// ─── Sections ─────────────────────────────────────────────────────────────────

function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.orgName}>Acme Corp</Text>
        <Text style={styles.orgMeta}>4 departments · 48 employees · Admin</Text>
      </View>
      <View style={styles.avatar}>
        <Text style={styles.avatarIcon}>🏢</Text>
      </View>
    </View>
  );
}

function Alert() {
  return (
    <View style={styles.alertBox}>
      <View style={styles.alertPulse} />
      <Text style={styles.alertText}>
        Engineering stress up 31% this week · consider a check-in
      </Text>
    </View>
  );
}

function HeadlineStats() {
  const stats = [
    { label: 'Total employees', val: '48', sub: 'across 4 depts', subColor: C.muted },
    { label: 'Checked in today', val: '31', valSuffix: '/48', sub: '↑ 65% rate', subColor: C.green },
    { label: 'Active now', val: '12', sub: '● online', subColor: C.teal },
  ];
  return (
    <View style={styles.row}>
      {stats.map((s, i) => (
        <View key={i} style={[styles.hlCard, i < stats.length - 1 && { marginRight: 8 }]}>
          <Text style={styles.hlLabel}>{s.label}</Text>
          <Text style={styles.hlVal}>
            {s.val}
            {s.valSuffix ? <Text style={styles.hlValSuffix}>{s.valSuffix}</Text> : null}
          </Text>
          <Text style={[styles.hlSub, { color: s.subColor }]}>{s.sub}</Text>
        </View>
      ))}
    </View>
  );
}

function PulseCard() {
  return (
    <View style={styles.card}>
      <View style={styles.pulseRow}>
        <Text style={styles.pulseNum}>
          74<Text style={styles.pulseNumSuffix}>/100</Text>
        </Text>
        <View style={styles.pulseMeta}>
          <Text style={styles.pulseTitle}>OVERALL PULSE SCORE</Text>
          <Text style={styles.pulseStatus}>Good 👍</Text>
          <Text style={styles.pulseDelta}>↑ +6 pts vs last week</Text>
        </View>
      </View>
      <MiniBar pct={74} color={C.teal} height={7} />
      <View style={[styles.row, { marginTop: 6, justifyContent: 'space-between' }]}>
        <Text style={styles.rangeLabel}>🔴 Critical {'<'}30</Text>
        <Text style={styles.rangeLabel}>🟡 Fair 30–59</Text>
        <Text style={styles.rangeLabel}>🟢 Good 60+</Text>
      </View>
    </View>
  );
}

function ProductivityMetrics() {
  const metrics = [
    { label: 'Avg focus score', val: '7.2', suffix: '/10', sub: '↑ +0.6 this week', subColor: C.green, pct: 72, color: C.green },
    { label: 'Burnout risk', val: '24', suffix: '%', sub: '↑ moderate risk', subColor: C.amber, pct: 24, color: C.amber },
    { label: 'Energy level', val: '6.1', suffix: '/10', sub: '→ stable', subColor: C.muted, pct: 61, color: C.teal },
    { label: 'Absenteeism risk', val: '18', suffix: '%', sub: '↑ watch closely', subColor: C.red, pct: 18, color: C.red },
  ];
  const rows = [[metrics[0], metrics[1]], [metrics[2], metrics[3]]];
  return (
    <View style={styles.prodGrid}>
      {rows.map((pair, rowIdx) => (
        <View key={rowIdx} style={styles.prodRow}>
      {pair.map((m, i) => (
        <View key={i} style={[styles.prodCard, i === 0 && { marginRight: 8 }]}>
          <Text style={styles.prodLabel}>{m.label}</Text>
          <Text style={styles.prodVal}>
            {m.val}
            <Text style={styles.prodValSuffix}>{m.suffix}</Text>
          </Text>
          <Text style={[styles.prodSub, { color: m.subColor }]}>{m.sub}</Text>
          <MiniBar pct={m.pct} color={m.color} height={4} />
        </View>
      ))}
        </View>
      ))}
    </View>
  );
}

function MoodDistribution() {
  const moods = [
    { name: '😌 Calm', pct: 42, color: C.teal },
    { name: '😤 Stressed', pct: 28, color: C.amber },
    { name: '😊 Great', pct: 18, color: C.green },
    { name: '😔 Low', pct: 8, color: C.purple },
    { name: '😐 Okay', pct: 4, color: '#94A3B8' },
  ];
  return (
    <View style={styles.card}>
      <View style={{ marginBottom: 14 }}>
        <Text style={styles.cardTitle}>How the team feels</Text>
        <Text style={styles.cardSub}>This week · all check-ins</Text>
      </View>
      {moods.map((m, i) => (
        <View key={i} style={[styles.moodRow, i < moods.length - 1 && { marginBottom: 9 }]}>
          <Text style={styles.moodName}>{m.name}</Text>
          <View style={[styles.barTrack, { flex: 1, height: 6, marginHorizontal: 8 }]}>
            <View style={[styles.barFill, { width: `${m.pct}%` as any, backgroundColor: m.color, height: 6 }]} />
          </View>
          <Text style={styles.moodPct}>{m.pct}%</Text>
        </View>
      ))}
    </View>
  );
}

type DeptData = {
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

function DeptCard({ dept }: { dept: DeptData }) {
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
}

function Departments() {
  const depts: DeptData[] = [
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
  ];
  return (
    <>
      {depts.map((d, i) => (
        <DeptCard key={i} dept={d} />
      ))}
    </>
  );
}

function EmotionChips() {
  const chips = [
    { label: '😌 Calm · 38%', bg: 'rgba(15,118,110,0.1)', border: 'rgba(15,118,110,0.28)', color: '#5DCAA5' },
    { label: '😬 Stressed · 24%', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.28)', color: C.amber },
    { label: '💭 Overthinking · 18%', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.28)', color: '#A78BFA' },
    { label: '🙌 Motivated · 12%', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.28)', color: C.green },
    { label: '😰 Anxious · 8%', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.28)', color: '#F87171' },
  ];
  return (
    <View style={styles.card}>
      <Text style={styles.cardSub}>Most logged across all departments</Text>
      <View style={styles.chips}>
        {chips.map((c, i) => (
          <View key={i} style={[styles.chip, { backgroundColor: c.bg, borderColor: c.border }]}>
            <Text style={[styles.chipText, { color: c.color }]}>{c.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function StressHeatmap() {
  const days = [
    { day: 'Mon', bg: 'rgba(34,197,94,0.22)' },
    { day: 'Tue', bg: 'rgba(245,158,11,0.30)' },
    { day: 'Wed', bg: 'rgba(245,158,11,0.18)' },
    { day: 'Thu', bg: 'rgba(239,68,68,0.42)' },
    { day: 'Fri', bg: 'rgba(245,158,11,0.28)' },
    { day: 'Sat', bg: 'rgba(34,197,94,0.12)' },
    { day: 'Sun', bg: 'rgba(34,197,94,0.08)' },
  ];
  return (
    <View style={styles.card}>
      <Text style={styles.cardSub}>Team stress pattern across the week</Text>
      <View style={[styles.row, { marginTop: 10, justifyContent: 'space-between' }]}>
        {days.map((d, i) => (
          <View key={i} style={styles.heatCol}>
            <View style={[styles.heatCell, { backgroundColor: d.bg }]} />
            <Text style={styles.heatLabel}>{d.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function QuickActions() {
  const actions = [
    { icon: '📣', label: 'Announce' },
    { icon: '📅', label: 'Schedule' },
    { icon: '📊', label: 'Report' },
    { icon: '⚙️', label: 'Settings' },
  ];
  return (
    <View style={styles.row}>
      {actions.map((a, i) => (
        <TouchableOpacity
          key={i}
          activeOpacity={0.7}
          style={[styles.actBtn, i < actions.length - 1 && { marginRight: 8 }]}
        >
          <Text style={{ fontSize: 18 }}>{a.icon}</Text>
          <Text style={styles.actLabel}>{a.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function Home() {
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

        <Header />
        <Alert />

        <SectionLabel label="OVERVIEW" />
        <HeadlineStats />

        <SectionLabel label="TEAM PULSE" />
        <PulseCard />

        <SectionLabel label="PRODUCTIVITY METRICS" />
        <ProductivityMetrics />

        <SectionLabel label="MOOD DISTRIBUTION" />
        <MoodDistribution />

        <SectionLabel label="DEPARTMENTS" />
        <Departments />

        <SectionLabel label="TOP EMOTIONS THIS WEEK" />
        <EmotionChips />

        <SectionLabel label="STRESS HEATMAP · BY DAY" />
        <StressHeatmap />

        <SectionLabel label="QUICK ACTIONS" />
        <QuickActions />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
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

  // Status
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

  // Header
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

  // Section label
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.muted,
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },

  // Alert
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

  // Row helper
  row: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginTop: 10,
  },

  // Headline stats
  hlCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 12,
  },
  hlLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: C.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  hlVal: {
    fontSize: 26,
    fontWeight: '900',
    color: C.text,
    letterSpacing: -1,
    lineHeight: 28,
  },
  hlValSuffix: {
    fontSize: 11,
    color: C.muted,
    fontWeight: '500',
  },
  hlSub: {
    fontSize: 10,
    marginTop: 4,
  },

  // Card (generic)
  card: {
    marginHorizontal: 14,
    marginTop: 10,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 16,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 10,
    color: C.muted2,
  },

  // Pulse card
  pulseRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
    marginBottom: 14,
  },
  pulseNum: {
    fontSize: 64,
    fontWeight: '900',
    color: C.teal,
    letterSpacing: -3,
    lineHeight: 68,
  },
  pulseNumSuffix: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.2)',
  },
  pulseMeta: {
    paddingBottom: 8,
  },
  pulseTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  pulseStatus: {
    fontSize: 16,
    fontWeight: '900',
    color: C.green,
    marginBottom: 3,
  },
  pulseDelta: {
    fontSize: 11,
    color: C.muted2,
  },
  rangeLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.2)',
  },

  // Bar primitive
  barTrack: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  barFill: {
    borderRadius: 4,
  },

  // Productivity grid
  prodGrid: {
    marginHorizontal: 14,
    marginTop: 10,
    gap: 8,
  },
  prodRow: {
    flexDirection: 'row',
  },
  prodCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 12,
  },
  prodLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: C.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  prodVal: {
    fontSize: 22,
    fontWeight: '900',
    color: C.text,
    letterSpacing: -0.8,
  },
  prodValSuffix: {
    fontSize: 11,
    color: C.muted,
    fontWeight: '500',
  },
  prodSub: {
    fontSize: 10,
    marginTop: 3,
  },

  // Mood
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodName: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    width: 80,
    flexShrink: 0,
  },
  moodPct: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    width: 28,
    textAlign: 'right',
    fontWeight: '700',
  },

  // Departments
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

  // Emotion chips
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Heatmap
  heatCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  heatCell: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 7,
  },
  heatLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.2)',
  },

  // Quick actions
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