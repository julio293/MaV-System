# MaV · Native — React Native pilot

A React Native port of the MaV design system, built with **Expo (TypeScript)** and
**[Shopify Restyle](https://github.com/Shopify/restyle)**. This is a **pilot**: the
theme foundation + four core components, ported from the HTML/CSS design system.

## What's here

```
src/theme/
  theme.ts          Restyle theme — role tokens mirroring css/tokens.css, light + dark
  ThemeProvider.tsx  <MavThemeProvider> + useThemeMode() (light/dark swap = the web `data-theme`)
  restyle.ts        typed Box / Text primitives
src/components/
  Badge.tsx         color (primary/red/green/orange) × type (filled/outline/clear) × size
  Button.tsx        primary / secondary / textonly, loading, disabled
  Input.tsx         default / focus / error / disabled
  Toggle.tsx        44×24 pill, animated handle
  icons.tsx         react-native-svg icons (check / close / info / alert)
App.tsx             showcase screen with a light/dark switch
```

## Run it

```bash
cd mav-native
npm install
npx expo start        # then press i (iOS), a (Android), or w (web)
```

## How the web design system maps to RN

| Web (HTML/CSS)                     | React Native (this pilot)                          |
| ---------------------------------- | -------------------------------------------------- |
| CSS custom properties (`--token`)  | `theme.ts` role tokens (typed)                     |
| `[data-theme="dark"]` swap         | `<MavThemeProvider>` swaps the theme object        |
| primary → lime in dark             | `darkTheme.colors.primary = '#a1ff5b'`             |
| `box-shadow`                       | `shadowColor/Opacity/Radius/Offset` + `elevation`  |
| `::after` handle, pseudo-elements  | real `Animated.View`s                              |
| `:hover`                           | dropped (touch) — Pressable `pressed` state        |
| inline `<svg>`                     | `react-native-svg`                                 |
| `var(--…)` in CSS                  | `useTheme<Theme>()` in components                  |

## Verified

Type-checks clean (`npx tsc --noEmit`) and renders via `expo export --platform web`
(react-native-web). Light mode screenshotted; dark mode swaps through the theme toggle.

## Not yet ported (next after pilot sign-off)

Chip, Checkbox, Radio, OTP, Divider, Progress Bar, Toast, List, Message Chat,
Coachmark, Input dropdown / with-label / search, Textarea, Message input.
Fonts (Inter, Plus Jakarta Sans) still use the system default — wire up `expo-font`
when the real font files are added.
