import React from 'react';
import { Image } from 'react-native';

// Native brand mark: the transparent final afro frame, floating like a sticker.
// (The web build uses BrandMark.web.tsx, which animates the transparent WebP.)
export function BrandMark({ size = 190 }: { size?: number }) {
  return (
    <Image
      source={require('@/assets/images/hbtm-afro.png')}
      style={{ width: (size * 260) / 288, height: size }}
      resizeMode="contain"
    />
  );
}
