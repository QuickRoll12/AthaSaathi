/**
 * ArthaSaathi — Settings Screen
 * Theme toggle, currency, profile, budget, and app info.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useTransactionStore } from '../../src/store/transactionStore';
import { Typography, Spacing, Radius } from '../../src/constants/Typography';
import { CurrencyCode } from '../../src/types';
import { CURRENCIES } from '../../src/utils/currency';
import { clearAllData } from '../../src/utils/storage';
import Input from '../../src/components/ui/Input';
import Button from '../../src/components/ui/Button';

interface SettingsRowProps {
  icon: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  delay?: number;
}

function SettingsRow({ icon, iconColor, title, subtitle, right, onPress, delay = 0 }: SettingsRowProps) {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(delay).duration(400)}>
      <Pressable
        style={[styles.row, { backgroundColor: theme.card }]}
        onPress={onPress}
        android_ripple={onPress ? { color: theme.surface } : undefined}
        disabled={!onPress}
      >
        <View style={[styles.rowIcon, { backgroundColor: `${iconColor || theme.primary}15` }]}>
          <MaterialCommunityIcons
            name={icon as any}
            size={20}
            color={iconColor || theme.primary}
          />
        </View>
        <View style={styles.rowContent}>
          <Text style={[Typography.bodyMedium, { color: theme.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[Typography.caption, { color: theme.textMuted, marginTop: 2 }]}>
              {subtitle}
            </Text>
          )}
        </View>
        {right || (
          onPress && <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textMuted} />
        )}
      </Pressable>
    </Animated.View>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();
  const settings = useSettingsStore();
  const [showProfile, setShowProfile] = useState(false);
  const [profileName, setProfileName] = useState(settings.profile.name);
  const [profileEmail, setProfileEmail] = useState(settings.profile.email);
  const [showBudget, setShowBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(
    settings.monthlyBudget > 0 ? settings.monthlyBudget.toString() : ''
  );

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all transactions and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await clearAllData();
            settings.resetSettings();
            // Reload transactions
            useTransactionStore.getState().loadTransactions();
          },
        },
      ]
    );
  };

  const currencyOptions: CurrencyCode[] = ['INR', 'USD', 'EUR', 'GBP'];

  const handleCurrencyChange = () => {
    const currentIdx = currencyOptions.indexOf(settings.currency);
    const nextIdx = (currentIdx + 1) % currencyOptions.length;
    settings.setCurrency(currencyOptions[nextIdx]);
    Haptics.selectionAsync();
  };

  const handleSaveProfile = () => {
    settings.updateProfile({
      name: profileName.trim(),
      email: profileEmail.trim(),
    });
    setShowProfile(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSaveBudget = () => {
    const budget = parseFloat(budgetInput) || 0;
    settings.setMonthlyBudget(budget);
    setShowBudget(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={[Typography.displayMedium, { color: theme.text }]}>Settings</Text>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd] as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileCard}
          >
            <View style={styles.profileAvatar}>
              <Text style={[Typography.headingLarge, { color: theme.primary }]}>
                {settings.profile.avatarInitial || 'A'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[Typography.headingMedium, { color: '#FFFFFF' }]}>
                {settings.profile.name || 'Set your name'}
              </Text>
              <Text style={[Typography.bodySmall, { color: 'rgba(255,255,255,0.7)' }]}>
                {settings.profile.email || 'Tap to edit profile'}
              </Text>
            </View>
            <Pressable onPress={() => setShowProfile(!showProfile)} hitSlop={8}>
              <MaterialCommunityIcons
                name={showProfile ? 'chevron-up' : 'pencil'}
                size={22}
                color="rgba(255,255,255,0.8)"
              />
            </Pressable>
          </LinearGradient>
        </Animated.View>

        {/* Profile Edit Form */}
        {showProfile && (
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={[styles.profileForm, { backgroundColor: theme.card }]}
          >
            <Input
              label="Full Name"
              value={profileName}
              onChangeText={setProfileName}
              leftIcon="account-outline"
              placeholder="Enter your name"
            />
            <Input
              label="Email"
              value={profileEmail}
              onChangeText={setProfileEmail}
              leftIcon="email-outline"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button
              title="Save Profile"
              onPress={handleSaveProfile}
              variant="primary"
              size="md"
              fullWidth
            />
          </Animated.View>
        )}

        {/* Appearance */}
        <Text style={[Typography.label, { color: theme.textMuted, paddingHorizontal: Spacing.lg, marginTop: Spacing.xl, marginBottom: Spacing.sm }]}>
          APPEARANCE
        </Text>

        <SettingsRow
          icon="theme-light-dark"
          title="Dark Mode"
          subtitle={theme.isDark ? 'Currently in dark mode' : 'Currently in light mode'}
          right={
            <Switch
              value={theme.isDark}
              onValueChange={() => {
                settings.toggleTheme();
                Haptics.selectionAsync();
              }}
              trackColor={{ false: theme.surface, true: `${theme.primary}40` }}
              thumbColor={theme.isDark ? theme.primary : theme.textMuted}
            />
          }
          delay={200}
        />

        {/* Finance */}
        <Text style={[Typography.label, { color: theme.textMuted, paddingHorizontal: Spacing.lg, marginTop: Spacing.xl, marginBottom: Spacing.sm }]}>
          FINANCE
        </Text>

        <SettingsRow
          icon="currency-inr"
          iconColor="#FFB547"
          title="Currency"
          subtitle={CURRENCIES[settings.currency].name}
          onPress={handleCurrencyChange}
          delay={300}
          right={
            <View style={[styles.currencyBadge, { backgroundColor: theme.surface }]}>
              <Text style={[Typography.label, { color: theme.text }]}>
                {CURRENCIES[settings.currency].symbol} {settings.currency}
              </Text>
            </View>
          }
        />

        <SettingsRow
          icon="wallet-outline"
          iconColor="#00D4AA"
          title="Monthly Budget"
          subtitle={
            settings.monthlyBudget > 0
              ? `${CURRENCIES[settings.currency].symbol}${settings.monthlyBudget.toLocaleString()}`
              : 'Not set'
          }
          onPress={() => setShowBudget(!showBudget)}
          delay={350}
        />

        {showBudget && (
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={[styles.budgetForm, { backgroundColor: theme.card }]}
          >
            <View style={[styles.budgetInput, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
              <Text style={[Typography.headingMedium, { color: theme.textMuted }]}>
                {CURRENCIES[settings.currency].symbol}
              </Text>
              <TextInput
                style={[Typography.headingMedium, { color: theme.text, flex: 1, padding: 0 }]}
                value={budgetInput}
                onChangeText={(v) => setBudgetInput(v.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={theme.textMuted}
                cursorColor={theme.primary}
              />
            </View>
            <Button
              title="Save Budget"
              onPress={handleSaveBudget}
              variant="primary"
              size="sm"
              fullWidth
            />
          </Animated.View>
        )}

        {/* Data */}
        <Text style={[Typography.label, { color: theme.textMuted, paddingHorizontal: Spacing.lg, marginTop: Spacing.xl, marginBottom: Spacing.sm }]}>
          DATA
        </Text>

        <SettingsRow
          icon="delete-outline"
          iconColor="#FF6B6B"
          title="Reset All Data"
          subtitle="Delete all transactions and settings"
          onPress={handleResetData}
          delay={400}
        />

        {/* About */}
        <Text style={[Typography.label, { color: theme.textMuted, paddingHorizontal: Spacing.lg, marginTop: Spacing.xl, marginBottom: Spacing.sm }]}>
          ABOUT
        </Text>

        <SettingsRow
          icon="information-outline"
          title="ArthaSaathi"
          subtitle="Version 1.0.0 • Your Wealth Companion"
          delay={450}
        />

        <SettingsRow
          icon="heart-outline"
          iconColor="#FF6B6B"
          title="Made with ❤️ in India"
          subtitle="Built with React Native & Expo"
          delay={500}
        />

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.base,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  profileForm: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.base,
    padding: Spacing.base,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  currencyBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
  budgetForm: {
    marginHorizontal: Spacing.base,
    padding: Spacing.base,
    borderRadius: Radius.lg,
    gap: Spacing.md,
  },
  budgetInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.base,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
});
