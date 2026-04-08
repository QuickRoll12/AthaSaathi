/**
 * ArthaSaathi — SnackBar
 * Slide-up notification with undo action.
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, Radius } from '../../constants/Typography';

interface SnackBarProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

export default function SnackBar({
  message,
  visible,
  onDismiss,
  actionLabel = 'Undo',
  onAction,
  duration = 3000,
}: SnackBarProps) {
  const theme = useTheme();
  const translateY = useSharedValue(100);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      // Auto dismiss
      const timer = setTimeout(() => {
        translateY.value = withSpring(100, { damping: 15 }, () => {
          runOnJS(onDismiss)();
        });
      }, duration);
      return () => clearTimeout(timer);
    } else {
      translateY.value = withSpring(100);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.surfaceElevated },
        animatedStyle,
      ]}
    >
      <Text style={[Typography.bodyMedium, { color: theme.text, flex: 1 }]} numberOfLines={2}>
        {message}
      </Text>
      {onAction && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={[Typography.button, { color: theme.primary }]}>{actionLabel}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: Spacing.base,
    right: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: Radius.lg,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    gap: Spacing.md,
  },
});
