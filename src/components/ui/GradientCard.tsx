/**
 * ArthaSaathi — GradientCard
 * Premium glassmorphic card with linear gradient background.
 */

import React from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Radius } from '../../constants/Typography';

interface GradientCardProps {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
  children: React.ReactNode;
  delay?: number;
}

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export default function GradientCard({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  children,
  delay = 0,
}: GradientCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(600).springify()}
      style={[styles.wrapper, style]}
    >
      <LinearGradient
        colors={colors as any}
        start={start}
        end={end}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: Radius.xl,
    padding: 20,
  },
});
