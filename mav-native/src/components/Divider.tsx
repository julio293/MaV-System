import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import type { Theme } from '../theme/theme';

/** Divider — Figma "Divider" (52:30219). 1px, --border/subtle. */
export function Divider({ vertical = false, length }: { vertical?: boolean; length?: number }) {
  const theme = useTheme<Theme>();
  return (
    <View
      style={
        vertical
          ? { width: 1, height: length ?? 24, backgroundColor: theme.colors.borderSubtle }
          : { height: 1, width: length ?? '100%', backgroundColor: theme.colors.borderSubtle }
      }
    />
  );
}
