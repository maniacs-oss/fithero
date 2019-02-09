/* @flow */

import * as React from 'react';
import { Platform, StyleSheet, ScrollView, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import i18n from '../../utils/i18n';
import withTheme from '../../utils/theme/withTheme';
import MuscleSelector from './MuscleSelector';
import type { ThemeType } from '../../utils/theme/withTheme';
import type { ExerciseSchemaType } from '../../database/types';
import { addExercise } from '../../database/services/ExerciseService';
import HeaderButton from '../../components/HeaderButton';
import HeaderIconButton from '../../components/HeaderIconButton';
import type { NavigationType } from '../../types';

type NavigationOptions = {
  navigation: NavigationType<{ onSave: () => void }>,
};

type Props = {
  exercise: ?ExerciseSchemaType,
  theme: ThemeType,
  navigation: NavigationType<{
    onSave: () => void,
  }>,
};

type State = {
  name: string,
  notes: ?string,
  primary: {},
  saveWasPressed: boolean,
};

export class EditExerciseScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: NavigationOptions) => {
    const { params = {} } = navigation.state;
    return {
      title: params.title || i18n.t('new_exercise'),
      headerLeft: (
        <HeaderIconButton icon="close" onPress={() => navigation.goBack()} />
      ),
      headerRight: (
        <HeaderButton onPress={params.onSave}>{i18n.t('save')}</HeaderButton>
      ),
    };
  };

  state = {
    name: '',
    notes: '',
    primary: {},
    saveWasPressed: false,
  };

  constructor(props: Props) {
    super(props);
    const { exercise } = props;
    if (exercise) {
      this.setState({
        name: exercise.name,
        notes: exercise.notes,
        primary: { [exercise.primary[0]]: true },
      });
    }

    props.navigation.setParams({
      onSave: this._onSave,
    });
  }

  _onSave = () => {
    const primary = Object.keys(this.state.primary);

    if (this.state.name && primary.length > 0) {
      const exerciseForDb = Object.assign(
        {},
        {
          name: this.state.name,
          primary,
        },
        this.state.notes ? { notes: this.state.notes } : {}
      );

      addExercise(exerciseForDb);
      this.props.navigation.goBack();
    } else {
      this.setState({ saveWasPressed: true });
    }
  };

  _onNameChange = name => {
    this.setState({ name });
  };

  _onNotesChange = notes => {
    this.setState({ notes });
  };

  _onPrimaryChange = muscles => {
    this.setState({
      primary: muscles,
    });
  };

  _isErrorName = () =>
    this.state.saveWasPressed && this.state.name.trim().length === 0;

  _isErrorMuscle = () =>
    this.state.saveWasPressed && Object.keys(this.state.primary).length === 0;

  render() {
    const { colors, roundness } = this.props.theme;
    const { name, notes, primary } = this.state;

    const isErrorMuscle = this._isErrorMuscle();

    return (
      <ScrollView>
        <View style={styles.screen}>
          {/* $FlowFixMe passing theme to a component gives Flow errors (Paper) */}
          <TextInput
            label={i18n.t('name')}
            mode="outlined"
            theme={{
              colors: {
                primary: colors.accent,
              },
            }}
            onChangeText={this._onNameChange}
            value={name}
            autoCorrect={false}
            selectionColor={colors.textSelection}
            error={this._isErrorName()}
            style={styles.inputRow}
          />
          {/* $FlowFixMe passing theme to a component gives Flow errors (Paper) */}
          <TextInput
            label={i18n.t('notes')}
            mode="outlined"
            numberOfLines={2}
            multiline
            theme={{
              colors: {
                primary: colors.accent,
              },
            }}
            onChangeText={this._onNotesChange}
            value={notes}
            autoCorrect={false}
            selectionColor={colors.textSelection}
            style={styles.inputRow}
          />
          <View>
            <View
              testID="muscle-container"
              style={[
                styles.categoriesContainer,
                {
                  borderColor: isErrorMuscle
                    ? colors.error
                    : colors.placeholder,
                  borderRadius: roundness,
                },
              ]}
            >
              <MuscleSelector
                muscles={primary}
                onValueChange={this._onPrimaryChange}
                multiple={false}
              />
            </View>
            <View
              style={[
                styles.outlinedLabelBackground,
                { backgroundColor: colors.background },
              ]}
            >
              <Text
                testID="muscle-label"
                style={[
                  styles.label,
                  { color: isErrorMuscle ? colors.error : colors.placeholder },
                ]}
              >
                {i18n.t('primary_muscle')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: Platform.OS === 'android' ? 4 : 8,
    paddingBottom: 8,
  },
  inputRow: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  outlinedLabelBackground: {
    position: 'absolute',
    top: -2,
    left: 24,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 12,
  },
  categoriesContainer: {
    borderWidth: 2,
    marginHorizontal: 16,
    marginTop: 6,
    paddingVertical: 8,
  },
});

export default withTheme(EditExerciseScreen);
