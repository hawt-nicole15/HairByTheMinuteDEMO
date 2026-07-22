import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HairProfileProvider } from '@/context/HairProfileContext';
import { initAnalytics, track } from '@/services/analytics';

export default function RootLayout() {
  const sessionStart = useRef<number>(Date.now());

  useEffect(() => {
    initAnalytics();
    track('app_opened');

    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        sessionStart.current = Date.now();
        track('app_foregrounded');
      } else if (state === 'background') {
        const seconds = Math.round((Date.now() - sessionStart.current) / 1000);
        track('app_backgrounded', { session_seconds: seconds });
      }
    });

    return () => sub.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <HairProfileProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="hair-goals" />
          <Stack.Screen name="account-setup" />
          <Stack.Screen name="legal" />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        </Stack>
      </HairProfileProvider>
    </SafeAreaProvider>
  );
}
