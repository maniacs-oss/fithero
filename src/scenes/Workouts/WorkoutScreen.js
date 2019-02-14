/* @flow */

import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

import WorkoutList from '../../components/WorkoutList';
import { getDay, getDatePrettyFormat, getToday } from '../../utils/date';
import { getWorkoutById } from '../../database/services/WorkoutService';
import type { NavigationType } from '../../types';
import type { WorkoutSchemaType } from '../../database/types';
import DataProvider from '../../components/DataProvider';
import Screen from '../../components/Screen';

type NavigationOptions = {
  navigation: NavigationType<{ day: string }>,
};

type Props = NavigationOptions & {};

class WorkoutScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }: NavigationOptions) => ({
    title: getDatePrettyFormat(navigation.state.params.day, getToday(), true),
  });

  _onAddExercises = () => {
    const day = getDay(this.props.navigation.state.params.day);
    this.props.navigation.navigate('Exercises', { day });
  };

  _onExercisePress = (exerciseKey: string, customExerciseName?: string) => {
    const day = getDay(this.props.navigation.state.params.day);
    this.props.navigation.navigate('EditSets', {
      day,
      exerciseKey,
      exerciseName: customExerciseName,
    });
  };

  render() {
    const day = getDay(this.props.navigation.state.params.day);

    return (
      <Screen>
        <DataProvider
          query={getWorkoutById}
          args={[day]}
          parse={(data: Array<WorkoutSchemaType>) =>
            data.length > 0 ? data[0] : null
          }
          render={(workout: ?WorkoutSchemaType) => (
            <WorkoutList
              contentContainerStyle={styles.list}
              workout={workout}
              onPressItem={this._onExercisePress}
            />
          )}
        />
        <FAB icon="add" onPress={this._onAddExercises} style={styles.fab} />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 8,
    paddingHorizontal: 4,
    paddingBottom: 56 + 32, // Taking FAB into account
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

export default WorkoutScreen;
