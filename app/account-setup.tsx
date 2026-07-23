import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useHairProfile } from '@/context/HairProfileContext';
import { useAuth } from '@/context/AuthContext';

export default function AccountSetupScreen() {
  const router = useRouter();
  const { completeOnboarding } = useHairProfile();
  const { signUp, redeemInvite } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [busy, setBusy] = useState(false);

  const validate = (): boolean => {
    const next: Record<string, string> = {};

    if (!firstName.trim()) next.firstName = 'First name is required';
    if (!lastName.trim()) next.lastName = 'Last name is required';
    if (!email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = 'Enter a valid email address';
    if (!password) next.password = 'Password is required';
    else if (password.length < 8) next.password = 'Password must be at least 8 characters';
    if (!confirmPassword) next.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match';
    if (!inviteCode.trim()) next.inviteCode = 'An invite code is required for the beta';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCreateAccount = async () => {
    if (busy) return;
    setSubmitError('');
    if (!validate()) return;
    setBusy(true);
    try {
      // 1. Create the account (a session is returned since email confirmation is off)
      await signUp(email.trim(), password);
      // 2. Redeem the invite code -> approves the account
      const ok = await redeemInvite(inviteCode);
      if (!ok) {
        setSubmitError('That invite code is invalid or already used. Check it and try again.');
        return;
      }
      // 3. Persist the hair profile to the database
      await completeOnboarding({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() });
      router.replace('/(tabs)');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not create your account. Please try again.';
      setSubmitError(/registered|already/i.test(msg) ? 'That email is already registered. Try signing in instead.' : msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Almost there!</Text>
            <Text style={styles.subtitle}>
              Create your account to save your hair profile and access your personalized routine anytime.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name row */}
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <Input
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Jane"
                  autoCapitalize="words"
                  error={errors.firstName}
                />
              </View>
              <View style={styles.nameField}>
                <Input
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Doe"
                  autoCapitalize="words"
                  error={errors.lastName}
                />
              </View>
            </View>

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              isPassword
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repeat your password"
              isPassword
              error={errors.confirmPassword}
            />

            <Input
              label="Invite Code"
              value={inviteCode}
              onChangeText={(t) => setInviteCode(t.toUpperCase())}
              placeholder="HBTM-XXXXXX"
              autoCapitalize="characters"
              autoCorrect={false}
              error={errors.inviteCode}
            />

            {!!submitError && <Text style={styles.submitError}>{submitError}</Text>}

            <Button
              label={busy ? 'Creating account…' : 'Create Account'}
              onPress={handleCreateAccount}
              disabled={busy}
              style={styles.createBtn}
            />
          </View>

          {/* Footer */}
          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text
              style={styles.termsLink}
              onPress={() => router.push('/legal?doc=terms')}
            >
              Terms of Service
            </Text>
            {' '}and{' '}
            <Text
              style={styles.termsLink}
              onPress={() => router.push('/legal?doc=privacy')}
            >
              Privacy Policy
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screenBg,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  form: {
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  submitError: {
    fontSize: 13,
    color: '#c0392b',
    marginBottom: 12,
  },
  createBtn: {
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primaryMedium,
    fontWeight: '600',
  },
});
