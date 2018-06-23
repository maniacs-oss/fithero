/* @flow */

import * as React from 'react';
import { CalendarList } from 'react-native-calendars';
import { withTheme } from 'react-native-paper';

import Screen from '../../components/Screen';
import type { NavigationType } from '../../types';
import TouchableIcon from '../../components/TouchableIcon';

type Props = {
  navigation: NavigationType<{
    today: string,
    scrollToToday?: () => void,
  }>,
  // eslint-disable-next-line flowtype/no-weak-types
  theme: Object,
};

class CalendarScreen extends React.Component<Props> {
  calendarList: {
    scrollToDay: (day: string, offset?: number, animation?: boolean) => void,
  } | null;

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerRight: (
        <TouchableIcon
          onPress={() => params.scrollToToday()}
          name="calendar-blank"
        />
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      scrollToToday: this.scrollToToday,
    });
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
    const { theme } = this.props;
    const { today } = this.props.navigation.state.params;

    return (
      <Screen>
        <CalendarList
          ref={c => {
            this.calendarList = c;
          }}
          onDayPress={this._goToDay}
          pastScrollRange={24}
          futureScrollRange={1}
          selected={today}
          markedDates={{
            [today]: {
              selected: true,
            },
          }}
          theme={{
            calendarBackground: theme.colors.background,
            dayTextColor: theme.colors.text,
            todayTextColor: theme.colors.text,
            monthTextColor: theme.colors.text,
            textSectionTitleColor: theme.colors.secondaryText,
            selectedDayTextColor: theme.colors.text,
            selectedDayBackgroundColor: theme.colors.primary,
          }}
        />
      </Screen>
    );
  }
}

export default withTheme(CalendarScreen);
