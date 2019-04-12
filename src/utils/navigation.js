/* @flow */

import theme from './theme';

export const defaultNavigationOptions = {
  title: 'FitHero',
  headerStyle: {
    elevation: 0,
    backgroundColor: theme.colors.toolbar,
    borderBottomColor: theme.colors.toolbar,
  },
  headerTintColor: theme.colors.toolbarTint,
  headerPressColorAndroid: 'rgba(255, 255, 255, .20)',
};
