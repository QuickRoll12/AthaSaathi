/**
 * ArthaSaathi — Analytics Screen
 * Monthly summary with donut chart, bar graph, and category breakdown.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { useTransactionStore } from '../../src/store/transactionStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Typography, Spacing, Radius } from '../../src/constants/Typography';
import { formatMonthYear } from '../../src/utils/dateUtils';
import { formatCurrency } from '../../src/utils/currency';
import { TransactionType } from '../../src/types';
import DonutChart from '../../src/components/analytics/DonutChart';
import BarGraph from '../../src/components/analytics/BarGraph';
import CategoryBreakdown from '../../src/components/analytics/CategoryBreakdown';
import EmptyState from '../../src/components/ui/EmptyState';
import GradientCard from '../../src/components/ui/GradientCard';
import { subMonths, addMonths } from 'date-fns';

export default function AnalyticsScreen() {
  const theme = useTheme();
  const currency = useSettingsStore((s) => s.currency);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');

  const transactions = useTransactionStore((s) => s.transactions);

  const { income, expense, balance } = React.useMemo(() => 
    useTransactionStore.getState().getMonthlyTotals(selectedMonth),
  [transactions, selectedMonth]);
  
  const categorySummary = React.useMemo(() => 
    useTransactionStore.getState().getCategorySummary(selectedMonth, selectedType),
  [transactions, selectedMonth, selectedType]);
  
  const monthlyTrend = React.useMemo(() => 
    useTransactionStore.getState().getMonthlyTrend(6),
  [transactions]);
  const hasData = income > 0 || expense > 0;

  const navigateMonth = (direction: 'prev' | 'next') => {
    Haptics.selectionAsync();
    setSelectedMonth((curr) =>
      direction === 'prev' ? subMonths(curr, 1) : addMonths(curr, 1)
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={[Typography.displayMedium, { color: theme.text }]}>Analytics</Text>
        </Animated.View>

        {/* Month Selector */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={[styles.monthSelector, { backgroundColor: theme.card }]}
        >
          <Pressable onPress={() => navigateMonth('prev')} hitSlop={12}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={theme.text} />
          </Pressable>
          <Text style={[Typography.headingMedium, { color: theme.text }]}>
            {formatMonthYear(selectedMonth)}
          </Text>
          <Pressable onPress={() => navigateMonth('next')} hitSlop={12}>
            <MaterialCommunityIcons name="chevron-right" size={28} color={theme.text} />
          </Pressable>
        </Animated.View>

        {!hasData ? (
          <EmptyState
            icon="chart-line-variant"
            title="No data for this month"
            description="Add some transactions to see your spending analysis here"
          />
        ) : (
          <>
            {/* Summary Cards */}
            <View style={styles.summaryRow}>
              <GradientCard
                colors={[theme.gradientStart, theme.gradientEnd]}
                style={styles.summaryCard}
                delay={150}
              >
                <Text style={[Typography.labelSmall, { color: 'rgba(255,255,255,0.7)' }]}>
                  NET BALANCE
                </Text>
                <Text style={[Typography.amountMedium, { color: '#FFFFFF', marginTop: 4 }]}>
                  {formatCurrency(balance, currency)}
                </Text>
              </GradientCard>
            </View>

            <View style={styles.miniCardsRow}>
              <Animated.View
                entering={FadeInDown.delay(200).duration(500)}
                style={[styles.miniCard, { backgroundColor: theme.incomeBg }]}
              >
                <MaterialCommunityIcons name="trending-up" size={20} color={theme.income} />
                <Text style={[Typography.labelSmall, { color: theme.income, marginTop: 4 }]}>
                  INCOME
                </Text>
                <Text style={[Typography.amountSmall, { color: theme.income }]}>
                  {formatCurrency(income, currency)}
                </Text>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(250).duration(500)}
                style={[styles.miniCard, { backgroundColor: theme.expenseBg }]}
              >
                <MaterialCommunityIcons name="trending-down" size={20} color={theme.expense} />
                <Text style={[Typography.labelSmall, { color: theme.expense, marginTop: 4 }]}>
                  EXPENSE
                </Text>
                <Text style={[Typography.amountSmall, { color: theme.expense }]}>
                  {formatCurrency(expense, currency)}
                </Text>
              </Animated.View>
            </View>

            {/* Type Toggle */}
            <Animated.View
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.typeToggleContainer}
            >
              <Text style={[Typography.headingMedium, { color: theme.text, marginBottom: Spacing.md }]}>
                Category Breakdown
              </Text>
              <View style={[styles.typeToggle, { backgroundColor: theme.surface }]}>
                {(['expense', 'income'] as TransactionType[]).map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => {
                      setSelectedType(t);
                      Haptics.selectionAsync();
                    }}
                    style={[
                      styles.typeBtn,
                      selectedType === t && {
                        backgroundColor: theme.card,
                        borderColor: theme.primary,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        Typography.buttonSmall,
                        { color: selectedType === t ? theme.primary : theme.textMuted },
                      ]}
                    >
                      {t === 'expense' ? 'Expenses' : 'Income'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>

            {/* Donut Chart */}
            <View style={styles.chartContainer}>
              <DonutChart
                data={categorySummary}
                total={selectedType === 'expense' ? expense : income}
              />
            </View>

            {/* Category Breakdown */}
            <CategoryBreakdown data={categorySummary} />

            {/* Bar Graph */}
            <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.barSection}>
              <Text
                style={[
                  Typography.headingMedium,
                  { color: theme.text, marginBottom: Spacing.md, paddingHorizontal: Spacing.base },
                ]}
              >
                6-Month Trend
              </Text>
              <View style={[styles.barCard, { backgroundColor: theme.card }]}>
                <BarGraph data={monthlyTrend} />
              </View>
            </Animated.View>
          </>
        )}

        <View style={{ height: 40 }} />
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
    marginBottom: Spacing.md,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.base,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
  },
  summaryRow: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  summaryCard: {
    flex: 1,
  },
  miniCardsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.md,
  },
  miniCard: {
    flex: 1,
    padding: Spacing.base,
    borderRadius: Radius.lg,
  },
  typeToggleContainer: {
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.xl,
  },
  typeToggle: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    padding: 4,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  chartContainer: {
    marginVertical: Spacing.xl,
  },
  barSection: {
    marginTop: Spacing.xl,
  },
  barCard: {
    marginHorizontal: Spacing.base,
    padding: Spacing.base,
    borderRadius: Radius.lg,
  },
});
