import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  useIncomingRequests,
  useRespondToRequest,
} from "../../../../api/hooks/organization/organization"

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

// ─── Types ────────────────────────────────────────────────────────────────────
type FilterValue = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'all';

interface OrganizationRequest {
  _id: string;
  employeeId: { _id: string; fullName: string; email: string } | string;
  organizationId: { _id: string; organization: string; location: string; businessSector: string } | string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message: string;
  createdAt: string;
}

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All',      value: 'all' },
  { label: 'Pending',  value: 'PENDING' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Rejected', value: 'REJECTED' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getEmployee = (req: OrganizationRequest) =>
  typeof req.employeeId === 'string'
    ? { _id: req.employeeId, fullName: 'Unknown', email: '' }
    : req.employeeId;

const getInitials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

const formatDate = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day ago`;
};

// ─── Request Card ─────────────────────────────────────────────────────────────
function RequestCard({
  req,
  onAccept,
  onReject,
  isLoading,
}: {
  req: OrganizationRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  isLoading: boolean;
}) {
  const employee   = getEmployee(req);
  const initials   = getInitials(employee.fullName);
  const isPending  = req.status === 'PENDING';
  const isAccepted = req.status === 'ACCEPTED';
  const isRejected = req.status === 'REJECTED';

  return (
    <View
      style={[
        styles.card,
        isAccepted && styles.cardAccepted,
        isRejected && styles.cardRejected,
      ]}
    >
      {/* Status badge */}
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

      {/* Top row */}
      <View style={styles.cardTop}>
        <View style={[styles.avatarCircle, { backgroundColor: 'rgba(15,118,110,0.2)' }]}>
          <Text style={[styles.avatarInitials, { color: '#5DCAA5' }]}>{initials}</Text>
        </View>
        <View style={styles.nameBlock}>
          <Text style={styles.nameText}>{employee.fullName}</Text>
          <Text style={styles.roleText}>{employee.email}</Text>
        </View>
      </View>

      {/* Meta */}
      <View style={styles.metaRow}>
        <MetaChip icon="📧" label={employee.email} />
        <MetaChip icon="🕐" label={formatDate(req.createdAt)} />
      </View>

      {/* Message */}
      {!!req.message && (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>"{req.message}"</Text>
        </View>
      )}

      <View style={styles.divider} />

      {/* Actions */}
      {isPending && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={[styles.rejectBtn, isLoading && { opacity: 0.5 }]}
            onPress={() => onReject(req._id)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#F87171" />
            ) : (
              <Text style={styles.rejectBtnText}>✕  Decline</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            style={[styles.acceptBtn, isLoading && { opacity: 0.5 }]}
            onPress={() => onAccept(req._id)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#5DCAA5" />
            ) : (
              <Text style={styles.acceptBtnText}>✓  Accept</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

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
      <Text style={styles.metaChipText} numberOfLines={1}>{label}</Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function JoinRequestsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const [search, setSearch]             = useState('');
  const [loadingId, setLoadingId]       = useState<string | null>(null);

  // ── Fetch all three statuses in parallel ──────────────────────────────────
  const { data: pendingData,  isLoading: loadingPending }  = useIncomingRequests('PENDING');
  const { data: acceptedData, isLoading: loadingAccepted } = useIncomingRequests('ACCEPTED');
  const { data: rejectedData, isLoading: loadingRejected } = useIncomingRequests('REJECTED');

  const { mutate: respond } = useRespondToRequest();

  const isLoading = loadingPending || loadingAccepted || loadingRejected;

  // ── Merge all for "all" filter ────────────────────────────────────────────
  const allRequests: OrganizationRequest[] = [
    ...(pendingData  ?? []),
    ...(acceptedData ?? []),
    ...(rejectedData ?? []),
  ];

  const counts = {
    all:      allRequests.length,
    PENDING:  pendingData?.length  ?? 0,
    ACCEPTED: acceptedData?.length ?? 0,
    REJECTED: rejectedData?.length ?? 0,
  };

  // ── Filter + search ───────────────────────────────────────────────────────
  const sourceList =
    activeFilter === 'all'
      ? allRequests
      : activeFilter === 'PENDING'
      ? (pendingData  ?? [])
      : activeFilter === 'ACCEPTED'
      ? (acceptedData ?? [])
      : (rejectedData ?? []);

  const filtered = sourceList.filter((r) => {
    if (!search.trim()) return true;
    const emp  = getEmployee(r);
    const term = search.toLowerCase();
    return (
      emp.fullName.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term)
    );
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAccept = (id: string) => {
    setLoadingId(id);
    respond(
      { id, action: 'accept' },
      { onSettled: () => setLoadingId(null) },
    );
  };

  const handleReject = (id: string) => {
    setLoadingId(id);
    respond(
      { id, action: 'reject' },
      { onSettled: () => setLoadingId(null) },
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Join Requests</Text>
          {counts.PENDING > 0 && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>{counts.PENDING}</Text>
            </View>
          )}
        </View>
        <Text style={styles.headerSub}>Review and manage incoming membership requests</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email..."
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
        {FILTERS.map((f) => {
          const count    = counts[f.value];
          const isActive = activeFilter === f.value;
          return (
            <TouchableOpacity
              key={f.value}
              activeOpacity={0.7}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setActiveFilter(f.value)}
            >
              <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                {f.label}
              </Text>
              <View style={[styles.filterCount, isActive && styles.filterCountActive]}>
                <Text style={[styles.filterCountText, isActive && styles.filterCountTextActive]}>
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
        {isLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator color={C.teal} size="large" />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No requests found</Text>
            <Text style={styles.emptySub}>
              {search ? 'Try a different search term' : 'Nothing here yet'}
            </Text>
          </View>
        ) : (
          filtered.map((r) => (
            <RequestCard
              key={r._id}
              req={r}
              onAccept={handleAccept}
              onReject={handleReject}
              isLoading={loadingId === r._id}
            />
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles (unchanged from original) ────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },

  header: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  headerTitle:    { fontSize: 22, fontWeight: '900', color: C.text, letterSpacing: -0.6 },
  headerSub:      { fontSize: 11, color: C.muted2 },
  pendingBadge:   { backgroundColor: C.amber, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  pendingBadgeText: { fontSize: 11, fontWeight: '800', color: '#04060F' },

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
  searchIcon:  { fontSize: 13 },
  searchInput: { flex: 1, fontSize: 13, color: C.text, padding: 0 },

  filterRow: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 4, gap: 8 },
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
  filterTabActive:      { backgroundColor: 'rgba(15,118,110,0.15)', borderColor: 'rgba(15,118,110,0.35)' },
  filterTabText:        { fontSize: 12, fontWeight: '600', color: C.muted2 },
  filterTabTextActive:  { color: '#5DCAA5' },
  filterCount:          { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1 },
  filterCountActive:    { backgroundColor: 'rgba(15,118,110,0.25)' },
  filterCountText:      { fontSize: 10, fontWeight: '700', color: C.muted },
  filterCountTextActive: { color: '#5DCAA5' },

  list:        { flex: 1 },
  listContent: { paddingHorizontal: 14, paddingTop: 10 },

  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 15,
    marginBottom: 10,
    position: 'relative',
  },
  cardAccepted: { borderColor: 'rgba(34,197,94,0.2)', backgroundColor: 'rgba(34,197,94,0.04)' },
  cardRejected: { borderColor: 'rgba(239,68,68,0.12)', opacity: 0.65 },

  cardTop:       { flexDirection: 'row', alignItems: 'flex-start', gap: 11, marginBottom: 11 },
  avatarCircle:  { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarInitials: { fontSize: 15, fontWeight: '900', letterSpacing: -0.5 },
  nameBlock:     { flex: 1, gap: 3 },
  nameText:      { fontSize: 14, fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  roleText:      { fontSize: 11, color: C.muted2 },

  statusBadge:        { position: 'absolute', top: 14, right: 14, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  statusBadgeGreen:   { backgroundColor: 'rgba(34,197,94,0.12)', borderColor: 'rgba(34,197,94,0.22)' },
  statusBadgeRed:     { backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.18)' },
  statusBadgePending: { backgroundColor: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.2)' },
  statusBadgeText:        { fontSize: 10, fontWeight: '700', color: C.green },
  statusBadgePendingText: { fontSize: 10, fontWeight: '700', color: C.amber },

  metaRow:      { flexDirection: 'row', gap: 6 },
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
  metaChipText: { fontSize: 10, color: 'rgba(255,255,255,0.35)', flexShrink: 1 },

  messageBox:  { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 10, marginTop: 8 },
  messageText: { fontSize: 11, color: C.muted2, fontStyle: 'italic', lineHeight: 16 },

  divider:    { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 12 },
  actionRow:  { flexDirection: 'row', gap: 8 },
  rejectBtn: {
    flex: 1, paddingVertical: 11, borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.07)', borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)', alignItems: 'center',
  },
  rejectBtnText: { fontSize: 13, fontWeight: '700', color: '#F87171' },
  acceptBtn: {
    flex: 1, paddingVertical: 11, borderRadius: 12,
    backgroundColor: 'rgba(15,118,110,0.18)', borderWidth: 1,
    borderColor: 'rgba(15,118,110,0.35)', alignItems: 'center',
  },
  acceptBtnText: { fontSize: 13, fontWeight: '700', color: '#5DCAA5' },
  resolvedNote:  { fontSize: 11, textAlign: 'center', fontStyle: 'italic' },

  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyIcon:  { fontSize: 36 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  emptySub:   { fontSize: 12, color: C.muted },
});