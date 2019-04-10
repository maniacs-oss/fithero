/* @flow */

import * as React from 'react';
import { InteractionManager } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { connect } from 'react-redux';

import Screen from '../../components/Screen';
import type { NavigationType, RealmResults } from '../../types';
import HeaderIconButton from '../../components/HeaderIconButton';
import { firstDayOfTheWeekToNumber, formatDate } from '../../utils/date';
import { getAllWorkouts } from '../../database/services/WorkoutService';
import type { WorkoutSchemaType } from '../../database/types';
import withTheme from '../../utils/theme/withTheme';
import type { ThemeType } from '../../utils/theme/withTheme';

type NavigationOptions = {
  navigation: NavigationType<{
    today: string,
    scrollToToday?: () => void,
  }>,
};

type Props = NavigationOptions & {
  firstDay: number,
  theme: ThemeType,
};

type State = {
  markedDates: { [day: string]: boolean },
  showCalendar: boolean,
};

export class CalendarScreen extends React.Component<Props, State> {
  state = {
    showCalendar: false,
    markedDates: {},
  };

  calendarList: {
    scrollToDay: (day: string, offset?: number, animation?: boolean) => void,
  } | null;

  workoutsListener: RealmResults<WorkoutSchemaType>;

  static navigationOptions = ({ navigation }: NavigationOptions) => {
    const { params = {} } = navigation.state;
    return {
      headerRight: (
        <HeaderIconButton
          onPress={() => {
            if (params.scrollToToday) {
              params.scrollToToday();
            }
          }}
          icon="today"
          last
        />
      ),
    };
  };

  componentDidMount() {
    global.requestAnimationFrame(() => {
      this.workoutsListener = getAllWorkouts();
      this.workoutsListener.addListener(workouts => {
        // TODO handle specific cases one by one?
        const markedDates = {};
        workouts.forEach(w => {
          markedDates[formatDate(w.id, 'YYYY-MM-DD')] = {
            marked: true,
          };
        });
        this.setState({ markedDates });
      });
      this.setState({
        showCalendar: true,
      });
    });
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.setParams({
        scrollToToday: this.scrollToToday,
      });
    });
  }

  componentWillUnmount() {
    this.workoutsListener.removeAllListeners();
  }

  scrollToToday = () => {
    const { today } = this.props.navigation.state.params;
    if (this.calendarList) {
      this.calendarList.scrollToDay(today, 0, true);
    }
  };

  _goToDay = day => {
    this.props.navigation.navigate('Workouts', { day: day.dateString });
  };

  render() {
    const { showCalendar } = this.state;
    const {
      firstDay,
      theme: { colors },
    } = this.props;
    const { today } = this.props.navigation.state.params;

    return (
      <Screen>
        {showCalendar && (
          <CalendarList
            ref={c => {
              this.calendarList = c;
            }}
            onDayPress={this._goToDay}
            pastScrollRange={24}
            futureScrollRange={1}
            selected={today}
            markedDates={{
              ...this.state.markedDates,
              [today]: {
                selected: true,
                marked: !!this.state.markedDates[today],
              },
            }}
            firstDay={firstDay}
            theme={{
              calendarBackground: colors.background,
              dayTextColor: colors.text,
              todayTextColor: colors.text,
              monthTextColor: colors.text,
              textSectionTitleColor: colors.secondaryText,
              selectedDayTextColor: colors.calendarSelectedDayTextColor,
              selectedDayBackgroundColor: colors.accent,
              selectedDotColor: colors.calendarSelectedDotColor,
              dotColor: colors.accent,
            }}
          />
        )}
      </Screen>
    );
  }
}

export default connect(
  state => ({
    firstDay: firstDayOfTheWeekToNumber(state.settings.firstDayOfTheWeek),
  }),
  null
)(withTheme(CalendarScreen));
