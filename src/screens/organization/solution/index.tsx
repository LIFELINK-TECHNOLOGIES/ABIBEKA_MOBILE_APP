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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#04060F',
  surface: '#0F1628',
  surfaceUp: '#141E35',
  border: 'rgba(255,255,255,0.06)',
  borderUp: 'rgba(255,255,255,0.1)',
  text: '#F0F4FF',
  muted: 'rgba(255,255,255,0.25)',
  muted2: 'rgba(255,255,255,0.35)',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
  teal: '#0F766E',
  tealLight: '#5DCAA5',
  purple: '#8B5CF6',
  blue: '#3B82F6',
};

// ─── Types ────────────────────────────────────────────────────────────────────
type IssueTag =
  | 'burnout'
  | 'communication'
  | 'workload'
  | 'culture'
  | 'process'
  | 'wellbeing'
  | 'retention';

type ProposalStatus = 'open' | 'in-progress' | 'adopted' | 'closed';

type Reply = {
  id: string;
  author: string;
  initials: string;
  avatarBg: string;
  authorColor: string;
  orgRole: string | null;
  body: string;
  upvotes: number;
  upvoted: boolean;
  postedAt: string;
};

type Proposal = {
  id: string;
  title: string;
  body: string;
  author: string;
  initials: string;
  avatarBg: string;
  authorColor: string;
  orgRole: string | null;
  department: string;
  tags: IssueTag[];
  status: ProposalStatus;
  upvotes: number;
  upvoted: boolean;
  replies: Reply[];
  postedAt: string;
  pinned?: boolean;
};

// ─── Tag config ───────────────────────────────────────────────────────────────
const TAG_CONFIG: Record<IssueTag, { label: string; color: string; bg: string; border: string }> = {
  burnout:       { label: '🔥 Burnout',       color: '#F87171', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.22)' },
  communication: { label: '💬 Communication', color: '#60A5FA', bg: 'rgba(59,130,246,0.1)',   border: 'rgba(59,130,246,0.22)' },
  workload:      { label: '⚖️ Workload',      color: '#FBBF24', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.22)' },
  culture:       { label: '🌱 Culture',       color: C.tealLight, bg: 'rgba(15,118,110,0.1)', border: 'rgba(15,118,110,0.22)' },
  process:       { label: '⚙️ Process',       color: '#A78BFA', bg: 'rgba(139,92,246,0.1)',   border: 'rgba(139,92,246,0.22)' },
  wellbeing:     { label: '💚 Wellbeing',     color: C.green,   bg: 'rgba(34,197,94,0.1)',    border: 'rgba(34,197,94,0.22)' },
  retention:     { label: '🧲 Retention',     color: '#FB923C', bg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.22)' },
};

