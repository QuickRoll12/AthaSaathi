/**
 * ArthaSaathi — Login Screen
 * Minimalistic and premium local authentication gateway.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Stack, router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/hooks/useTheme';
import { Typography, Spacing, Radius } from '../src/constants/Typography';
import { useSettingsStore } from '../src/store/settingsStore';
import Button from '../src/components/ui/Button';

export default function LoginScreen() {
  const theme = useTheme();
  const setAuthenticated = useSettingsStore((s) => s.setAuthenticated);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    // Dismiss keyboard visually
    if (loading) return;

    if (username.trim() === 'admin' && password === 'password') {
      setLoading(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Artificial delay for premium feel
      setTimeout(() => {
        setAuthenticated(true);
        router.replace('/');
      }, 700);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMsg('Invalid username or password');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Graphic / Gradient Ring */}
          <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.logoContainer}>
            <LinearGradient
              colors={[theme.gradientStart, theme.gradientEnd]}
              style={styles.logoRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={[styles.logoInner, { backgroundColor: theme.background }]}>
                <MaterialCommunityIcons name="shield-lock-outline" size={48} color={theme.primary} />
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Heading */}
          <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.textContainer}>
            <Text style={[Typography.displayMedium, { color: theme.text, textAlign: 'center' }]}>
              Welcome Back
            </Text>
            <Text style={[Typography.bodyMedium, { color: theme.textSecondary, textAlign: 'center', marginTop: Spacing.sm }]}>
              Sign in to manage your wealth.
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInUp.delay(400).duration(800)} style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={[Typography.label, { color: theme.textSecondary, marginBottom: Spacing.sm }]}>
                Username
              </Text>
              <View style={[styles.inputBox, { backgroundColor: theme.inputBg, borderColor: errorMsg ? theme.expense : theme.border }]}>
                <MaterialCommunityIcons name="account-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[Typography.bodyMedium, { color: theme.text, flex: 1 }]}
                  placeholder="admin"
                  placeholderTextColor={theme.textMuted}
                  value={username}
                  onChangeText={(val) => {
                    setUsername(val);
                    if (errorMsg) setErrorMsg('');
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  cursorColor={theme.primary}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={[Typography.label, { color: theme.textSecondary, marginBottom: Spacing.sm }]}>
                Password
              </Text>
              <View style={[styles.inputBox, { backgroundColor: theme.inputBg, borderColor: errorMsg ? theme.expense : theme.border }]}>
                <MaterialCommunityIcons name="lock-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[Typography.bodyMedium, { color: theme.text, flex: 1 }]}
                  placeholder="password"
                  placeholderTextColor={theme.textMuted}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errorMsg) setErrorMsg('');
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  cursorColor={theme.primary}
                />
              </View>
            </View>

            {errorMsg ? (
              <Animated.Text entering={FadeInDown} style={[Typography.caption, { color: theme.expense, marginTop: Spacing.xs, textAlign: 'center' }]}>
                {errorMsg}
              </Animated.Text>
            ) : null}

            <View style={styles.actionContainer}>
              <Button
                title="Secure Login"
                onPress={handleLogin}
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              />
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View entering={FadeInUp.delay(600).duration(800)} style={styles.footer}>
            <MaterialCommunityIcons name="fingerprint" size={24} color={theme.textMuted} />
            <Text style={[Typography.caption, { color: theme.textMuted, marginTop: Spacing.xs }]}>
              Biometrics secured
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.huge,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3, // Gradient border width
  },
  logoInner: {
    flex: 1,
    borderRadius: 47,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: Spacing.lg,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    height: 56,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  actionContainer: {
    marginTop: Spacing.xl,
  },
  footer: {
    alignItems: 'center',
    marginTop: 60,
  },
});
