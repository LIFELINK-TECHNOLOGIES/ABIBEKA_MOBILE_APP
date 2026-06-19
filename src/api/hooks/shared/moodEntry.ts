import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../clients";
import { MoodEntry } from "../../endpoints/shared/moodEntry";

// ─── Types ─────────────────────────────────────────────────────────────────
interface SubmitCheckInPayload {
  mood: number;
  emotions: string[];
  energy: number;
  stress: number;
  situations: string[];
  answers: Record<string, string>;
  date?: string;
}

interface MoodEntryDoc {
  _id: string;
  userId: string;
  date: string;
  mood: number;
  emotions: string[];
  energy: number;
  stress: number;
  situations: string[];
  answers: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

interface SubmitCheckInResponse {
  success: boolean;
  message: string;
  data: MoodEntryDoc;
}

// A single day's mood point, used for moodTrend.daily / bestDay / worstDay
interface MoodDayPoint {
  date: string;
  mood: number;
  label: string | null;
  emoji: string | null;
  color: string | null;
  score: number;
}

// The mode (most-logged) mood for the rolling week
interface MostFrequentMood {
  mood: number;
  label: string | null;
  emoji: string | null;
  color: string | null;
  count: number;
  percentage: number;
}

// A single day's stress point. Used for stress.daily, and also for
// peakDay/calmestDay — the backend pulls those straight out of the same
// daily array, so they carry the same `classification` field.
interface StressDayPoint {
  date: string;
  value: number;
  classification: "calm" | "moderate" | "high";
}

interface DashboardData {
  totalCheckIns: number;
  streak: number;
  hasJoinedOrganization: boolean;
  // Rolling last-7-days mood trend
  moodTrend: {
    avg: number;
    bestDay: MoodDayPoint | null;
    worstDay: MoodDayPoint | null;
    mostFrequentMood: MostFrequentMood | null;
    daily: MoodDayPoint[];
  };
  // Rolling last-7-days stress level
  stress: {
    avg: number;
    percentage: number; // 0-10 scale normalized to 0-100
    peakDay: StressDayPoint | null;
    calmestDay: StressDayPoint | null;
    daily: StressDayPoint[];
  };
  // Rolling last-7-days emotion breakdown
  emotionBreakdown: {
    calmLevel: number;
    happyLevel: number;
    stressLevel: number;
    anxietyLevel: number;
    emotionCounts: Record<string, number>;
  };
  // Contribution grid — spans the requested `range`, not the rolling week
  grid: { date: string; value: number }[];
  latestEntry: {
    mood: number;
    stress: number;
    energy: number;
    emotions: string[];
    situations: string[];
    answers: Record<string, string>;
  } | null;
  aiInsight: string | null;
}

interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

interface TodayEntryResponse {
  success: boolean;
  data: MoodEntryDoc | null;
  checkedInToday: boolean;
}

// ─── Query keys ───────────────────────────────────────────────────────────
export const MOOD_DASHBOARD_KEY = ["moodDashboard"];
export const MOOD_TODAY_KEY = ["moodToday"];

// ─── Submit check-in ────────────────────────────────────────────────────────
export const useSubmitCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitCheckInPayload) => {
      const { data } = await api.post<SubmitCheckInResponse>(MoodEntry.POST_DATA, payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MOOD_DASHBOARD_KEY });
      queryClient.invalidateQueries({ queryKey: MOOD_TODAY_KEY });
    },
  });
};

// ─── Get dashboard data ─────────────────────────────────────────────────────
// `range` still controls the totalCheckIns/streak/grid window (default 30 days).
// moodTrend, stress, and emotionBreakdown are always the rolling last 7 days,
// independent of `range`.
export const useMoodDashboard = (range: number = 30) => {
  return useQuery({
    queryKey: [...MOOD_DASHBOARD_KEY, range],
    queryFn: async () => {
      const { data } = await api.get<DashboardResponse>(
        `${MoodEntry.GET_DATA}?range=${range}`
      );
      return data;
    },
  });
};

// ─── Get today's entry (check if user already checked in) ──────────────────
export const useTodayMoodEntry = () => {
  return useQuery({
    queryKey: MOOD_TODAY_KEY,
    queryFn: async () => {
      const { data } = await api.get<TodayEntryResponse>(MoodEntry.TODAY_DATA);
      return data;
    },
  });
};