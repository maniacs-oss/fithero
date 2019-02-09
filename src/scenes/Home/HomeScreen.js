/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

import Screen from '../../components/Screen';
import type { NavigationType } from '../../types';
import DayRow from './DayRow';
import { dateToString, getCurrentWeek, getToday } from '../../utils/date';
import { getWorkoutsByRange } from '../../database/services/WorkoutService';
import WorkoutList from '../../components/WorkoutList';
import type { WorkoutSchemaType } from '../../database/types';
import HeaderButton from '../../components/HeaderButton';
import i18n from '../../utils/i18n';
import HeaderIconButton from '../../components/HeaderIconButton';

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
  static navigationOptions = ({
    navigation,
  }: {
    // eslint-disable-next-line react/no-unused-prop-types
    navigation: NavigationType<{}>,
  }) => {
    const navigateToCalendar = () => {
      navigation.navigate('Calendar', {
        today: getToday().format('YYYY-MM-DD'),
      });
    };
    return {
      headerRight:
        Platform.OS === 'ios' ? (
          <HeaderButton onPress={navigateToCalendar}>
            {i18n.t('calendar')}
          </HeaderButton>
        ) : (
          <HeaderIconButton icon="date-range" onPress={navigateToCalendar} />
        ),
    };
  };

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
    this.props.navigation.navigate('Exercises', { day: selectedDay });
  };

  _onDaySelected = dateString => {
    this.setState({ selectedDay: dateString });
  };

  _onExercisePress = (exerciseKey: string, customExerciseName?: string) => {
    const { selectedDay } = this.state;
    this.props.navigation.navigate('EditSets', {
      day: selectedDay,
      exerciseKey,
      exerciseName: customExerciseName,
    });
  };

  _renderHeader = () => {
    const { workouts } = this.props;
    const { currentWeek, selectedDay } = this.state;

    return (
      <DayRow
        selected={selectedDay}
        currentWeek={currentWeek}
        onDaySelected={this._onDaySelected}
        workouts={workouts}
      />
    );
  };

  render() {
    const { workouts } = this.props;
    const { selectedDay } = this.state;
    const workout = workouts[selectedDay];

    return (
      <Screen>
        <WorkoutList
          contentContainerStyle={styles.list}
          workout={workout}
          onPressItem={this._onExercisePress}
          ListHeaderComponent={this._renderHeader}
        />
        <FAB icon="add" onPress={this._onAddExercises} style={styles.fab} />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 56 + 32, // Taking FAB into account
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

export default connect(
  state => ({ workouts: state.workouts }),
  null
)(HomeScreen);
