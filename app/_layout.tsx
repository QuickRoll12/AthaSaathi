/**
 * ArthaSaathi — Root Layout
 * Initializes fonts, stores, splash screen, and global providers.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSettingsStore } from '../src/store/settingsStore';
import { useTransactionStore } from '../src/store/transactionStore';
import { DarkColors, LightColors } from '../src/constants/Colors';

// Keep splash screen visible during loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const loadTransactions = useTransactionStore((s) => s.loadTransactions);
  const theme = useSettingsStore((s) => s.theme);
  const settingsLoaded = useSettingsStore((s) => s.isLoaded);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
          'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
          'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
          'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
          'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
          ...MaterialCommunityIcons.font,
        });

        // Load persisted data
        await Promise.all([loadSettings(), loadTransactions()]);
      } catch (e) {
        console.warn('Error loading app resources:', e);
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [appReady]);

  if (!appReady) return null;

  const colors = theme === 'dark' ? DarkColors : LightColors;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      />
    </GestureHandlerRootView>
  );
}
