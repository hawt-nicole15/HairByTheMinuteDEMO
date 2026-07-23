import React from 'react';

// Web: a real anchor so the link opens synchronously in a new tab (never
// popup-blocked, unlike Linking.openURL which opens async and loses the gesture).
export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
    >
      {children}
    </a>
  );
}
