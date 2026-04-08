/**
 * ArthaSaathi — Settings Store (Zustand)
 * Manages theme, currency, user profile, and onboarding state.
 */

import { create } from 'zustand';
import { ThemeMode, CurrencyCode, UserProfile, AppSettings } from '../types';
import { saveData, loadData, STORAGE_KEYS } from '../utils/storage';

interface SettingsState extends AppSettings {
  isLoaded: boolean;

  // Actions
  loadSettings: () => Promise<void>;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setCurrency: (currency: CurrencyCode) => void;
  setOnboardingComplete: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  setMonthlyBudget: (budget: number) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  currency: 'INR',
  hasCompletedOnboarding: false,
  monthlyBudget: 0,
  profile: {
    name: '',
    email: '',
    avatarInitial: 'A',
  },
};

function persistSettings(state: Partial<SettingsState>) {
  const { isLoaded, ...settings } = state as any;
  // Remove functions
  const data: Record<string, any> = {};
  for (const [key, value] of Object.entries(settings)) {
    if (typeof value !== 'function') {
      data[key] = value;
    }
  }
  saveData(STORAGE_KEYS.SETTINGS, data);
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  isLoaded: false,

  loadSettings: async () => {
    const saved = await loadData<AppSettings>(STORAGE_KEYS.SETTINGS);
    if (saved) {
      set({ ...saved, isLoaded: true });
    } else {
      set({ isLoaded: true });
    }
  },

  setTheme: (theme) => {
    set({ theme });
    persistSettings({ ...get(), theme });
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    set({ theme: newTheme });
    persistSettings({ ...get(), theme: newTheme });
  },

  setCurrency: (currency) => {
    set({ currency });
    persistSettings({ ...get(), currency });
  },

  setOnboardingComplete: () => {
    set({ hasCompletedOnboarding: true });
    persistSettings({ ...get(), hasCompletedOnboarding: true });
  },

  updateProfile: (profileUpdate) => {
    const currentProfile = get().profile;
    const newProfile = { ...currentProfile, ...profileUpdate };

    // Auto-compute avatar initial from name
    if (profileUpdate.name) {
      newProfile.avatarInitial = profileUpdate.name.charAt(0).toUpperCase();
    }

    set({ profile: newProfile });
    persistSettings({ ...get(), profile: newProfile });
  },

  setMonthlyBudget: (budget) => {
    set({ monthlyBudget: budget });
    persistSettings({ ...get(), monthlyBudget: budget });
  },

  resetSettings: () => {
    set({ ...DEFAULT_SETTINGS, isLoaded: true });
    persistSettings(DEFAULT_SETTINGS);
  },
}));
