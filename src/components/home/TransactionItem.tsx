/**
 * ArthaSaathi — Transaction Item (Swipeable)
 * Individual transaction row with swipe-to-delete and category styling.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  Layout,
  FadeOut,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, Radius } from '../../constants/Typography';
import { formatCurrency } from '../../utils/currency';
import { formatShortDate } from '../../utils/dateUtils';
import { getCategoryById } from '../../constants/Categories';
import { Transaction } from '../../types';
import { useSettingsStore } from '../../store/settingsStore';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete?: (id: string) => void;
  onPress?: (transaction: Transaction) => void;
  index?: number;
}

const SWIPE_THRESHOLD = -80;

export default function TransactionItem({
  transaction,
  onDelete,
  onPress,
  index = 0,
}: TransactionItemProps) {
  const theme = useTheme();
  const currency = useSettingsStore((s) => s.currency);
  const category = getCategoryById(transaction.category);
  const isIncome = transaction.type === 'income';
  const translateX = useSharedValue(0);

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onDelete?.(transaction.id);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = Math.max(e.translationX, -120);
      }
    })
    .onEnd((e) => {
      if (e.translationX < SWIPE_THRESHOLD) {
        translateX.value = withSpring(-120);
        runOnJS(handleDelete)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const itemStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -20 ? 1 : 0,
  }));

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 60).duration(400).springify()}
      exiting={FadeOut.duration(300)}
      layout={Layout.springify()}
      style={styles.wrapper}
    >
      {/* Delete background */}
      <Animated.View style={[styles.deleteAction, { backgroundColor: theme.expense }, deleteStyle]}>
        <MaterialCommunityIcons name="delete-outline" size={24} color="#FFFFFF" />
        <Text style={[Typography.labelSmall, { color: '#FFFFFF' }]}>Delete</Text>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.container,
            { backgroundColor: theme.card },
            itemStyle,
          ]}
        >
          <Pressable
            style={styles.pressable}
            onPress={() => onPress?.(transaction)}
            android_ripple={{ color: theme.surface }}
          >
            {/* Category icon */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${category.color}20` },
              ]}
            >
              <MaterialCommunityIcons
                name={category.icon as any}
                size={22}
                color={category.color}
              />
            </View>

            {/* Details */}
            <View style={styles.details}>
              <Text
                style={[Typography.headingSmall, { color: theme.text }]}
                numberOfLines={1}
              >
                {category.name}
              </Text>
              <Text
                style={[Typography.caption, { color: theme.textMuted, marginTop: 2 }]}
                numberOfLines={1}
              >
                {transaction.note || formatShortDate(transaction.date)}
              </Text>
            </View>

            {/* Amount */}
            <View style={styles.amountContainer}>
              <Text
                style={[
                  Typography.amountSmall,
                  {
                    color: isIncome ? theme.income : theme.expense,
                  },
                ]}
              >
                {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
              </Text>
              <Text style={[Typography.caption, { color: theme.textMuted, marginTop: 2 }]}>
                {formatShortDate(transaction.date)}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  deleteAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  container: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
});
