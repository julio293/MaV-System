import React from 'react';
import { View, Pressable } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';

/** List row — Figma "List" (125:4920). Leading + name/subtitle + trailing, divider. */
export function ListRow({
  name,
  subtitle,
  leading,
  trailing,
  last = false,
  onPress,
}: {
  name: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  last?: boolean;
  onPress?: () => void;
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingTop: 8,
        paddingBottom: 16,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: c.borderSubtle,
      }}
    >
      {leading}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: c.fg }}>{name}</Text>
        {!!subtitle && <Text style={{ fontSize: 12, color: c.muted }}>{subtitle}</Text>}
      </View>
      {trailing}
    </Pressable>
  );
}

/** Round avatar with an initial (leading slot helper). */
export function AvatarInitial({ initial, color = '#c9457a' }: { initial: string; color?: string }) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>{initial}</Text>
    </View>
  );
}
