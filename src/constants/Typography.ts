/**
 * ArthaSaathi — Typography Scale System
 * Consistent, accessible type sizing based on Poppins.
 */

import { TextStyle, Platform } from 'react-native';

const fontFamily = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  mono: 'SpaceMono-Regular',
};

interface TypeStyle extends TextStyle {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
}

// Scale: display → caption
export const Typography: Record<string, TypeStyle> = {
  // Hero text — splash / balance
  displayLarge: {
    fontFamily: fontFamily.bold,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.5,
  },

  // Screen titles
  displayMedium: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
  },

  // Section headings
  headingLarge: {
    fontFamily: fontFamily.semibold,
    fontSize: 22,
    lineHeight: 30,
  },

  headingMedium: {
    fontFamily: fontFamily.semibold,
    fontSize: 18,
    lineHeight: 26,
  },

  headingSmall: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    lineHeight: 22,
  },

  // Body copy
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
  },

  bodyMedium: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
  },

  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
  },

  // Amounts (mono for digit alignment)
  amountLarge: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },

  amountMedium: {
    fontFamily: fontFamily.semibold,
    fontSize: 20,
    lineHeight: 28,
  },

  amountSmall: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 22,
  },

  // Labels & chips
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.3,
  },

  labelSmall: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
  },

  // Captions
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },

  // Button text
  button: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.3,
  },

  buttonSmall: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
};

export const FontFamilies = fontFamily;

// Spacing scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
} as const;

// Border radius scale
export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;
