/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

import Screen from '../../components/Screen';
import type { NavigationType } from '../../types';
import DayRow from './DayRow';
import { dateToString, getCurrentWeek, getToday } from '../../utils/date';
import { getWorkoutsByRange } from '../../database/services/WorkoutService';
import WorkoutList from '../../components/WorkoutList';
import type { WorkoutSchemaType } from '../../database/types';

type Props = {
  dispatch: () => void,
  navigation: NavigationType<{}>,
  workouts: { [date: string]: WorkoutSchemaType },
};

type State = {
  currentWeek: Array<Date>,
  selectedDay: string,
};

class HomeScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const today = getToday();
    this.state = {
      selectedDay: dateToString(today),
      currentWeek: getCurrentWeek(today),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { currentWeek } = this.state;

    getWorkoutsByRange(dispatch, currentWeek[0], currentWeek[6]);
  }

  _onAddExercises = () => {
    const { selectedDay } = this.state;
    this.props.navigation.push('Exercises', { day: selectedDay });
  };

  _onDaySelected = dateString => {
    this.setState({ selectedDay: dateString });
  };

  _onExercisePress = (exerciseKey: string) => {
    const { selectedDay } = this.state;
    this.props.navigation.push('EditSets', { day: selectedDay, exerciseKey });
  };

  render() {
    const { workouts } = this.props;
    const { selectedDay } = this.state;
    const workout = workouts[selectedDay];

    return (
      <Screen>
        <DayRow
          selected={this.state.selectedDay}
          currentWeek={this.state.currentWeek}
          onDaySelected={this._onDaySelected}
          workouts={workouts}
        />
        {workout && (
          <WorkoutList
            contentContainerStyle={styles.list}
            workout={workout}
            onPressItem={this._onExercisePress}
          />
        )}
        <FAB icon="add" onPress={this._onAddExercises} style={styles.fab} />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 4,
    paddingHorizontal: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

export default withNavigation(
  connect(
    state => ({ workouts: state.workouts }),
    null
  )(HomeScreen)
);
