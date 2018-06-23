/* @flow */

import { Colors, DarkTheme } from 'react-native-paper';

export default {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.red500,
    accent: Colors.red500,
    icon: Colors.white,
    secondaryText: 'rgba(255, 255, 255, .7)',
    selected: Colors.teal700,
    confirm: Colors.teal700,
    delete: Colors.red700,
  },
};
