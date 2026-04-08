/**
 * ArthaSaathi — Animated Button
 * Scalable button with press animation and haptic feedback.
 */

import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Radius, Spacing } from '../../constants/Typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const SPRING_CONFIG = { damping: 12, stiffness: 200 };

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [disabled, loading, onPress]);

  const tap = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.95, SPRING_CONFIG);
    })
    .onFinalize(() => {
      scale.value = withSpring(1, SPRING_CONFIG);
      if (!disabled && !loading) {
        runOnJS(handlePress)();
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sizeStyles = SIZE_MAP[size];
  const isDisabled = disabled || loading;

  const getContainerStyle = (): ViewStyle[] => {
    const base: ViewStyle[] = [styles.base, sizeStyles.container];
    if (fullWidth) base.push(styles.fullWidth);
    if (isDisabled) base.push(styles.disabled);

    switch (variant) {
      case 'secondary':
        base.push({ backgroundColor: theme.surface });
        break;
      case 'outline':
        base.push({ backgroundColor: 'transparent', borderWidth: 1.5, borderColor: theme.primary });
        break;
      case 'ghost':
        base.push({ backgroundColor: 'transparent' });
        break;
    }

    return [...base, style as ViewStyle];
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary': return '#FFFFFF';
      case 'secondary': return theme.text;
      case 'outline': return theme.primary;
      case 'ghost': return theme.primary;
      default: return '#FFFFFF';
    }
  };

  const content = (
    <>
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              sizeStyles.text,
              { color: getTextColor() },
              icon ? { marginLeft: 8 } : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (variant === 'primary') {
    return (
      <GestureDetector gesture={tap}>
        <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth]}>
          <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd] as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.base, sizeStyles.container, isDisabled && styles.disabled, style]}
          >
            {content}
          </LinearGradient>
        </Animated.View>
      </GestureDetector>
    );
  }

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[animatedStyle, ...getContainerStyle()]}>
        {content}
      </Animated.View>
    </GestureDetector>
  );
}

const SIZE_MAP: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, borderRadius: Radius.md },
    text: { ...Typography.buttonSmall },
  },
  md: {
    container: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.lg },
    text: { ...Typography.button },
  },
  lg: {
    container: { paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.base, borderRadius: Radius.xl },
    text: { ...Typography.button, fontSize: 18 },
  },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
