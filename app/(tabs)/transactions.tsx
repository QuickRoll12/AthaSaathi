/**
 * ArthaSaathi — Transactions (History) Screen
 * Searchable, filterable list of all transactions with swipe-to-delete.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, SectionList } from 'react-native';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { useTransactionStore } from '../../src/store/transactionStore';
import { Typography, Spacing, Radius } from '../../src/constants/Typography';
import { TransactionFilter, Transaction } from '../../src/types';
import TransactionItem from '../../src/components/home/TransactionItem';
import EmptyState from '../../src/components/ui/EmptyState';
import AddTransactionSheet from '../../src/components/modals/AddTransactionSheet';
import SnackBar from '../../src/components/ui/SnackBar';
import { getDateGroupLabel } from '../../src/utils/dateUtils';

const FILTERS: { label: string; value: TransactionFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
];

export default function TransactionsScreen() {
  const theme = useTheme();
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const [search, setSearch] = useState('');
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [deletedTx, setDeletedTx] = useState<Transaction | null>(null);

  const transactions = useTransactionStore((s) => s.transactions);
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction);
  const addTransaction = useTransactionStore((s) => s.addTransaction);

  const filteredTransactions = useMemo(
    () => useTransactionStore.getState().getFilteredTransactions(filter, search),
    [filter, search, transactions]
  );

  // Group transactions by date
  const sections = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach((tx) => {
      const label = getDateGroupLabel(tx.date);
      if (!groups[label]) groups[label] = [];
      groups[label].push(tx);
    });
    return Object.entries(groups).map(([title, data]) => ({ title, data }));
  }, [filteredTransactions]);

  const handleDelete = useCallback((id: string) => {
    const tx = filteredTransactions.find((t) => t.id === id);
    if (tx) {
      setDeletedTx(tx);
      deleteTransaction(id);
      setSnackbar({ visible: true, message: 'Transaction deleted' });
    }
  }, [filteredTransactions]);

  const handleUndo = useCallback(() => {
    if (deletedTx) {
      addTransaction(deletedTx);
      setDeletedTx(null);
      setSnackbar({ visible: false, message: '' });
    }
  }, [deletedTx]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <Text style={[Typography.displayMedium, { color: theme.text }]}>
          Transactions
        </Text>
        <Text style={[Typography.bodyMedium, { color: theme.textSecondary, marginTop: 4 }]}>
          {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
        </Text>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(500)}
        style={[styles.searchContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
      >
        <MaterialCommunityIcons name="magnify" size={20} color={theme.textMuted} />
        <TextInput
          style={[Typography.bodyMedium, { color: theme.text, flex: 1, padding: 0 }]}
          placeholder="Search by category, note, amount..."
          placeholderTextColor={theme.textMuted}
          value={search}
          onChangeText={setSearch}
          cursorColor={theme.primary}
        />
        {search !== '' && (
          <Pressable onPress={() => setSearch('')} hitSlop={8}>
            <MaterialCommunityIcons name="close-circle" size={18} color={theme.textMuted} />
          </Pressable>
        )}
      </Animated.View>

      {/* Filter Chips */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.value}
            onPress={() => {
              setFilter(f.value);
              Haptics.selectionAsync();
            }}
            style={[
              styles.chip,
              {
                backgroundColor: filter === f.value ? `${theme.primary}20` : theme.surface,
                borderColor: filter === f.value ? theme.primary : 'transparent',
                borderWidth: filter === f.value ? 1 : 0,
              },
            ]}
          >
            <Text
              style={[
                Typography.label,
                { color: filter === f.value ? theme.primary : theme.textSecondary },
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </Animated.View>

      {/* Transaction List */}
      {sections.length === 0 ? (
        <EmptyState
          icon="text-search"
          title={search ? 'No results found' : 'No transactions'}
          description={
            search
              ? `No transactions matching "${search}"`
              : 'Your transaction history will appear here'
          }
          actionLabel={!search ? 'Add Transaction' : undefined}
          onAction={!search ? () => setShowAddSheet(true) : undefined}
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { title } }) => (
            <Text
              style={[
                Typography.label,
                {
                  color: theme.textMuted,
                  paddingHorizontal: Spacing.lg,
                  paddingTop: Spacing.md,
                  paddingBottom: Spacing.sm,
                },
              ]}
            >
              {title}
            </Text>
          )}
          renderItem={({ item, index }) => (
            <TransactionItem
              transaction={item}
              onDelete={handleDelete}
              index={index}
            />
          )}
        />
      )}

      {/* FAB */}
      <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.fabContainer}>
        <Pressable
          style={[styles.fab, { backgroundColor: theme.fab }]}
          onPress={() => setShowAddSheet(true)}
          android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true }}
        >
          <MaterialCommunityIcons name="plus" size={28} color={theme.fabIcon} />
        </Pressable>
      </Animated.View>

      {/* Add Transaction Sheet */}
      <AddTransactionSheet
        visible={showAddSheet}
        onClose={() => setShowAddSheet(false)}
      />

      {/* Snackbar */}
      <SnackBar
        message={snackbar.message}
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        onAction={handleUndo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
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
