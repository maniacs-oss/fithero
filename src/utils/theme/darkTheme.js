/* @flow */

import { Colors, DarkTheme as PaperDarkTheme } from 'react-native-paper';

import type { ThemeColorsType } from './types';
import type { ThemeType } from './withTheme';

const accent = '#a6ed8e';
const background = '#121212';
const surface = '#1e1e1e';

const ThemeColors: ThemeColorsType = {
  accent,
  background,
  borderColor: '#555555',
  calendarSelectedDayTextColor: background,
  calendarSelectedDotColor: background,
  chartBar: Colors.green200,
  chip: '#2e2e2e',
  chipSelected: '#474747',
  dialogBackground: '#383838',
  secondaryText: '#a0a0a0',
  selected: '#474747',
  surface,
  primary: background,
  textSelection: Colors.red300,
  toolbar: '#121212',
  toolbarTint: Colors.white,
  trophy: accent,
};

const DarkTheme: ThemeType = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...ThemeColors,
  },
};

export default DarkTheme;
