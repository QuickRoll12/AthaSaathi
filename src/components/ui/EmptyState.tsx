/**
 * ArthaSaathi — Smart Empty State
 * Beautifully animated empty states with contextual messaging.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp, BounceIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing } from '../../constants/Typography';
import Button from './Button';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Animated.View
        entering={BounceIn.delay(200).duration(800)}
        style={[styles.iconContainer, { backgroundColor: theme.surface }]}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={48}
          color={theme.primary}
        />
      </Animated.View>

      <Animated.Text
        entering={FadeInUp.delay(400).duration(500)}
        style={[Typography.headingMedium, { color: theme.text, marginTop: Spacing.lg }]}
      >
        {title}
      </Animated.Text>

      <Animated.Text
        entering={FadeInUp.delay(500).duration(500)}
        style={[
          Typography.bodyMedium,
          {
            color: theme.textSecondary,
            textAlign: 'center',
            marginTop: Spacing.sm,
            paddingHorizontal: Spacing.xxl,
          },
        ]}
      >
        {description}
      </Animated.Text>

      {actionLabel && onAction && (
        <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.actionButton}>
          <Button title={actionLabel} onPress={onAction} variant="primary" size="md" />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.huge,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    marginTop: Spacing.xl,
  },
});
