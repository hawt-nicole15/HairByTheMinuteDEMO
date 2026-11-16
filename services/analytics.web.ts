// Web build of analytics — Metro automatically uses this .web.ts file instead
// of analytics.ts when bundling for web. posthog-react-native doesn't run in a
// browser, so the web PWA uses posthog-js with the same public ingestion key.
import posthog from 'posthog-js';

const API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const HOST = 'https://us.i.posthog.com';

let started = false;

export function initAnalytics(): void {
  if (!API_KEY || started) return;
  posthog.init(API_KEY, {
    api_host: HOST,
    capture_pageview: false,
    persistence: 'localStorage',
    person_profiles: 'identified_only',
  });
  started = true;
}

export function track(event: string, properties?: Record<string, string | number | boolean | null>): void {
  if (!started) return;
  posthog.capture(event, properties ?? {});
}
