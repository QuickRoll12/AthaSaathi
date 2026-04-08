/**
 * ArthaSaathi — Date Utility Functions
 * Grouping, formatting, and comparison helpers.
 */

import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  startOfMonth,
  endOfMonth,
  subMonths,
  isSameMonth,
  parseISO,
  getMonth,
  getYear,
} from 'date-fns';

/**
 * Human-friendly date group label.
 */
export function getDateGroupLabel(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isThisWeek(date, { weekStartsOn: 1 })) return 'This Week';
  if (isThisMonth(date)) return 'This Month';
  return format(date, 'MMMM yyyy');
}

/**
 * Short display format.
 * @example "07 Apr" or "25 Dec"
 */
export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM');
}

/**
 * Full display format with day.
 * @example "Mon, 07 Apr 2025"
 */
export function formatFullDate(dateStr: string): string {
  return format(parseISO(dateStr), 'EEE, dd MMM yyyy');
}

/**
 * Month + year label
 * @example "April 2025"
 */
export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy');
}

/**
 * Short month label for chart axis.
 * @example "Apr"
 */
export function formatShortMonth(date: Date): string {
  return format(date, 'MMM');
}

/**
 * Get start and end of a given month.
 */
export function getMonthRange(date: Date): { start: Date; end: Date } {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

/**
 * Generate an array of the last N months as Date objects.
 */
export function getLastNMonths(n: number, from: Date = new Date()): Date[] {
  return Array.from({ length: n }, (_, i) => subMonths(from, i)).reverse();
}

/**
 * Check if two dates fall in the same month & year.
 */
export function isSameMonthYear(date1: string | Date, date2: Date): boolean {
  const d = typeof date1 === 'string' ? parseISO(date1) : date1;
  return isSameMonth(d, date2);
}

/**
 * Get month index (0-11) and year from ISO string.
 */
export function getMonthYearFromISO(iso: string): { month: number; year: number } {
  const d = parseISO(iso);
  return { month: getMonth(d), year: getYear(d) };
}

/**
 * Format a date for form display.
 */
export function formatDateForPicker(date: Date): string {
  return format(date, 'dd MMM yyyy');
}
