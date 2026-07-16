import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';

export type CoachAppearance = 'top' | 'bottom';

/** Coachmark — Figma "Coachmark" (259:21967). Dashed pointer + text over a blanket. */
export function Coachmark({
  title,
  description,
  step,
  appearance = 'top',
}: {
  title: string;
  description?: string;
  step?: string;
  appearance?: CoachAppearance;
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;

  const Pointer = () => (
    <View style={{ alignItems: 'center', height: 40, justifyContent: appearance === 'top' ? 'flex-start' : 'flex-end' }}>
      {appearance === 'bottom' && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.primary }} />}
      <View style={{ width: 0, height: 30, borderLeftWidth: 2, borderStyle: 'dashed', borderColor: c.primary }} />
      {appearance === 'top' && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.primary }} />}
    </View>
  );

  const TextBlock = () => (
    <View style={{ alignItems: 'center', gap: 4, padding: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '500', color: '#fff', textAlign: 'center' }}>{title}</Text>
      {!!description && (
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff', textAlign: 'center' }}>{description}</Text>
      )}
      {!!step && <Text style={{ fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.75)' }}>{step}</Text>}
    </View>
  );

  return (
    <View style={{ backgroundColor: '#141414', borderRadius: 12, padding: 16, alignItems: 'center', maxWidth: 340 }}>
      {appearance === 'top' && <Pointer />}
      <TextBlock />
      {appearance === 'bottom' && <Pointer />}
    </View>
  );
}
