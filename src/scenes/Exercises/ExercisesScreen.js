/* @flow */

import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import data from '../../data/exercises.json';
import Screen from '../../components/Screen';
import ExerciseItem from './ExerciseItem';

type State = {
  selected: { [key: string]: boolean },
};

export default class ExercisesScreen extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    const selected = {};
    data.forEach(d => {
      selected[d.id] = false;
    });
    this.state = {
      selected,
    };
  }

  _onExerciseToggle = (id: string, value: boolean) => {
    const selected = { ...this.state.selected };
    selected[id] = value;
    this.setState({ selected });
  };

  _keyExtractor = item => item.id;

  _renderItem = ({ item }) => (
    <ExerciseItem
      checked={this.state.selected[item.id]}
      exercise={item}
      onPress={this._onExerciseToggle}
    />
  );

  render() {
    return (
      <Screen style={styles.screen}>
        <FlatList
          data={data}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    paddingVertical: 8,
  },
});
