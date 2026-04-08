/**
 * ArthaSaathi — Predefined Category System
 * Rich category set with Indian context (e.g., Chai, Auto-rickshaw, etc.)
 */

import { Category } from '../types';
import { SharedColors } from './Colors';

const cc = SharedColors.categoryColors;

export const DEFAULT_CATEGORIES: Category[] = [
  // ─── Expense Categories ────────────────────────────────
  { id: 'food',          name: 'Food & Dining',    icon: 'food',                  color: cc[0],  type: 'expense' },
  { id: 'transport',     name: 'Transport',         icon: 'bus',                   color: cc[1],  type: 'expense' },
  { id: 'shopping',      name: 'Shopping',          icon: 'shopping',              color: cc[2],  type: 'expense' },
  { id: 'bills',         name: 'Bills & Recharges', icon: 'receipt',               color: cc[3],  type: 'expense' },
  { id: 'entertainment', name: 'Entertainment',     icon: 'movie-open',            color: cc[4],  type: 'expense' },
  { id: 'health',        name: 'Health',            icon: 'hospital-box',          color: cc[5],  type: 'expense' },
  { id: 'education',     name: 'Education',         icon: 'school',                color: cc[6],  type: 'expense' },
  { id: 'groceries',     name: 'Groceries',         icon: 'cart',                  color: cc[7],  type: 'expense' },
  { id: 'rent',          name: 'Rent',              icon: 'home-city',             color: cc[8],  type: 'expense' },
  { id: 'fuel',          name: 'Fuel',              icon: 'gas-station',           color: cc[9],  type: 'expense' },
  { id: 'subscriptions', name: 'Subscriptions',     icon: 'cellphone-play',        color: cc[10], type: 'expense' },
  { id: 'other_expense', name: 'Other',             icon: 'dots-horizontal-circle',color: cc[11], type: 'expense' },

  // ─── Income Categories ─────────────────────────────────
  { id: 'salary',        name: 'Salary',            icon: 'cash-multiple',         color: cc[1],  type: 'income' },
  { id: 'freelance',     name: 'Freelance',         icon: 'laptop',                color: cc[0],  type: 'income' },
  { id: 'investment',    name: 'Investments',        icon: 'chart-line',            color: cc[4],  type: 'income' },
  { id: 'gift',          name: 'Gift',              icon: 'gift',                  color: cc[7],  type: 'income' },
  { id: 'refund',        name: 'Refund',            icon: 'cash-refund',           color: cc[8],  type: 'income' },
  { id: 'other_income',  name: 'Other',             icon: 'dots-horizontal-circle',color: cc[14], type: 'income' },
];

/**
 * Look up a category by its ID. Returns fallback if not found.
 */
export function getCategoryById(id: string): Category {
  return (
    DEFAULT_CATEGORIES.find((c) => c.id === id) ?? {
      id: 'unknown',
      name: 'Unknown',
      icon: 'help-circle',
      color: '#6B6B8D',
      type: 'both',
    }
  );
}

/**
 * Get categories filtered by transaction type.
 */
export function getCategoriesByType(type: 'income' | 'expense'): Category[] {
  return DEFAULT_CATEGORIES.filter((c) => c.type === type || c.type === 'both');
}
