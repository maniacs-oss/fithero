/* @flow */

import { Colors, DarkTheme } from 'react-native-paper';
import type { ThemeColorsType } from './types';
import type { ThemeType } from './withTheme';

const primary = Colors.amberA200;
const background = '#333333';

const ThemeColors: ThemeColorsType = {
  accent: primary,
  background,
  calendarSelectedDayTextColor: background,
  calendarSelectedDotColor: background,
  chip: '#424242',
  chipSelected: 'rgba(255, 255, 255, .20)',
  secondaryText: 'rgba(255, 255, 255, .7)',
  selected: 'rgba(255, 255, 255, .20)',
  surface: Colors.grey800,
  primary,
  textSelection: Colors.red300,
  toolbar: Colors.grey900,
  toolbarTint: Colors.white,
  trophy: primary,
};

const Theme: ThemeType = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...ThemeColors,
  },
};

export default Theme;
