/* @flow */

import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import data from '../../data/exercises.json';
import Screen from '../../components/Screen';
import ExerciseItem from './ExerciseItem';
import ExerciseHeader from './ExerciseHeader';
import type { NavigationType } from '../../types';

type Props = {
  navigation: NavigationType<{ day: string }>,
};

export default class ExercisesScreen extends Component<Props> {
  _onExerciseToggle = (exerciseKey: string) => {
    const { day } = this.props.navigation.state.params;
    this.props.navigation.push('EditSets', { day, exerciseKey });
  };

  _keyExtractor = item => item.id;

  _renderItem = ({ item }) => (
    <ExerciseItem exercise={item} onPress={this._onExerciseToggle} />
  );

  _renderHeader = () => {
    const { day } = this.props.navigation.state.params;
    return <ExerciseHeader day={day} style={styles.header} />;
  };

  render() {
    return (
      <Screen style={styles.screen}>
        <FlatList
          data={data}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListHeaderComponent={this._renderHeader}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    paddingVertical: 8,
  },
  header: {
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
});
