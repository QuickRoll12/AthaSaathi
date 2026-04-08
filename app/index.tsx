/**
 * ArthaSaathi — Index Route
 * Redirects to onboarding or main tabs based on state.
 */

import { Redirect } from 'expo-router';
import { useSettingsStore } from '../src/store/settingsStore';

export default function Index() {
  const hasCompletedOnboarding = useSettingsStore((s) => s.hasCompletedOnboarding);
  const isAuthenticated = useSettingsStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
