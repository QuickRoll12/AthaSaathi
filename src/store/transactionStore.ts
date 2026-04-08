/**
 * ArthaSaathi — Transaction Store (Zustand)
 * Full CRUD with AsyncStorage persistence, computed selectors, and category analytics.
 */

import { create } from 'zustand';
import { Transaction, TransactionType, TransactionFilter, CategorySummary } from '../types';
import { saveData, loadData, STORAGE_KEYS } from '../utils/storage';
import { getCategoryById } from '../constants/Categories';
import { isSameMonthYear, getMonthYearFromISO } from '../utils/dateUtils';
import { parseISO, isAfter, isBefore, startOfMonth, endOfMonth } from 'date-fns';

interface TransactionState {
  transactions: Transaction[];
  isLoaded: boolean;

  // Actions
  loadTransactions: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;

  // Selectors
  getFilteredTransactions: (filter: TransactionFilter, searchQuery?: string) => Transaction[];
  getTransactionsForMonth: (date: Date) => Transaction[];
  getMonthlyTotals: (date: Date) => { income: number; expense: number; balance: number };
  getCategorySummary: (date: Date, type: TransactionType) => CategorySummary[];
  getMonthlyTrend: (months: number) => Array<{ month: Date; income: number; expense: number }>;
  getRecentTransactions: (count: number) => Transaction[];
}

/**
 * Generate a unique ID (UUID-like).
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoaded: false,

  // ─── Actions ──────────────────────────────────────────────

  loadTransactions: async () => {
    const saved = await loadData<Transaction[]>(STORAGE_KEYS.TRANSACTIONS);
    if (saved) {
      set({ transactions: saved, isLoaded: true });
    } else {
      set({ isLoaded: true });
    }
  },

  addTransaction: (txData) => {
    const newTx: Transaction = {
      ...txData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const updated = [newTx, ...state.transactions];
      saveData(STORAGE_KEYS.TRANSACTIONS, updated);
      return { transactions: updated };
    });
  },

  deleteTransaction: (id) => {
    set((state) => {
      const updated = state.transactions.filter((t) => t.id !== id);
      saveData(STORAGE_KEYS.TRANSACTIONS, updated);
      return { transactions: updated };
    });
  },

  updateTransaction: (id, data) => {
    set((state) => {
      const updated = state.transactions.map((t) =>
        t.id === id ? { ...t, ...data } : t
      );
      saveData(STORAGE_KEYS.TRANSACTIONS, updated);
      return { transactions: updated };
    });
  },

  // ─── Selectors ────────────────────────────────────────────

  getFilteredTransactions: (filter, searchQuery = '') => {
    let txs = get().transactions;

    // Filter by type
    if (filter !== 'all') {
      txs = txs.filter((t) => t.type === filter);
    }

    // Filter by search query (category name or note)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      txs = txs.filter((t) => {
        const category = getCategoryById(t.category);
        return (
          category.name.toLowerCase().includes(q) ||
          t.note.toLowerCase().includes(q) ||
          t.amount.toString().includes(q)
        );
      });
    }

    // Sort newest first
    return txs.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
  },

  getTransactionsForMonth: (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    return get()
      .transactions.filter((t) => {
        const d = parseISO(t.date);
        return (isAfter(d, start) || d.getTime() === start.getTime()) &&
               (isBefore(d, end) || d.getTime() === end.getTime());
      })
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
  },

  getMonthlyTotals: (date: Date) => {
    const monthTxs = get().getTransactionsForMonth(date);
    const income = monthTxs
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTxs
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense, balance: income - expense };
  },

  getCategorySummary: (date: Date, type: TransactionType) => {
    const monthTxs = get()
      .getTransactionsForMonth(date)
      .filter((t) => t.type === type);

    const total = monthTxs.reduce((sum, t) => sum + t.amount, 0);
    if (total === 0) return [];

    // Group by category
    const categoryMap: Record<string, { total: number; count: number }> = {};

    monthTxs.forEach((t) => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = { total: 0, count: 0 };
      }
      categoryMap[t.category].total += t.amount;
      categoryMap[t.category].count += 1;
    });

    return Object.entries(categoryMap)
      .map(([catId, data]) => {
        const category = getCategoryById(catId);
        return {
          categoryId: catId,
          categoryName: category.name,
          icon: category.icon,
          color: category.color,
          total: data.total,
          percentage: Math.round((data.total / total) * 100),
          count: data.count,
        };
      })
      .sort((a, b) => b.total - a.total);
  },

  getMonthlyTrend: (months: number) => {
    const now = new Date();
    const result: Array<{ month: Date; income: number; expense: number }> = [];

    for (let i = months - 1; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const totals = get().getMonthlyTotals(monthDate);
      result.push({
        month: monthDate,
        income: totals.income,
        expense: totals.expense,
      });
    }

    return result;
  },

  getRecentTransactions: (count: number) => {
    return get()
      .transactions.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
      .slice(0, count);
  },
}));
