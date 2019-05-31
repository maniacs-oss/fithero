/* @flow */

import * as React from 'react';
import { Platform, StyleSheet, ScrollView, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import i18n from '../../utils/i18n';
import withTheme from '../../utils/theme/withTheme';
import MuscleSelector from './MuscleSelector';
import type { ThemeType } from '../../utils/theme/withTheme';
import {
  addExercise,
  editExercise,
  getExerciseById,
} from '../../database/services/ExerciseService';
import HeaderButton from '../../components/HeaderButton';
import HeaderIconButton from '../../components/HeaderIconButton';
import type { NavigationType } from '../../types';
import Screen from '../../components/Screen';
import { getDefaultNavigationOptions } from '../../utils/navigation';

type NavigationObjectType = {
  navigation: NavigationType<{ id?: string, onSave: () => void }>,
};

type NavigationOptions = NavigationObjectType & {
  screenProps: {
    theme: ThemeType,
  },
};

type Props = NavigationObjectType & {
  theme: ThemeType,
};

type State = {
  name: string,
  notes: ?string,
  primary: {},
  saveWasPressed: boolean,
};

export class EditExerciseScreen extends React.Component<Props, State> {
  static navigationOptions = ({
    navigation,
    screenProps,
  }: NavigationOptions) => {
    const { params = {} } = navigation.state;
    return {
      ...getDefaultNavigationOptions(screenProps.theme),
      title: params.id ? i18n.t('edit_exercise') : i18n.t('new_exercise'),
      headerLeft: (
        <HeaderIconButton icon="close" onPress={() => navigation.goBack()} />
      ),
      headerRight: (
        <HeaderButton onPress={params.onSave}>{i18n.t('save')}</HeaderButton>
      ),
    };
  };

  constructor(props: Props) {
    super(props);
    const { params = {} } = props.navigation.state;
    const { id } = params;

    const exercise = id ? getExerciseById(id)[0] : null;

    this.state = {
      name: exercise ? exercise.name : '',
      notes: exercise ? exercise.notes : '',
      primary: exercise ? { [exercise.primary[0]]: true } : {},
      saveWasPressed: false,
    };

    props.navigation.setParams({
      onSave: this._onSave,
    });
  }

  _onSave = () => {
    const primary = Object.keys(this.state.primary);

    if (this.state.name && primary.length > 0) {
      const exerciseForDb = {
        name: this.state.name,
        primary,
        notes: this.state.notes || null,
        secondary: [],
      };

      const { params = {} } = this.props.navigation.state;
      if (params.id) {
        editExercise({ id: params.id, ...exerciseForDb });
      } else {
        addExercise(exerciseForDb);
      }
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
      <Screen style={styles.screen}>
        <ScrollView>
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
        </ScrollView>
      </Screen>
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
    // Using just borderWidth here, shows a strange bug effect when navigating
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    marginHorizontal: 16,
    marginTop: 6,
    paddingVertical: 8,
  },
});

export default withTheme(EditExerciseScreen);
