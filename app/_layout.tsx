import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HairProfileProvider } from '@/context/HairProfileContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { initAnalytics, track } from '@/services/analytics';

// Gate the app: signed-in + approved users must accept the beta waiver before
// reaching the tabs; unauthenticated users are kept out of both.
function useProtectedRoute() {
  const { session, approved, waiverAccepted, loadingAuth } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loadingAuth) return;
    const authed = !!session && approved;
    const inTabs = segments[0] === '(tabs)';
    const onWaiver = segments[0] === 'waiver';

    if ((inTabs || onWaiver) && !authed) {
      router.replace('/');
    } else if (authed && !waiverAccepted && inTabs) {
      router.replace('/waiver');
    } else if (authed && waiverAccepted && onWaiver) {
      router.replace('/(tabs)');
    }
  }, [session, approved, waiverAccepted, loadingAuth, segments]);
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
      <Stack.Screen name="waiver" options={{ gestureEnabled: false }} />
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
