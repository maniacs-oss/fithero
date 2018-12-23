/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ThemeType } from '../utils/theme/withTheme';
import withTheme from '../utils/theme/withTheme';

type Props = {
  children?: React.Node,
  style?: ViewStyleProp,
  theme: ThemeType,
};

class Screen extends React.Component<Props> {
  render() {
    return (
      <View
        style={[
          { backgroundColor: this.props.theme.colors.background },
          styles.container,
          this.props.style,
        ]}
      >
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withTheme(Screen);
