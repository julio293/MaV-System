import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';
import { AlertIcon } from './icons';

/** Input — Figma "Input" (52:30298). Default / focus / error / disabled. */
export function Input({
  value,
  onChangeText,
  placeholder,
  error,
  disabled = false,
  secureTextEntry,
}: {
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? c.red
    : focused
    ? c.primary
    : value
    ? c.inputBorderActive
    : c.border;

  const bg = disabled ? c.inputBgDisabled : error ? c.errorBg : c.inputBg;

  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: bg,
          borderWidth: 1,
          borderColor,
          borderRadius: theme.borderRadii.sm,
        }}
      >
        <TextInput
          style={{ flex: 1, fontSize: 14, fontWeight: '700', color: disabled ? c.placeholder : c.fg, padding: 0 }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={c.placeholder}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {!!error && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AlertIcon size={20} color={c.red} />
          <Text style={{ fontSize: 14, fontWeight: '700', color: c.red }}>{error}</Text>
        </View>
      )}
    </View>
  );
}
