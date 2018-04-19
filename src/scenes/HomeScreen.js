/* @flow */

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

import Screen from '../components/Screen';
import type { Navigation } from '../types';

type Props = {
  navigation: Navigation,
};

class HomeScreen extends Component<Props> {
  _onAddExercises = () => {
    this.props.navigation.push('Exercises');
  };

  render() {
    return (
      <Screen>
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
