import React from 'react';

// Web brand mark: a transparent animated afro "sticker" (WebP). Because it's an
// <img>, it autoplays on load with no autoplay-policy issues, and its built-in
// loop count (1) makes it play once and freeze on the final frame. No
// background — it floats directly on the page like a sticker.
export function BrandMark({ size = 190 }: { size?: number }) {
  return (
    <img
      src="/hbtmicon.webp"
      alt="Hair by the Minute"
      style={{
        height: size,
        width: 'auto',
        objectFit: 'contain',
        filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.28))',
      }}
    />
  );
}
