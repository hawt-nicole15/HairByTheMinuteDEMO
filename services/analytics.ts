import PostHog from 'posthog-react-native';

const API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const HOST = 'https://us.i.posthog.com';

let client: PostHog | null = null;

export function initAnalytics(): void {
  if (!API_KEY || client) return;
  client = new PostHog(API_KEY, { host: HOST });
}

export function track(event: string, properties?: Record<string, string | number | boolean | null>): void {
  client?.capture(event, properties ?? {});
}