const STATUS_CONFIG: Record<ProposalStatus, { label: string; color: string; bg: string; border: string }> = {
  open:        { label: '● Open',        color: C.tealLight, bg: 'rgba(15,118,110,0.12)',  border: 'rgba(15,118,110,0.28)' },
  'in-progress': { label: '◑ In Progress', color: '#FBBF24',   bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)' },
  adopted:     { label: '✓ Adopted',     color: C.green,     bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)' },
  closed:      { label: '✕ Closed',      color: C.muted2,    bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' },
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: '1',
    title: 'Introduce no-meeting Wednesdays for Engineering',
    body: 'Engineering stress has been up 31% this week. One proven lever is protected focus time. I propose we block all of Wednesday from recurring meetings so engineers get a full day of deep work each week.',
    author: 'Kofi Mensah', initials: 'KM', avatarBg: 'rgba(15,118,110,0.2)', authorColor: C.tealLight,
    orgRole: 'Manager', department: 'Design',
    tags: ['burnout', 'workload', 'process'],
    status: 'in-progress',
    upvotes: 24, upvoted: false,
    pinned: true,
    postedAt: '2h ago',
    replies: [
      {
        id: 'r1', author: 'Amara Osei', initials: 'AO', avatarBg: 'rgba(239,68,68,0.18)', authorColor: '#F87171',
        orgRole: null, body: 'Strongly support this. Last Wednesday I had 6 meetings and shipped nothing. A focused day would be a game-changer for the team.', upvotes: 11, upvoted: false, postedAt: '1h ago',
      },
      {
        id: 'r2', author: 'Daniel Nwosu', initials: 'DN', avatarBg: 'rgba(139,92,246,0.18)', authorColor: '#A78BFA',
        orgRole: 'Admin', body: 'HR data backs this up — teams with protected deep work days report 28% lower burnout scores. I can pull the numbers if helpful.', upvotes: 8, upvoted: false, postedAt: '45m ago',
      },
    ],
  },
  {
    id: '2',
    title: 'Monthly anonymous pulse reviews shared org-wide',
    body: 'Right now pulse data is only visible to admins. Making anonymised summaries visible to the whole org creates accountability and trust. People feel heard when they see results acted on.',
    author: 'Zara Williams', initials: 'ZW', avatarBg: 'rgba(245,158,11,0.18)', authorColor: '#FCD34D',
    orgRole: null, department: 'Sales',
    tags: ['culture', 'communication', 'wellbeing'],
    status: 'open',
    upvotes: 17, upvoted: false,
    postedAt: '5h ago',
    replies: [
      {
        id: 'r3', author: 'Fatima Al-Rashid', initials: 'FA', avatarBg: 'rgba(251,191,36,0.15)', authorColor: '#FBBF24',
        orgRole: 'CFO', body: 'From a leadership perspective, I think this is healthy. Transparency tends to improve morale more than any perk. Supportive.', upvotes: 6, upvoted: false, postedAt: '3h ago',
      },
    ],
  },
  {
    id: '3',
    title: 'Peer recognition channel — shout-outs that actually land',
    body: 'Recognition from peers means more than top-down awards. A dedicated space for public shout-outs, tied to org values, would boost morale without adding manager overhead.',
    author: 'Priya Sharma', initials: 'PS', avatarBg: 'rgba(239,68,68,0.15)', authorColor: '#F87171',
    orgRole: null, department: 'Engineering',
    tags: ['culture', 'retention', 'wellbeing'],
    status: 'adopted',
    upvotes: 38, upvoted: true,
    postedAt: '1d ago',
    replies: [
      {
        id: 'r4', author: 'Marcus Obi', initials: 'MO', avatarBg: 'rgba(245,158,11,0.15)', authorColor: '#FCD34D',
        orgRole: null, body: 'Already seeing this used. Sales team has had 12 shout-outs this week alone. Retention risk is visibly down in our dept.', upvotes: 9, upvoted: false, postedAt: '18h ago',
      },
      {
        id: 'r5', author: 'Chidi Eze', initials: 'CE', avatarBg: 'rgba(15,118,110,0.15)', authorColor: C.tealLight,
        orgRole: null, body: 'Design team loves it. One small ask — can we pin the top shout-out of the week to the home screen?', upvotes: 4, upvoted: false, postedAt: '14h ago',
      },
    ],
  },
  {
    id: '4',
    title: 'Flexible start times for parents and caregivers',
    body: 'Several teammates have flagged that rigid 9am starts are causing stress, especially parents doing school runs. A 7am–10am flexible start window with no penalty would reduce absenteeism and improve focus scores.',
    author: 'Daniel Nwosu', initials: 'DN', avatarBg: 'rgba(139,92,246,0.18)', authorColor: '#A78BFA',
    orgRole: 'Admin', department: 'HR',
    tags: ['wellbeing', 'workload', 'retention'],
    status: 'open',
    upvotes: 29, upvoted: false,
    postedAt: '2d ago',
    replies: [],
  },
];

