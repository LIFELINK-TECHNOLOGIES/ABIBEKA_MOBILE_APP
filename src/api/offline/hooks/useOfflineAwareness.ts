
 
import { useCallback, useEffect } from "react";
import {
  useQuery,
  useQueryClient,
  QueryKey,
  QueryFunction,
  UseQueryOptions,
} from "@tanstack/react-query";
import { readCache, writeCache } from "./useOfflineCache";
import { useNetworkStatus } from "./useNetworkStatus";

interface OfflineAwareOptions<TData> extends Omit<UseQueryOptions<TData>, "queryKey" | "queryFn"> {
  queryKey: QueryKey;
  queryFn: QueryFunction<TData>;
  /** AsyncStorage key — must be unique per query */
  cacheKey: string;
  /** Cache TTL in ms (default 7 days) */
  cacheTtl?: number;
}

export function useOfflineAwareQuery<TData>({
  queryKey,
  queryFn,
  cacheKey,
  cacheTtl,
  ...rest
}: OfflineAwareOptions<TData>) {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus();

  // Seed cache from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const existing = queryClient.getQueryData<TData>(queryKey);
      if (existing) return; // RQ already has data, skip
      const cached = await readCache<TData>(cacheKey);
      if (cached) {
        queryClient.setQueryData(queryKey, cached);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  const query = useQuery<TData>({
    queryKey,
    queryFn,
    enabled: isOnline,
    staleTime: 1000 * 60 * 5,
    ...rest,
  });

  // Persist to AsyncStorage whenever fresh data arrives
  useEffect(() => {
    if (query.data) {
      writeCache(cacheKey, query.data, cacheTtl);
    }
  }, [query.data, cacheKey, cacheTtl]);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  return {
    ...query,
    refreshing: query.isFetching && !query.isLoading,
    onRefresh,
    isOffline: !isOnline,
    /** true when showing cached data while fetching */
    isShowingStale: !isOnline || (!!query.data && query.isFetching),
  };
}