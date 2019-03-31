/* @flow */

/* eslint-disable import/no-extraneous-dependencies, no-undef */

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const snapshotDiff = require('snapshot-diff');

const { toMatchDiffSnapshot } = snapshotDiff;

expect.addSnapshotSerializer(snapshotDiff.getSnapshotDiffSerializer());
expect.extend({ toMatchDiffSnapshot });

Enzyme.configure({ adapter: new Adapter() });

// We never want to call the real methods of this module (or bad things are going to happen)
jest.mock('realm');
// This module has some issues with Jest and we want to avoid to use transformIgnorePatterns
jest.mock('react-navigation-backhandler', () => ({
  AndroidBackHandler: ({ children }) => children,
}));
jest.mock('react-native-localize', () => ({
  findBestAvailableLanguage: () => 'en',
}));
jest.mock('@react-native-community/async-storage', () => ({
  setItem: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
}));
jest.mock('react-native-share');
jest.mock('react-native-unimodules', () => ({
  FileSystem: {
    cacheDirectory: 'testCache',
    writeAsStringAsync: jest.fn(),
    readDirectoryAsync: jest.fn(),
    deleteAsync: jest.fn(),
    copyAsync: jest.fn(),
    readAsStringAsync: jest.fn(),
  },
}));
jest.mock('expo-document-picker');