// ─── Compose Modal ────────────────────────────────────────────────────────────
function ComposeModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, body: string, tags: IssueTag[]) => void;
}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTags, setSelectedTags] = useState<IssueTag[]>([]);

  const toggleTag = (tag: IssueTag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const canSubmit = title.trim().length > 5 && body.trim().length > 10;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(title.trim(), body.trim(), selectedTags);
    setTitle(''); setBody(''); setSelectedTags([]);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.composeSheet}
      >
        <View style={styles.sheetHandle} />
        <Text style={styles.composeTitle}>Propose a solution</Text>
        <Text style={styles.composeSub}>Share what you think would help the org.</Text>

        <Text style={styles.composeLabel}>ISSUE TITLE</Text>
        <TextInput
          style={styles.composeInput}
          placeholder="e.g. Reduce recurring meeting load..."
          placeholderTextColor="rgba(255,255,255,0.18)"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        <Text style={[styles.composeLabel, { marginTop: 12 }]}>YOUR PROPOSAL</Text>
        <TextInput
          style={[styles.composeInput, styles.composeTextArea]}
          placeholder="Describe the issue and your proposed solution..."
          placeholderTextColor="rgba(255,255,255,0.18)"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <Text style={[styles.composeLabel, { marginTop: 12 }]}>TAG THE ISSUE</Text>
        <View style={styles.tagGrid}>
          {(Object.keys(TAG_CONFIG) as IssueTag[]).map(tag => {
            const cfg = TAG_CONFIG[tag];
            const active = selectedTags.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                activeOpacity={0.7}
                style={[
                  styles.tagChip,
                  { borderColor: active ? cfg.border : C.border },
                  active && { backgroundColor: cfg.bg },
                ]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[styles.tagChipText, { color: active ? cfg.color : C.muted2 }]}>
                  {cfg.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
        >
          <Text style={[styles.submitBtnText, !canSubmit && { color: C.muted }]}>
            Post proposal
          </Text>
        </TouchableOpacity>
        <View style={{ height: 20 }} />
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Thread Modal ─────────────────────────────────────────────────────────────
function ThreadModal({
  proposal,
  visible,
  onClose,
  onUpvoteProposal,
  onUpvoteReply,
  onPostReply,
  onChangeStatus,
}: {
  proposal: Proposal | null;
  visible: boolean;
  onClose: () => void;
  onUpvoteProposal: (id: string) => void;
  onUpvoteReply: (proposalId: string, replyId: string) => void;
  onPostReply: (proposalId: string, body: string) => void;
  onChangeStatus: (proposalId: string, status: ProposalStatus) => void;
}) {
  const [replyText, setReplyText] = useState('');
  if (!proposal) return null;
  const status = STATUS_CONFIG[proposal.status];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.composeSheet, { maxHeight: '92%' }]}
      >
        <View style={styles.sheetHandle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Status + change row */}
          <View style={styles.threadStatusRow}>
            <View style={[styles.statusBadge, { backgroundColor: status.bg, borderColor: status.border }]}>
              <Text style={[styles.statusBadgeText, { color: status.color }]}>{status.label}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
              <View style={styles.statusChangeRow}>
                {(Object.keys(STATUS_CONFIG) as ProposalStatus[])
                  .filter(s => s !== proposal.status)
                  .map(s => {
                    const sc = STATUS_CONFIG[s];
                    return (
                      <TouchableOpacity
                        key={s}
                        style={[styles.statusChangeChip, { borderColor: sc.border }]}
                        onPress={() => onChangeStatus(proposal.id, s)}
                      >
                        <Text style={[styles.statusChangeText, { color: sc.color }]}>{sc.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </ScrollView>
          </View>

          {/* Title + body */}
          <Text style={styles.threadTitle}>{proposal.title}</Text>
          <View style={styles.threadAuthorRow}>
            <View style={[styles.miniAvatar, { backgroundColor: proposal.avatarBg }]}>
              <Text style={[styles.miniAvatarText, { color: proposal.authorColor }]}>{proposal.initials}</Text>
            </View>
            <Text style={styles.threadAuthor}>{proposal.author}</Text>
            {proposal.orgRole && (
              <View style={styles.orgRoleChip}>
                <Text style={styles.orgRoleChipText}>{proposal.orgRole}</Text>
              </View>
            )}
            <Text style={styles.threadDept}>{proposal.department}</Text>
            <Text style={styles.threadTime}>{proposal.postedAt}</Text>
          </View>
          <Text style={styles.threadBody}>{proposal.body}</Text>

          {/* Tags */}
          <View style={styles.threadTags}>
            {proposal.tags.map(tag => {
              const cfg = TAG_CONFIG[tag];
              return (
                <View key={tag} style={[styles.tagChip, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                  <Text style={[styles.tagChipText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
              );
            })}
          </View>

          {/* Upvote */}
          <TouchableOpacity
            style={[styles.upvoteBtn, proposal.upvoted && styles.upvoteBtnActive]}
            onPress={() => onUpvoteProposal(proposal.id)}
          >
            <Text style={styles.upvoteIcon}>▲</Text>
            <Text style={[styles.upvoteCount, proposal.upvoted && { color: C.tealLight }]}>
              {proposal.upvotes} support this
            </Text>
          </TouchableOpacity>

          {/* Replies */}
          <View style={styles.threadDivider} />
          <Text style={styles.repliesLabel}>
            {proposal.replies.length} {proposal.replies.length === 1 ? 'reply' : 'replies'}
          </Text>

          {proposal.replies.map(reply => (
            <View key={reply.id} style={styles.replyCard}>
              <View style={styles.replyTop}>
                <View style={[styles.miniAvatar, { backgroundColor: reply.avatarBg }]}>
                  <Text style={[styles.miniAvatarText, { color: reply.authorColor }]}>{reply.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.replyAuthorRow}>
                    <Text style={styles.replyAuthor}>{reply.author}</Text>
                    {reply.orgRole && (
                      <View style={styles.orgRoleChip}>
                        <Text style={styles.orgRoleChipText}>{reply.orgRole}</Text>
                      </View>
                    )}
                    <Text style={styles.replyTime}>{reply.postedAt}</Text>
                  </View>
                  <Text style={styles.replyBody}>{reply.body}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.replyUpvote}
                onPress={() => onUpvoteReply(proposal.id, reply.id)}
              >
                <Text style={[styles.replyUpvoteText, reply.upvoted && { color: C.tealLight }]}>
                  ▲ {reply.upvotes}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* Reply input */}
        <View style={styles.replyInputRow}>
          <TextInput
            style={styles.replyInput}
            placeholder="Add your thoughts..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.replyPostBtn, !replyText.trim() && { opacity: 0.4 }]}
            onPress={() => {
              if (!replyText.trim()) return;
              onPostReply(proposal.id, replyText.trim());
              setReplyText('');
            }}
          >
            <Text style={styles.replyPostBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 12 }} />
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Proposal Card ────────────────────────────────────────────────────────────
function ProposalCard({
  proposal,
  onPress,
  onUpvote,
}: {
  proposal: Proposal;
  onPress: () => void;
  onUpvote: (id: string) => void;
}) {
  const status = STATUS_CONFIG[proposal.status];

  return (
    <TouchableOpacity activeOpacity={0.82} style={styles.card} onPress={onPress}>
      {/* Pinned banner */}
      {proposal.pinned && (
        <View style={styles.pinnedBar}>
          <Text style={styles.pinnedText}>📌 Pinned by leadership</Text>
        </View>
      )}

      {/* Author row */}
      <View style={styles.cardAuthorRow}>
        <View style={[styles.miniAvatar, { backgroundColor: proposal.avatarBg }]}>
          <Text style={[styles.miniAvatarText, { color: proposal.authorColor }]}>{proposal.initials}</Text>
        </View>
        <Text style={styles.cardAuthor}>{proposal.author}</Text>
        {proposal.orgRole && (
          <View style={styles.orgRoleChip}>
            <Text style={styles.orgRoleChipText}>{proposal.orgRole}</Text>
          </View>
        )}
        <Text style={styles.cardDept}>· {proposal.department}</Text>
        <View style={{ flex: 1 }} />
        <View style={[styles.statusBadge, { backgroundColor: status.bg, borderColor: status.border }]}>
          <Text style={[styles.statusBadgeText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.cardTitle}>{proposal.title}</Text>

      {/* Body preview */}
      <Text style={styles.cardBodyPreview} numberOfLines={2}>{proposal.body}</Text>

      {/* Tags */}
      <View style={styles.cardTags}>
        {proposal.tags.slice(0, 3).map(tag => {
          const cfg = TAG_CONFIG[tag];
          return (
            <View key={tag} style={[styles.tagChip, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
              <Text style={[styles.tagChipText, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={[styles.upvoteBtn, proposal.upvoted && styles.upvoteBtnActive]}
          onPress={e => { e.stopPropagation?.(); onUpvote(proposal.id); }}
        >
          <Text style={[styles.upvoteIcon, proposal.upvoted && { color: C.tealLight }]}>▲</Text>
          <Text style={[styles.upvoteCount, proposal.upvoted && { color: C.tealLight }]}>
            {proposal.upvotes}
          </Text>
        </TouchableOpacity>
        <View style={styles.cardMeta}>
          <Text style={styles.cardMetaText}>💬 {proposal.replies.length}</Text>
          <Text style={styles.cardMetaText}>{proposal.postedAt}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function SolutionsForumScreen() {
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<IssueTag | 'all'>('all');
  const [activeStatus, setActiveStatus] = useState<ProposalStatus | 'all'>('all');
  const [composeVisible, setComposeVisible] = useState(false);
  const [threadProposalId, setThreadProposalId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'top' | 'new'>('top');

  const threadProposal = proposals.find(p => p.id === threadProposalId) || null;

  const handleUpvoteProposal = (id: string) => {
    setProposals(prev => prev.map(p =>
      p.id === id ? { ...p, upvotes: p.upvoted ? p.upvotes - 1 : p.upvotes + 1, upvoted: !p.upvoted } : p
    ));
  };

  const handleUpvoteReply = (proposalId: string, replyId: string) => {
    setProposals(prev => prev.map(p =>
      p.id !== proposalId ? p : {
        ...p,
        replies: p.replies.map(r =>
          r.id !== replyId ? r : { ...r, upvotes: r.upvoted ? r.upvotes - 1 : r.upvotes + 1, upvoted: !r.upvoted }
        ),
      }
    ));
  };

  const handlePostReply = (proposalId: string, body: string) => {
    const newReply: Reply = {
      id: `r-${Date.now()}`, author: 'You', initials: 'YO',
      avatarBg: 'rgba(15,118,110,0.2)', authorColor: C.tealLight,
      orgRole: null, body, upvotes: 0, upvoted: false, postedAt: 'just now',
    };
    setProposals(prev => prev.map(p =>
      p.id === proposalId ? { ...p, replies: [...p.replies, newReply] } : p
    ));
  };

  const handleChangeStatus = (proposalId: string, status: ProposalStatus) => {
    setProposals(prev => prev.map(p =>
      p.id === proposalId ? { ...p, status } : p
    ));
  };

  const handleNewProposal = (title: string, body: string, tags: IssueTag[]) => {
    const newP: Proposal = {
      id: `p-${Date.now()}`, title, body,
      author: 'You', initials: 'YO',
      avatarBg: 'rgba(15,118,110,0.2)', authorColor: C.tealLight,
      orgRole: null, department: 'Your dept',
      tags, status: 'open',
      upvotes: 0, upvoted: false,
      replies: [], postedAt: 'just now',
    };
    setProposals(prev => [newP, ...prev]);
  };

  let filtered = proposals.filter(p => {
    const matchSearch =
      search.trim() === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.body.toLowerCase().includes(search.toLowerCase());
    const matchTag = activeTag === 'all' || p.tags.includes(activeTag);
    const matchStatus = activeStatus === 'all' || p.status === activeStatus;
    return matchSearch && matchTag && matchStatus;
  });

  if (sortBy === 'top') {
    filtered = [...filtered].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.upvotes - a.upvotes;
    });
  }

  const totalOpen = proposals.filter(p => p.status === 'open' || p.status === 'in-progress').length;

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Solutions Board</Text>
          <Text style={styles.headerSub}>{totalOpen} active · propose, discuss, act</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.composeBtn}
          onPress={() => setComposeVisible(true)}
        >
          <Text style={styles.composeBtnText}>＋ Propose</Text>
        </TouchableOpacity>
      </View>

      {/* Stats strip */}
      <View style={styles.statsStrip}>
        {([
          { label: 'Proposed', val: proposals.length, color: C.tealLight },
          { label: 'In Progress', val: proposals.filter(p => p.status === 'in-progress').length, color: '#FBBF24' },
          { label: 'Adopted', val: proposals.filter(p => p.status === 'adopted').length, color: C.green },
          { label: 'Replies', val: proposals.reduce((a, p) => a + p.replies.length, 0), color: '#60A5FA' },
        ] as { label: string; val: number; color: string }[]).map((s, i) => (
          <View key={i} style={styles.statItem}>
            <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Search + sort */}
      <View style={styles.searchRow}>
        <View style={styles.searchWrapper}>
          <Text style={{ fontSize: 12 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search proposals..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={styles.sortToggle}>
          {(['top', 'new'] as const).map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.sortBtn, sortBy === s && styles.sortBtnActive]}
              onPress={() => setSortBy(s)}
            >
              <Text style={[styles.sortBtnText, sortBy === s && styles.sortBtnTextActive]}>
                {s === 'top' ? '▲ Top' : '🕐 New'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tag filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.tagFilterRow}
      >
        <TouchableOpacity
          style={[styles.tagFilterChip, activeTag === 'all' && styles.tagFilterChipActive]}
          onPress={() => setActiveTag('all')}
        >
          <Text style={[styles.tagFilterText, activeTag === 'all' && { color: C.tealLight }]}>All topics</Text>
        </TouchableOpacity>
        {(Object.keys(TAG_CONFIG) as IssueTag[]).map(tag => {
          const cfg = TAG_CONFIG[tag];
          const isActive = activeTag === tag;
          return (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagFilterChip,
                { borderColor: isActive ? cfg.border : C.border },
                isActive && { backgroundColor: cfg.bg },
              ]}
              onPress={() => setActiveTag(isActive ? 'all' : tag)}
            >
              <Text style={[styles.tagFilterText, { color: isActive ? cfg.color : C.muted2 }]}>
                {cfg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Status filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.statusFilterRow}
      >
        <TouchableOpacity
          style={[styles.tagFilterChip, activeStatus === 'all' && styles.tagFilterChipActive]}
          onPress={() => setActiveStatus('all')}
        >
          <Text style={[styles.tagFilterText, activeStatus === 'all' && { color: C.tealLight }]}>All statuses</Text>
        </TouchableOpacity>
        {(Object.keys(STATUS_CONFIG) as ProposalStatus[]).map(s => {
          const sc = STATUS_CONFIG[s];
          const isActive = activeStatus === s;
          return (
            <TouchableOpacity
              key={s}
              style={[
                styles.tagFilterChip,
                { borderColor: isActive ? sc.border : C.border },
                isActive && { backgroundColor: sc.bg },
              ]}
              onPress={() => setActiveStatus(isActive ? 'all' : s)}
            >
              <Text style={[styles.tagFilterText, { color: isActive ? sc.color : C.muted2 }]}>
                {sc.label}
              </Text>
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
            <Text style={{ fontSize: 32 }}>📭</Text>
            <Text style={styles.emptyTitle}>No proposals found</Text>
            <Text style={styles.emptySub}>Be the first to propose a solution</Text>
          </View>
        ) : (
          filtered.map(p => (
            <ProposalCard
              key={p.id}
              proposal={p}
              onPress={() => setThreadProposalId(p.id)}
              onUpvote={handleUpvoteProposal}
            />
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Compose modal */}
      <ComposeModal
        visible={composeVisible}
        onClose={() => setComposeVisible(false)}
        onSubmit={handleNewProposal}
      />

      {/* Thread modal */}
      <ThreadModal
        proposal={threadProposal}
        visible={!!threadProposalId}
        onClose={() => setThreadProposalId(null)}
        onUpvoteProposal={handleUpvoteProposal}
        onUpvoteReply={handleUpvoteReply}
        onPostReply={handlePostReply}
        onChangeStatus={handleChangeStatus}
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
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: '900', color: C.text, letterSpacing: -0.6, marginBottom: 3 },
  headerSub: { fontSize: 11, color: C.muted2 },
  composeBtn: {
    backgroundColor: 'rgba(15,118,110,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(15,118,110,0.4)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  composeBtnText: { fontSize: 13, fontWeight: '800', color: C.tealLight },

  // Stats strip
  statsStrip: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  statLabel: { fontSize: 9, fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Search
  searchRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, marginTop: 10 },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 7,
  },
  searchInput: { flex: 1, fontSize: 12, color: C.text, padding: 0 },
  sortToggle: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sortBtn: { paddingHorizontal: 10, paddingVertical: 9 },
  sortBtnActive: { backgroundColor: 'rgba(15,118,110,0.2)' },
  sortBtnText: { fontSize: 11, fontWeight: '700', color: C.muted },
  sortBtnTextActive: { color: C.tealLight },

  // Tag / status filter rows
  tagFilterRow: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 2,
    gap: 6,
  },
  statusFilterRow: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 6,
    gap: 6,
  },
  tagFilterChip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  tagFilterChipActive: {
    backgroundColor: 'rgba(15,118,110,0.15)',
    borderColor: 'rgba(15,118,110,0.35)',
  },
  tagFilterText: { fontSize: 11, fontWeight: '600', color: C.muted2 },

  // List
  list: { flex: 1 },
  listContent: { paddingHorizontal: 14, paddingTop: 6 },

  // Card
  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    overflow: 'hidden',
  },
  pinnedBar: {
    backgroundColor: 'rgba(251,191,36,0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(251,191,36,0.15)',
    marginHorizontal: -14,
    marginTop: -14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 12,
  },
  pinnedText: { fontSize: 10, fontWeight: '700', color: '#FBBF24' },
  cardAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  cardAuthor: { fontSize: 11, fontWeight: '700', color: C.text },
  cardDept: { fontSize: 10, color: C.muted },
  cardTitle: { fontSize: 14, fontWeight: '900', color: C.text, letterSpacing: -0.3, marginBottom: 6, lineHeight: 20 },
  cardBodyPreview: { fontSize: 12, color: C.muted2, lineHeight: 18, marginBottom: 10 },
  cardTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardMeta: { flexDirection: 'row', gap: 10 },
  cardMetaText: { fontSize: 11, color: C.muted },

  // Status badge (used in cards + thread)
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBadgeText: { fontSize: 10, fontWeight: '700' },

  // Upvote
  upvoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  upvoteBtnActive: {
    backgroundColor: 'rgba(15,118,110,0.14)',
    borderColor: 'rgba(15,118,110,0.3)',
  },
  upvoteIcon: { fontSize: 10, color: C.muted },
  upvoteCount: { fontSize: 12, fontWeight: '700', color: C.muted2 },

  // Tag chip (shared across compose + cards)
  tagChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: 'transparent',
  },
  tagChipText: { fontSize: 10, fontWeight: '700' },

  // Avatar shared
  miniAvatar: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  miniAvatarText: { fontSize: 9, fontWeight: '900' },

  // Org role chip
  orgRoleChip: {
    backgroundColor: 'rgba(99,102,241,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.25)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  orgRoleChipText: { fontSize: 9, fontWeight: '700', color: '#818CF8' },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  emptySub: { fontSize: 12, color: C.muted },

  // Modal overlay
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },

  // Compose sheet
  composeSheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#0A1020',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 18,
    paddingTop: 12,
    maxHeight: '88%',
  },
  sheetHandle: {
    width: 36, height: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  composeTitle: { fontSize: 18, fontWeight: '900', color: C.text, marginBottom: 4 },
  composeSub: { fontSize: 11, color: C.muted2, marginBottom: 16 },
  composeLabel: {
    fontSize: 9, fontWeight: '700', color: C.muted,
    letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 6,
  },
  composeInput: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 13,
    color: C.text,
  },
  composeTextArea: { height: 100, textAlignVertical: 'top' },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 16 },
  submitBtn: {
    backgroundColor: 'rgba(15,118,110,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(15,118,110,0.4)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: C.border },
  submitBtnText: { fontSize: 14, fontWeight: '800', color: C.tealLight },

  // Thread modal
  threadStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  statusChangeRow: { flexDirection: 'row', gap: 6 },
  statusChangeChip: {
    paddingHorizontal: 9, paddingVertical: 4,
    borderRadius: 8, borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  statusChangeText: { fontSize: 10, fontWeight: '700' },
  threadTitle: { fontSize: 17, fontWeight: '900', color: C.text, letterSpacing: -0.4, marginBottom: 8, lineHeight: 24 },
  threadAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  threadAuthor: { fontSize: 11, fontWeight: '700', color: C.text },
  threadDept: { fontSize: 10, color: C.muted },
  threadTime: { fontSize: 10, color: C.muted, marginLeft: 'auto' },
  threadBody: { fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 21, marginBottom: 12 },
  threadTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 12 },
  threadDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 14 },
  repliesLabel: { fontSize: 10, fontWeight: '700', color: C.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 },

  // Reply
  replyCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 11,
    marginBottom: 8,
  },
  replyTop: { flexDirection: 'row', gap: 9, marginBottom: 6 },
  replyAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  replyAuthor: { fontSize: 11, fontWeight: '700', color: C.text },
  replyTime: { fontSize: 10, color: C.muted, marginLeft: 'auto' },
  replyBody: { fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 18 },
  replyUpvote: { alignSelf: 'flex-end', marginTop: 4 },
  replyUpvoteText: { fontSize: 11, fontWeight: '700', color: C.muted },

  // Reply input
  replyInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 10,
  },
  replyInput: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: C.text,
    maxHeight: 80,
  },
  replyPostBtn: {
    width: 40, height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(15,118,110,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(15,118,110,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyPostBtnText: { fontSize: 18, color: C.tealLight, fontWeight: '700' },
});