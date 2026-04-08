/**
 * ArthaSaathi — Quick Stats
 * Income / Expense summary pills for the home screen.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, Radius } from '../../constants/Typography';
import { formatCurrency } from '../../utils/currency';
import { useSettingsStore } from '../../store/settingsStore';

interface QuickStatsProps {
  income: number;
  expense: number;
  transactionCount: number;
}

export default function QuickStats({ income, expense, transactionCount }: QuickStatsProps) {
  const theme = useTheme();
  const currency = useSettingsStore((s) => s.currency);

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInLeft.delay(200).duration(500).springify()}
        style={[styles.card, { backgroundColor: theme.incomeBg, borderColor: `${theme.income}30` }]}
      >
        <View style={[styles.iconBg, { backgroundColor: `${theme.income}25` }]}>
          <MaterialCommunityIcons name="trending-up" size={18} color={theme.income} />
        </View>
        <Text style={[Typography.labelSmall, { color: theme.income, marginTop: Spacing.sm }]}>
          INCOME
        </Text>
        <Text style={[Typography.amountSmall, { color: theme.income, marginTop: 2 }]}>
          {formatCurrency(income, currency)}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInRight.delay(300).duration(500).springify()}
        style={[styles.card, { backgroundColor: theme.expenseBg, borderColor: `${theme.expense}30` }]}
      >
        <View style={[styles.iconBg, { backgroundColor: `${theme.expense}25` }]}>
          <MaterialCommunityIcons name="trending-down" size={18} color={theme.expense} />
        </View>
        <Text style={[Typography.labelSmall, { color: theme.expense, marginTop: Spacing.sm }]}>
          EXPENSE
        </Text>
        <Text style={[Typography.amountSmall, { color: theme.expense, marginTop: 2 }]}>
          {formatCurrency(expense, currency)}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.lg,
  },
  card: {
    flex: 1,
    padding: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
