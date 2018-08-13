/* @flow */

import * as React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, withTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { Theme } from 'react-native-paper/types';

type Props = {
  icon: string,
  onPress: () => void,
  theme: Theme,
};

class HeaderIconButton extends React.Component<Props> {
  render() {
    const { icon, onPress } = this.props;
    const { text } = this.props.theme.colors;

    if (Platform.OS === 'android') {
      return <Appbar.Action onPress={onPress} icon={icon} color={text} />;
    }

    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <Icon name={icon} size={24} color={text} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        paddingVertical: 8,
        paddingHorizontal: 16,
      },
    }),
  },
});

export default withTheme(HeaderIconButton);
