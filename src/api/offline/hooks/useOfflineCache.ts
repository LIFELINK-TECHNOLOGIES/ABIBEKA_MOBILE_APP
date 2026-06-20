/**
 * Thin AsyncStorage helpers used by every hook for the offline layer.
 * Key convention:  "cache:<query-key-json>"
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "cache:";

export async function readCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const { data, expiresAt } = JSON.parse(raw) as {
      data: T;
      expiresAt: number;
    };
    // Stale data is still returned — caller decides whether to use it
    return data;
  } catch {
    return null;
  }
}

export async function writeCache<T>(
  key: string,
  data: T,
  ttlMs = 7 * 24 * 60 * 60 * 1000 // 7 days
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      PREFIX + key,
      JSON.stringify({ data, expiresAt: Date.now() + ttlMs })
    );
  } catch {
    // Storage quota or serialisation error — silently skip
  }
}

export async function clearCache(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(PREFIX + key);
  } catch {}
}

export async function clearAllCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((k) => k.startsWith(PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch {}
}