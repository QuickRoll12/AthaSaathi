/**
 * ArthaSaathi — Core Type Definitions
 * Single source of truth for all data structures.
 */

// ─── Transaction Types ───────────────────────────────────────────────

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: string; // ISO 8601 string
  createdAt: string;
}

export interface TransactionFormData {
  type: TransactionType;
  amount: string;
  category: string;
  note: string;
  date: Date;
}

// ─── Category Types ──────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  icon: string; // MaterialCommunityIcons name
  color: string;
  type: TransactionType | 'both';
}

// ─── Analytics Types ─────────────────────────────────────────────────

export interface MonthlySummary {
  month: number; // 0-11
  year: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  icon: string;
  color: string;
  total: number;
  percentage: number;
  count: number;
}

// ─── Settings Types ──────────────────────────────────────────────────

export type ThemeMode = 'dark' | 'light';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarInitial: string;
}

export interface AppSettings {
  theme: ThemeMode;
  currency: CurrencyCode;
  hasCompletedOnboarding: boolean;
  isAuthenticated: boolean;
  monthlyBudget: number;
  profile: UserProfile;
}

// ─── Navigation Types ────────────────────────────────────────────────

export type TabRoute = 'index' | 'analytics' | 'transactions' | 'settings';

// ─── Filter & Sort ───────────────────────────────────────────────────

export type TransactionFilter = 'all' | 'income' | 'expense';
export type SortOrder = 'newest' | 'oldest' | 'highest' | 'lowest';

export interface DateRange {
  start: Date;
  end: Date;
}
