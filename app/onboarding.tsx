/**
 * ArthaSaathi — Onboarding Screen
 * 3-slide animated onboarding flow with gradient backgrounds.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
  ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '../src/store/settingsStore';
import { useTheme } from '../src/hooks/useTheme';
import { Typography, Spacing, Radius } from '../src/constants/Typography';
import Button from '../src/components/ui/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  gradientColors: string[];
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'wallet-outline',
    title: 'Track Every Rupee',
    subtitle: 'Effortlessly log your income and expenses with beautiful, intuitive controls',
    gradientColors: ['#7C5CFC', '#5B3FD4'],
  },
  {
    id: '2',
    icon: 'chart-donut',
    title: 'Visual Insights',
    subtitle: 'Understand your spending patterns with animated charts and category breakdowns',
    gradientColors: ['#00D4AA', '#00A88A'],
  },
  {
    id: '3',
    icon: 'shield-check-outline',
    title: 'Your Data, Your Device',
    subtitle: 'All data stays on your phone. No account needed, no cloud — complete privacy',
    gradientColors: ['#FF6B6B', '#D44545'],
  },
];

function SlideItem({ slide, index, scrollX }: { slide: OnboardingSlide; index: number; scrollX: Animated.SharedValue<number> }) {
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    );

    return { transform: [{ scale }], opacity };
  });

  return (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      <Animated.View style={[styles.slideContent, animatedStyle]}>
        <View style={[styles.iconCircle]}>
          <LinearGradient
            colors={slide.gradientColors as any}
            style={styles.iconGradient}
          >
            <MaterialCommunityIcons
              name={slide.icon as any}
              size={56}
              color="#FFFFFF"
            />
          </LinearGradient>
        </View>

        <Text style={[Typography.displayMedium, { color: theme.text, textAlign: 'center', marginTop: Spacing.xxl }]}>
          {slide.title}
        </Text>
        <Text
          style={[
            Typography.bodyLarge,
            {
              color: theme.textSecondary,
              textAlign: 'center',
              marginTop: Spacing.md,
              paddingHorizontal: Spacing.xxl,
            },
          ]}
        >
          {slide.subtitle}
        </Text>
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen() {
  const theme = useTheme();
  const setOnboardingComplete = useSettingsStore((s) => s.setOnboardingComplete);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setOnboardingComplete();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Logo */}
      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.header}>
        <View style={[styles.logoBadge, { backgroundColor: theme.primary }]}>
          <Text style={[Typography.headingMedium, { color: '#FFFFFF' }]}>अ</Text>
        </View>
        <Text style={[Typography.headingMedium, { color: theme.text, marginLeft: Spacing.sm }]}>
          ArthaSaathi
        </Text>
      </Animated.View>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef as any}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item, index }) => (
          <SlideItem slide={item} index={index} scrollX={scrollX} />
        )}
      />

      {/* Pagination + CTA */}
      <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.footer}>
        {/* Dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentIndex ? theme.primary : theme.border,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          {currentIndex < SLIDES.length - 1 ? (
            <>
              <Pressable onPress={handleGetStarted} style={styles.skipButton}>
                <Text style={[Typography.buttonSmall, { color: theme.textMuted }]}>Skip</Text>
              </Pressable>
              <Button title="Next" onPress={handleNext} variant="primary" size="md" />
            </>
          ) : (
            <Button
              title="Get Started 🚀"
              onPress={handleGetStarted}
              variant="primary"
              size="lg"
              fullWidth
            />
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  iconCircle: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipButton: {
    padding: Spacing.md,
  },
});
