/* @flow */

import * as React from 'react';
import { FlatList, Keyboard, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import { AndroidBackHandler } from 'react-navigation-backhandler';

import type {
  WorkoutExerciseSchemaType,
  WorkoutSetSchemaType,
} from '../../database/types';
import EditSetsInputControls from './EditSetsInputControls';
import i18n from '../../utils/i18n';
import EditSetItem from './EditSetItem';
import EditSetActionButtons from './EditSetActionButtons';
import {
  extractSetIndexFromDatabase,
  getExerciseSchemaId,
  getSetSchemaId,
} from '../../database/utils';
import {
  addSet,
  deleteSet,
  getLastSetByType,
  getMaxSetByType,
  updateSet,
} from '../../database/services/WorkoutSetService';
import { addExercise } from '../../database/services/WorkoutExerciseService';
import { toDate } from '../../utils/date';
import DataProvider from '../../components/DataProvider';
import type { RealmResults } from '../../types';

type Props = {
  day: string,
  exerciseKey: string,
  exercise?: ?WorkoutExerciseSchemaType,
};

type State = {
  weight: number,
  reps: number,
  selectedId: string,
};

type ActionIncDec = (property: string, value: number) => void;

export class EditSetsWithControls extends React.Component<Props, State> {
  smallestWeightDec: ActionIncDec;
  weightDec: ActionIncDec;
  weightInc: ActionIncDec;
  smallestWeightInc: ActionIncDec;
  biggestRepsDec: ActionIncDec;
  repsDec: ActionIncDec;
  repsInc: ActionIncDec;
  biggestRepsInc: ActionIncDec;

  constructor(props: Props) {
    super(props);
    this.smallestWeightDec = this.handleIncDec.bind(this, 'weight', -0.5);
    this.weightDec = this.handleIncDec.bind(this, 'weight', -1);
    this.weightInc = this.handleIncDec.bind(this, 'weight', +1);
    this.smallestWeightInc = this.handleIncDec.bind(this, 'weight', +0.5);

    this.biggestRepsDec = this.handleIncDec.bind(this, 'reps', -2);
    this.repsDec = this.handleIncDec.bind(this, 'reps', -1);
    this.repsInc = this.handleIncDec.bind(this, 'reps', +1);
    this.biggestRepsInc = this.handleIncDec.bind(this, 'reps', +2);

    let lastSet = null;
    if (props.exercise) {
      lastSet = props.exercise.sets[props.exercise.sets.length - 1];
    } else {
      const sets = getLastSetByType(
        this.props.exerciseKey || this.props.exercise?.type
      );
      if (sets.length > 0) {
        lastSet = sets[0];
      }
    }

    this.state = {
      weight: lastSet ? lastSet.weight : 20,
      reps: lastSet ? lastSet.reps : 8,
      selectedId: '',
    };
  }

  onBackButtonPressAndroid = () => {
    if (this.state.selectedId) {
      this.setState({ selectedId: '' });
      return true;
    }
    return false;
  };

  handleIncDec = (property: string, value: number) => {
    const currentValue = this.state[property] >= 0 ? this.state[property] : 0;
    const newValue = currentValue + value;
    this.setState({ [property]: newValue > 0 ? newValue : 0 });
  };

  _onChangeWeightInput = (value: string) => {
    this.setState({ weight: value ? parseFloat(value) : -1 });
  };

  _onChangeRepsInput = (value: string) => {
    this.setState({ reps: value ? parseInt(value, 10) : -1 });
  };

  _keyExtractor = item => item.id;

  _onPressItem = (setId: string) => {
    if (this.state.selectedId === setId) {
      this.setState({ selectedId: '' });
      return;
    }
    if (this.props.exercise) {
      const { sets } = this.props.exercise;
      const set = sets.find(s => s.id === setId);
      if (set) {
        this.setState({
          selectedId: setId,
          weight: set.weight,
          reps: set.reps,
        });
      }
    }
  };

  _onAddSet = () => {
    const { day, exerciseKey, exercise } = this.props;
    const { reps, selectedId, weight } = this.state;

    let newExercise = null;

    Keyboard.dismiss();

    if (!exercise) {
      const exerciseIdDb = getExerciseSchemaId(day, exerciseKey);
      newExercise = {
        id: exerciseIdDb,
        sets: [
          {
            id: getSetSchemaId(day, exerciseKey, 1),
            weight,
            reps,
            date: toDate(day),
            type: exerciseKey,
          },
        ],
        comments: '',
        date: toDate(day),
        type: exerciseKey,
      };
      addExercise(newExercise);
    } else if (!selectedId) {
      const lastId = exercise.sets[exercise.sets.length - 1].id;
      const lastIndex = extractSetIndexFromDatabase(lastId);

      addSet({
        id: getSetSchemaId(day, exerciseKey, lastIndex + 1),
        weight,
        reps,
        date: toDate(day),
        type: exerciseKey,
      });
    } else if (selectedId) {
      updateSet({
        id: selectedId,
        weight,
        reps,
        date: toDate(day),
        type: exerciseKey,
      });
    }

    if (selectedId) {
      this.setState({ selectedId: '' });
    }
  };

  _onDeleteSet = () => {
    const { selectedId } = this.state;

    Keyboard.dismiss();

    deleteSet(selectedId);
    this.setState({ selectedId: '' });
  };

  _renderItem = ({ item, index }, maxSetId) => (
    <EditSetItem
      set={item}
      index={index + 1}
      isSelected={this.state.selectedId === item.id}
      isMaxSet={maxSetId === item.id}
      onPressItem={this._onPressItem}
    />
  );

  render() {
    const { exercise } = this.props;
    const { reps, selectedId, weight } = this.state;

    return (
      <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
        <View style={styles.container}>
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <EditSetsInputControls
                input={weight}
                label={i18n.t('weight_label', {
                  w: i18n.t('kg.unit', { count: 10 }),
                })}
                onChangeText={this._onChangeWeightInput}
                controls={[
                  { label: '-0.5', action: this.smallestWeightDec },
                  { label: '-1.0', action: this.weightDec },
                  { label: '+1.0', action: this.weightInc },
                  { label: '+0.5', action: this.smallestWeightInc },
                ]}
              />
              <EditSetsInputControls
                input={reps}
                label={i18n.t('reps.title')}
                onChangeText={this._onChangeRepsInput}
                controls={[
                  { label: '-2', action: this.biggestRepsDec },
                  { label: '-1', action: this.repsDec },
                  { label: '+1', action: this.repsInc },
                  { label: '+2', action: this.biggestRepsInc },
                ]}
              />
            </View>
            <EditSetActionButtons
              isUpdate={!!selectedId}
              onAddSet={this._onAddSet}
              onDeleteSet={this._onDeleteSet}
            />
          </Card>
          <DataProvider
            query={getMaxSetByType}
            args={[this.props.exerciseKey]}
            parse={(sets: RealmResults<WorkoutSetSchemaType>) =>
              sets.length > 0 ? sets[0].id : null
            }
            render={(maxSetId: string) => (
              <FlatList
                contentContainerStyle={styles.list}
                // It's possible that we delete the whole exercise so this access to .sets would be invalid
                data={exercise && exercise.isValid() ? exercise.sets : []}
                keyExtractor={this._keyExtractor}
                renderItem={propsData => this._renderItem(propsData, maxSetId)}
                extraData={[this.state.selectedId, exercise]}
                keyboardShouldPersistTaps="always"
              />
            )}
          />
        </View>
      </AndroidBackHandler>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  cardContent: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  list: {
    paddingVertical: 12,
  },
});

export default EditSetsWithControls;
