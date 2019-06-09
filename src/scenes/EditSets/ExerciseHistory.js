/* @flow */

import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import useRealmResultsHook from '../../components/useRealmResultsHook';
import { getExercisesByType } from '../../database/services/WorkoutExerciseService';
import type {
  WorkoutExerciseSchemaType,
  WorkoutSetSchemaType,
} from '../../database/types';
import { connect } from 'react-redux';
import ExerciseHistoryItem from './ExerciseHistoryItem';
import { getMaxSetByType } from '../../database/services/WorkoutSetService';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';
import type { NavigationType } from '../../types';
import { dateToString, getToday } from '../../utils/date';
import i18n from '../../utils/i18n';

type Props = {
  type: 'string',
  unit: DefaultUnitSystemType,
  navigation: NavigationType<{
    exerciseKey: string,
  }>,
};

const ExerciseHistory = (props: Props) => {
  const type = props.navigation.state.params.exerciseKey;

  const { data, timestamp } = useRealmResultsHook<WorkoutExerciseSchemaType>(
    useCallback(() => getExercisesByType(type), [type])
  );
  const { data: maxSet } = useRealmResultsHook<WorkoutSetSchemaType>(
    useCallback(() => getMaxSetByType(type), [type])
  );

  const maxSetId = maxSet.length > 0 ? maxSet[0].id : null;
  const todayString = dateToString(getToday());

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <ExerciseHistoryItem
            exercise={item}
            unit={props.unit}
            maxSetId={maxSetId}
            todayString={todayString}
          />
        </Card>
      )}
      extraData={timestamp}
      ListEmptyComponent={renderEmptyView}
    />
  );
};

const keyExtractor = exercise => exercise.id;

const renderEmptyView = () => (
  <View style={styles.emptyContainer}>
    <Text>{i18n.t('empty_view__history')}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  emptyContainer: {
    padding: 16,
  },
});

export default connect(
  state => ({
    unit: state.settings.defaultUnitSystem,
  }),
  null
)(ExerciseHistory);
