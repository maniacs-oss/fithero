/* @flow */

/* eslint-disable import/no-extraneous-dependencies, no-undef */

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// We never want to call the real methods of this module (or bad things are going to happen)
jest.mock('realm');
// This module has some issues with Jest and we want to avoid to use transformIgnorePatterns
jest.mock('react-navigation-backhandler', () => ({
  AndroidBackHandler: ({ children }) => children,
}));
