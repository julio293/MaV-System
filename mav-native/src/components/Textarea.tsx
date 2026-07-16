import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';
import { AlertIcon } from './icons';

/** Textarea — Figma "Textarea". Multi-line, radius 8, min-height 120. */
export function Textarea({
  value,
  onChangeText,
  placeholder,
  error,
  disabled = false,
  minHeight = 120,
}: {
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minHeight?: number;
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;
  const [focused, setFocused] = useState(false);
  const borderColor = error ? c.red : focused ? c.primary : c.border;
  const bg = disabled ? c.inputBgDisabled : error ? c.errorBg : c.inputBg;

  return (
    <View style={{ gap: 8 }}>
      <TextInput
        multiline
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.placeholder}
        editable={!disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          minHeight,
          textAlignVertical: 'top',
          padding: 16,
          borderRadius: theme.borderRadii.md,
          borderWidth: 1,
          borderColor,
          backgroundColor: bg,
          fontSize: 14,
          fontWeight: '700',
          color: disabled ? c.placeholder : c.fg,
        }}
      />
      {!!error && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AlertIcon size={20} color={c.red} />
          <Text style={{ fontSize: 14, fontWeight: '700', color: c.red }}>{error}</Text>
        </View>
      )}
    </View>
  );
}
