/* @flow */

import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Subheading, Title } from 'react-native-paper';

import { whenIsTheDay } from '../utils/date';
import i18n from '../utils/i18n';
import { getAllWorkouts } from '../database/services/WorkoutService';
import type { WorkoutSchemaType } from '../database/types';
import type { RealmResults } from '../types';

type Props = {
  dayString: string,
};

const min = Math.ceil(1);
const max = Math.floor(2);
const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;

const descriptions = (isFirstWorkout: boolean) => ({
  past: 'empty_view__no_workouts_description_past',
  today: isFirstWorkout
    ? 'empty_view__no_workouts_description_first_workout'
    : `empty_view__no_workouts_description_today_${randomValue}`,
  future: 'empty_view__no_workouts_description_future',
});

const WorkoutEmptyView = ({ dayString }: Props) => {
  const [workoutsNumber, setWorkoutsNumber] = useState(
    () => getAllWorkouts().length
  );

  useEffect(
    () => {
      function handleChange(newData: RealmResults<WorkoutSchemaType>) {
        if (
          (workoutsNumber === 0 && newData.length > 0) ||
          (workoutsNumber > 0 && newData.length === 0)
        ) {
          setWorkoutsNumber(newData.length);
        }
      }
      const query = getAllWorkouts();
      query.addListener(handleChange);
      return () => {
        query.removeAllListeners();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const description = descriptions(workoutsNumber === 0)[
    whenIsTheDay(dayString)
  ];
  return (
    <View style={styles.container}>
      <Title>{i18n.t('empty_view__no_workouts_title')}</Title>
      <Subheading style={styles.subheading}>{i18n.t(description)}</Subheading>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  subheading: {
    textAlign: 'center',
  },
});

export default WorkoutEmptyView;
