/**
 * ArthaSaathi — Notifications Sheet
 * Displays alerts like Budget Warnings or spending insights.
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, Radius } from '../../constants/Typography';
import { useSettingsStore } from '../../store/settingsStore';
import { useTransactionStore } from '../../store/transactionStore';

interface NotificationsSheetProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationsSheet({
  visible,
  onClose,
}: NotificationsSheetProps) {
  const theme = useTheme();
  
  // Compute alerts dynamically
  const monthlyBudget = useSettingsStore((s) => s.monthlyBudget);
  const transactions = useTransactionStore((s) => s.transactions);
  
  const { expense } = React.useMemo(() => 
    useTransactionStore.getState().getMonthlyTotals(new Date()),
  [transactions]);

  const alerts = [];

  if (monthlyBudget > 0) {
    const usage = expense / monthlyBudget;
    if (usage >= 1) {
      alerts.push({
        id: 'budget-exceeded',
        icon: 'alert-circle',
        color: theme.expense,
        title: 'Budget Exceeded',
        desc: `You have spent over your monthly budget of ₹${monthlyBudget}.`,
      });
    } else if (usage >= 0.8) {
      alerts.push({
        id: 'budget-warning',
        icon: 'alert-outline',
        color: '#FFB300', // Warning Yellow
        title: 'Approaching Budget Limit',
        desc: `You have spent ${Math.round(usage * 100)}% of your monthly budget.`,
      });
    }
  } else {
    alerts.push({
      id: 'no-budget',
      icon: 'bullseye-arrow',
      color: theme.primary,
      title: 'Set a Budget',
      desc: 'Head to settings to configure a monthly budget and track your spending goals.',
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={[styles.overlay, { backgroundColor: theme.overlay }]}
        >
          <Pressable style={styles.overlayPress} onPress={onClose} />
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}
          pointerEvents="box-none"
        >
          <Animated.View
            entering={SlideInDown.duration(350)}
            exiting={SlideOutDown.duration(250)}
            style={[styles.sheet, { backgroundColor: theme.background }]}
          >
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: theme.border }]} />
            </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.content}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[Typography.headingLarge, { color: theme.text }]}>
              Notifications
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={16}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons name="close-circle" size={28} color={theme.textMuted} />
            </Pressable>
          </View>

          {alerts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="bell-sleep-outline" size={48} color={theme.textMuted} />
              <Text style={[Typography.bodyMedium, { color: theme.textMuted, marginTop: Spacing.md }]}>
                You're all caught up!
              </Text>
            </View>
          ) : (
            alerts.map((alert) => (
              <View key={alert.id} style={[styles.alertCard, { backgroundColor: theme.card }]}>
                <View style={[styles.iconBox, { backgroundColor: `${alert.color}20` }]}>
                  <MaterialCommunityIcons name={alert.icon as any} size={24} color={alert.color} />
                </View>
                <View style={styles.alertTexts}>
                  <Text style={[Typography.headingSmall, { color: theme.text }]}>
                    {alert.title}
                  </Text>
                  <Text style={[Typography.bodySmall, { color: theme.textSecondary, marginTop: 2 }]}>
                    {alert.desc}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </Animated.View>
      </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayPress: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    maxHeight: '70%',
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  alertTexts: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
});
