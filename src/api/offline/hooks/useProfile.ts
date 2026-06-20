import { useCallback, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import api from "../../clients";
import { useAuthStore, UserData } from "../../../store/authStore";
import { readCache, writeCache } from "./useOfflineCache";
import { useNetworkStatus } from "./useNetworkStatus";

// ─── Query key ─────────────────────────────────────────────────────────────
export const PROFILE_KEYS = {
  me: ["profile", "me"] as QueryKey,
};

const CACHE_KEY = "profile:me";

// ─── API shapes ────────────────────────────────────────────────────────────
interface ProfileResponse {
  success: boolean;
  data: UserData;
}

interface UpdateProfilePayload {
  fullName?: string;
  location?: string;
  position?: string;
  department?: string;
  clearanceLevel?: string;
  businessSector?: string;
  employeeRange?: string;
}

// ─── useProfile ────────────────────────────────────────────────────────────
/**
 * Fetches the current user's profile.
 *
 * Offline behaviour
 * ─────────────────
 * 1. On mount the query's `initialData` is seeded from AsyncStorage so the
 *    screen renders immediately with the last-known data.
 * 2. React Query then fires the network request in the background.
 * 3. On success the fresh data overwrites both the RQ cache and AsyncStorage.
 * 4. The Zustand store is also kept in sync so any component reading
 *    `useAuthStore` sees up-to-date user data too.
 *
 * Pull-to-refresh
 * ───────────────
 * Destructure `{ refreshing, onRefresh }` and pass them to your
 * `<ScrollView refreshControl={<RefreshControl ... />} />`.
 */
export const useProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const storedUser = useAuthStore((s) => s.user);
  const { isOnline } = useNetworkStatus();

  // Seed React Query cache from AsyncStorage before the query fires
  useEffect(() => {
    (async () => {
      const cached = await readCache<UserData>(CACHE_KEY);
      if (cached) {
        queryClient.setQueryData(PROFILE_KEYS.me, {
          success: true,
          data: cached,
        } as ProfileResponse);
      }
    })();
  }, [queryClient]);

  const query = useQuery<ProfileResponse>({
    queryKey: PROFILE_KEYS.me,
    queryFn: async () => {
      const { data } = await api.get<ProfileResponse>("/profile/me");
      return data;
    },
    // Show Zustand store data instantly while the real fetch runs
    initialData: storedUser
      ? ({ success: true, data: storedUser } as ProfileResponse)
      : undefined,
    initialDataUpdatedAt: 0, // treat it as immediately stale → always refetch
    staleTime: 1000 * 60 * 5, // 5 min after a successful fetch
    enabled: isOnline, // don't hammer network when offline
    select: (res) => res, // keep full shape; screens pick res.data
  });

  // When fresh data arrives → sync Zustand + AsyncStorage
  useEffect(() => {
    if (query.data?.data) {
      setUser(query.data.data);
      writeCache(CACHE_KEY, query.data.data);
    }
  }, [query.data, setUser]);

  // Pull-to-refresh helper
  const onRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.me });
  }, [queryClient]);

  return {
    ...query,
    profile: query.data?.data ?? null,
    refreshing: query.isFetching && !query.isLoading,
    onRefresh,
    isOffline: !isOnline,
  };
};

// ─── useUpdateProfile ──────────────────────────────────────────────────────
/**
 * Mutates the profile then immediately:
 *   1. Updates the React Query cache (no extra round-trip)
 *   2. Syncs Zustand store
 *   3. Writes to AsyncStorage so the next cold-start is up to date
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const { data } = await api.patch<ProfileResponse>("/profile/me", payload);
      return data;
    },
    onSuccess: (response) => {
      const updated = response.data;

      // 1. Update RQ cache directly — no refetch needed
      queryClient.setQueryData<ProfileResponse>(PROFILE_KEYS.me, (old) =>
        old ? { ...old, data: updated } : { success: true, data: updated }
      );

      // 2. Keep Zustand in sync
      setUser(updated);

      // 3. Persist offline copy
      writeCache(CACHE_KEY, updated);
    },
    onError: () => {
      // Refetch on error to ensure cache reflects server state
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.me });
    },
  });
};