import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

// ─── Tokens (matches HomeScreen) ─────────────────────────────────────────────
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

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = 'pending' | 'accepted' | 'rejected';

type Request = {
  id: string;
  name: string;
  role: string;
  department: string;
  deptIcon: string;
  deptColor: string;
  deptBg: string;
  email: string;
  location: string;
  experience: string;
  requestedAt: string;
  status: Status;
  initials: string;
  avatarBg: string;
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const INITIAL_REQUESTS: Request[] = [
  {
    id: '1',
    name: 'Amara Osei',
    role: 'Senior Frontend Engineer',
    department: 'Engineering',
    deptIcon: '💻',
    deptColor: '#F87171',
    deptBg: 'rgba(239,68,68,0.1)',
    email: 'amara.osei@email.com',
    location: 'Lagos, NG',
    experience: '5 yrs exp',
    requestedAt: '2 min ago',
    status: 'pending',
    initials: 'AO',
    avatarBg: 'rgba(239,68,68,0.2)',
  },
  {
    id: '2',
    name: 'Kofi Mensah',
    role: 'Product Designer',
    department: 'Design',
    deptIcon: '🎨',
    deptColor: '#5DCAA5',
    deptBg: 'rgba(15,118,110,0.1)',
    email: 'kofi.mensah@email.com',
    location: 'Accra, GH',
    experience: '3 yrs exp',
    requestedAt: '18 min ago',
    status: 'pending',
    initials: 'KM',
    avatarBg: 'rgba(15,118,110,0.2)',
  },
  {
    id: '3',
    name: 'Zara Williams',
    role: 'Sales Executive',
    department: 'Sales',
    deptIcon: '📈',
    deptColor: '#FCD34D',
    deptBg: 'rgba(245,158,11,0.1)',
    email: 'zara.w@email.com',
    location: 'London, UK',
    experience: '4 yrs exp',
    requestedAt: '1 hr ago',
    status: 'pending',
    initials: 'ZW',
    avatarBg: 'rgba(245,158,11,0.2)',
  },
  {
    id: '4',
    name: 'Daniel Nwosu',
    role: 'HR Business Partner',
    department: 'HR',
    deptIcon: '🤝',
    deptColor: '#A78BFA',
    deptBg: 'rgba(139,92,246,0.1)',
    email: 'daniel.n@email.com',
    location: 'Abuja, NG',
    experience: '6 yrs exp',
    requestedAt: '3 hr ago',
    status: 'pending',
    initials: 'DN',
    avatarBg: 'rgba(139,92,246,0.2)',
  },
  {
    id: '5',
    name: 'Priya Sharma',
    role: 'Backend Engineer',
    department: 'Engineering',
    deptIcon: '💻',
    deptColor: '#F87171',
    deptBg: 'rgba(239,68,68,0.1)',
    email: 'priya.s@email.com',
    location: 'Bangalore, IN',
    experience: '7 yrs exp',
    requestedAt: '5 hr ago',
    status: 'pending',
    initials: 'PS',
    avatarBg: 'rgba(239,68,68,0.18)',
  },
  {
    id: '6',
    name: 'Chidi Eze',
    role: 'UX Researcher',
    department: 'Design',
    deptIcon: '🎨',
    deptColor: '#5DCAA5',
    deptBg: 'rgba(15,118,110,0.1)',
    email: 'chidi.eze@email.com',
    location: 'Enugu, NG',
    experience: '2 yrs exp',
    requestedAt: '1 day ago',
    status: 'pending',
    initials: 'CE',
    avatarBg: 'rgba(15,118,110,0.18)',
  },
];

const FILTERS: { label: string; value: Status | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
];

// ─── Request Card ─────────────────────────────────────────────────────────────
function RequestCard({
  req,
  onAccept,
  onReject,
}: {
  req: Request;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const isPending = req.status === 'pending';
  const isAccepted = req.status === 'accepted';
  const isRejected = req.status === 'rejected';

  return (
    <View
      style={[
        styles.card,
        isAccepted && styles.cardAccepted,
        isRejected && styles.cardRejected,
      ]}
    >
      {/* Status badge — absolute top-right */}
      {isAccepted && (
        <View style={[styles.statusBadge, styles.statusBadgeGreen]}>
          <Text style={styles.statusBadgeText}>✓ Accepted</Text>
        </View>
      )}
      {isRejected && (
        <View style={[styles.statusBadge, styles.statusBadgeRed]}>
          <Text style={[styles.statusBadgeText, { color: C.red }]}>✕ Rejected</Text>
        </View>
      )}
      {isPending && (
        <View style={[styles.statusBadge, styles.statusBadgePending]}>
          <Text style={styles.statusBadgePendingText}>Pending</Text>
        </View>
      )}

      {/* Top row: avatar + name block */}
      <View style={styles.cardTop}>
        <View style={[styles.avatarCircle, { backgroundColor: req.avatarBg }]}>
          <Text style={[styles.avatarInitials, { color: req.deptColor }]}>
            {req.initials}
          </Text>
        </View>

        <View style={styles.nameBlock}>
          <Text style={styles.nameText}>{req.name}</Text>
          <Text style={styles.roleText}>{req.role}</Text>
          <View style={[styles.deptPill, { backgroundColor: req.deptBg }]}>
            <Text style={{ fontSize: 10 }}>{req.deptIcon}</Text>
            <Text style={[styles.deptPillText, { color: req.deptColor }]}>
              {req.department}
            </Text>
          </View>
        </View>
      </View>

      {/* Meta row */}
      <View style={styles.metaRow}>
        <MetaChip icon="📧" label={req.email} />
        <MetaChip icon="📍" label={req.location} />
      </View>
      <View style={[styles.metaRow, { marginTop: 5 }]}>
        <MetaChip icon="💼" label={req.experience} />
        <MetaChip icon="🕐" label={req.requestedAt} />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Action buttons — only show when pending */}
      {isPending && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.rejectBtn}
            onPress={() => onReject(req.id)}
          >
            <Text style={styles.rejectBtnText}>✕  Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.acceptBtn}
            onPress={() => onAccept(req.id)}
          >
            <Text style={styles.acceptBtnText}>✓  Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Resolved state message */}
      {!isPending && (
        <Text style={[styles.resolvedNote, { color: isAccepted ? C.green : C.muted }]}>
          {isAccepted
            ? 'Added to org · welcome email sent'
            : 'Request declined · applicant notified'}
        </Text>
      )}
    </View>
  );
}

