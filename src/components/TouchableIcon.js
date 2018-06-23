/* @flow */

import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { TouchableRipple, withTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  borderless?: boolean,
  name: string,
  // eslint-disable-next-line flowtype/no-weak-types
  iconStyle?: Object | Array<Object>,
  // eslint-disable-next-line flowtype/no-weak-types
  style?: Object | Array<Object>,
  onPress: () => void,
  // eslint-disable-next-line flowtype/no-weak-types
  theme: Object,
};

class TouchableIcon extends React.Component<Props> {
  render() {
    const { borderless = true, name, iconStyle, style, onPress } = this.props;
    const { icon: iconColor } = this.props.theme.colors;

    return (
      <TouchableRipple
        borderless={borderless}
        onPress={onPress}
        style={[styles.container, style]}
      >
        <Icon style={iconStyle} name={name} size={24} color={iconColor} />
      </TouchableRipple>
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
      android: {
        padding: 16,
      },
    }),
  },
});

export default withTheme(TouchableIcon);
