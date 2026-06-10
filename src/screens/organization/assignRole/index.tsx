import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
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
  tealLight: '#5DCAA5',
  purple: '#8B5CF6',
};

// ─── Org roles ────────────────────────────────────────────────────────────────
type OrgRole = {
  id: string;
  title: string;
  short: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  description: string;
  permissions: string[];
};

const ORG_ROLES: OrgRole[] = [
  {
    id: 'manager',
    title: 'Manager',
    short: 'MGR',
    icon: '🧭',
    color: C.tealLight,
    bg: 'rgba(15,118,110,0.12)',
    border: 'rgba(15,118,110,0.3)',
    description: 'Oversees a department, manages check-ins and team health.',
    permissions: ['View department data', 'Manage team check-ins', 'Send announcements'],
  },
  {
    id: 'admin',
    title: 'Admin',
    short: 'ADM',
    icon: '🛡️',
    color: '#818CF8',
    bg: 'rgba(99,102,241,0.12)',
    border: 'rgba(99,102,241,0.3)',
    description: 'Full org access. Manages members, roles and settings.',
    permissions: ['All manager permissions', 'Manage members & roles', 'Edit org settings'],
  },
  {
    id: 'coo',
    title: 'COO',
    short: 'COO',
    icon: '⚙️',
    color: '#FB923C',
    bg: 'rgba(251,146,60,0.1)',
    border: 'rgba(251,146,60,0.28)',
    description: 'Chief Operating Officer. Runs day-to-day org operations.',
    permissions: ['All admin permissions', 'Operations oversight', 'Cross-dept visibility'],
  },
  {
    id: 'cfo',
    title: 'CFO',
    short: 'CFO',
    icon: '💰',
    color: '#FBBF24',
    bg: 'rgba(251,191,36,0.1)',
    border: 'rgba(251,191,36,0.28)',
    description: 'Chief Financial Officer. Manages financial reporting and budgets.',
    permissions: ['Financial data access', 'Budget management', 'Payroll visibility'],
  },
  {
    id: 'md',
    title: 'MD',
    short: 'MD',
    icon: '👔',
    color: '#E879F9',
    bg: 'rgba(232,121,249,0.1)',
    border: 'rgba(232,121,249,0.28)',
    description: 'Managing Director. Strategic leadership and executive decisions.',
    permissions: ['Full org access', 'Executive controls', 'Org-wide reports'],
  },
];

// ─── Employees ────────────────────────────────────────────────────────────────
type Employee = {
  id: string;
  name: string;
  initials: string;
  currentRole: string;
  department: string;
  deptIcon: string;
  deptColor: string;
  avatarBg: string;
  assignedOrgRole: string | null;
};

const EMPLOYEES: Employee[] = [
  {
    id: '1', name: 'Amara Osei', initials: 'AO',
    currentRole: 'Senior Frontend Engineer', department: 'Engineering',
    deptIcon: '💻', deptColor: '#F87171', avatarBg: 'rgba(239,68,68,0.18)',
    assignedOrgRole: null,
  },
  {
    id: '2', name: 'Kofi Mensah', initials: 'KM',
    currentRole: 'Product Designer', department: 'Design',
    deptIcon: '🎨', deptColor: C.tealLight, avatarBg: 'rgba(15,118,110,0.18)',
    assignedOrgRole: 'manager',
  },
  {
    id: '3', name: 'Zara Williams', initials: 'ZW',
    currentRole: 'Sales Executive', department: 'Sales',
    deptIcon: '📈', deptColor: '#FCD34D', avatarBg: 'rgba(245,158,11,0.18)',
    assignedOrgRole: null,
  },
  {
    id: '4', name: 'Daniel Nwosu', initials: 'DN',
    currentRole: 'HR Business Partner', department: 'HR',
    deptIcon: '🤝', deptColor: '#A78BFA', avatarBg: 'rgba(139,92,246,0.18)',
    assignedOrgRole: 'admin',
  },
  {
    id: '5', name: 'Priya Sharma', initials: 'PS',
    currentRole: 'Backend Engineer', department: 'Engineering',
    deptIcon: '💻', deptColor: '#F87171', avatarBg: 'rgba(239,68,68,0.15)',
    assignedOrgRole: null,
  },
  {
    id: '6', name: 'Chidi Eze', initials: 'CE',
    currentRole: 'UX Researcher', department: 'Design',
    deptIcon: '🎨', deptColor: C.tealLight, avatarBg: 'rgba(15,118,110,0.15)',
    assignedOrgRole: null,
  },
  {
    id: '7', name: 'Fatima Al-Rashid', initials: 'FA',
    currentRole: 'Finance Analyst', department: 'Finance',
    deptIcon: '💰', deptColor: '#FBBF24', avatarBg: 'rgba(251,191,36,0.15)',
    assignedOrgRole: 'cfo',
  },
  {
    id: '8', name: 'Marcus Obi', initials: 'MO',
    currentRole: 'Head of Sales', department: 'Sales',
    deptIcon: '📈', deptColor: '#FCD34D', avatarBg: 'rgba(245,158,11,0.15)',
    assignedOrgRole: null,
  },
];

