/* @flow */

import * as React from 'react';
import { Provider } from 'react-native-paper';
import { connect } from 'react-redux';
import { defaultTheme, darkTheme } from './utils/theme';

const PaperThemeProvider = ({ appTheme, render }) => {
  const theme = appTheme === 'default' ? defaultTheme : darkTheme;
  return <Provider theme={theme}>{render(theme)}</Provider>;
};

export default connect(
  state => ({
    appTheme: state.settings.appTheme,
  }),
  null
)(PaperThemeProvider);
