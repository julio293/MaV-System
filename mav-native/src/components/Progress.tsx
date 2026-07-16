import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import type { Theme } from '../theme/theme';

/** Progress Bar — Figma "Progress" (145:939). 6px track, radius 8, fill #0d00fa. */
export function Progress({
  value = 0,
  disabled = false,
  width,
}: {
  value?: number; // 0–100
  disabled?: boolean;
  width?: number;
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;
  const pct = Math.max(0, Math.min(100, value));

  return (
    <View
      style={{
        height: 6,
        width: width ?? '100%',
        maxWidth: 400,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: disabled ? c.progressDisabled : c.progressTrack,
      }}
    >
      {!disabled && (
        <View style={{ height: 6, width: `${pct}%`, borderRadius: 8, backgroundColor: c.progressFill }} />
      )}
    </View>
  );
}
