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
import {
  getWeight,
  getWeightUnit,
  toKg,
  toTwoDecimals,
} from '../../utils/metrics';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';

type Props = {
  day: string,
  defaultUnitSystem: DefaultUnitSystemType,
  exerciseKey: string,
  exercise: ?WorkoutExerciseSchemaType,
};

type State = {
  weight: string,
  reps: string,
  selectedId: string,
};

type ActionIncDec = (property: string, value: number) => void;

export class EditSetsWithControls extends React.Component<Props, State> {
  weightDec: ActionIncDec;
  weightInc: ActionIncDec;
  repsDec: ActionIncDec;
  repsInc: ActionIncDec;

  constructor(props: Props) {
    super(props);
    this.weightDec = this.handleIncDec.bind(this, 'weight', -1);
    this.weightInc = this.handleIncDec.bind(this, 'weight', +1);

    this.repsDec = this.handleIncDec.bind(this, 'reps', -1);
    this.repsInc = this.handleIncDec.bind(this, 'reps', +1);

    const lastSet = this._getLastSet(props, '');
    this.state = {
      weight: this._getInputWeight(props, lastSet),
      reps: lastSet ? lastSet.reps.toString() : '8',
      selectedId: '',
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.defaultUnitSystem !== this.props.defaultUnitSystem) {
      const lastSet = this._getLastSet(nextProps, this.state.selectedId);
      this.setState({
        weight: this._getInputWeight(nextProps, lastSet),
      });
    }
  }

  _getLastSet(props: Props, selectedId?: string) {
    let lastSet = null;
    if (!selectedId) {
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
    } else if (props.exercise) {
      const sets = props.exercise.sets;
      lastSet = sets[sets.findIndex(s => s.id === selectedId)];
    }
    return lastSet;
  }

  _getInputWeight(props: Props, lastSet: ?WorkoutSetSchemaType) {
    const defaultWeight = props.defaultUnitSystem === 'metric' ? 20 : 45;

    const lastWeight = lastSet
      ? toTwoDecimals(
          getWeight(lastSet.weight, props.exercise, props.defaultUnitSystem)
        )
      : defaultWeight;

    return lastWeight.toString();
  }

  onBackButtonPressAndroid = () => {
    if (this.state.selectedId) {
      this.setState({ selectedId: '' });
      return true;
    }
    return false;
  };

  handleIncDec = (property: string, value: number) => {
    const currentValue =
      this.state[property] >= '0' ? this.state[property] : '0';
    const parsedValue =
      property === 'weight'
        ? parseFloat(currentValue)
        : parseInt(currentValue, 10);
    const newValue = (parsedValue + value).toString();
    this.setState({ [property]: newValue > '0' ? newValue : '0' });
  };

  _onChangeWeightInput = (value: string) => {
    if (value === '.' || !isNaN(value)) {
      this.setState({
        weight: value,
      });
    }
  };

  _onChangeRepsInput = (value: string) => {
    this.setState({ reps: parseInt(value, 10) >= 0 ? value : '0' });
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
          weight: toTwoDecimals(
            getWeight(
              set.weight,
              this.props.exercise,
              this.props.defaultUnitSystem
            )
          ).toString(),
          reps: set.reps.toString(),
        });
      }
    }
  };

  _onAddSet = () => {
    const { day, defaultUnitSystem, exerciseKey, exercise } = this.props;
    const {
      reps: repsToConvert,
      selectedId,
      weight: weightToConvert,
    } = this.state;

    let newExercise = null;

    Keyboard.dismiss();

    const unit = getWeightUnit(exercise, defaultUnitSystem);
    let weight = 0;
    if (weightToConvert !== '.' && !isNaN(weightToConvert)) {
      weight =
        unit === 'metric'
          ? parseFloat(weightToConvert)
          : toKg(parseFloat(weightToConvert));
    }

    const reps = parseInt(repsToConvert, 10);

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
        weight_unit: defaultUnitSystem,
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

  _renderItem = ({ item, index }, maxSetId) => {
    const { defaultUnitSystem, exercise } = this.props;

    const unit =
      exercise && exercise.weight_unit
        ? exercise.weight_unit
        : defaultUnitSystem;

    return (
      <EditSetItem
        set={item}
        index={index + 1}
        isSelected={this.state.selectedId === item.id}
        isMaxSet={maxSetId === item.id}
        onPressItem={this._onPressItem}
        unit={unit}
      />
    );
  };

  render() {
    const { defaultUnitSystem, exercise } = this.props;
    const { reps, selectedId, weight } = this.state;

    const unit = getWeightUnit(exercise, defaultUnitSystem);

    return (
      <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
        <View style={styles.container}>
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <EditSetsInputControls
                input={weight}
                label={i18n.t('weight_label', {
                  w:
                    unit === 'metric'
                      ? i18n.t('kg.unit', { count: 10 })
                      : i18n.t('lb'),
                })}
                onChangeText={this._onChangeWeightInput}
                controls={[
                  { icon: 'remove', action: this.weightDec },
                  { icon: 'add', action: this.weightInc },
                ]}
                keyboardType="numeric"
                containerStyle={[
                  styles.weightContainer,
                  styles.weightSeparation,
                ]}
                labelStyle={styles.weightSeparation}
              />
              <EditSetsInputControls
                input={reps}
                label={i18n.t('reps.title')}
                onChangeText={this._onChangeRepsInput}
                controls={[
                  { icon: 'remove', action: this.repsDec },
                  { icon: 'add', action: this.repsInc },
                ]}
                keyboardType="number-pad"
                containerStyle={[styles.repsContainer, styles.repsSeparation]}
                labelStyle={styles.repsSeparation}
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
                extraData={[this.state.selectedId]}
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
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  list: {
    paddingVertical: 12,
  },
  weightContainer: {
    flex: 1,
  },
  repsContainer: {
    flex: 0.9,
  },
  weightSeparation: {
    paddingRight: 8,
  },
  repsSeparation: {
    paddingLeft: 8,
  },
});

export default EditSetsWithControls;