function MetaChip({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.metaChip}>
      <Text style={{ fontSize: 10 }}>{icon}</Text>
      <Text style={styles.metaChipText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function JoinRequestsScreen() {
  const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS);
  const [activeFilter, setActiveFilter] = useState<Status | 'all'>('all');
  const [search, setSearch] = useState('');

  const handleAccept = (id: string) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'accepted' } : r))
    );
  };

  const handleReject = (id: string) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
  };

  const filtered = requests.filter(r => {
    const matchesFilter = activeFilter === 'all' || r.status === activeFilter;
    const matchesSearch =
      search.trim() === '' ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Join Requests</Text>
            {pendingCount > 0 && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>{pendingCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.headerSub}>
            Review and manage incoming membership requests
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, role, or department..."
          placeholderTextColor="rgba(255,255,255,0.2)"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map(f => {
          const count =
            f.value === 'all'
              ? requests.length
              : requests.filter(r => r.status === f.value).length;
          const isActive = activeFilter === f.value;
          return (
            <TouchableOpacity
              key={f.value}
              activeOpacity={0.7}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setActiveFilter(f.value)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  isActive && styles.filterTabTextActive,
                ]}
              >
                {f.label}
              </Text>
              <View
                style={[
                  styles.filterCount,
                  isActive && styles.filterCountActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterCountText,
                    isActive && styles.filterCountTextActive,
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No requests found</Text>
            <Text style={styles.emptySub}>
              {search ? 'Try a different search term' : 'Nothing here yet'}
            </Text>
          </View>
        ) : (
          filtered.map(r => (
            <RequestCard
              key={r.id}
              req={r}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))
        )}
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

  // Header
  header: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: C.text,
    letterSpacing: -0.6,
  },
  headerSub: {
    fontSize: 11,
    color: C.muted2,
  },
  pendingBadge: {
    backgroundColor: C.amber,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#04060F',
  },

  // Search
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginTop: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: { fontSize: 13 },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: C.text,
    padding: 0,
  },

  // Filter tabs
  filterRow: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  filterTabActive: {
    backgroundColor: 'rgba(15,118,110,0.15)',
    borderColor: 'rgba(15,118,110,0.35)',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.muted2,
  },
  filterTabTextActive: {
    color: '#5DCAA5',
  },
  filterCount: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  filterCountActive: {
    backgroundColor: 'rgba(15,118,110,0.25)',
  },
  filterCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.muted,
  },
  filterCountTextActive: {
    color: '#5DCAA5',
  },

  // List
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },

  // Card
  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 15,
    marginBottom: 10,
    position: 'relative',
  },
  cardAccepted: {
    borderColor: 'rgba(34,197,94,0.2)',
    backgroundColor: 'rgba(34,197,94,0.04)',
  },
  cardRejected: {
    borderColor: 'rgba(239,68,68,0.12)',
    opacity: 0.65,
  },

  // Card top
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    marginBottom: 11,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  nameBlock: {
    flex: 1,
    gap: 3,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.3,
  },
  roleText: {
    fontSize: 11,
    color: C.muted2,
  },
  deptPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 2,
  },
  deptPillText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // Status badges
  statusBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBadgeGreen: {
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderColor: 'rgba(34,197,94,0.22)',
  },
  statusBadgeRed: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderColor: 'rgba(239,68,68,0.18)',
  },
  statusBadgePending: {
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderColor: 'rgba(245,158,11,0.2)',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.green,
  },
  statusBadgePendingText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.amber,
  },

  // Meta chips
  metaRow: {
    flexDirection: 'row',
    gap: 6,
  },
  metaChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  metaChipText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    flexShrink: 1,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 12,
  },

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    alignItems: 'center',
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F87171',
  },
  acceptBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: 'rgba(15,118,110,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(15,118,110,0.35)',
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5DCAA5',
  },

  // Resolved note
  resolvedNote: {
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyIcon: { fontSize: 36 },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
  },
  emptySub: {
    fontSize: 12,
    color: C.muted,
  },
});