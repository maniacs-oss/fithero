/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import type { CategoryType, StylePropType } from '../../types';

type Props = {
  muscle: CategoryType,
  checked: boolean,
  onValueChange: (id: string) => void,
  style?: StylePropType,
  render: (props: {
    checked: boolean,
  }) => React.Node,
};

class MuscleSelector extends React.PureComponent<Props> {
  _onPressItem = () => {
    this.props.onValueChange(this.props.muscle.id);
  };

  render() {
    const { muscle, style } = this.props;
    return (
      <TouchableRipple
        onPress={this._onPressItem}
        style={[styles.container, style]}
      >
        <View style={styles.row}>
          <View pointerEvents="none" style={styles.checkboxContainer}>
            {this.props.render({ checked: this.props.checked })}
          </View>
          <Text style={styles.text}>{muscle.name}</Text>
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 48,
  },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  checkboxContainer: {
    paddingRight: 8,
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
  },
});

export default MuscleSelector;
