/* @flow */

import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import withTheme from '../utils/theme/withTheme';
import type { ThemeType } from '../utils/theme/withTheme';

type Props = {
  children: string,
  onPress: () => void,
  theme: ThemeType,
};

class HeaderButton extends React.Component<Props> {
  render() {
    const { onPress } = this.props;
    const { toolbarTint } = this.props.theme.colors;

    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.text, { color: toolbarTint }]}>
          {this.props.children}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
    marginLeft: 10,
    marginRight: 15,
  },
});

export default withTheme(HeaderButton);
