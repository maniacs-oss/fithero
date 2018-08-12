/* @flow */

import { Colors, DarkTheme } from 'react-native-paper';

export default {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#333333',
    chip: '#424242',
    chipSelected: 'rgba(255, 255, 255, .20)',
    primary: Colors.red500,
    accent: Colors.red500,
    icon: Colors.white,
    secondaryText: 'rgba(255, 255, 255, .7)',
    selected: Colors.teal700,
    confirm: Colors.teal700,
    delete: Colors.red700,
    toolbar: Colors.grey900,
    trophy: Colors.yellowA400,
  },
};
