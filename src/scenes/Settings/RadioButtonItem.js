/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { RadioButton, Text, TouchableRipple } from 'react-native-paper';

type Props = {
  checked: boolean,
  onValueChange: (value: string) => void,
  title: string,
  value: string,
};

class RadioButtonItem extends React.PureComponent<Props> {
  _onPressItem = () => {
    this.props.onValueChange(this.props.value);
  };

  render() {
    const { checked, title, value } = this.props;

    return (
      <TouchableRipple onPress={this._onPressItem} style={styles.container}>
        <View style={styles.row}>
          <View pointerEvents="none" style={styles.checkboxContainer}>
            <RadioButton
              status={checked ? 'checked' : 'unchecked'}
              value={value}
            />
          </View>
          <Text style={styles.text}>{title}</Text>
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
    paddingHorizontal: 24,
  },
  checkboxContainer: {
    paddingRight: 8,
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 16,
  },
});

export default RadioButtonItem;
