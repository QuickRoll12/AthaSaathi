/**
 * ArthaSaathi — AsyncStorage Helpers
 * Type-safe wrappers with error handling for persistence.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TRANSACTIONS: '@arthasaathi/transactions',
  SETTINGS: '@arthasaathi/settings',
  ONBOARDING: '@arthasaathi/onboarding_done',
} as const;

/**
 * Save a value to AsyncStorage.
 */
export async function saveData<T>(key: string, value: T): Promise<void> {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
  } catch (error) {
    console.error(`[Storage] Failed to save ${key}:`, error);
  }
}

/**
 * Load a value from AsyncStorage.
 */
export async function loadData<T>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    if (json === null) return null;
    return JSON.parse(json) as T;
  } catch (error) {
    console.error(`[Storage] Failed to load ${key}:`, error);
    return null;
  }
}

/**
 * Remove a value from AsyncStorage.
 */
export async function removeData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`[Storage] Failed to remove ${key}:`, error);
  }
}

/**
 * Clear all app data. Use for logout / reset.
 */
export async function clearAllData(): Promise<void> {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('[Storage] Failed to clear all data:', error);
  }
}

export { STORAGE_KEYS };
