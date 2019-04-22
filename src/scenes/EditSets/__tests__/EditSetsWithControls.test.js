/* @flow */

import React from 'react';
import { Keyboard } from 'react-native';
import { render } from 'react-native-testing-library';
import { shallow } from 'enzyme';

import { EditSetsWithControls } from '../EditSetsWithControls';
import theme from '../../../utils/theme';
import { toDate } from '../../../utils/date';
import {
  deleteSet,
  getLastSetByType,
  getMaxSetByType,
} from '../../../database/services/WorkoutSetService';
import { MockRealmArray } from '../../../database/services/__tests__/helpers/databaseMocks';
import type { WorkoutExerciseSchemaType } from '../../../database/types';

jest.mock('Keyboard');

jest.mock('../../../database/services/WorkoutSetService', () => ({
  addSet: jest.fn(),
  deleteSet: jest.fn(),
  getLastSetByType: jest.fn(() => []),
  updateSet: jest.fn(),
  getMaxSetByType: jest.fn(),
}));

jest.mock('../../../database/services/WorkoutExerciseService');

const date = toDate('2018-05-01T00:00:00.000Z');

describe('EditSetsWithControls', () => {
  const day = '2018-05-01T00:00:00.000Z';
  const exerciseKey = 'bench-press';
  const exercise = {
    id: '2018-05-01T00:00:00.000Z_bench-press',
    sets: [
      {
        id: '2018-05-01T00:00:00.000Z_bench-press_001',
        reps: 8,
        weight: 100,
        date,
        type: 'bench-press',
      },
      {
        id: '2018-05-01T00:00:00.000Z_bench-press_002',
        reps: 6,
        weight: 90,
        date,
        type: 'bench-press',
      },
    ],
    date,
    type: 'bench-press',
    sort: 0,
    weight_unit: 'metric',
    isValid: jest.fn(() => true),
  };

  const defaultWeight = 20;
  const defaultReps = 8;

  describe('EditSetsInputControls', () => {
    // eslint-disable-next-line flowtype/no-weak-types
    const getInputControls = (wrapper: Object, index: number) => {
      const inputControls = wrapper
        .find('withTheme(EditSetsInputControls)')
        .at(index)
        .dive();

      const Component = inputControls.props().children();
      return shallow(React.cloneElement(Component, { theme }));
    };

    it('has correct default values if there is no exercise', () => {
      const wrapper = shallow(
        <EditSetsWithControls
          day={day}
          exerciseKey={exerciseKey}
          exercisesCount={1}
          defaultUnitSystem="metric"
          exercise={null}
        />
      );

      expect(wrapper.state()).toEqual({
        weight: defaultWeight.toString(),
        reps: defaultReps.toString(),
        selectedId: '',
      });

      const weightControls = getInputControls(wrapper, 0);

      expect(weightControls.find('TextInput').props().value).toEqual('20');
      expect(
        weightControls
          .find('Caption')
          .children()
          .text()
      ).toEqual('Weight (kgs)');

      const repsControls = getInputControls(wrapper, 1);

      expect(repsControls.find('TextInput').props().value).toEqual('8');
      expect(
        repsControls
          .find('Caption')
          .children()
          .text()
      ).toEqual('Reps');
    });

    it('has the values of last set if we pass an exercise', () => {
      const wrapper = shallow(
        <EditSetsWithControls
          day={day}
          exerciseKey={exerciseKey}
          exercise={{
            weight_unit: 'metric',
            sort: 1,
            isValid: jest.fn(),
            ...exercise,
          }}
          exercisesCount={1}
          defaultUnitSystem="metric"
        />
      );
      expect(wrapper.state()).toEqual({
        weight: exercise.sets[1].weight.toString(),
        reps: exercise.sets[1].reps.toString(),
        selectedId: '',
      });

      const weightControls = getInputControls(wrapper, 0);
      const repsControls = getInputControls(wrapper, 1);

      expect(weightControls.find('TextInput').props().value).toEqual(
        exercise.sets[1].weight.toString()
      );
      expect(repsControls.find('TextInput').props().value).toEqual(
        exercise.sets[1].reps.toString()
      );
    });

    it('has values of last set (from another day) if no exercise', () => {
      const mockLastSet = {
        id: '2018-05-01T00:00:00.000Z_bench-press_002',
        reps: 6,
        weight: 90,
        date: toDate('2018-05-01T00:00:00.000Z'),
        type: 'bench-press',
      };

      // $FlowFixMe Flow does not now this is a mock
      getLastSetByType.mockImplementation(() => [mockLastSet]);

      const wrapper = shallow(
        <EditSetsWithControls
          day={day}
          exerciseKey={exerciseKey}
          exercisesCount={0}
          defaultUnitSystem="metric"
          exercise={null}
        />
      );
      expect(wrapper.state()).toEqual({
        weight: mockLastSet.weight.toString(),
        reps: mockLastSet.reps.toString(),
        selectedId: '',
      });

      const weightControls = getInputControls(wrapper, 0);
      const repsControls = getInputControls(wrapper, 1);

      expect(weightControls.find('TextInput').props().value).toEqual(
        mockLastSet.weight.toString()
      );
      expect(repsControls.find('TextInput').props().value).toEqual(
        mockLastSet.reps.toString()
      );
    });

    it('changes input(s) state using the TextInput', () => {
      const wrapper = shallow(
        <EditSetsWithControls
          day={day}
          exerciseKey={exerciseKey}
          exercisesCount={1}
          defaultUnitSystem="metric"
          exercise={null}
        />
      );
      const weightControls = getInputControls(wrapper, 0);
      const repsControls = getInputControls(wrapper, 1);

      const _checkStateAfterChange = (controls, stateLabel, value) => {
        controls
          .find('TextInput')
          .props()
          .onChangeText(value.toString());

        expect(wrapper.state()[stateLabel]).toEqual(value.toString());

        controls
          .find('TextInput')
          .props()
          .onChangeText('');

        expect(wrapper.state()[stateLabel]).toEqual(
          stateLabel === 'weight' ? '' : '0'
        );
      };

      _checkStateAfterChange(weightControls, 'weight', 50.0);
      _checkStateAfterChange(repsControls, 'reps', 5);
    });

    it.skip('handles empty TextInput', () => {
      // TODO write test
    });

    it('uses -2, -1, +1, +2 buttons for reps', () => {
      // $FlowFixMe Flow does not now this is a mock
      getLastSetByType.mockImplementation(() => []);

      const changeRepsValue = (buttons, buttonIndex) => {
        buttons
          .at(buttonIndex)
          .props()
          .onPress();
      };

      const wrapper = shallow(
        <EditSetsWithControls
          day={day}
          exerciseKey={exerciseKey}
          exercisesCount={1}
          defaultUnitSystem="metric"
          exercise={null}
        />
      );
      const weightControls = getInputControls(wrapper, 1);

      const buttons = weightControls.find('withTheme(IconButton)');

      changeRepsValue(buttons, 0);
      expect(wrapper.state().reps).toEqual((defaultReps - 1).toString());

      changeRepsValue(buttons, 1);
      changeRepsValue(buttons, 1);
      expect(wrapper.state().reps).toEqual(
        (defaultReps - 1 + 1 + 1).toString()
      );
    });

    it('uses -1.0, -0.5, +0.5, +1.0 buttons for weight', () => {
      // $FlowFixMe Flow does not now this is a mock
      getLastSetByType.mockImplementation(() => []);

      const changeWeightValue = (buttons, buttonIndex) => {
        buttons
          .at(buttonIndex)
          .props()
          .onPress();
      };

      const wrapper = shallow(
        <EditSetsWithControls
          day={day}
          exerciseKey={exerciseKey}
          exercisesCount={1}
          defaultUnitSystem="metric"
          exercise={null}
        />
      );
      const weightControls = getInputControls(wrapper, 0);

      const buttons = weightControls.find('withTheme(IconButton)');

      changeWeightValue(buttons, 0);
      expect(wrapper.state().weight).toEqual((defaultWeight - 1.0).toString());

      changeWeightValue(buttons, 1);
      changeWeightValue(buttons, 1);
      expect(wrapper.state().weight).toEqual(
        (defaultWeight - 1.0 + 1.0 + 1.0).toString()
      );
    });
  });

  describe('EditSetActionButtons and back button', () => {
    const wrapper = shallow(
      <EditSetsWithControls
        day={day}
        exerciseKey={exerciseKey}
        exercisesCount={1}
        defaultUnitSystem="metric"
        exercise={null}
      />
    );

    beforeEach(() => {
      jest.clearAllMocks();
      wrapper.setState({ selectedId: '' });
    });

    // eslint-disable-next-line flowtype/no-weak-types
    const getActionButtons = (parent: Object) => {
      const inputControls = parent
        .find('withTheme(EditSetActionButtons)')
        .dive();

      const Component = inputControls.props().children();
      return shallow(React.cloneElement(Component, { theme }));
    };

    it('switches between Add and Update text if a set is selected', () => {
      expect(
        getActionButtons(wrapper)
          .find('withTheme(Button)')
          .at(0)
          .children()
          .text()
      ).toEqual('Add');

      wrapper.setState({ selectedId: exercise.sets[0].id });

      expect(
        getActionButtons(wrapper)
          .find('withTheme(Button)')
          .at(0)
          .children()
          .text()
      ).toEqual('Update');
    });

    it('switches Delete button to enabled/disabled depending on set selection', () => {
      const deleteButton = getActionButtons(wrapper)
        .find('withTheme(Button)')
        .at(1);

      // Nothing selected
      expect(deleteButton.props().disabled).toBe(true);

      wrapper.setState({ selectedId: exercise.sets[0].id });

      // Something selected means delete button is enabled
      expect(deleteButton.props().disabled).toBe(true);
    });

    it('handles back button if an option is selected', () => {
      wrapper.setState({ selectedId: exercise.sets[0].id });

      // Something is selected, handle it
      expect(wrapper.instance().onBackButtonPressAndroid()).toBe(true);
      expect(wrapper.state().selectedId).toEqual('');

      // Default behavior if nothing is selected
      expect(wrapper.instance().onBackButtonPressAndroid()).toBe(false);
    });

    it.skip('adds a set and dismiss the keyboard', () => {
      expect(Keyboard.dismiss).not.toBeCalled();

      wrapper.instance()._onAddSet();

      expect(Keyboard.dismiss).toBeCalled();

      // TODO test rest of logic inside here
    });

    it('deletes a set and dismiss the keyboard', () => {
      expect(Keyboard.dismiss).not.toBeCalled();

      wrapper.instance()._onDeleteSet();

      expect(Keyboard.dismiss).toBeCalled();
      expect(deleteSet).toHaveBeenCalledTimes(1);
    });
  });

  describe('Weight units', () => {
    // $FlowFixMe
    getMaxSetByType.mockImplementation(
      () => new MockRealmArray({ ...exercise.sets[0] })
    );

    const _renderComponent = (customExercise?: WorkoutExerciseSchemaType) =>
      render(
        <EditSetsWithControls
          day={day}
          exerciseKey={exerciseKey}
          exercisesCount={1}
          defaultUnitSystem="metric"
          exercise={customExercise || exercise}
        />
      );

    it('renders kgs or lbs', () => {
      const { toJSON: metricJSON } = _renderComponent();
      const { toJSON: imperialJSON } = _renderComponent({
        ...exercise,
        weight_unit: 'imperial',
      });

      // $FlowFixMe
      expect(metricJSON()).toMatchDiffSnapshot(imperialJSON(), {
        contextLines: 0,
        stablePatchmarks: true,
      });
    });
  });
});
