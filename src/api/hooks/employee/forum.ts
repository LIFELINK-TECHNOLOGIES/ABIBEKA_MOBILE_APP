import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../clients";
import { FORUM } from "../../endpoints/employee/forum";
import { useOfflineAwareQuery } from "../../offline/hooks/useOfflineAwareness";

// ─── Types ─────────────────────────────────────────────────────────────────
interface ForumPost {
  id: string;
  anonId: string;
  content: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  userVote: "up" | "down" | null;
  createdAt: string;
}

interface CreatePostPayload {
  content: string;
  tags: string[];
}

interface GetPostsResponse {
  success: boolean;
  data: ForumPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface VoteResponse {
  success: boolean;
  data: {
    id: string;
    upvotes: number;
    downvotes: number;
    userVote: "up" | "down" | null;
  };
}

// ─── Flagging / moderation types ────────────────────────────────────────────
export type ForumPostStatus = "VISIBLE" | "UNDER_REVIEW" | "REJECTED";

interface FlagPostPayload {
  id: string;
  reason?: string;
}

interface FlagPostResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: ForumPostStatus;
  };
}

export interface FlaggedPost {
  id: string;
  content: string;
  tags: string[];
  status: ForumPostStatus;
  flagCount: number;
  flagReasons: string[];
  createdAt: string;
}

interface GetFlaggedPostsResponse {
  success: boolean;
  data: FlaggedPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ReviewPostPayload {
  id: string;
  action: "approve" | "reject";
  note?: string;
}

interface ReviewPostResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: ForumPostStatus;
  };
}

// ─── Query keys ────────────────────────────────────────────────────────────
export const FORUM_KEYS = {
  posts: (page: number, tag?: string) => ["forum-posts", page, tag] as const,
  tags: ["forum-tags"] as const,
  // limit is part of the key because the Flagged tab grows `limit` instead
  // of paging (see useFlaggedPosts below) — a different limit is a
  // different query, same as a different page would be.
  flagged: (page: number, limit: number) =>
    ["forum-flagged-posts", page, limit] as const,
};

// ─── Get forum posts ────────────────────────────────────────────────────────
export const useForumPosts = (page = 1, limit = 20, tag?: string) => {
  return useOfflineAwareQuery<GetPostsResponse>({
    queryKey: FORUM_KEYS.posts(page, tag),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (tag) params.append("tag", tag);
      const { data } = await api.get<GetPostsResponse>(
        `${FORUM.GET_POSTS}?${params.toString()}`
      );
      return data;
    },
    cacheKey: `forum:posts:${page}:${tag ?? "all"}`,
  });
};

// ─── Get forum tags ─────────────────────────────────────────────────────────
export const useForumTags = () => {
  return useOfflineAwareQuery<string[]>({
    queryKey: FORUM_KEYS.tags,
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: string[] }>(
        FORUM.GET_TAGS
      );
      return data.data;
    },
    cacheKey: "forum:tags",
  });
};

// ─── Create post ────────────────────────────────────────────────────────────
export const useCreateForumPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePostPayload) => {
      const { data } = await api.post(FORUM.CREATE_POST, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
    },
  });
};

// ─── Vote post ──────────────────────────────────────────────────────────────
export const useVoteForumPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, type }: { id: string; type: "up" | "down" }) => {
      const { data } = await api.patch<VoteResponse>(FORUM.VOTE(id), { type });
      return data;
    },
    onSuccess: (response, { id }) => {
      queryClient.setQueriesData<GetPostsResponse>(
        { queryKey: ["forum-posts"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((post) =>
              post.id === id
                ? {
                    ...post,
                    upvotes: response.data.upvotes,
                    downvotes: response.data.downvotes,
                    userVote: response.data.userVote,
                  }
                : post
            ),
          };
        }
      );
    },
  });
};

// ─── Delete post ────────────────────────────────────────────────────────────
export const useDeleteForumPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(FORUM.DELETE_POST(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
    },
  });
};

// ─── Flag post ──────────────────────────────────────────────────────────────
// A single flag moves a post to UNDER_REVIEW server-side, so we optimistically
// drop it out of every cached forum-posts page immediately — no point waiting
// for a refetch to hide something that's already gone from the feed.
export const useFlagForumPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: FlagPostPayload) => {
      const { data } = await api.patch<FlagPostResponse>(FORUM.FLAG(id), {
        reason: reason ?? "",
      });
      return data;
    },
    onSuccess: (_response, { id }) => {
      queryClient.setQueriesData<GetPostsResponse>(
        { queryKey: ["forum-posts"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((post) => post.id !== id),
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["forum-flagged-posts"] });
    },
  });
};

// ─── Get flagged posts (org admin / clearance >= 3 review queue) ───────────
// `enabled` is passed through so callers can skip the request entirely for
// users who can't review (see MIN_CLEARANCE_FOR_REVIEW in the forum screen —
// keep that value in sync with the backend's canReviewFlags check).
//
// "Load more" grows `limit` on a fixed page=1 rather than paging — simpler
// to reason about with this hook's cache-per-key model, at the cost of
// re-fetching everything already seen when you load more. Fine at the
// volumes a review queue realistically hits; revisit if that changes.
export const useFlaggedPosts = (page = 1, limit = 20, enabled = true) => {
  return useOfflineAwareQuery<GetFlaggedPostsResponse>({
    queryKey: FORUM_KEYS.flagged(page, limit),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      const { data } = await api.get<GetFlaggedPostsResponse>(
        `${FORUM.GET_FLAGGED}?${params.toString()}`
      );
      return data;
    },
    cacheKey: `forum:flagged:${page}:${limit}`,
    enabled,
  });
};

// ─── Review a flagged post (approve / reject) ───────────────────────────────
export const useReviewForumPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action, note }: ReviewPostPayload) => {
      const { data } = await api.patch<ReviewPostResponse>(FORUM.REVIEW(id), {
        action,
        note: note ?? "",
      });
      return data;
    },
    onSuccess: (_response, { id }) => {
      // Leaves the review queue either way, at any limit it's cached under
      queryClient.setQueriesData<GetFlaggedPostsResponse>(
        { queryKey: ["forum-flagged-posts"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((post) => post.id !== id),
            pagination: {
              ...old.pagination,
              total: Math.max(0, old.pagination.total - 1),
            },
          };
        }
      );
      // If approved it's visible again — let the normal feed pick it up
      // next time it refetches rather than trying to splice it back in here.
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
    },
  });
};
