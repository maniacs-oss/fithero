/* @flow */

import * as React from 'react';
import { FlatList, View } from 'react-native';

import type { ExerciseSchemaType, WorkoutSchemaType } from '../database/types';
import WorkoutItem from './WorkoutItem';
import {
  getExerciseById,
  isCustomExercise,
} from '../database/services/ExerciseService';
import DataProvider from './DataProvider';
import { extractExerciseKeyFromDatabase } from '../database/utils';

type Props = {
  contentContainerStyle?: View.propTypes.style,
  onPressItem: (exerciseKey: string, customExerciseName?: string) => void,
  workout: WorkoutSchemaType,
};

class WorkoutList extends React.Component<Props> {
  _keyExtractor = item => item.id;

  _onPressItem = (exerciseKey: string, customExerciseName?: string) => {
    this.props.onPressItem(exerciseKey, customExerciseName);
  };

  _renderItem = ({ item }) => {
    if (isCustomExercise(item.id)) {
      return (
        <DataProvider
          query={getExerciseById}
          args={[extractExerciseKeyFromDatabase(item.id)]}
          parse={(data: Array<ExerciseSchemaType>) => data[0].name}
          render={(data: string) => (
            <WorkoutItem
              exercise={item}
              customExerciseName={data}
              onPressItem={this._onPressItem}
            />
          )}
        />
      );
    }
    // $FlowFixMe withMaxSet + withTheme problems
    return <WorkoutItem exercise={item} onPressItem={this._onPressItem} />;
  };

  render() {
    const { workout, ...rest } = this.props;

    return (
      <FlatList
        data={workout ? workout.exercises : []}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        {...rest}
      />
    );
  }
}

export default WorkoutList;
