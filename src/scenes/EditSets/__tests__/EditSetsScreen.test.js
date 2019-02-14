/* @flow */

import React from 'react';
import { render } from 'react-native-testing-library';
import { Provider } from 'react-redux';

import EditSetsScreen from '../EditSetsScreen';
import store from '../../../redux/configureStore';
import { EDIT_SETS_SCREEN_TYPE } from '../../../redux/modules/settings';

jest.mock('../EditSetsWithControls');
jest.mock('../EditSetsWithPaper');
jest.mock('../../../components/DataProvider', () => props => props.render());

const getComponent = (type: 'list' | 'paper') => {
  store.dispatch({
    type: EDIT_SETS_SCREEN_TYPE,
    payload: type,
  });
  return render(
    <Provider store={store}>
      <EditSetsScreen
        navigation={{
          state: {
            params: {
              day: '2018-05-04T00:00:00.000Z',
              exerciseKey: 'bench-press',
            },
          },
        }}
      />
    </Provider>
  );
};

it('renders the EditSetsWithControls when the option is "list"', () => {
  const { queryByTestId } = getComponent('list');

  expect(queryByTestId('edit-sets-with-controls')).not.toBeNull();
  expect(queryByTestId('edit-sets-with-paper')).toBeNull();
});

it('renders the EditSetsWithControls when the option is "paper"', () => {
  const { queryByTestId } = getComponent('paper');

  expect(queryByTestId('edit-sets-with-controls')).toBeNull();
  expect(queryByTestId('edit-sets-with-paper')).not.toBeNull();
});
