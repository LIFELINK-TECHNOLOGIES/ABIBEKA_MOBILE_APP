// ─── Tokens ───────────────────────────────────────────────────────────────────
export const B = {
  bg: '#04060F',
  surface: '#0F1628',
  surfaceRaised: '#141E35',
  border: 'rgba(255,255,255,0.06)',
  text: '#F0F4FF',
  muted: 'rgba(255,255,255,0.28)',
  muted2: 'rgba(255,255,255,0.18)',
  primary: '#0F766E',
  accent: '#5DCAA5',
  amber: '#F59E0B',
  red: '#EF4444',
  green: '#22C55E',
  purple: '#8B5CF6',
  purpleLight: '#A78BFA',
  blue: '#3B82F6',
};

// ─── Org config ───────────────────────────────────────────────────────────────
export const ORG = {
  name: 'Acme Corp',
  icon: '🏢',
  description: 'A space to speak freely and find solutions together.',
  address: '14 Innovation Drive, Lagos, NG',
  activeToday: 31,
};

// ─── Mood tags ────────────────────────────────────────────────────────────────
export const MOOD_TAGS = [
  { label: 'Burnout',  color: '#FBBF24' },
  { label: 'Motivated', color: '#F87171' },
  { label: 'Overwhelmed',        color: '#818CF8' },
  { label: 'Stressed',       color: B.accent },
  { label: 'Anxious',      color: B.green },
  { label: 'Grateful',    color: '#FB923C' },
  { label: 'Productive',    color: '#EF4444' },
  { label: 'Tired',  color: '#34D399' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
export type Post = {
  id: string;
  avatar: string;
  content: string;
  moodTag: string;
  tagColor: string;
  upvotes: number;
  downvotes: number;
  date: string;
  time: string;
  userVote: 'up' | 'down' | null;
  trending: boolean;
};

// ⚠️ These must match SOLUTION_TAGS / SOLUTION_STATUSES exported from the
// Solution mongoose model EXACTLY (same casing, same word breaks, same
// underscores/hyphens). A mismatch here is a silent runtime crash, not a
// type error, because SOL_TAG[tag] / SOL_STATUS[status] is a plain object
// lookup that just returns `undefined` for an unknown key.
export type SolutionTag =
  | 'Burnout'
  | 'Workload'
  | 'Stress Management'
  | 'Mental Health'
  | 'Work-Life Balance'
  | 'Career Growth'
  | 'Compensation'
  | 'Team Culture'
  | 'Communication'
  | 'Management Support';

export type SolutionStatus = 'Open' | 'In_progress' | 'Adopted';

export type Solution = {
  id: string;
  title: string;
  body: string;
  authorLabel: string;
  authorIcon: string;
  tags: SolutionTag[];
  status: SolutionStatus;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  postedAt: string;
  weekLabel: string;
  pinned?: boolean;
};

// ─── Config maps ──────────────────────────────────────────────────────────────
export const SOL_TAG: Record<SolutionTag, { label: string; color: string; bg: string }> = {
  Burnout:             { label: '🔥 Burnout',             color: '#F87171',     bg: 'rgba(248,113,113,0.1)' },
  Workload:            { label: '⚖️ Workload',            color: '#FBBF24',     bg: 'rgba(251,191,36,0.1)' },
  'Stress Management': { label: '🧘 Stress Management',   color: B.accent,      bg: 'rgba(93,202,165,0.1)' },
  'Mental Health':      { label: '💚 Mental Health',       color: B.green,       bg: 'rgba(34,197,94,0.1)' },
  'Work-Life Balance': { label: '🌗 Work-Life Balance',   color: '#38BDF8',     bg: 'rgba(56,189,248,0.1)' },
  'Career Growth':      { label: '📈 Career Growth',       color: B.purpleLight, bg: 'rgba(167,139,250,0.1)' },
  Compensation:        { label: '💰 Compensation',        color: '#34D399',     bg: 'rgba(52,211,153,0.1)' },
  'Team Culture':       { label: '🌱 Team Culture',        color: B.purple,      bg: 'rgba(139,92,246,0.1)' },
  Communication:       { label: '💬 Communication',       color: '#60A5FA',     bg: 'rgba(96,165,250,0.1)' },
  'Management Support': { label: '🤝 Management Support',  color: '#FB923C',     bg: 'rgba(251,146,60,0.1)' },
};

export const SOL_STATUS: Record<SolutionStatus, { label: string; color: string; bg: string; border: string }> = {
  Open:         { label: '● Open',        color: B.purpleLight, bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.28)' },
  In_progress:  { label: '◑ In Progress', color: '#FBBF24',     bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)' },
  Adopted:      { label: '✓ Adopted',     color: B.green,       bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)' },
};

export const PODIUM_COLORS = [
  { medal: '🥇', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.4)',  labelKey: 'gold' },
  { medal: '🥈', color: '#CBD5E1', bg: 'rgba(203,213,225,0.07)', border: 'rgba(203,213,225,0.25)', labelKey: 'silver' },
  { medal: '🥉', color: '#FB923C', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.28)', labelKey: 'bronze' },
];

// ─── Mock data ────────────────────────────────────────────────────────────────
export const INITIAL_POSTS: Post[] = [
  { id: '1', avatar: '🦊', content: "Three back-to-back sprints with no retrospective. We're shipping fast but I feel like we're accumulating invisible debt — technical and emotional.", moodTag: '🔥 Burnout', tagColor: '#EF4444', upvotes: 18, downvotes: 2, date: 'Today', time: '9:14 am', userVote: null, trending: true },
  { id: '2', avatar: '🐺', content: "Honestly the no-meeting Wednesday idea changed my week completely. I finally had time to think. More of this please.", moodTag: '😊 Happy', tagColor: '#34D399', upvotes: 31, downvotes: 0, date: 'Today', time: '8:02 am', userVote: 'up', trending: true },
  { id: '3', avatar: '🦋', content: "The new async standup format saves me 45 minutes a day. Small change, big difference. Thank you to whoever pushed for it.", moodTag: '💪 Motivated', tagColor: '#34D399', upvotes: 12, downvotes: 1, date: 'Yesterday', time: '5:30 pm', userVote: null, trending: false },
  { id: '4', avatar: '🦉', content: "It's week 8 of the same issue being flagged in retros with no visible action. At some point silence from leadership feels like dismissal.", moodTag: '😤 Frustrated', tagColor: '#F87171', upvotes: 27, downvotes: 3, date: 'Yesterday', time: '2:11 pm', userVote: null, trending: true },
  { id: '5', avatar: '🐬', content: "Genuinely anxious about the reorg rumours. I know nothing's confirmed but uncertainty is draining. A short update from anyone would help.", moodTag: '😰 Anxious', tagColor: '#FB923C', upvotes: 22, downvotes: 1, date: 'Mon', time: '11:44 am', userVote: null, trending: false },
];

// Note: SolutionsTab now fetches real solutions via useSolutions()/the API,
// so this mock array is no longer rendered there. It's kept here (and kept
// in sync with the current SolutionTag/SolutionStatus schema) only in case
// another screen still imports it for previews/storybook/tests.
export const INITIAL_SOLUTIONS: Solution[] = [
  {
    id: 's1',
    title: 'No-meeting Wednesdays — now official',
    body: 'After reviewing pulse data and employee feedback, we are officially introducing Wednesday as a protected deep-work day. No recurring meetings can be scheduled on Wednesdays starting next month. One-off critical syncs need approval from a manager.',
    authorLabel: 'Leadership', authorIcon: '👔',
    tags: ['Burnout', 'Workload'],
    status: 'Adopted',
    upvotes: 48, downvotes: 3, userVote: null,
    postedAt: '3d ago', weekLabel: 'This week', pinned: true,
  },
  {
    id: 's2',
    title: 'Async standups replacing daily 9am call',
    body: 'Effective immediately, the Engineering daily standup moves to async format via a shared channel. Post your update before 10am. Live syncs happen Tuesdays only. This directly addresses the feedback about cognitive overhead from early-morning calls.',
    authorLabel: 'Engineering Leadership', authorIcon: '💻',
    tags: ['Communication', 'Mental Health'],
    status: 'Adopted',
    upvotes: 39, downvotes: 1, userVote: 'up',
    postedAt: '5d ago', weekLabel: 'This week',
  },
  {
    id: 's3',
    title: 'Reorg update — what we can share now',
    body: 'We hear the anxiety about structural changes. Here is what is confirmed: no team eliminations. We are adding two new roles in Engineering and expanding the Design team. Final structure will be announced in the all-hands on the 20th. We are committed to no surprises.',
    authorLabel: 'CEO Office', authorIcon: '🏢',
    tags: ['Team Culture', 'Communication'],
    status: 'Open',
    upvotes: 34, downvotes: 5, userVote: null,
    postedAt: '1d ago', weekLabel: 'This week',
  },
  {
    id: 's4',
    title: 'Flexible start window: 7am–10am, no penalty',
    body: 'Starting next quarter, all employees may begin their day anytime between 7am and 10am. Core hours (10am–4pm) remain unchanged. This addresses caregiver scheduling and commute stress. HR will send updated policy documentation this week.',
    authorLabel: 'HR Team', authorIcon: '🤝',
    tags: ['Mental Health', 'Workload'],
    status: 'In_progress',
    upvotes: 29, downvotes: 2, userVote: null,
    postedAt: '2d ago', weekLabel: 'This week',
  },
  {
    id: 's5',
    title: 'Monthly anonymous pulse summary — now public',
    body: 'From next month, anonymised pulse summaries will be shared with all org members at the end of each month. You will see team-level trends, not individual data. This is a direct response to feedback asking for more transparency.',
    authorLabel: 'Leadership', authorIcon: '👔',
    tags: ['Team Culture', 'Communication'],
    status: 'Open',
    upvotes: 21, downvotes: 0, userVote: null,
    postedAt: '6d ago', weekLabel: 'Last week',
  },
];