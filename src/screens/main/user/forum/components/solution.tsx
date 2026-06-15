import React, { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  B,
  ORG,
  SOL_TAG,
  SOL_STATUS,
  PODIUM_COLORS,
} from '../constants/constant';
import type { Solution, SolutionTag, SolutionStatus } from '../constants/constant';

// ─── Solutions: Vote bar ──────────────────────────────────────────────────────
const SolutionVoteBar = ({
  solution,
  onVote,
}: {
  solution: Solution;
  onVote: (id: string, dir: 'up' | 'down') => void;
}) => {
  const { t } = useTranslation();
  const upScale = useRef(new Animated.Value(1)).current;
  const downScale = useRef(new Animated.Value(1)).current;

  const vote = (dir: 'up' | 'down') => {
    const a = dir === 'up' ? upScale : downScale;
    Animated.sequence([
      Animated.spring(a, { toValue: 1.4, tension: 300, friction: 7, useNativeDriver: true }),
      Animated.spring(a, { toValue: 1, tension: 300, friction: 7, useNativeDriver: true }),
    ]).start(() => onVote(solution.id, dir));
  };

  const total = solution.upvotes + solution.downvotes;
  const upPct = total > 0 ? (solution.upvotes / total) * 100 : 50;
  const upActive = solution.userVote === 'up';
  const downActive = solution.userVote === 'down';

  return (
    <View style={s.solVoteWrap}>
      <View style={s.splitBarTrack}>
        <View style={[s.splitBarUp, { width: `${upPct}%` as any }]} />
        <View style={[s.splitBarDown, { width: `${100 - upPct}%` as any }]} />
      </View>
      <View style={s.solVoteRow}>
        <Animated.View style={{ transform: [{ scale: upScale }] }}>
          <Pressable
            onPress={() => vote('up')}
            style={[s.solVoteBtn, upActive && s.solVoteBtnUpActive]}
          >
            <Text style={{ fontSize: 14 }}>👍</Text>
            <Text style={[s.solVoteNum, upActive && { color: B.purpleLight }]}>
              {solution.upvotes}
            </Text>
          </Pressable>
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: downScale }] }}>
          <Pressable
            onPress={() => vote('down')}
            style={[s.solVoteBtn, downActive && s.solVoteBtnDownActive]}
          >
            <Text style={{ fontSize: 14 }}>👎</Text>
            <Text style={[s.solVoteNum, downActive && { color: B.red }]}>
              {solution.downvotes}
            </Text>
          </Pressable>
        </Animated.View>
        <View style={{ flex: 1 }} />
        <View style={s.approvalPill}>
          <Text style={s.approvalPct}>{Math.round(upPct)}%</Text>
          <Text style={s.approvalLabel}> {t('forum.approval')}</Text>
        </View>
      </View>
    </View>
  );
};

