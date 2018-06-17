/* @flow */

import * as React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

import type { ExerciseSchemaType } from '../../database/types';
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
  updateSet,
} from '../../database/services/SetService';
import { addExercise } from '../../database/services/ExerciseService';

type Props = {
  day: string,
  dispatch: () => void,
  exerciseKey: string,
  exercise?: ExerciseSchemaType,
};

type State = {
  weight: number,
  reps: number,
  selectedId: string,
};

type ActionIncDec = (property: string, value: number) => void;

class EditSetsWithControls extends React.Component<Props, State> {
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
    }

    this.state = {
      weight: lastSet ? lastSet.weight : 20,
      reps: lastSet ? lastSet.reps : 8,
      selectedId: '',
    };
  }

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
    const { day, dispatch, exerciseKey, exercise } = this.props;
    const { reps, selectedId, weight } = this.state;

    let newExercise = null;

    if (!exercise) {
      const exerciseIdDb = getExerciseSchemaId(day, exerciseKey);
      newExercise = {
        id: exerciseIdDb,
        sets: [
          {
            id: getSetSchemaId(day, exerciseKey, 1),
            weight,
            reps,
          },
        ],
        comments: '',
      };
      addExercise(dispatch, newExercise);
    } else if (!selectedId) {
      const lastId = exercise.sets[exercise.sets.length - 1].id;
      const lastIndex = extractSetIndexFromDatabase(lastId);

      addSet(dispatch, {
        id: getSetSchemaId(day, exerciseKey, lastIndex + 1),
        weight,
        reps,
      });
    } else if (selectedId) {
      updateSet(dispatch, {
        id: selectedId,
        weight,
        reps,
      });
    }

    if (selectedId) {
      this.setState({ selectedId: '' });
    }
  };

  _onDeleteSet = () => {
    const { dispatch } = this.props;
    const { selectedId } = this.state;

    deleteSet(dispatch, selectedId);
    this.setState({ selectedId: '' });
  };

  _renderItem = ({ item, index }) => (
    <EditSetItem
      set={item}
      index={index + 1}
      isSelected={this.state.selectedId === item.id}
      onPressItem={this._onPressItem}
    />
  );

  render() {
    const { exercise } = this.props;
    const { reps, selectedId, weight } = this.state;

    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <EditSetsInputControls
              input={weight}
              label={i18n.t('weight_label', {
                w: i18n.t('kg_unit', { count: 10 }),
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
              label={i18n.t('reps')}
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
        <FlatList
          contentContainerStyle={styles.list}
          data={exercise ? exercise.sets : []}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          extraData={this.state.selectedId}
        />
      </View>
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
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 2,
  },
  list: {
    paddingVertical: 12,
  },
});

export default EditSetsWithControls;
