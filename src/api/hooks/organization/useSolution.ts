import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../clients";
import { Solution } from "../../endpoints/organization/sloution";
import { useOfflineAwareQuery } from "../../offline/hooks/useOfflineAwareness";

// ─── Types ─────────────────────────────────────────────────────────────────
type SolutionVoteType = "up" | "down";
type SolutionStatusValue = "open" | "in_progress" | "resolved";

interface SolutionItem {
  id: string;
  authorIcon: string;
  authorLabel: string;
  postedAt: string;
  status: SolutionStatusValue;
  title: string;
  body: string;
  tags: string[];
  pinned: boolean;
  upvotes: number;
  downvotes: number;
  userVote: SolutionVoteType | null;
  weekLabel: "This week" | "Last week" | null;
}

interface CreateSolutionPayload {
  title: string;
  body: string;
  tags?: string[];
  status?: SolutionStatusValue;
}

interface SolutionFilters {
  tag?: string;
  status?: SolutionStatusValue;
}

// ─── Query keys ───────────────────────────────────────────────────────────
export const SOLUTION_KEYS = {
  list: ["solutions"],
  tags: ["solutions", "tags"],
};

// ─── List solutions ───────────────────────────────────────────────────────
export const useSolutions = (filters: SolutionFilters = {}) => {
  const { tag, status } = filters;

  return useOfflineAwareQuery<SolutionItem[]>({
    queryKey: [...SOLUTION_KEYS.list, tag, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (tag) params.append("tag", tag);
      if (status) params.append("status", status);
      const query = params.toString();

      const { data } = await api.get<{ success: boolean; data: SolutionItem[] }>(
        `${Solution.GET_SOLUTIONS}${query ? `?${query}` : ""}`
      );
      return data.data;
    },
    cacheKey: `solutions:list:${tag ?? "all"}:${status ?? "all"}`,
  });
};

// ─── Available solution tags ──────────────────────────────────────────────
export const useSolutionTags = () => {
  return useOfflineAwareQuery<string[]>({
    queryKey: SOLUTION_KEYS.tags,
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: string[] }>(
        Solution.GET_SOLUTION_TAGS
      );
      return data.data;
    },
    cacheKey: "solutions:tags",
    // Tags change rarely — 30 min stale window
    staleTime: 1000 * 60 * 30,
  });
};

// ─── Organization posts a new solution ────────────────────────────────────
export const useCreateSolution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSolutionPayload) => {
      const { data } = await api.post(Solution.CREATE_SOLUTION, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOLUTION_KEYS.list });
    },
  });
};

// ─── Upvote / downvote a solution ─────────────────────────────────────────
export const useVoteSolution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, type }: { id: string; type: SolutionVoteType }) => {
      const { data } = await api.patch(Solution.VOTE_SOLUTION(id), { type });
      return data;
    },
    onSuccess: (response, { id, type }) => {
      // Update vote counts directly in cache — no refetch needed
      queryClient.setQueriesData<SolutionItem[]>(
        { queryKey: SOLUTION_KEYS.list },
        (old) => {
          if (!old) return old;
          return old.map((s) => {
            if (s.id !== id) return s;
            const wasUp   = s.userVote === "up";
            const wasDown = s.userVote === "down";
            const toggling = s.userVote === type;
            return {
              ...s,
              upvotes:
                type === "up"
                  ? toggling ? s.upvotes - 1 : s.upvotes + 1 - (wasDown ? 0 : 0)
                  : wasUp ? s.upvotes - 1 : s.upvotes,
              downvotes:
                type === "down"
                  ? toggling ? s.downvotes - 1 : s.downvotes + 1
                  : wasDown ? s.downvotes - 1 : s.downvotes,
              userVote: toggling ? null : type,
            };
          });
        }
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: SOLUTION_KEYS.list });
    },
  });
};

// ─── Pin / unpin a solution ───────────────────────────────────────────────
export const usePinSolution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(Solution.PIN_SOLUTION(id));
      return data;
    },
    onSuccess: (_, id) => {
      // Toggle pin in cache immediately
      queryClient.setQueriesData<SolutionItem[]>(
        { queryKey: SOLUTION_KEYS.list },
        (old) =>
          old
            ? old.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s))
            : old
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: SOLUTION_KEYS.list });
    },
  });
};

// ─── Delete a solution ────────────────────────────────────────────────────
export const useDeleteSolution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(Solution.DELETE_SOLUTION(id));
      return data;
    },
    onSuccess: (_, id) => {
      // Remove from cache immediately — no refetch
      queryClient.setQueriesData<SolutionItem[]>(
        { queryKey: SOLUTION_KEYS.list },
        (old) => (old ? old.filter((s) => s.id !== id) : old)
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: SOLUTION_KEYS.list });
    },
  });
};