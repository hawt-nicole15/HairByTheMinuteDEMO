import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function LandingScreen() {
  const router = useRouter();
  const { session, approved, loadingAuth } = useAuth();

  useEffect(() => {
    if (!loadingAuth && session && approved) {
      router.replace('/(tabs)');
    }
  }, [loadingAuth, session, approved]);

  // Show nothing while the session is being restored to prevent a flash
  if (loadingAuth) return <View style={styles.container} />;

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative background circles */}
      <View style={styles.decorCircleLarge} />
      <View style={styles.decorCircleSmall} />
      <View style={styles.decorCircleTiny} />

      {/* Main content */}
      <View style={styles.content}>
        {/* Brand mark */}
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>HBTM</Text>
        </View>

        {/* App name */}
        <Text style={styles.appNameLight}>Hair by the</Text>
        <Text style={styles.appNameBold}>Minute</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Tagline */}
        <Text style={styles.tagline}>
          Your personalized natural hair journey{'\n'}starts right here.
        </Text>
      </View>

      {/* Bottom CTA area */}
      <View style={styles.ctaSection}>
        <Button
          label="Get Started"
          onPress={() => router.push('/onboarding')}
          style={styles.getStartedBtn}
          textStyle={styles.getStartedText}
        />

        <Button
          label="Sign In"
          onPress={() => router.push('/sign-in')}
          variant="outline"
          style={styles.signInBtn}
          textStyle={styles.signInText}
        />

        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text
            style={styles.termsLink}
            onPress={() => router.push('/legal?doc=terms')}
          >
            Terms
          </Text>
          {' '}&{' '}
          <Text
            style={styles.termsLink}
            onPress={() => router.push('/legal?doc=privacy')}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  /* Decorative circles */
  decorCircleLarge: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -180,
    right: -160,
  },
  decorCircleSmall: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: 120,
    left: -100,
  },
  decorCircleTiny: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: 160,
    right: 30,
  },

  /* Content */
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  brandMark: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  brandMarkText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.sand,
    letterSpacing: 4,
  },
  appNameLight: {
    fontSize: 22,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1,
  },
  appNameBold: {
    fontSize: 54,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -1,
    lineHeight: 58,
    marginTop: 2,
  },
  divider: {
    width: 48,
    height: 2,
    backgroundColor: Colors.sand,
    borderRadius: 1,
    marginVertical: 20,
    opacity: 0.7,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },

  /* CTA */
  ctaSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 12,
  },
  getStartedBtn: {
    backgroundColor: Colors.sand,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  getStartedText: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  signInBtn: {
    borderColor: 'rgba(255,255,255,0.45)',
  },
  signInText: {
    color: Colors.white,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 4,
    lineHeight: 18,
  },
  termsLink: {
    color: 'rgba(255,255,255,0.65)',
    textDecorationLine: 'underline',
  },
});
