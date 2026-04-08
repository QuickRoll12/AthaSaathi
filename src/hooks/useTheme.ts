/**
 * ArthaSaathi — Theme Hook
 * Provides theme-aware color values and utility functions.
 */

import { useSettingsStore } from '../store/settingsStore';
import { DarkColors, LightColors, ThemeColors } from '../constants/Colors';

export function useTheme(): ThemeColors & { isDark: boolean; toggleTheme: () => void } {
  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  const colors = theme === 'dark' ? DarkColors : LightColors;

  return {
    ...colors,
    isDark: theme === 'dark',
    toggleTheme,
  };
}
