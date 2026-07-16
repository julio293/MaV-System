import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { useTheme } from '@shopify/restyle';
import type { Theme } from '../theme/theme';
import { Text } from '../theme/restyle';
import { SearchIcon, ChevronDownIcon } from './icons';

/** Input variants — Figma "Input & dropdown" (52:30298): search + dropdown. */
export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search…',
}: {
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;
  const [focused, setFocused] = useState(false);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: theme.borderRadii.sm,
        borderWidth: 1,
        borderColor: focused ? c.primary : c.border,
        backgroundColor: c.inputBg,
      }}
    >
      <SearchIcon size={20} color={focused ? c.fg : c.placeholder} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ flex: 1, fontSize: 14, fontWeight: '700', color: c.fg, padding: 0 }}
      />
    </View>
  );
}

export function Dropdown({
  label,
  placeholder = 'Select an option',
  onPress,
}: {
  label?: string;
  placeholder?: string;
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
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: theme.borderRadii.sm,
        borderWidth: 1,
        borderColor: c.border,
        backgroundColor: c.inputBg,
      }}
    >
      <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: label ? c.fg : c.placeholder }}>
        {label ?? placeholder}
      </Text>
      <ChevronDownIcon size={24} color={c.fg} />
    </Pressable>
  );
}
