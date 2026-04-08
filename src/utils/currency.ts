/**
 * ArthaSaathi — Currency Formatting Utilities
 * Handles INR-first formatting with support for other currencies.
 */

import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee',    locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar',        locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro',             locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound',    locale: 'en-GB' },
};

/**
 * Formats a number as currency string.
 * @example formatCurrency(150000, 'INR') → "₹1,50,000"
 */
export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode = 'INR'
): string {
  const config = CURRENCIES[currencyCode];

  if (currencyCode === 'INR') {
    // Indian grouping: 1,23,456.78
    return `${config.symbol}${formatIndianNumber(amount)}`;
  }

  return `${config.symbol}${amount.toLocaleString(config.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format number in Indian grouping (lakhs & crores).
 */
function formatIndianNumber(num: number): string {
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const parts = absNum.toFixed(2).split('.');
  const intPart = parts[0];
  const decPart = parts[1] === '00' ? '' : `.${parts[1]}`;

  // Apply Indian comma grouping
  let result = '';
  const len = intPart.length;

  if (len <= 3) {
    result = intPart;
  } else {
    result = intPart.substring(len - 3);
    let remaining = intPart.substring(0, len - 3);

    while (remaining.length > 2) {
      result = remaining.substring(remaining.length - 2) + ',' + result;
      remaining = remaining.substring(0, remaining.length - 2);
    }
    if (remaining.length > 0) {
      result = remaining + ',' + result;
    }
  }

  return `${isNegative ? '-' : ''}${result}${decPart}`;
}

/**
 * Compact formatting for charts / badges.
 * @example formatCompact(150000) → "1.5L"
 */
export function formatCompact(amount: number, currencyCode: CurrencyCode = 'INR'): string {
  const config = CURRENCIES[currencyCode];
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (currencyCode === 'INR') {
    if (abs >= 10000000) return `${sign}${config.symbol}${(abs / 10000000).toFixed(1)}Cr`;
    if (abs >= 100000) return `${sign}${config.symbol}${(abs / 100000).toFixed(1)}L`;
    if (abs >= 1000) return `${sign}${config.symbol}${(abs / 1000).toFixed(1)}K`;
    return `${sign}${config.symbol}${abs}`;
  }

  if (abs >= 1000000) return `${sign}${config.symbol}${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${sign}${config.symbol}${(abs / 1000).toFixed(1)}K`;
  return `${sign}${config.symbol}${abs}`;
}
