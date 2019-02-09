/* @flow */

import * as React from 'react';
import { Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
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
    const { accent, toolbarTint } = this.props.theme.colors;

    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity onPress={onPress}>
          <Text style={[styles.text, { color: toolbarTint }]}>
            {this.props.children}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <Button
        onPress={onPress}
        mode="contained"
        color={accent}
        style={styles.right}
      >
        {this.props.children}
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
    marginLeft: 10,
    marginRight: 15,
  },
  ...Platform.select({
    android: {
      right: {
        marginRight: 16,
      },
    },
  }),
});

export default withTheme(HeaderButton);
