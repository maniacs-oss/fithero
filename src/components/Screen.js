/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTheme } from 'react-native-paper';

import type { Theme } from 'react-native-paper/src/types';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

type Props = {
  children?: React.Node,
  style?: ViewStyleProp,
  theme: Theme,
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
