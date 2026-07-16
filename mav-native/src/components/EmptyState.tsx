import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';
import { CheckCircleIcon } from './icons';

/** Message Chat / empty state — Figma "Message Chat" (229:15404). */
export function EmptyState({
  title,
  subtitle,
  media = 'none',
}: {
  title: string;
  subtitle?: string;
  media?: 'none' | 'icon' | 'loader';
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, maxWidth: 340 }}>
      {media === 'icon' && (
        <View
          style={{
            width: 54,
            height: 54,
            borderRadius: 27,
            backgroundColor: c.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircleIcon size={28} color={c.onPrimary} strokeWidth={2.6} />
        </View>
      )}
      {media === 'loader' && <ActivityIndicator size="large" color={c.primary} />}
      <Text style={{ fontSize: 22, fontWeight: '700', color: c.fg, textAlign: 'center' }}>{title}</Text>
      {!!subtitle && (
        <Text style={{ fontSize: 14, color: c.muted, textAlign: 'center' }}>{subtitle}</Text>
      )}
    </View>
  );
}
