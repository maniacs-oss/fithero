/* @flow */

import Share from 'react-native-share';
import { FileSystem } from 'react-native-unimodules';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-community/async-storage';

import realm from '../';
import { EXERCISE_SCHEMA_NAME } from '../schemas/ExerciseSchema';
import { WORKOUT_SCHEMA_NAME } from '../schemas/WorkoutSchema';
import {
  firstDayOfTheWeekToNumber,
  getCurrentLocale,
  getToday,
  setMomentFirstDayOfTheWeek,
} from '../../utils/date';
import { deserializeExercises, deserializeWorkouts } from '../utils';
import { name as packageName } from '../../../package.json';
import { Settings } from '../../utils/constants';
import type { SettingsType } from '../../redux/modules/settings';
import { Platform, StatusBar } from 'react-native';

export const backupDatabase = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const asyncStorageData = await AsyncStorage.multiGet(keys);
  let settings = {};
  asyncStorageData.forEach(([key, value]) => {
    if (key.includes(packageName)) {
      settings[key] = value;
    }
  });

  // Clear old backups
  try {
    const files = await FileSystem.readDirectoryAsync(
      FileSystem.cacheDirectory
    );
    files.forEach(async file => {
      if (file.includes('fithero-backup-')) {
        await FileSystem.deleteAsync(`${FileSystem.cacheDirectory}/${file}`);
      }
    });
  } catch {
    // No file
  }

  // Workouts already contain everything about workouts exercises and workouts sets
  const workoutSchema = realm.objects(WORKOUT_SCHEMA_NAME);
  const exerciseSchema = realm.objects(EXERCISE_SCHEMA_NAME);

  const backupJSON = JSON.stringify({
    workouts: deserializeWorkouts(workoutSchema),
    exercises: deserializeExercises(exerciseSchema),
    settings,
  });

  const filePath = `${
    FileSystem.cacheDirectory
  }/fithero-backup-${getToday().format('YYYY-MM-DD')}.json`;
  await FileSystem.writeAsStringAsync(filePath, backupJSON);

  await Share.open({ url: `file://${filePath}`, type: 'text/plain' });
};

export const restoreDatabase = async (
  initSettingsAction: (settings: SettingsType) => void
) => {
  const { name, uri, type } = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: false,
  });
  if (type === 'cancel') {
    return;
  }

  if (name.match(/fithero-backup-\d\d\d\d-\d\d-\d\d.json/g)) {
    await FileSystem.copyAsync({
      from: uri,
      to: `${FileSystem.cacheDirectory}/${name}`,
    });
    const backup = JSON.parse(
      await FileSystem.readAsStringAsync(`${FileSystem.cacheDirectory}/${name}`)
    );

    const settings = [];
    Object.keys(backup.settings).map(key => {
      settings.push([key, backup.settings[key]]);
    });
    await AsyncStorage.multiSet(settings);

    const firstDayOfTheWeek = backup.settings[Settings.firstDayOfTheWeek];
    const locale = getCurrentLocale();
    setMomentFirstDayOfTheWeek(
      locale,
      firstDayOfTheWeekToNumber(backup.settings[Settings.firstDayOfTheWeek]),
      true
    );

    // Update store after setting moment
    const appTheme = backup.settings[Settings.appTheme] || 'default';
    initSettingsAction({
      appTheme,
      defaultUnitSystem: backup.settings[Settings.defaultUnitSystem],
      firstDayOfTheWeek,
    });

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(
        appTheme === 'default' ? '#233656' : '#000000'
      );
    }

    realm.write(() => {
      realm.deleteAll();

      backup.exercises.forEach(exercise => {
        realm.create(EXERCISE_SCHEMA_NAME, exercise);
      });

      backup.workouts.forEach(workout => {
        realm.create(WORKOUT_SCHEMA_NAME, workout);
      });
    });
  } else {
    // TODO warn not supported file
  }
};
