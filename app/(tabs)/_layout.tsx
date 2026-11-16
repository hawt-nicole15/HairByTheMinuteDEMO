import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { track } from '@/services/analytics';

export default function TabLayout() {
  // Bottom inset keeps the tab bar clear of the iPhone home indicator
  // (matters most for the installed PWA in standalone mode).
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenListeners={{ focus: (e) => track('tab_viewed', { tab: e.target?.split('-')[0] ?? '' }) }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 6,
          height: 64 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          lineHeight: 16,
          // the label box is only fontSize-tall, so descenders (the 'y' in
          // "My Hair") get clipped without this
          overflow: 'visible',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Routines',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Ask Cassi',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Hair',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
