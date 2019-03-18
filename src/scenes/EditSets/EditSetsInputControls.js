/* @flow */

import * as React from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { Caption, IconButton } from 'react-native-paper';
import type {
  TextStyleProp,
  ViewStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

import type { ThemeType } from '../../utils/theme/withTheme';
import withTheme from '../../utils/theme/withTheme';

type Props = {
  controls: Array<{
    icon: 'remove' | 'add',
    action: (property: string, value: number) => void,
  }>,
  input: string,
  label: string,
  onChangeText: (value: string) => void,
  theme: ThemeType,
  containerStyle?: ViewStyleProp,
  labelStyle?: TextStyleProp,
};

const increaseButtonSize = Platform.OS === 'ios' ? 36 : 28;

class EditSetsInputControls extends React.Component<Props> {
  static _renderInput(control) {
    return (
      <IconButton
        icon={control.icon}
        size={20}
        style={styles.increaseButton}
        onPress={control.action}
      />
    );
  }

  render() {
    const {
      controls,
      input,
      label,
      onChangeText,
      theme,
      containerStyle,
      labelStyle,
      ...rest
    } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        <Caption style={[styles.lineTitle, labelStyle]}>{label}</Caption>
        <View style={styles.lineInput}>
          {EditSetsInputControls._renderInput(controls[0])}
          <View style={styles.textInputContainer}>
            <TextInput
              value={input}
              onChangeText={onChangeText}
              underlineColorAndroid="transparent"
              selectionColor={theme.colors.textSelection}
              style={[
                {
                  color: theme.colors.text,
                },
                styles.textInput,
              ]}
              placeholderTextColor={theme.colors.placeholder}
              {...rest}
            />
          </View>
          {EditSetsInputControls._renderInput(controls[1])}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 2,
  },
  lineTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  lineInput: {
    marginTop: 20,
    flexDirection: 'row',
  },
  textInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    fontSize: 20,
    textAlign: 'center',
  },
  increaseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: increaseButtonSize,
    width: increaseButtonSize,
  },
});

export default withTheme(EditSetsInputControls);
