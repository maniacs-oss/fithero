/* @flow */

import type { ThemeType } from './theme/withTheme';

export const getDefaultNavigationOptions = (theme: ThemeType) => ({
  title: 'FitHero',
  headerStyle: {
    elevation: 0,
    backgroundColor: theme.colors.toolbar,
    borderBottomColor: theme.colors.toolbar,
  },
  headerTintColor: theme.colors.toolbarTint,
  headerPressColorAndroid: 'rgba(255, 255, 255, .20)',
  cardStyle: {
    backgroundColor: theme.colors.background,
  },
});
