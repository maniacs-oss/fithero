/* @flow */

import * as React from 'react';
import { FlatList } from 'react-native';

import type { WorkoutSchemaType } from '../../database/types';
import WorkoutItem from './WorkoutItem';

type Props = {
  workout: WorkoutSchemaType,
};

class WorkoutList extends React.Component<Props> {
  _keyExtractor = item => item.id;

  _renderItem = ({ item }) => <WorkoutItem exercise={item} />;

  render() {
    return (
      <FlatList
        data={this.props.workout.exercises}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

export default WorkoutList;
