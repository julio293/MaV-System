import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { useTheme } from '@shopify/restyle';
import type { Theme } from '../theme/theme';
import { PlusIcon } from './icons';
import Svg, { Path } from 'react-native-svg';

const SendIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 2L11 13" />
    <Path d="M22 2l-7 20-4-9-9-4z" />
  </Svg>
);

/** Message input — Figma "Message input" (52:33177). Composer + toolbar + send. */
export function MessageInput({ onSend }: { onSend?: (text: string) => void }) {
  const theme = useTheme<Theme>();
  const c = theme.colors;
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const hasText = text.trim().length > 0;

  return (
    <View
      style={{
        minHeight: 130,
        padding: 16,
        borderRadius: theme.borderRadii.md,
        borderWidth: 1,
        borderColor: focused ? c.primary : c.border,
        backgroundColor: c.inputBg,
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <TextInput
        multiline
        value={text}
        onChangeText={setText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Your message…"
        placeholderTextColor={c.placeholder}
        style={{ flex: 1, textAlignVertical: 'top', fontSize: 14, fontWeight: '700', color: c.fg }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Pressable style={{ padding: 6 }}><PlusIcon size={20} color={c.fg} /></Pressable>
          <View style={{ width: 1, height: 20, backgroundColor: c.borderSubtle }} />
          <Pressable style={{ padding: 6 }}><PlusIcon size={20} color={c.fg} /></Pressable>
        </View>
        <Pressable
          onPress={() => hasText && (onSend?.(text), setText(''))}
          style={{
            padding: 6,
            borderRadius: theme.borderRadii.sm,
            backgroundColor: hasText ? c.primary : c.inputBgDisabled,
          }}
        >
          <SendIcon color={hasText ? c.onPrimary : c.placeholder} />
        </Pressable>
      </View>
    </View>
  );
}
