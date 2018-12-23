/* @flow */

import { withTheme, type Theme } from 'react-native-paper';
import type { WithThemeType } from '@callstack/react-theme-provider/lib/createWithTheme.js.flow';

import { type ThemeColorsType } from './types';

export type ThemeType = {
  ...Theme,
  colors: {
    ...$PropertyType<ThemeType, 'colors'>,
    ...ThemeColorsType,
  },
};

export type ThemeShape = $Shape<{
  ...ThemeType,
  colors: $Shape<$PropertyType<ThemeType, 'colors'>>,
  fonts: $Shape<$PropertyType<ThemeType, 'fonts'>>,
}>;

// eslint-disable-next-line flowtype/no-weak-types
export default ((withTheme: any): WithThemeType<ThemeType, ThemeShape>);
