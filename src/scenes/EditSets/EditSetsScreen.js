/* @flow */

import React, { Component } from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
import { Subheading, Title, withTheme } from 'react-native-paper';

import Screen from '../../components/Screen';
import i18n from '../../utils/i18n';
import { parseSummary } from '../../utils/exercisePaper';

type Props = {
  // eslint-disable-next-line flowtype/no-weak-types
  theme: Object,
};

type State = {
  exerciseSummary: string,
  numberOfSets: number,
};

class EditSetsScreen extends Component<Props, State> {
  state = {
    exerciseSummary: '',
    numberOfSets: 0,
  };

  _onValueChange = (value: string) => {
    const { sets } = parseSummary(value);
    this.setState({ exerciseSummary: value, numberOfSets: sets.length });
  };

  render() {
    const { theme } = this.props;
    const { exerciseSummary, numberOfSets } = this.state;

    return (
      <Screen style={styles.container}>
        <Title>Exercise title</Title>
        <Subheading>{`${numberOfSets} ${i18n.t(
          numberOfSets === 1 ? 'set' : 'sets'
        )}`}</Subheading>
        <TextInput
          autoFocus
          autoCorrect={false}
          multiline
          labelColor={theme.colors.primary}
          underlineColorAndroid="transparent"
          selectionColor={theme.colors.primary}
          style={[{ color: theme.colors.text }, styles.textArea]}
          placeholderTextColor={theme.colors.placeholder}
          placeholder={i18n.t('exercise__paper-placeholder')}
          value={exerciseSummary}
          onChangeText={this._onValueChange}
          textAlignVertical="top"
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  textArea: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 24,
    fontSize: Platform.OS === 'ios' ? 16 : 18,
  },
});

export default withTheme(EditSetsScreen);
