/* @flow */

import * as React from 'react';
import { FlatList, View } from 'react-native';

import type { WorkoutSchemaType } from '../../database/types';
import WorkoutItem from './WorkoutItem';

type Props = {
  contentContainerStyle?: View.propTypes.style,
  onPressItem: (exerciseKey: string) => void,
  workout: WorkoutSchemaType,
};

class WorkoutList extends React.Component<Props> {
  _keyExtractor = item => item.id;

  _onPressItem = (exerciseKey: string) => {
    this.props.onPressItem(exerciseKey);
  };

  _renderItem = ({ item }) => (
    <WorkoutItem exercise={item} onPressItem={this._onPressItem} />
  );

  render() {
    const { contentContainerStyle } = this.props;

    return (
      <FlatList
        contentContainerStyle={contentContainerStyle}
        data={this.props.workout.exercises}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

export default WorkoutList;
