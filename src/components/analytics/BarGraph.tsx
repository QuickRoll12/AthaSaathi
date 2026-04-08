/**
 * ArthaSaathi — Animated Bar Graph
 * Monthly income vs expense comparison with animated bars.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  FadeInUp,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, Radius } from '../../constants/Typography';
import { formatCompact } from '../../utils/currency';
import { formatShortMonth } from '../../utils/dateUtils';
import { useSettingsStore } from '../../store/settingsStore';

interface BarData {
  month: Date;
  income: number;
  expense: number;
}

interface BarGraphProps {
  data: BarData[];
  height?: number;
}

function AnimatedBar({
  value,
  maxValue,
  color,
  barHeight,
  delay,
}: {
  value: number;
  maxValue: number;
  color: string;
  barHeight: number;
  delay: number;
}) {
  const heightAnim = useSharedValue(0);

  useEffect(() => {
    const targetHeight = maxValue > 0 ? (value / maxValue) * barHeight : 0;
    heightAnim.value = withDelay(
      delay,
      withTiming(targetHeight, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
  }, [value, maxValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: heightAnim.value,
    backgroundColor: color,
    width: 14,
    borderRadius: 7,
    minHeight: value > 0 ? 4 : 0,
  }));

  return <Animated.View style={animatedStyle} />;
}

export default function BarGraph({ data, height = 160 }: BarGraphProps) {
  const theme = useTheme();
  const currency = useSettingsStore((s) => s.currency);

  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.income, d.expense)),
    1
  );

  return (
    <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.container}>
      <View style={[styles.chartArea, { height }]}>
        {data.map((item, index) => (
          <View key={index} style={styles.barGroup}>
            <View style={styles.barsContainer}>
              <AnimatedBar
                value={item.income}
                maxValue={maxValue}
                color={theme.income}
                barHeight={height - 30}
                delay={index * 100}
              />
              <AnimatedBar
                value={item.expense}
                maxValue={maxValue}
                color={theme.expense}
                barHeight={height - 30}
                delay={index * 100 + 50}
              />
            </View>
            <Text style={[Typography.caption, { color: theme.textMuted, marginTop: Spacing.xs }]}>
              {formatShortMonth(item.month)}
            </Text>
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.income }]} />
          <Text style={[Typography.caption, { color: theme.textSecondary }]}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.expense }]} />
          <Text style={[Typography.caption, { color: theme.textSecondary }]}>Expense</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  barGroup: {
    alignItems: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
