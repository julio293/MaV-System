import { createTheme } from '@shopify/restyle';

/**
 * MaV design-system theme for React Native (Shopify Restyle).
 * Mirrors css/tokens.css — role tokens map to the same hex values, and the
 * dark theme reproduces the "lime" re-theming (primary #352eff → #a1ff5b).
 * RN supports 8-digit #RRGGBBAA hex, so the 10%-opacity soft fills carry over.
 */

const palette = {
  white: '#ffffff',
  black: '#171717',

  primary: '#352eff',
  primaryLime: '#a1ff5b',
  primarySoft: '#352eff1a',

  red: '#ff0000',
  redSoft: '#ff00001a',
  green: '#629c28',
  greenSoft: '#629c281a',
  orange: '#ff8400',
  orangeSoft: '#ff84001a',

  mono100l: '#e5e5e5',
  mono200l: '#cccccc',
  mono300l: '#b2b2b2',
  mono500: '#7f7f7f',
  mono900l: '#191919',
  mono100d: '#242424',
  mono200d: '#484848',
  mono300d: '#6a6a6a',
  mono600d: '#999999',
  mono900d: '#e5e5e5',

  subtle: '#efefef',
  toggleDisabledOn: '#e4ebff',
  progressFill: '#0d00fa',
  progressTrack: '#99c2e9',
};

const lightColors = {
  bg: palette.white,
  surface: '#f5f5f5',
  fg: palette.black,
  muted: palette.mono500,
  placeholder: palette.mono300l,
  border: palette.mono200l,
  borderSubtle: palette.subtle,

  primary: palette.primary,
  onPrimary: palette.white,
  primarySoft: palette.primarySoft,

  red: palette.red,
  redSoft: palette.redSoft,
  green: palette.green,
  greenSoft: palette.greenSoft,
  orange: palette.orange,
  orangeSoft: palette.orangeSoft,

  inputBg: palette.white,
  inputBgDisabled: palette.subtle,
  inputBorderActive: palette.mono900l,
  errorBg: palette.redSoft,

  toggleTrack: palette.mono100l,
  toggleTrackActive: palette.primary,
  toggleDisabledOn: palette.toggleDisabledOn,
  handle: palette.white,

  // Progress bar keeps its own blue palette (does not lime-swap in dark)
  progressFill: palette.progressFill,
  progressTrack: palette.progressTrack,
  progressDisabled: palette.subtle,

  grey: '#f5f5f5',
};

const darkColors: typeof lightColors = {
  ...lightColors,
  bg: palette.black,
  surface: palette.mono100d,
  fg: palette.mono900d,
  muted: palette.mono600d,
  placeholder: palette.mono300d,
  border: palette.mono200d,
  borderSubtle: palette.mono200d,

  primary: palette.primaryLime,
  onPrimary: palette.black,

  inputBg: palette.black,
  inputBgDisabled: palette.mono100d,
  inputBorderActive: palette.mono900d,

  toggleTrack: palette.mono100d,
  toggleTrackActive: palette.primaryLime,

  progressDisabled: palette.mono100d,
  grey: palette.mono100d,
};

export const lightTheme = createTheme({
  colors: lightColors,
  spacing: { none: 0, xxs: 2, xs: 4, s: 8, sm: 10, m: 12, l: 16, xl: 24, xxl: 32 },
  borderRadii: { none: 0, sm: 4, md: 8, lg: 16, full: 9999 },
  textVariants: {
    defaults: { fontSize: 14, color: 'fg' },
    title: { fontSize: 18, fontWeight: '500', color: 'fg' },
    body: { fontSize: 14, fontWeight: '500', color: 'fg' },
    label: { fontSize: 14, fontWeight: '700', color: 'fg' },
    desc: { fontSize: 14, color: 'muted' },
    muted: { fontSize: 12, color: 'muted' },
    badge: { fontSize: 14, fontWeight: '500' },
  },
});

export type Theme = typeof lightTheme;

export const darkTheme: Theme = { ...lightTheme, colors: darkColors };
