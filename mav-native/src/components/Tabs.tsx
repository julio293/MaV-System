import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';

export type Tab = { key: string; label: string };

/** Tabs — Figma "Tabs" (901:22860). Rail + per-tab active indicator (lime in dark). */
export function Tabs({
  tabs,
  value,
  onChange,
  scrollable = false,
}: {
  tabs: Tab[];
  value: string;
  onChange: (key: string) => void;
  scrollable?: boolean;
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;

  const bar = (
    <View style={{ position: 'relative', flexDirection: 'row', minWidth: scrollable ? undefined : '100%' }}>
      {/* full-width rail */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, borderRadius: 999, backgroundColor: c.tabsRail }} />
      {tabs.map((t) => {
        const selected = t.key === value;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            style={{ flex: scrollable ? undefined : 1, height: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: selected ? c.fg : c.placeholder }}>{t.label}</Text>
            {selected && (
              <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, borderRadius: 999, backgroundColor: c.primary }} />
            )}
          </Pressable>
        );
      })}
    </View>
  );

  if (scrollable) {
    return <ScrollView horizontal showsHorizontalScrollIndicator={false}>{bar}</ScrollView>;
  }
  return bar;
}
