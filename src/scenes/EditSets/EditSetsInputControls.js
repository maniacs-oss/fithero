/* @flow */

import * as React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Caption, Text, TouchableRipple, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/src/types';

type Props = {
  controls: Array<{
    label: string,
    action: (property: string, value: number) => void,
  }>,
  input: number,
  label: string,
  onChangeText: (value: string) => void,
  theme: Theme,
};

class EditSetsInputControls extends React.Component<Props> {
  static _renderInput(control) {
    return (
      <TouchableRipple style={styles.increaseButton} onPress={control.action}>
        <Text>{control.label}</Text>
      </TouchableRipple>
    );
  }

  render() {
    const { controls, input, label, onChangeText, theme } = this.props;

    return (
      <View style={styles.container}>
        <Caption style={styles.lineTitle}>{label}</Caption>
        <View style={styles.lineInput}>
          {EditSetsInputControls._renderInput(controls[0])}
          {EditSetsInputControls._renderInput(controls[1])}
          <View style={styles.textInputContainer}>
            <TextInput
              value={input >= 0 ? input.toString() : ''}
              onChangeText={onChangeText}
              keyboardType="numeric"
              labelColor={theme.colors.primary}
              underlineColorAndroid="transparent"
              selectionColor={theme.colors.primary}
              textAlign="center"
              style={[{ color: theme.colors.text }, styles.textInput]}
              placeholderTextColor={theme.colors.placeholder}
            />
          </View>
          {EditSetsInputControls._renderInput(controls[2])}
          {EditSetsInputControls._renderInput(controls[3])}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 2,
  },
  lineTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  lineInput: {
    marginTop: 16,
    flexDirection: 'row',
  },
  textInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  textInput: {
    fontSize: 20,
    width: 100,
    maxWidth: 100,
  },
  increaseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    height: 48,
    width: 48,
  },
});

export default withTheme(EditSetsInputControls);
