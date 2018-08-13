/* @flow */

import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  children: string,
  onPress: () => void,
};

class HeaderButton extends React.Component<Props> {
  render() {
    const { onPress } = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.text}>{this.props.children}</Text>
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

export default HeaderButton;
