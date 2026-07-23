import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HairProfileProvider } from '@/context/HairProfileContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { initAnalytics, track } from '@/services/analytics';

// Redirect anyone who isn't a signed-in, approved user out of the tab area.
function useProtectedRoute() {
  const { session, approved, loadingAuth } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loadingAuth) return;
    const inTabs = segments[0] === '(tabs)';
    const authed = !!session && approved;
    if (inTabs && !authed) {
      router.replace('/');
    }
  }, [session, approved, loadingAuth, segments]);
}

function RootNavigator() {
  useProtectedRoute();
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="hair-goals" />
      <Stack.Screen name="account-setup" />
      <Stack.Screen name="legal" />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
    </Stack>
  );
}

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
      <AuthProvider>
        <HairProfileProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </HairProfileProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
