/* @flow */

import * as React from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux';

import type { ExerciseSchemaType, WorkoutSchemaType } from '../database/types';
import WorkoutItem from './WorkoutItem';
import {
  getExerciseById,
  isCustomExercise,
} from '../database/services/ExerciseService';
import DataProvider from './DataProvider';
import { extractExerciseKeyFromDatabase } from '../database/utils';
import type { DefaultUnitSystemType } from '../redux/modules/settings';
import WorkoutEmptyView from './WorkoutEmptyView';

type Props = {
  dayString: string,
  defaultUnitSystem: DefaultUnitSystemType,
  contentContainerStyle?: View.propTypes.style,
  onPressItem: (exerciseKey: string, customExerciseName?: string) => void,
  workout: ?WorkoutSchemaType,
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
          parse={(data: Array<ExerciseSchemaType>) =>
            data.length > 0 ? data[0].name : ''
          }
          render={(customName: string) => {
            if (!item.isValid()) {
              // We might have deleted the whole user exercise
              return null;
            }
            return (
              <WorkoutItem
                exercise={item}
                customExerciseName={customName}
                onPressItem={this._onPressItem}
                defaultUnitSystem={this.props.defaultUnitSystem}
              />
            );
          }}
        />
      );
    }

    return (
      <WorkoutItem
        exercise={item}
        onPressItem={this._onPressItem}
        defaultUnitSystem={this.props.defaultUnitSystem}
      />
    );
  };

  _renderEmptyView = () => {
    const { dayString, workout } = this.props;
    if (
      !workout ||
      (workout &&
        workout.isValid &&
        (workout.exercises.length === 0 && !workout.comments))
    ) {
      return <WorkoutEmptyView dayString={dayString} />;
    }
    return null;
  };

  render() {
    const { workout, ...rest } = this.props;

    return (
      <FlatList
        data={workout && workout.isValid() ? workout.exercises : []}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListEmptyComponent={this._renderEmptyView()}
        {...rest}
      />
    );
  }
}

export default connect(
  state => ({
    defaultUnitSystem: state.settings.defaultUnitSystem,
  }),
  null
)(WorkoutList);