// ─── Solutions: Card ──────────────────────────────────────────────────────────
const SolutionCard = ({
  solution,
  onVote,
}: {
  solution: Solution;
  onVote: (id: string, dir: 'up' | 'down') => void;
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const status = SOL_STATUS[solution.status];
  const accentColor = solution.tags[0] ? SOL_TAG[solution.tags[0]].color : B.purpleLight;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[
        s.solCard,
        { borderLeftColor: accentColor + '80' },
        solution.pinned && s.solCardPinned,
      ]}
      onPress={() => setExpanded((e) => !e)}
    >
      {solution.pinned && (
        <View style={s.pinnedBar}>
          <Text style={s.pinnedText}>{t('forum.pinnedOfficial')}</Text>
        </View>
      )}

      <View style={s.solCardTop}>
        <View
          style={[
            s.solAuthorIcon,
            { backgroundColor: accentColor + '18', borderColor: accentColor + '35' },
          ]}
        >
          <Text style={{ fontSize: 14 }}>{solution.authorIcon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.solAuthorLabel}>{solution.authorLabel}</Text>
        </View>
        <Text style={s.solTime}>{solution.postedAt}</Text>
        <View
          style={[
            s.solStatusBadge,
            { backgroundColor: status.bg, borderColor: status.border },
          ]}
        >
          <Text style={[s.solStatusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <Text style={s.solTitle}>{solution.title}</Text>
      <Text style={s.solBody} numberOfLines={expanded ? undefined : 2}>
        {solution.body}
      </Text>
      <Text style={[s.expandToggle, { color: accentColor }]}>
        {expanded ? t('forum.showLess') : t('forum.readMore')}
      </Text>

      <View style={s.solTags}>
        {solution.tags.map((tag) => {
          const cfg = SOL_TAG[tag];
          return (
            <View
              key={tag}
              style={[s.solTagChip, { backgroundColor: cfg.bg, borderColor: cfg.color + '30' }]}
            >
              <Text style={[s.solTagText, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
          );
        })}
      </View>

      <SolutionVoteBar solution={solution} onVote={onVote} />
    </TouchableOpacity>
  );
};

// ─── Solutions: Leaderboard / Podium ─────────────────────────────────────────
const Leaderboard = ({ solutions }: { solutions: Solution[] }) => {
  const { t } = useTranslation();
  const top3 = solutions
    .filter((s) => s.weekLabel === 'This week')
    .sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes))
    .slice(0, 3);

  if (top3.length === 0) return null;

  const order = top3.length === 3 ? [1, 0, 2] : top3.map((_, i) => i);

  return (
    <View style={s.lbWrap}>
      <View style={s.lbGlowTop} />

      <View style={s.lbHeader}>
        <View style={s.lbHeaderIconWrap}>
          <Text style={s.lbHeaderEmoji}>🏆</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.lbHeaderTitle}>{t('forum.weekChampions')}</Text>
          <Text style={s.lbHeaderSub}>{t('forum.rankedByApproval')}</Text>
        </View>
      </View>

      <View style={s.podiumRow}>
        {order.map((idx) => {
          const sol = top3[idx];
          if (!sol) return <View key={idx} style={{ flex: 1 }} />;
          const pd = PODIUM_COLORS[idx];
          const total = sol.upvotes + sol.downvotes;
          const pct = total > 0 ? Math.round((sol.upvotes / total) * 100) : 0;
          const isFirst = idx === 0;
          return (
            <View
              key={sol.id}
              style={[
                s.podiumCard,
                { borderColor: pd.border, backgroundColor: pd.bg },
                isFirst && s.podiumCardFirst,
                isFirst && {
                  shadowColor: pd.color,
                  shadowOpacity: 0.5,
                  shadowRadius: 14,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 10,
                },
              ]}
            >
              <View style={s.podiumTop}>
                <Text style={[s.podiumMedal, isFirst && { fontSize: 28 }]}>{pd.medal}</Text>
                <Text style={[s.podiumRankLabel, { color: pd.color }]}>
                  {t(`forum.medals.${pd.labelKey}`)}
                </Text>
              </View>
              <Text style={[s.podiumPct, { color: pd.color }, isFirst && { fontSize: 30 }]}>
                {pct}
                <Text style={s.podiumPctSuffix}>%</Text>
              </Text>
              <Text style={s.podiumApproval}>{t('forum.approval')}</Text>
              <View style={s.podiumBarTrack}>
                <View
                  style={[
                    s.podiumBarFill,
                    { width: `${pct}%` as any, backgroundColor: pd.color },
                  ]}
                />
              </View>
              <Text style={s.podiumTitle} numberOfLines={3}>
                {sol.title}
              </Text>
              <Text style={[s.podiumAuthor, { color: pd.color }]}>{sol.authorLabel}</Text>
              <View style={s.podiumVotes}>
                <Text style={s.podiumVoteNum}>👍 {sol.upvotes}</Text>
                <Text style={s.podiumVoteNum}>👎 {sol.downvotes}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// ─── Solutions: New solution sheet ───────────────────────────────────────────
export const NewSolutionSheet = ({
  visible,
  onClose,
  onPost,
}: {
  visible: boolean;
  onClose: () => void;
  onPost: (title: string, body: string, tags: SolutionTag[]) => void;
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTags, setSelectedTags] = useState<SolutionTag[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<SolutionStatus>('open');
  const slide = useRef(new Animated.Value(700)).current;
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.spring(slide, { toValue: 0, tension: 55, friction: 13, useNativeDriver: true }).start();
    } else {
      Animated.spring(slide, { toValue: 700, tension: 55, friction: 13, useNativeDriver: true }).start(
        () => { setMounted(false); setTitle(''); setBody(''); setSelectedTags([]); },
      );
    }
  }, [visible]);

  if (!mounted) return null;

  const canSubmit = title.trim().length > 5 && body.trim().length > 20;

  const submit = () => {
    if (!canSubmit) return;
    onPost(title.trim(), body.trim(), selectedTags);
    onClose();
  };

  return (
    <Animated.View style={[s.sheet, { transform: [{ translateY: slide }] }]}>
      <View style={s.sheetHandle} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={s.sheetHeaderRow}>
            <View
              style={[
                s.sheetAvatarWrap,
                { backgroundColor: B.purple + '20', borderColor: B.purple + '30' },
              ]}
            >
              <Text style={{ fontSize: 18 }}>📋</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.sheetTitle}>{t('forum.postSolution')}</Text>
              <Text style={s.sheetSub}>{t('forum.visibleSignedAs', { org: ORG.name })}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={{ fontSize: 20, color: B.muted }}>✕</Text>
            </Pressable>
          </View>

          <Text style={s.fieldLabel}>{t('forum.titleLabel')}</Text>
          <View style={s.textWrap}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={t('forum.titlePlaceholder')}
              placeholderTextColor={B.muted2}
              style={[s.textInput, { minHeight: 0 }]}
              maxLength={100}
            />
          </View>

          <Text style={[s.fieldLabel, { marginTop: 12 }]}>{t('forum.solutionDetails')}</Text>
          <View style={s.textWrap}>
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder={t('forum.bodyPlaceholder')}
              placeholderTextColor={B.muted2}
              multiline
              numberOfLines={6}
              style={s.textInput}
              maxLength={600}
              textAlignVertical="top"
            />
            <Text style={[s.charCount, { color: body.length > 560 ? B.red : B.muted2 }]}>
              {600 - body.length}
            </Text>
          </View>

          <Text style={[s.fieldLabel, { marginTop: 12 }]}>{t('forum.tagIssues')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
            {(Object.keys(SOL_TAG) as SolutionTag[]).map((tag) => {
              const cfg = SOL_TAG[tag];
              const active = selectedTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  onPress={() =>
                    setSelectedTags((prev) =>
                      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
                    )
                  }
                  style={[s.tagChip, active && { borderColor: cfg.color, backgroundColor: cfg.bg }]}
                >
                  <Text style={[s.tagChipText, active && { color: cfg.color, fontWeight: '700' }]}>
                    {cfg.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[s.fieldLabel, { marginTop: 4 }]}>{t('forum.statusLabel')}</Text>
          <View style={{ flexDirection: 'row', gap: 7, marginBottom: 20 }}>
            {(Object.keys(SOL_STATUS) as SolutionStatus[]).map((st) => {
              const cfg = SOL_STATUS[st];
              const active = selectedStatus === st;
              return (
                <Pressable
                  key={st}
                  onPress={() => setSelectedStatus(st)}
                  style={[
                    s.tagChip,
                    active && { borderColor: cfg.border, backgroundColor: cfg.bg },
                  ]}
                >
                  <Text
                    style={[s.tagChipText, active && { color: cfg.color, fontWeight: '700' }]}
                  >
                    {cfg.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={submit}
            activeOpacity={0.88}
            style={[
              s.postBtn,
              { backgroundColor: B.purple, shadowColor: B.purple },
              !canSubmit && { opacity: 0.35 },
            ]}
          >
            <Text style={s.postBtnText}>{t('forum.postSolutionBtn')}</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

// ─── Solutions tab ────────────────────────────────────────────────────────────
export const SolutionsTab = ({
  solutions,
  onVote,
  isOrganization,
  onNewSolution,
}: {
  solutions: Solution[];
  onVote: (id: string, dir: 'up' | 'down') => void;
  isOrganization: boolean;
  onNewSolution: () => void;
}) => {
  const { t } = useTranslation();
  const thisWeek = solutions.filter((s) => s.weekLabel === 'This week');
  const lastWeek = solutions.filter((s) => s.weekLabel === 'Last week');

  return (
    <View style={{ flex: 1 }}>
      <View style={s.solHero}>
        <View style={s.solHeroGlow} />
        <View style={s.solHeroIconWrap}>
          <Text style={{ fontSize: 22 }}>✦</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.solHeroTitle}>{t('forum.officialSolutions')}</Text>
          <Text style={s.solHeroSub}>
            {isOrganization
              ? t('forum.heroSubOrg')
              : t('forum.heroSubUser', { org: ORG.name })}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {!isOrganization && (
          <View style={s.readOnlyBanner}>
            <Text style={{ fontSize: 14 }}>👁️</Text>
            <Text style={s.readOnlyText}>
              {t('forum.readOnlyHint', { org: ORG.name })}
            </Text>
          </View>
        )}

        <Leaderboard solutions={solutions} />

        {thisWeek.length > 0 && (
          <>
            <View style={s.weekLabel}>
              <View style={[s.weekDot, { backgroundColor: B.purpleLight }]} />
              <Text style={[s.weekLabelText, { color: B.purpleLight }]}>
                {t('forum.thisWeekSolutions', { count: thisWeek.length })}
              </Text>
            </View>
            {thisWeek
              .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
              .map((sol) => (
                <SolutionCard key={sol.id} solution={sol} onVote={onVote} />
              ))}
          </>
        )}

        {lastWeek.length > 0 && (
          <>
            <View style={[s.weekLabel, { marginTop: 6 }]}>
              <View style={[s.weekDot, { backgroundColor: B.muted }]} />
              <Text style={[s.weekLabelText, { color: B.muted }]}>
                {t('forum.lastWeekSolutions', { count: lastWeek.length })}
              </Text>
            </View>
            {lastWeek.map((sol) => (
              <SolutionCard key={sol.id} solution={sol} onVote={onVote} />
            ))}
          </>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {isOrganization && (
        <Pressable
          onPress={onNewSolution}
          style={[s.fab, { backgroundColor: B.purple, shadowColor: B.purple }]}
        >
          <Text style={{ fontSize: 20, color: '#fff' }}>📋</Text>
        </Pressable>
      )}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Solution vote bar
  solVoteWrap: { gap: 8 },
  splitBarTrack: {
    flexDirection: 'row',
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  splitBarUp: { height: 5, backgroundColor: B.purpleLight },
  splitBarDown: { height: 5, backgroundColor: B.red },
  solVoteRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  solVoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  solVoteBtnUpActive: { backgroundColor: B.purple + '14', borderColor: B.purple + '40' },
  solVoteBtnDownActive: { backgroundColor: B.red + '14', borderColor: B.red + '40' },
  solVoteNum: { fontSize: 13, color: B.muted, fontWeight: '600' },
  approvalPill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(139,92,246,0.1)',
  },
  approvalPct: { fontSize: 13, fontWeight: '900', color: B.purpleLight },
  approvalLabel: { fontSize: 10, color: B.muted, fontWeight: '600' },

  // Solution card
  solCard: {
    marginHorizontal: 14,
    marginBottom: 10,
    backgroundColor: B.surface,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderColor: B.border,
    borderRadius: 18,
    padding: 14,
    overflow: 'hidden',
  },
  solCardPinned: { borderColor: 'rgba(251,191,36,0.25)' },
  pinnedBar: {
    backgroundColor: 'rgba(251,191,36,0.07)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(251,191,36,0.15)',
    marginHorizontal: -14,
    marginTop: -14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 12,
  },
  pinnedText: { fontSize: 10, fontWeight: '700', color: '#FBBF24' },
  solCardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  solAuthorIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: B.primary + '18',
    borderWidth: 1,
    borderColor: B.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  solAuthorLabel: { fontSize: 11, fontWeight: '700', color: B.muted },
  solStatusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  solStatusText: { fontSize: 10, fontWeight: '700' },
  solTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: B.text,
    letterSpacing: -0.3,
    marginBottom: 6,
    lineHeight: 20,
  },
  solBody: { fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 20, marginBottom: 6 },
  expandToggle: { fontSize: 11, fontWeight: '700', marginBottom: 10 },
  solTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 5,
    marginBottom: 12,
  },
  solTagChip: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  solTagText: { fontSize: 10, fontWeight: '700' },
  solTime: { fontSize: 10, color: B.muted, marginRight: 6 },

  // Leaderboard
  lbWrap: {
    marginHorizontal: 14,
    marginTop: 14,
    marginBottom: 4,
    backgroundColor: B.surface,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.18)',
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
  },
  lbGlowTop: {
    position: 'absolute',
    top: -60,
    left: '50%',
    marginLeft: -90,
    width: 180,
    height: 120,
    borderRadius: 90,
    backgroundColor: 'rgba(251,191,36,0.06)',
  },
  lbHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  lbHeaderIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(251,191,36,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lbHeaderEmoji: { fontSize: 17 },
  lbHeaderTitle: { fontSize: 14, fontWeight: '900', color: B.text, marginBottom: 2 },
  lbHeaderSub: { fontSize: 10, color: B.muted },
  podiumRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  podiumCard: { flex: 1, borderWidth: 1, borderRadius: 16, padding: 10, alignItems: 'center' },
  podiumCardFirst: { paddingTop: 14, paddingBottom: 14, transform: [{ translateY: -8 }] },
  podiumTop: { alignItems: 'center', marginBottom: 6 },
  podiumMedal: { fontSize: 22, marginBottom: 2 },
  podiumRankLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  podiumPct: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },
  podiumPctSuffix: { fontSize: 13, fontWeight: '800' },
  podiumApproval: {
    fontSize: 9,
    color: B.muted,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  podiumBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  podiumBarFill: { height: 4, borderRadius: 2 },
  podiumTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: B.text,
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 4,
    minHeight: 45,
  },
  podiumAuthor: { fontSize: 9, fontWeight: '700', marginBottom: 8 },
  podiumVotes: { flexDirection: 'row', gap: 8 },
  podiumVoteNum: { fontSize: 9, color: B.muted, fontWeight: '700' },

  // Week labels
  weekLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 14,
    marginTop: 18,
    marginBottom: 8,
  },
  weekDot: { width: 6, height: 6, borderRadius: 3 },
  weekLabelText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },

  // Solutions hero
  solHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 14,
    marginTop: 14,
    marginBottom: 4,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(139,92,246,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
    overflow: 'hidden',
  },
  solHeroGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(139,92,246,0.18)',
  },
  solHeroIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(139,92,246,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  solHeroTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  solHeroSub: { fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 16 },

  // Read-only banner
  readOnlyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 0,
    backgroundColor: 'rgba(139,92,246,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.18)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  readOnlyText: { flex: 1, fontSize: 12, color: B.purpleLight, lineHeight: 17 },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    shadowRadius: 16,
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  // Sheet
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#080D1A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: B.border,
    padding: 20,
    zIndex: 9999,
    maxHeight: '88%',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  sheetAvatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: B.primary + '20',
    borderWidth: 1,
    borderColor: B.primary + '28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: { fontSize: 15, fontWeight: '800', color: B.text },
  sheetSub: { fontSize: 11, color: B.muted, marginTop: 2 },
  textWrap: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: B.border,
    padding: 14,
    marginBottom: 18,
  },
  textInput: { fontSize: 15, color: B.text, minHeight: 80, lineHeight: 23 },
  charCount: { fontSize: 11, fontWeight: '700', textAlign: 'right', marginTop: 6 },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: B.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  tagChipText: { fontSize: 12, color: B.muted },
  postBtn: {
    height: 52,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 14,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
  },
  postBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});