// ─── Role Picker Modal ────────────────────────────────────────────────────────
function RolePickerModal({
  employee,
  visible,
  onClose,
  onAssign,
  onRevoke,
}: {
  employee: Employee | null;
  visible: boolean;
  onClose: () => void;
  onAssign: (empId: string, roleId: string) => void;
  onRevoke: (empId: string) => void;
}) {
  if (!employee) return null;
  const current = ORG_ROLES.find(r => r.id === employee.assignedOrgRole);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.modalSheet}>
        {/* Handle */}
        <View style={styles.sheetHandle} />

        {/* Employee summary */}
        <View style={styles.sheetEmpRow}>
          <View style={[styles.sheetAvatar, { backgroundColor: employee.avatarBg }]}>
            <Text style={[styles.sheetAvatarText, { color: employee.deptColor }]}>
              {employee.initials}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sheetEmpName}>{employee.name}</Text>
            <Text style={styles.sheetEmpRole}>{employee.currentRole} · {employee.department}</Text>
          </View>
          {current && (
            <View style={[styles.sheetCurrentBadge, { backgroundColor: current.bg, borderColor: current.border }]}>
              <Text style={[styles.sheetCurrentBadgeText, { color: current.color }]}>
                {current.icon} {current.title}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sheetDivider} />

        <Text style={styles.sheetLabel}>ASSIGN ORG ROLE</Text>
        <Text style={styles.sheetSub}>
          This person will gain access to org management tools.
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 12 }}>
          {ORG_ROLES.map(role => {
            const isSelected = employee.assignedOrgRole === role.id;
            return (
              <TouchableOpacity
                key={role.id}
                activeOpacity={0.75}
                style={[
                  styles.roleOption,
                  { borderColor: isSelected ? role.border : C.border },
                  isSelected && { backgroundColor: role.bg },
                ]}
                onPress={() => {
                  onAssign(employee.id, role.id);
                  onClose();
                }}
              >
                <View style={[styles.roleOptionIcon, { backgroundColor: role.bg, borderColor: role.border }]}>
                  <Text style={{ fontSize: 16 }}>{role.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.roleOptionTitleRow}>
                    <Text style={[styles.roleOptionTitle, { color: isSelected ? role.color : C.text }]}>
                      {role.title}
                    </Text>
                    {isSelected && (
                      <View style={[styles.activeChip, { backgroundColor: role.bg, borderColor: role.border }]}>
                        <Text style={[styles.activeChipText, { color: role.color }]}>● Active</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.roleOptionDesc}>{role.description}</Text>
                  <View style={styles.permissionRow}>
                    {role.permissions.map((p, i) => (
                      <View key={i} style={styles.permChip}>
                        <Text style={styles.permChipText}>{p}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Revoke */}
          {employee.assignedOrgRole && (
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.revokeBtn}
              onPress={() => { onRevoke(employee.id); onClose(); }}
            >
              <Text style={styles.revokeBtnText}>Remove org role · revert to employee</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Employee Row ─────────────────────────────────────────────────────────────
function EmployeeRow({
  emp,
  onPress,
}: {
  emp: Employee;
  onPress: () => void;
}) {
  const orgRole = ORG_ROLES.find(r => r.id === emp.assignedOrgRole);

  return (
    <TouchableOpacity activeOpacity={0.75} style={styles.empRow} onPress={onPress}>
      {/* Avatar */}
      <View style={[styles.empAvatar, { backgroundColor: emp.avatarBg }]}>
        <Text style={[styles.empInitials, { color: emp.deptColor }]}>{emp.initials}</Text>
      </View>

      {/* Info */}
      <View style={{ flex: 1 }}>
        <View style={styles.empNameRow}>
          <Text style={styles.empName}>{emp.name}</Text>
          {orgRole && (
            <View style={[styles.orgRolePill, { backgroundColor: orgRole.bg, borderColor: orgRole.border }]}>
              <Text style={styles.orgRolePillIcon}>{orgRole.icon}</Text>
              <Text style={[styles.orgRolePillText, { color: orgRole.color }]}>{orgRole.title}</Text>
            </View>
          )}
        </View>
        <Text style={styles.empJobRole}>{emp.currentRole}</Text>
        <View style={styles.empDeptRow}>
          <Text style={{ fontSize: 10 }}>{emp.deptIcon}</Text>
          <Text style={[styles.empDept, { color: emp.deptColor }]}>{emp.department}</Text>
        </View>
      </View>

      {/* Chevron */}
      <Text style={styles.chevron}>{orgRole ? '✏️' : '＋'}</Text>
    </TouchableOpacity>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function AssignRoleScreen() {
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);
  const [search, setSearch] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterAssigned, setFilterAssigned] = useState<'all' | 'assigned' | 'unassigned'>('all');

  const handleAssign = (empId: string, roleId: string) => {
    setEmployees(prev =>
      prev.map(e => e.id === empId ? { ...e, assignedOrgRole: roleId } : e)
    );
  };

  const handleRevoke = (empId: string) => {
    setEmployees(prev =>
      prev.map(e => e.id === empId ? { ...e, assignedOrgRole: null } : e)
    );
  };

  const filtered = employees.filter(e => {
    const matchSearch =
      search.trim() === '' ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.currentRole.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterAssigned === 'all' ||
      (filterAssigned === 'assigned' && e.assignedOrgRole !== null) ||
      (filterAssigned === 'unassigned' && e.assignedOrgRole === null);
    return matchSearch && matchFilter;
  });

  const assignedCount = employees.filter(e => e.assignedOrgRole !== null).length;

  // Group by org role for the summary strip
  const roleStrip = ORG_ROLES.map(r => ({
    ...r,
    count: employees.filter(e => e.assignedOrgRole === r.id).length,
  })).filter(r => r.count > 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Assign Roles</Text>
          <Text style={styles.headerSub}>
            Promote employees to org leadership · {assignedCount} assigned
          </Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{assignedCount}/{employees.length}</Text>
        </View>
      </View>

      {/* Active roles strip */}
      {roleStrip.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={styles.stripRow}
        >
          {roleStrip.map(r => (
            <View key={r.id} style={[styles.stripChip, { backgroundColor: r.bg, borderColor: r.border }]}>
              <Text style={{ fontSize: 12 }}>{r.icon}</Text>
              <Text style={[styles.stripChipTitle, { color: r.color }]}>{r.title}</Text>
              <View style={[styles.stripCount, { backgroundColor: r.border }]}>
                <Text style={[styles.stripCountText, { color: r.color }]}>{r.count}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={{ fontSize: 13 }}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search employees..."
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
        {(['all', 'assigned', 'unassigned'] as const).map(f => {
          const count =
            f === 'all' ? employees.length :
            f === 'assigned' ? employees.filter(e => e.assignedOrgRole !== null).length :
            employees.filter(e => e.assignedOrgRole === null).length;
          const isActive = filterAssigned === f;
          return (
            <TouchableOpacity
              key={f}
              activeOpacity={0.7}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setFilterAssigned(f)}
            >
              <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
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

      {/* Employee list */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 32 }}>👥</Text>
            <Text style={styles.emptyTitle}>No employees found</Text>
            <Text style={styles.emptySub}>Try a different search or filter</Text>
          </View>
        ) : (
          filtered.map((emp, i) => (
            <React.Fragment key={emp.id}>
              <EmployeeRow
                emp={emp}
                onPress={() => {
                  setSelectedEmp(employees.find(e => e.id === emp.id) || emp);
                  setModalVisible(true);
                }}
              />
              {i < filtered.length - 1 && <View style={styles.rowDivider} />}
            </React.Fragment>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Role Picker Modal */}
      <RolePickerModal
        employee={selectedEmp ? employees.find(e => e.id === selectedEmp.id) || null : null}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAssign={handleAssign}
        onRevoke={handleRevoke}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: C.text,
    letterSpacing: -0.6,
    marginBottom: 3,
  },
  headerSub: { fontSize: 11, color: C.muted2 },
  headerBadge: {
    backgroundColor: 'rgba(15,118,110,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(15,118,110,0.35)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerBadgeText: { fontSize: 13, fontWeight: '800', color: C.tealLight },

  // Strip
  stripRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  stripChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  stripChipTitle: { fontSize: 11, fontWeight: '700' },
  stripCount: {
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  stripCountText: { fontSize: 10, fontWeight: '800' },

  // Search
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginTop: 4,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 13, color: C.text, padding: 0 },

  // Filter
  filterRow: {
    paddingHorizontal: 14,
    paddingTop: 10,
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
  filterTabText: { fontSize: 12, fontWeight: '600', color: C.muted2 },
  filterTabTextActive: { color: C.tealLight },
  filterCount: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  filterCountActive: { backgroundColor: 'rgba(15,118,110,0.25)' },
  filterCountText: { fontSize: 10, fontWeight: '700', color: C.muted },
  filterCountTextActive: { color: C.tealLight },

  // List
  list: { flex: 1 },
  listContent: { paddingTop: 6 },
  rowDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginLeft: 76,
  },

  // Employee row
  empRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  empAvatar: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  empInitials: { fontSize: 15, fontWeight: '900' },
  empNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  empName: { fontSize: 14, fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  empJobRole: { fontSize: 11, color: C.muted2, marginBottom: 4 },
  empDeptRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  empDept: { fontSize: 10, fontWeight: '600' },
  orgRolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  orgRolePillIcon: { fontSize: 10 },
  orgRolePillText: { fontSize: 10, fontWeight: '700' },
  chevron: { fontSize: 14, color: C.muted },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  emptySub: { fontSize: 12, color: C.muted },

  // Modal
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0A1020',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 18,
    paddingTop: 12,
    maxHeight: '85%',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },

  // Sheet employee row
  sheetEmpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  sheetAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sheetAvatarText: { fontSize: 15, fontWeight: '900' },
  sheetEmpName: { fontSize: 15, fontWeight: '800', color: C.text, marginBottom: 2 },
  sheetEmpRole: { fontSize: 11, color: C.muted2 },
  sheetCurrentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  sheetCurrentBadgeText: { fontSize: 11, fontWeight: '700' },
  sheetDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 14,
  },
  sheetLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.muted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  sheetSub: { fontSize: 11, color: 'rgba(255,255,255,0.25)' },

  // Role option
  roleOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderRadius: 16,
    padding: 13,
    marginBottom: 8,
  },
  roleOptionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  roleOptionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  roleOptionTitle: { fontSize: 14, fontWeight: '800' },
  roleOptionDesc: { fontSize: 11, color: C.muted2, marginBottom: 7, lineHeight: 16 },
  activeChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  activeChipText: { fontSize: 9, fontWeight: '700' },
  permissionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  permChip: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  permChipText: { fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: '600' },

  // Revoke
  revokeBtn: {
    marginTop: 4,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: 'rgba(239,68,68,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.18)',
    alignItems: 'center',
  },
  revokeBtnText: { fontSize: 13, fontWeight: '700', color: '#F87171' },
});