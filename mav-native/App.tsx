import React, { useState } from 'react';
import { ScrollView, View, Pressable, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@shopify/restyle';
import { MavThemeProvider, useThemeMode } from './src/theme/ThemeProvider';
import { Text } from './src/theme/restyle';
import type { Theme } from './src/theme/theme';
import { Badge } from './src/components/Badge';
import { Chip } from './src/components/Chip';
import { Button } from './src/components/Button';
import { Input } from './src/components/Input';
import { SearchInput, Dropdown } from './src/components/SearchInput';
import { Textarea } from './src/components/Textarea';
import { OtpInput } from './src/components/OtpInput';
import { Checkbox } from './src/components/Checkbox';
import { Radio } from './src/components/Radio';
import { Toggle } from './src/components/Toggle';
import { Divider } from './src/components/Divider';
import { Progress } from './src/components/Progress';
import { Toast } from './src/components/Toast';
import { ListRow, AvatarInitial } from './src/components/ListRow';
import { EmptyState } from './src/components/EmptyState';
import { MessageInput } from './src/components/MessageInput';
import { Coachmark } from './src/components/Coachmark';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme<Theme>();
  return (
    <View style={{ gap: 12, marginBottom: 28 }}>
      <Text style={{ fontSize: 12, fontWeight: '700', letterSpacing: 1, color: theme.colors.muted }}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>{children}</View>;
}

function Showcase() {
  const theme = useTheme<Theme>();
  const { mode, toggle } = useThemeMode();
  const [text, setText] = useState('');
  const [on, setOn] = useState(true);
  const [otp, setOtp] = useState('12');
  const [chips, setChips] = useState(['Primary', 'Red', 'Green', 'Orange']);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 64 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: theme.colors.fg }}>MaV · Native</Text>
          <Pressable onPress={toggle} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9999, borderWidth: 1, borderColor: theme.colors.border }}>
            <Text style={{ fontSize: 13, color: theme.colors.fg }}>{mode === 'dark' ? '☀︎ Light' : '☾ Dark'}</Text>
          </Pressable>
        </View>

        <Section title="Badge">
          <Row>
            <Badge color="primary">Primary</Badge>
            <Badge color="red">Red</Badge>
            <Badge color="green">Green</Badge>
            <Badge color="orange">Orange</Badge>
            <Badge color="primary" type="outline">Outline</Badge>
            <Badge color="green" type="clear">Clear</Badge>
          </Row>
        </Section>

        <Section title="Chip (tap to dismiss)">
          <Row>
            {chips.map((label) => (
              <Chip key={label} label={label} color={label.toLowerCase() as any} onClose={() => setChips((cs) => cs.filter((x) => x !== label))} />
            ))}
            <Chip label="Grey" color="grey" />
            <Chip label="Outline" color="primary" type="outline" />
          </Row>
        </Section>

        <Section title="Button">
          <Row>
            <Button label="Primary" />
            <Button label="Secondary" variant="secondary" />
            <Button label="Text only" variant="textonly" />
            <Button label="Loading" loading />
            <Button label="Disabled" disabled />
          </Row>
        </Section>

        <Section title="Input">
          <Input value={text} onChangeText={setText} placeholder="Enter email…" />
          <Input value="bad-email" error="Please enter a valid email" />
          <SearchInput placeholder="Search transactions…" />
          <Dropdown placeholder="Select an option" />
          <Textarea placeholder="Your message…" minHeight={90} />
        </Section>

        <Section title="OTP">
          <OtpInput length={6} value={otp} onChange={setOtp} />
        </Section>

        <Section title="Selection controls">
          <Row><Checkbox state="selected" /><Checkbox state="indeterminate" /><Checkbox state="default" /><Checkbox state="disabled" /></Row>
          <Row><Radio state="active" /><Radio state="default" /><Radio state="disabled" /></Row>
          <Row>
            <Toggle value={on} onValueChange={setOn} />
            <Toggle value={false} onValueChange={() => {}} />
            <Toggle value disabled />
          </Row>
        </Section>

        <Section title="Divider & Progress">
          <Divider />
          <Progress value={40} />
          <Progress value={80} />
          <Progress disabled />
        </Section>

        <Section title="Toast">
          <Toast color="primary" title="Heads up" description="Lorem ipsum dolor sit amet." action="Undo" onClose={() => {}} />
          <Toast color="green" title="Saved successfully" onClose={() => {}} />
          <Toast color="red" title="Something went wrong" action="Retry" onClose={() => {}} />
        </Section>

        <Section title="List">
          <View style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 16, padding: 20 }}>
            <ListRow name="Julio Santos" subtitle="julio@fyscaltech.com" leading={<AvatarInitial initial="J" color="#3a5fd9" />} />
            <ListRow name="Mom" subtitle="+63 933 4234 222" leading={<AvatarInitial initial="M" />} last />
          </View>
        </Section>

        <Section title="Message input">
          <MessageInput onSend={() => {}} />
        </Section>

        <Section title="Empty state">
          <EmptyState media="icon" title="Feels so empty here" subtitle="All saved transactions will show up here." />
        </Section>

        <Section title="Coachmark">
          <Coachmark appearance="top" title="Find anything fast" description="Search all your transactions here." step="( 1 / 4 )" />
        </Section>
      </ScrollView>
    </View>
  );
}

export default function App() {
  const scheme = useColorScheme();
  return (
    <MavThemeProvider initialMode={scheme === 'dark' ? 'dark' : 'light'}>
      <Showcase />
    </MavThemeProvider>
  );
}
