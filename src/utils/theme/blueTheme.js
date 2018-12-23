/* @flow */

import { Colors, DarkTheme } from 'react-native-paper';
import type { ThemeColorsType } from './types';
import type { ThemeType } from './withTheme';

const primary = '#415B76';
const accent = '#6FE3C4';
const selected = 'rgba(255, 255, 255, .20)';

const ThemeColors: ThemeColorsType = {
  accent,
  background: primary,
  calendarSelectedDayTextColor: primary,
  calendarSelectedDotColor: primary,
  chip: '#526c87',
  chipSelected: selected,
  primary,
  selected,
  secondaryText: 'rgba(255, 255, 255, .7)',
  surface: '#526c87',
  textSelection: '#6f8691',
  toolbar: primary,
  toolbarTint: Colors.white,
  trophy: accent,
};

const Theme: ThemeType = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...ThemeColors,
  },
};

export default Theme;
