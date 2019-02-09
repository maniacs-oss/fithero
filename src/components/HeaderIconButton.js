/* @flow */

import * as React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import withTheme from '../utils/theme/withTheme';
import type { ThemeType } from '../utils/theme/withTheme';

type Props = {
  icon: string,
  onPress: () => mixed,
  theme: ThemeType,
};

class HeaderIconButton extends React.Component<Props> {
  render() {
    const { icon, onPress } = this.props;
    const { toolbarTint } = this.props.theme.colors;

    if (Platform.OS === 'android') {
      return (
        <Appbar.Action onPress={onPress} icon={icon} color={toolbarTint} />
      );
    }

    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <Icon name={icon} size={24} color={toolbarTint} />
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
