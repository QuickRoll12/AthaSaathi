/**
 * ArthaSaathi — Animated Donut Chart
 * Custom SVG-based donut chart with animated segments and center total.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing } from '../../constants/Typography';
import { CategorySummary } from '../../types';
import { formatCurrency, formatCompact } from '../../utils/currency';
import { useSettingsStore } from '../../store/settingsStore';

interface DonutChartProps {
  data: CategorySummary[];
  total: number;
  size?: number;
  strokeWidth?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function DonutChart({
  data,
  total,
  size = 200,
  strokeWidth = 24,
}: DonutChartProps) {
  const theme = useTheme();
  const currency = useSettingsStore((s) => s.currency);
  const progress = useSharedValue(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) });
  }, [data]);

  if (data.length === 0) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={theme.surface}
            strokeWidth={strokeWidth}
            fill="none"
          />
        </Svg>
        <View style={styles.centerLabel}>
          <Text style={[Typography.bodyMedium, { color: theme.textMuted }]}>No data</Text>
        </View>
      </View>
    );
  }

  let cumulativeOffset = 0;

  return (
    <Animated.View entering={FadeIn.duration(600)} style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.surface}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Segments */}
        <G rotation="-90" origin={`${center}, ${center}`}>
          {data.map((item, index) => {
            const segmentLength = (item.percentage / 100) * circumference;
            const offset = cumulativeOffset;
            cumulativeOffset += segmentLength;

            return (
              <Circle
                key={item.categoryId}
                cx={center}
                cy={center}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            );
          })}
        </G>
      </Svg>

      {/* Center label */}
      <View style={styles.centerLabel}>
        <Text style={[Typography.labelSmall, { color: theme.textMuted }]}>TOTAL</Text>
        <Text style={[Typography.amountMedium, { color: theme.text }]}>
          {formatCompact(total, currency)}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  centerLabel: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
