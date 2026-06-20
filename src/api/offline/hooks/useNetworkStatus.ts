import { useEffect, useState, useCallback } from "react";
import * as Network from "expo-network";

export interface NetworkStatus {
  isOnline: boolean;
  isChecking: boolean;
}

export const useNetworkStatus = (): NetworkStatus => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  const check = useCallback(async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      setIsOnline(
        state.isConnected === true && state.isInternetReachable !== false
      );
    } catch {
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    check();

    // Poll every 5 s — Expo Network has no subscription API on all platforms
    const interval = setInterval(check, 5_000);
    return () => clearInterval(interval);
  }, [check]);

  return { isOnline, isChecking };
};