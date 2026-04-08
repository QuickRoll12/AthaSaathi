/**
 * ArthaSaathi — Category Breakdown
 * List of category spending with progress bars and percentages.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, Radius } from '../../constants/Typography';
import { CategorySummary } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { useSettingsStore } from '../../store/settingsStore';
import { useEffect } from 'react';

interface CategoryBreakdownProps {
  data: CategorySummary[];
}

function CategoryRow({ item, index }: { item: CategorySummary; index: number }) {
  const theme = useTheme();
  const currency = useSettingsStore((s) => s.currency);
  const barWidth = useSharedValue(0);

  useEffect(() => {
    barWidth.value = withDelay(
      index * 100 + 200,
      withTiming(item.percentage, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
  }, [item.percentage]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%`,
    backgroundColor: item.color,
    height: 6,
    borderRadius: 3,
  }));

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).duration(400)}
      style={[styles.row, { backgroundColor: theme.card }]}
    >
      <View style={styles.rowTop}>
        <View style={styles.rowLeft}>
          <View style={[styles.iconBg, { backgroundColor: `${item.color}20` }]}>
            <MaterialCommunityIcons name={item.icon as any} size={18} color={item.color} />
          </View>
          <View>
            <Text style={[Typography.bodyMedium, { color: theme.text }]} numberOfLines={1}>
              {item.categoryName}
            </Text>
            <Text style={[Typography.caption, { color: theme.textMuted }]}>
              {item.count} transaction{item.count !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        <View style={styles.rowRight}>
          <Text style={[Typography.amountSmall, { color: theme.text }]}>
            {formatCurrency(item.total, currency)}
          </Text>
          <Text style={[Typography.caption, { color: item.color }]}>
            {item.percentage}%
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[styles.barTrack, { backgroundColor: theme.surface }]}>
        <Animated.View style={barStyle} />
      </View>
    </Animated.View>
  );
}

export default function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const theme = useTheme();

  if (data.length === 0) return null;

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <CategoryRow key={item.categoryId} item={item} index={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
  },
  row: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
});
