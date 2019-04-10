/* @flow */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { connect } from 'react-redux';

import Screen from '../../components/Screen';
import type { NavigationType } from '../../types';
import DayRow from './DayRow';
import {
  dateToWorkoutId,
  getCurrentWeek,
  getSafeTimezoneTime,
  getToday,
} from '../../utils/date';
import { getWorkoutsByRange } from '../../database/services/WorkoutService';
import WorkoutList from '../../components/WorkoutList';
import type { WorkoutSchemaType } from '../../database/types';
import HeaderIconButton from '../../components/HeaderIconButton';
import DataProvider from '../../components/DataProvider';
import type { FirstDayOfTheWeekType } from '../../redux/modules/settings';
import HeaderOverflowButton from '../../components/HeaderOverflowButton';
import i18n from '../../utils/i18n';
import WorkoutComments from '../../components/WorkoutComments';

type NavigationOptions = {
  navigation: NavigationType<{ addWorkoutComment: () => void }>,
};

type Props = NavigationOptions & {
  firstDayOfTheWeek: FirstDayOfTheWeekType,
};

type State = {
  selectedDay: string,
};

class HomeScreen extends Component<Props, State> {
  static navigationOptions = ({ navigation }: NavigationOptions) => {
    const navigateToCalendar = () => {
      navigation.navigate('Calendar', {
        today: getToday().format('YYYY-MM-DD'),
      });
    };
    const { params = {} } = navigation.state;
    return {
      headerRight: (
        <View style={styles.headerButtons}>
          <HeaderIconButton icon="date-range" onPress={navigateToCalendar} />
          <HeaderOverflowButton
            actions={[i18n.t('comment_workout')]}
            onPress={params.addWorkoutComment}
            last
          />
        </View>
      ),
    };
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedDay: dateToWorkoutId(getToday()),
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      addWorkoutComment: this._addWorkoutComment,
    });
  }

  _addWorkoutComment = () => {
    const { selectedDay } = this.state;
    this.props.navigation.navigate('Comments', { day: selectedDay });
  };

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

  _renderHeader = (
    workouts: { [key: string]: WorkoutSchemaType },
    currentWeek
  ) => {
    const { selectedDay } = this.state;

    return (
      <View>
        <DayRow
          selected={selectedDay}
          currentWeek={currentWeek}
          onDaySelected={this._onDaySelected}
          workouts={workouts}
        />
        {workouts && workouts[selectedDay] && workouts[selectedDay].comments ? (
          <WorkoutComments
            comments={workouts[selectedDay].comments}
            navigate={this.props.navigation.navigate}
            day={selectedDay}
          />
        ) : null}
      </View>
    );
  };

  render() {
    const { selectedDay } = this.state;
    const { firstDayOfTheWeek } = this.props;
    const today = getToday();
    const currentWeek = getCurrentWeek(today, firstDayOfTheWeek);

    return (
      <Screen>
        <DataProvider
          query={getWorkoutsByRange}
          args={[getSafeTimezoneTime(currentWeek[0]), currentWeek[6]]}
          parse={(data: Array<WorkoutSchemaType>) => {
            if (!data) {
              return null;
            }
            return data.reduce((obj, item) => {
              // eslint-disable-next-line no-param-reassign
              obj[item.id] = item;
              return obj;
            }, {});
          }}
          render={(workouts: { [key: string]: WorkoutSchemaType }) => (
            <WorkoutList
              contentContainerStyle={styles.list}
              workout={workouts ? workouts[selectedDay] : null}
              onPressItem={this._onExercisePress}
              ListHeaderComponent={() =>
                this._renderHeader(workouts, currentWeek)
              }
              extraData={currentWeek}
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
    paddingBottom: 56 + 32, // Taking FAB into account
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  headerButtons: {
    flexDirection: 'row',
  },
});

export default connect(
  state => ({
    firstDayOfTheWeek: state.settings.firstDayOfTheWeek,
  }),
  null
)(HomeScreen);
