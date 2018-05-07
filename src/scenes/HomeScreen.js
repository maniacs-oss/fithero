/* @flow */

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

import Screen from '../components/Screen';
import type { NavigationType } from '../types';
import DayRow from './Home/DayRow';
import { getToday } from '../utils/date';

type Props = {
  navigation: NavigationType,
};

type State = {
  selectedDay: string,
};

class HomeScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedDay: getToday(),
    };
  }

  _onAddExercises = () => {
    this.props.navigation.push('Exercises');
  };

  _onDaySelected = dateString => {
    this.setState({ selectedDay: dateString });
  };

  render() {
    return (
      <Screen>
        <DayRow
          selected={this.state.selectedDay}
          onDaySelected={this._onDaySelected}
        />
        <FAB icon="add" onPress={this._onAddExercises} style={styles.fab} />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

export default withNavigation(HomeScreen);
