import api from "../../clients";
import { OrgDashboard } from "../../endpoints/organization/stats";
import { useOfflineAwareQuery } from "../../offline/hooks/useOfflineAwareness";

// ─── Types ───────────────────────────────────────────────────────────────
interface RawDept {
  name: string;
  memberCount: number;
  checkedInToday: number;
  avgMood: number;
  avgStress: number;
  avgEnergy: number;
  pulseScore: number;
}

interface RawEmotion {
  emotion: string;
  count: number;
  pct: number;
}

interface RawHeatDay {
  day: string;
  avgStress: number;
  intensity: number;
}

export interface OrgDashboardRaw {
  totalEmployees: number;
  departmentCount: number;
  totalCheckInsToday: number;
  checkInRate: number;
  goodLevel: number;
  moodDistribution: {
    great: number;
    calm: number;
    okay: number;
    low: number;
    stressed: number;
  };
  departments: RawDept[];
  topEmotions: RawEmotion[];
  stressHeatmap: RawHeatDay[];
  alertDept: string | null;
  alertStressChange: number | null;
}

// ─── Query key ────────────────────────────────────────────────────────────
export const ORG_DASHBOARD_KEY = ["orgDashboard"];

// ─── Hook ─────────────────────────────────────────────────────────────────
export const useOrgDashboard = () => {
  return useOfflineAwareQuery<OrgDashboardRaw>({
    queryKey: ORG_DASHBOARD_KEY,
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: OrgDashboardRaw }>(
        OrgDashboard.GET
      );
      return data.data;
    },
    cacheKey: "org:dashboard",
    staleTime: 1000 * 60 * 5,
  });
};