/**
 * ArthaSaathi — Category Picker Grid
 * Grid layout of category icons for selection.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, Radius } from '../../constants/Typography';
import { Category, TransactionType } from '../../types';
import { getCategoriesByType } from '../../constants/Categories';

interface CategoryPickerGridProps {
  type: TransactionType;
  selectedId: string;
  onSelect: (category: Category) => void;
}

export default function CategoryPickerGrid({
  type,
  selectedId,
  onSelect,
}: CategoryPickerGridProps) {
  const theme = useTheme();
  const categories = getCategoriesByType(type);

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <Text style={[Typography.headingSmall, { color: theme.text, marginBottom: Spacing.md }]}>
        Select Category
      </Text>
      <View style={styles.grid}>
        {categories.map((cat, index) => {
          const isSelected = cat.id === selectedId;
          return (
            <Animated.View
              key={cat.id}
              entering={ZoomIn.delay(index * 40).duration(300)}
            >
              <Pressable
                style={[
                  styles.item,
                  {
                    backgroundColor: isSelected ? `${cat.color}25` : theme.surface,
                    borderColor: isSelected ? cat.color : 'transparent',
                    borderWidth: isSelected ? 2 : 0,
                  },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  onSelect(cat);
                }}
              >
                <MaterialCommunityIcons
                  name={cat.icon as any}
                  size={24}
                  color={isSelected ? cat.color : theme.textSecondary}
                />
                <Text
                  style={[
                    Typography.labelSmall,
                    {
                      color: isSelected ? cat.color : theme.textSecondary,
                      marginTop: Spacing.xs,
                      textAlign: 'center',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  item: {
    width: 80,
    height: 76,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.sm,
  },
});
