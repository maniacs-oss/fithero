/* @flow */

import { getExerciseMuscleName } from './exercises';
import type { CategoryType } from '../types';

const categories = ['arms', 'back', 'chest', 'core', 'legs'];

const muscles = [
  'abs',
  'back',
  'biceps',
  'core',
  'shoulders',
  'hamstrings',
  'forearms',
  'calves',
  'glutes',
  'abductors',
  'lats',
  'chest',
  'quadriceps',
  'traps',
  'triceps',
];

const getMainCategories = () =>
  categories.map(id => ({
    id,
    name: getExerciseMuscleName(id),
  }));

const getMuscleCategories = () =>
  muscles.map(id => ({
    id,
    name: getExerciseMuscleName(id),
  }));

export const muscleCategories: Array<CategoryType> = getMuscleCategories();

export const mainCategories: Array<CategoryType> = getMainCategories();

export const mapCategories = {
  abs: 'core',
  back: 'back',
  biceps: 'arms',
  core: 'core',
  shoulders: 'arms',
  hamstrings: 'legs',
  forearms: 'arms',
  calves: 'legs',
  glutes: 'legs',
  abductors: 'legs',
  lats: 'back',
  chest: 'chest',
  quadriceps: 'legs',
  traps: 'back',
  triceps: 'arms',
};
