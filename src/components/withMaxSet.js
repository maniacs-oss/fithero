/* @flow */

import * as React from 'react';

import { getMaxSetByType } from '../database/services/WorkoutSetService';
import type { WorkoutSetSchemaType } from '../database/types';
import type { RealmResults } from '../types';

type InjectedProps = {|
  maxSetId: string,
|};

// In the future this should be a React Hook
// Right now mixing this with withTheme give Flow problems
function withMaxSet<Props: {}>(
  WrappedComponent: React.ComponentType<Props>
): React.ComponentType<$Diff<Props, InjectedProps>> {
  return class WithMaxSet extends React.Component<*, InjectedProps> {
    realmListener: RealmResults<WorkoutSetSchemaType>;

    state = {
      maxSetId: '',
    };

    componentDidMount() {
      this.realmListener = getMaxSetByType(
        this.props.exerciseKey || this.props.exercise.type
      );
      this.realmListener.addListener(sets => {
        if (sets.length > 0) {
          const set = sets[0];
          if (set.id !== this.state.maxSetId) {
            this.setState({ maxSetId: set.id });
          }
        } else if (this.state.maxSetId) {
          // Can be that we deleted that set/exercise
          this.setState({ maxSetId: '' });
        }
      });
    }

    componentWillUnmount() {
      this.realmListener.removeAllListeners();
    }

    render() {
      return (
        <WrappedComponent {...this.props} maxSetId={this.state.maxSetId} />
      );
    }
  };
}

export default withMaxSet;
