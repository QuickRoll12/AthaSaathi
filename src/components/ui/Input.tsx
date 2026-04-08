/**
 * ArthaSaathi — Styled Input
 * Theme-aware input with floating label, error state, and icons.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, Radius } from '../../constants/Typography';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  onFocus,
  onBlur,
  value,
  ...props
}: InputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    if (value || isFocused) {
      focusAnim.value = withTiming(1, { duration: 200 });
    } else {
      focusAnim.value = withTiming(0, { duration: 200 });
    }
  }, [isFocused, value]);

  const labelStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(focusAnim.value, [0, 1], [0, -24]) },
        { scale: interpolate(focusAnim.value, [0, 1], [1, 0.8]) },
      ],
    };
  });

  const borderColor = error
    ? theme.expense
    : isFocused
      ? theme.primary
      : theme.border;

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.inputBg,
            borderColor,
            borderWidth: isFocused ? 1.5 : 1,
          },
        ]}
      >
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon as any}
            size={20}
            color={isFocused ? theme.primary : theme.textMuted}
            style={styles.leftIcon}
          />
        )}
        <View style={styles.inputWrapper}>
          <Animated.Text
            style={[
              styles.label,
              { color: isFocused ? theme.primary : theme.textMuted },
              labelStyle,
            ]}
          >
            {label}
          </Animated.Text>
          <TextInput
            style={[
              styles.input,
              Typography.bodyMedium,
              {
                color: theme.text,
                paddingLeft: leftIcon ? 0 : 0,
              },
            ]}
            placeholderTextColor={theme.textMuted}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            value={value}
            cursorColor={theme.primary}
            selectionColor={theme.primaryLight}
            {...props}
          />
        </View>
        {rightIcon && (
          <Pressable onPress={onRightIconPress} hitSlop={8}>
            <MaterialCommunityIcons
              name={rightIcon as any}
              size={20}
              color={theme.textMuted}
              style={styles.rightIcon}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text style={[styles.errorText, { color: theme.expense }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.base,
    minHeight: 56,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    left: 0,
    ...Typography.bodyMedium,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.sm,
    marginTop: 4,
  },
  errorText: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    marginLeft: Spacing.sm,
  },
});
