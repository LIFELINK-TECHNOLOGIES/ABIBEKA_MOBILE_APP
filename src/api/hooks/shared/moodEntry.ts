import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../clients";
import { MoodEntry } from "../../endpoints/shared/moodEntry";
import { useOfflineAwareQuery } from "../../offline/hooks/useOfflineAwareness";

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
  nextCheckIn: string;
}

interface MoodDayPoint {
  date: string;
  mood: number;
  label: string | null;
  emoji: string | null;
  color: string | null;
  score: number;
}

interface MostFrequentMood {
  mood: number;
  label: string | null;
  emoji: string | null;
  color: string | null;
  count: number;
  percentage: number;
}

interface StressDayPoint {
  date: string;
  value: number;
  classification: "calm" | "moderate" | "high";
}

interface DashboardData {
  totalCheckIns: number;
  streak: number;
  hasJoinedOrganization: boolean;
  moodTrend: {
    avg: number;
    bestDay: MoodDayPoint | null;
    worstDay: MoodDayPoint | null;
    mostFrequentMood: MostFrequentMood | null;
    daily: MoodDayPoint[];
  };
  stress: {
    avg: number;
    percentage: number;
    peakDay: StressDayPoint | null;
    calmestDay: StressDayPoint | null;
    daily: StressDayPoint[];
  };
  emotionBreakdown: {
    calmLevel: number;
    happyLevel: number;
    stressLevel: number;
    anxietyLevel: number;
    emotionCounts: Record<string, number>;
  };
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
  nextCheckIn: string | null;
}

// ─── Query keys ───────────────────────────────────────────────────────────
export const MOOD_DASHBOARD_KEY = ["moodDashboard"];
export const MOOD_TODAY_KEY     = ["moodToday"];

// ─── Submit check-in ──────────────────────────────────────────────────────
export const useSubmitCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitCheckInPayload) => {
      const { data } = await api.post<SubmitCheckInResponse>(
        MoodEntry.POST_DATA,
        payload
      );
      return data;
    },
    onSuccess: (response) => {
      // Seed today's entry directly into cache — no round-trip needed
      queryClient.setQueryData<TodayEntryResponse>(MOOD_TODAY_KEY, {
        success: true,
        data: response.data,
        checkedInToday: true,
        nextCheckIn: response.nextCheckIn,
      });
      // Dashboard needs a full refetch — aggregates changed
      queryClient.invalidateQueries({ queryKey: MOOD_DASHBOARD_KEY });
    },
  });
};

// ─── Mood dashboard ───────────────────────────────────────────────────────
export const useMoodDashboard = (range = 30) => {
  return useOfflineAwareQuery<DashboardResponse>({
    queryKey: [...MOOD_DASHBOARD_KEY, range],
    queryFn: async () => {
      const { data } = await api.get<DashboardResponse>(
        `${MoodEntry.GET_DATA}?range=${range}`
      );
      return data;
    },
    cacheKey: `mood:dashboard:${range}`,
    // Dashboard data is heavier — 5 min stale window
    staleTime: 1000 * 60 * 5,
  });
};

// ─── Today's check-in status ──────────────────────────────────────────────
// Never served from cache alone — always re-verifies with server on mount.
// But still seeds AsyncStorage so the gate screen isn't blank on cold start.
export const useTodayMoodEntry = () => {
  return useOfflineAwareQuery<TodayEntryResponse>({
    queryKey: MOOD_TODAY_KEY,
    queryFn: async () => {
      const { data } = await api.get<TodayEntryResponse>(MoodEntry.TODAY_DATA);
      return data;
    },
    cacheKey: "mood:today",
    staleTime: 0,           // always stale — re-verify on every mount
    refetchOnMount: "always",
  });
};