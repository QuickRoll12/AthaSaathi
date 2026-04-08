/**
 * ArthaSaathi — Home Screen
 * Displays balance card, quick stats, and recent transactions.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useTransactionStore } from '../../src/store/transactionStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Typography, Spacing, Radius } from '../../src/constants/Typography';
import BalanceCard from '../../src/components/home/BalanceCard';
import TransactionItem from '../../src/components/home/TransactionItem';
import QuickStats from '../../src/components/home/QuickStats';
import EmptyState from '../../src/components/ui/EmptyState';
import AddTransactionSheet from '../../src/components/modals/AddTransactionSheet';
import NotificationsSheet from '../../src/components/modals/NotificationsSheet';
import SnackBar from '../../src/components/ui/SnackBar';
import { format } from 'date-fns';

export default function HomeScreen() {
  const theme = useTheme();
  const profile = useSettingsStore((s) => s.profile);
  const transactions = useTransactionStore((s) => s.transactions);
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction);

  const { income, expense, balance } = React.useMemo(() => 
    useTransactionStore.getState().getMonthlyTotals(new Date()),
  [transactions]);
  
  const recentTransactions = React.useMemo(() => 
    useTransactionStore.getState().getRecentTransactions(10),
  [transactions]);

  const monthlyBudget = useSettingsStore((s) => s.monthlyBudget);
  const hasAlerts = monthlyBudget > 0 && expense / monthlyBudget >= 0.8;

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', undoId: '' });
  const [deletedTx, setDeletedTx] = useState<any>(null);

  const handleDelete = useCallback((id: string) => {
    const tx = recentTransactions.find((t) => t.id === id);
    if (tx) {
      setDeletedTx(tx);
      deleteTransaction(id);
      setSnackbar({ visible: true, message: 'Transaction deleted', undoId: id });
    }
  }, [recentTransactions]);

  const handleUndo = useCallback(() => {
    if (deletedTx) {
      useTransactionStore.getState().addTransaction(deletedTx);
      setDeletedTx(null);
      setSnackbar({ visible: false, message: '', undoId: '' });
    }
  }, [deletedTx]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)} style={styles.header}>
          <View>
            <Text style={[Typography.bodyMedium, { color: theme.textSecondary }]}>
              {greeting()} 👋
            </Text>
            <Text style={[Typography.headingLarge, { color: theme.text, marginTop: 2 }]}>
              {profile.name || 'ArthaSaathi'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable
              style={[styles.notifBadge, { backgroundColor: theme.surface }]}
              onPress={() => setShowNotifications(true)}
            >
              <MaterialCommunityIcons name="bell-outline" size={22} color={theme.text} />
              {hasAlerts && (
                <View style={styles.badgeDot} />
              )}
            </Pressable>
          </View>
        </Animated.View>

        {/* Balance Card */}
        <BalanceCard
          totalBalance={balance}
          income={income}
          expense={expense}
        />

        {/* Quick Stats */}
        <QuickStats
          income={income}
          expense={expense}
          transactionCount={recentTransactions.length}
        />

        {/* Budget Alert Inline Card */}
        {hasAlerts && (
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.budgetAlertBox}>
            <View style={styles.budgetAlertIcon}>
              <MaterialCommunityIcons name="alert-decagram" size={24} color="#FF6B6B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[Typography.headingSmall, { color: theme.text }]}>
                Budget Warning
              </Text>
              <Text style={[Typography.bodySmall, { color: theme.textSecondary, marginTop: 2 }]}>
                You have consumed {Math.round((expense / monthlyBudget) * 100)}% of your monthly budget (₹{monthlyBudget}).
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Recent Transactions */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.sectionHeader}>
          <Text style={[Typography.headingMedium, { color: theme.text }]}>
            Recent Transactions
          </Text>
          <Text style={[Typography.caption, { color: theme.textMuted }]}>
            {format(new Date(), 'MMMM yyyy')}
          </Text>
        </Animated.View>

        {recentTransactions.length === 0 ? (
          <EmptyState
            icon="wallet-plus-outline"
            title="No transactions yet"
            description="Tap the + button to add your first income or expense"
            actionLabel="Add Transaction"
            onAction={() => setShowAddSheet(true)}
          />
        ) : (
          recentTransactions.map((tx, index) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onDelete={handleDelete}
              index={index}
            />
          ))
        )}

        {/* Bottom padding for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(400)}
        style={styles.fabContainer}
      >
        <Pressable
          style={[styles.fab, { backgroundColor: theme.fab }]}
          onPress={() => setShowAddSheet(true)}
          android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true }}
        >
          <MaterialCommunityIcons name="plus" size={28} color={theme.fabIcon} />
        </Pressable>
      </Animated.View>

      {/* Sheets */}
      <AddTransactionSheet
        visible={showAddSheet}
        onClose={() => setShowAddSheet(false)}
      />
      
      <NotificationsSheet
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Snackbar */}
      <SnackBar
        message={snackbar.message}
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '', undoId: '' })}
        onAction={handleUndo}
        actionLabel="Undo"
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  notifBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  budgetAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  budgetAlertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
