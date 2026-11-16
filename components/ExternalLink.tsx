import React from 'react';
import { Linking, TouchableOpacity } from 'react-native';

// Native: Linking.openURL works fine (opens the system browser).
export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(href)}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {children}
    </TouchableOpacity>
  );
}
