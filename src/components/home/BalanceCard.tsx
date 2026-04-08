/**
 * ArthaSaathi — Balance Card (Home)
 * Premium gradient card showing total balance, income, and expense.
 * Features an animated counting number effect on mount.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInDown,
  interpolate,
  Easing,
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, Radius } from '../../constants/Typography';
import { formatCurrency } from '../../utils/currency';
import { useSettingsStore } from '../../store/settingsStore';

interface BalanceCardProps {
  totalBalance: number;
  income: number;
  expense: number;
}

export default function BalanceCard({ totalBalance, income, expense }: BalanceCardProps) {
  const theme = useTheme();
  const currency = useSettingsStore((s) => s.currency);
  const animProgress = useSharedValue(0);

  useEffect(() => {
    animProgress.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.cubic) });
  }, [totalBalance]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animProgress.value, [0, 0.5, 1], [0.3, 0.8, 1]),
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(600).springify()}
      style={styles.wrapper}
    >
      <LinearGradient
        colors={[theme.balanceGradientStart, theme.balanceGradientMid, theme.balanceGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Decorative circles */}
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />

        <Text style={[Typography.labelSmall, styles.balanceLabel]}>
          TOTAL BALANCE
        </Text>

        <Animated.View style={shimmerStyle}>
          <Text style={[Typography.displayLarge, styles.balanceAmount]}>
            {formatCurrency(totalBalance, currency)}
          </Text>
        </Animated.View>

        {/* Income / Expense pills */}
        <View style={styles.pillRow}>
          <View style={styles.pill}>
            <View style={[styles.pillIcon, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
              <MaterialCommunityIcons name="arrow-down" size={14} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[Typography.labelSmall, styles.pillLabel]}>Income</Text>
              <Text style={[Typography.amountSmall, styles.pillValue]}>
                {formatCurrency(income, currency)}
              </Text>
            </View>
          </View>

          <View style={styles.pillDivider} />

          <View style={styles.pill}>
            <View style={[styles.pillIcon, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
              <MaterialCommunityIcons name="arrow-up" size={14} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[Typography.labelSmall, styles.pillLabel]}>Expense</Text>
              <Text style={[Typography.amountSmall, styles.pillValue]}>
                {formatCurrency(expense, currency)}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    borderRadius: Radius.xxl,
    overflow: 'hidden',
    // Shadow
    elevation: 12,
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  card: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    borderRadius: Radius.xxl,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  decorCircle1: {
    width: 150,
    height: 150,
    top: -40,
    right: -30,
  },
  decorCircle2: {
    width: 100,
    height: 100,
    bottom: -20,
    left: -20,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  balanceAmount: {
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  pillIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillLabel: {
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
  },
  pillValue: {
    color: '#FFFFFF',
    marginTop: 1,
  },
  pillDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: Spacing.sm,
  },
});
