/**
 * ArthaSaathi — Design System Colors
 * Premium fintech color palette with dark & light theme support.
 */

export interface ThemeColors {
  // ─── Backgrounds ─────────────────────
  background: string;
  card: string;
  surface: string;
  surfaceElevated: string;

  // ─── Text ────────────────────────────
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // ─── Brand ───────────────────────────
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // ─── Semantic ────────────────────────
  income: string;
  incomeBg: string;
  expense: string;
  expenseBg: string;
  warning: string;
  warningBg: string;

  // ─── Gradients ───────────────────────
  gradientStart: string;
  gradientEnd: string;
  cardGradientStart: string;
  cardGradientEnd: string;
  balanceGradientStart: string;
  balanceGradientMid: string;
  balanceGradientEnd: string;

  // ─── UI Elements ─────────────────────
  border: string;
  borderLight: string;
  inputBg: string;
  tabBarBg: string;
  tabBarActive: string;
  tabBarInactive: string;
  shimmer: string;
  overlay: string;
  fab: string;
  fabIcon: string;
}

export const DarkColors: ThemeColors = {
  // Backgrounds
  background: '#0A0A1B',
  card: '#141428',
  surface: '#1E1E38',
  surfaceElevated: '#282850',

  // Text
  text: '#FFFFFF',
  textSecondary: '#B4B4CC',
  textMuted: '#6B6B8D',
  textInverse: '#0A0A1B',

  // Brand
  primary: '#7C5CFC',
  primaryLight: '#9B7EFF',
  primaryDark: '#5B3FD4',

  // Semantic
  income: '#00D4AA',
  incomeBg: 'rgba(0, 212, 170, 0.12)',
  expense: '#FF6B6B',
  expenseBg: 'rgba(255, 107, 107, 0.12)',
  warning: '#FFB547',
  warningBg: 'rgba(255, 181, 71, 0.12)',

  // Gradients
  gradientStart: '#7C5CFC',
  gradientEnd: '#00D4AA',
  cardGradientStart: '#1E1E38',
  cardGradientEnd: '#141428',
  balanceGradientStart: '#7C5CFC',
  balanceGradientMid: '#5BAFB0',
  balanceGradientEnd: '#00D4AA',

  // UI
  border: '#2A2A4A',
  borderLight: '#1E1E38',
  inputBg: '#1A1A30',
  tabBarBg: '#0F0F24',
  tabBarActive: '#7C5CFC',
  tabBarInactive: '#6B6B8D',
  shimmer: '#1E1E38',
  overlay: 'rgba(0, 0, 0, 0.7)',
  fab: '#7C5CFC',
  fabIcon: '#FFFFFF',
};

export const LightColors: ThemeColors = {
  // Backgrounds
  background: '#F5F5FA',
  card: '#FFFFFF',
  surface: '#F0F0F8',
  surfaceElevated: '#FFFFFF',

  // Text
  text: '#1A1A2E',
  textSecondary: '#6B6B8D',
  textMuted: '#9B9BB5',
  textInverse: '#FFFFFF',

  // Brand
  primary: '#7C5CFC',
  primaryLight: '#9B7EFF',
  primaryDark: '#5B3FD4',

  // Semantic
  income: '#00B894',
  incomeBg: 'rgba(0, 184, 148, 0.10)',
  expense: '#FF6B6B',
  expenseBg: 'rgba(255, 107, 107, 0.10)',
  warning: '#F0A030',
  warningBg: 'rgba(240, 160, 48, 0.10)',

  // Gradients
  gradientStart: '#7C5CFC',
  gradientEnd: '#00D4AA',
  cardGradientStart: '#FFFFFF',
  cardGradientEnd: '#F5F5FA',
  balanceGradientStart: '#7C5CFC',
  balanceGradientMid: '#5BAFB0',
  balanceGradientEnd: '#00D4AA',

  // UI
  border: '#E8E8F0',
  borderLight: '#F0F0F8',
  inputBg: '#F5F5FA',
  tabBarBg: '#FFFFFF',
  tabBarActive: '#7C5CFC',
  tabBarInactive: '#9B9BB5',
  shimmer: '#E8E8F0',
  overlay: 'rgba(0, 0, 0, 0.4)',
  fab: '#7C5CFC',
  fabIcon: '#FFFFFF',
};

export const SharedColors = {
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Category Colors (consistent across themes)
  categoryColors: [
    '#7C5CFC', // Purple
    '#00D4AA', // Teal
    '#FF6B6B', // Coral
    '#FFB547', // Amber
    '#4ECDC4', // Mint
    '#FF8A5C', // Peach
    '#5B7FFF', // Blue
    '#FF5CA8', // Pink
    '#45B7D1', // Sky
    '#96CEB4', // Sage
    '#FFEAA7', // Gold
    '#DDA0DD', // Plum
    '#98D8C8', // Seafoam
    '#F7DC6F', // Sunshine
    '#BB8FCE', // Lavender
  ],
};
