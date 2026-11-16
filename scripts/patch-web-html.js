/**
 * Post-export patch for the web build.
 *
 * Expo's "single" web output uses a fixed default index.html template and does
 * not run app/+html.tsx, so we inject the PWA head tags (manifest, theme color,
 * iOS add-to-home-screen metadata) and a friendly title here after `expo export`.
 *
 * Run automatically via `npm run build:web`.
 */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'dist', 'index.html');
if (!fs.existsSync(file)) {
  console.error('dist/index.html not found — run `expo export --platform web` first.');
  process.exit(1);
}

let html = fs.readFileSync(file, 'utf8');

html = html.replace(/<title>[^<]*<\/title>/, '<title>Hair by the Minute</title>');

html = html.replace(
  /<meta name="viewport"[^>]*\/?>/,
  '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no, viewport-fit=cover" />',
);

const headTags = `    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#765341" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Hair by the Minute" />
    <link rel="apple-touch-icon" href="/pwa-192.png" />
`;

if (!html.includes('rel="manifest"')) {
  html = html.replace('</head>', headTags + '  </head>');
}

fs.writeFileSync(file, html);
console.log('Patched dist/index.html with PWA head tags.');
