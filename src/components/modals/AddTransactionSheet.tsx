/**
 * ArthaSaathi — Add Transaction Bottom Sheet
 * Full-featured transaction entry form with validation, category picker,
 * date picker, and haptic feedback.
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { useTransactionStore } from '../../store/transactionStore';
import { Typography, Spacing, Radius } from '../../constants/Typography';
import { TransactionType, TransactionFormData, Category } from '../../types';
import CategoryPickerGrid from './CategoryPickerGrid';
import Button from '../ui/Button';
import { formatDateForPicker } from '../../utils/dateUtils';

interface AddTransactionSheetProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddTransactionSheet({
  visible,
  onClose,
}: AddTransactionSheetProps) {
  const theme = useTheme();
  const addTransaction = useTransactionStore((s) => s.addTransaction);

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const amountRef = useRef<TextInput>(null);

  const resetForm = useCallback(() => {
    setType('expense');
    setAmount('');
    setSelectedCategory('');
    setNote('');
    setDate(new Date());
    setErrors({});
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Enter a valid amount';
    }
    if (!selectedCategory) {
      newErrors.category = 'Select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(() => {
    if (!validate()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    addTransaction({
      type,
      amount: parseFloat(amount),
      category: selectedCategory,
      note: note.trim(),
      date: date.toISOString(),
    });

    resetForm();
    onClose();
  }, [type, amount, selectedCategory, note, date]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={[styles.overlay, { backgroundColor: theme.overlay }]}
        >
          <Pressable style={styles.overlayPress} onPress={handleClose} />
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
            {/* Handle bar */}
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: theme.border }]} />
            </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={[Typography.headingLarge, { color: theme.text }]}>
                Add Transaction
              </Text>
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync();
                  handleClose();
                }}
                hitSlop={16}
                style={styles.closeButton}
                android_ripple={{ color: theme.surface, borderless: true }}
              >
                <MaterialCommunityIcons name="close-circle" size={28} color={theme.textMuted} />
              </Pressable>
            </View>

            {/* Type Toggle */}
            <View style={[styles.typeToggle, { backgroundColor: theme.surface }]}>
              <Pressable
                style={[
                  styles.typeButton,
                  type === 'expense' && {
                    backgroundColor: theme.expenseBg,
                    borderColor: theme.expense,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => {
                  setType('expense');
                  setSelectedCategory('');
                  Haptics.selectionAsync();
                }}
              >
                <MaterialCommunityIcons
                  name="arrow-up-circle"
                  size={20}
                  color={type === 'expense' ? theme.expense : theme.textMuted}
                />
                <Text
                  style={[
                    Typography.buttonSmall,
                    { color: type === 'expense' ? theme.expense : theme.textMuted },
                  ]}
                >
                  Expense
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.typeButton,
                  type === 'income' && {
                    backgroundColor: theme.incomeBg,
                    borderColor: theme.income,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => {
                  setType('income');
                  setSelectedCategory('');
                  Haptics.selectionAsync();
                }}
              >
                <MaterialCommunityIcons
                  name="arrow-down-circle"
                  size={20}
                  color={type === 'income' ? theme.income : theme.textMuted}
                />
                <Text
                  style={[
                    Typography.buttonSmall,
                    { color: type === 'income' ? theme.income : theme.textMuted },
                  ]}
                >
                  Income
                </Text>
              </Pressable>
            </View>

            {/* Amount Input */}
            <View style={styles.amountSection}>
              <Text style={[Typography.label, { color: theme.textSecondary, marginBottom: Spacing.sm }]}>
                Amount
              </Text>
              <View
                style={[
                  styles.amountInput,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: errors.amount ? theme.expense : theme.border,
                    borderWidth: 1,
                  },
                ]}
              >
                <Text style={[Typography.displayMedium, { color: theme.textMuted }]}>₹</Text>
                <TextInput
                  ref={amountRef}
                  style={[Typography.displayMedium, { color: theme.text, flex: 1, padding: 0 }]}
                  value={amount}
                  onChangeText={(v) => {
                    setAmount(v.replace(/[^0-9.]/g, ''));
                    if (errors.amount) setErrors((e) => ({ ...e, amount: '' }));
                  }}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={theme.textMuted}
                  cursorColor={theme.primary}
                />
              </View>
              {errors.amount ? (
                <Text style={[Typography.caption, { color: theme.expense, marginTop: Spacing.xs }]}>
                  {errors.amount}
                </Text>
              ) : null}
            </View>

            {/* Category Picker */}
            <CategoryPickerGrid
              type={type}
              selectedId={selectedCategory}
              onSelect={(cat: Category) => {
                setSelectedCategory(cat.id);
                if (errors.category) setErrors((e) => ({ ...e, category: '' }));
              }}
            />
            {errors.category ? (
              <Text style={[Typography.caption, { color: theme.expense, marginLeft: Spacing.xs }]}>
                {errors.category}
              </Text>
            ) : null}

            {/* Note */}
            <View style={styles.noteSection}>
              <Text style={[Typography.label, { color: theme.textSecondary, marginBottom: Spacing.sm }]}>
                Note (optional)
              </Text>
              <TextInput
                style={[
                  Typography.bodyMedium,
                  styles.noteInput,
                  {
                    backgroundColor: theme.inputBg,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                value={note}
                onChangeText={setNote}
                placeholder="What was this for?"
                placeholderTextColor={theme.textMuted}
                multiline
                maxLength={100}
                cursorColor={theme.primary}
              />
            </View>

            {/* Date */}
            <View style={styles.dateSection}>
              <Text style={[Typography.label, { color: theme.textSecondary, marginBottom: Spacing.sm }]}>
                Date
              </Text>
              <Pressable
                style={[styles.datePicker, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
                onPress={() => {
                  // Simple date cycling: Today / Yesterday
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);

                  if (date.toDateString() === new Date().toDateString()) {
                    setDate(yesterday);
                  } else {
                    setDate(new Date());
                  }
                  Haptics.selectionAsync();
                }}
              >
                <MaterialCommunityIcons name="calendar" size={20} color={theme.primary} />
                <Text style={[Typography.bodyMedium, { color: theme.text }]}>
                  {formatDateForPicker(date)}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={18} color={theme.textMuted} />
              </Pressable>
            </View>

            {/* Submit Button */}
            <View style={styles.submitSection}>
              <Button
                title={`Add ${type === 'income' ? 'Income' : 'Expense'}`}
                onPress={handleSubmit}
                variant="primary"
                size="lg"
                fullWidth
              />
            </View>
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
    maxHeight: '92%',
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
    marginBottom: Spacing.sm,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  typeToggle: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    padding: 4,
    marginTop: Spacing.lg,
    gap: 4,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  amountSection: {
    marginTop: Spacing.xl,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.base,
    borderRadius: Radius.lg,
  },
  noteSection: {
    marginTop: Spacing.lg,
  },
  noteInput: {
    padding: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 1,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  dateSection: {
    marginTop: Spacing.lg,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  submitSection: {
    marginTop: Spacing.xxl,
  },
});
