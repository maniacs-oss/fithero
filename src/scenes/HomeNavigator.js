/* @flow */

import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';

import HomeScreen from './HomeScreen';

type State = {
  index: number,
  routes: Array<{
    key: string,
    title: string,
    icon: string,
  }>,
};

export default class HomeNavigator extends React.Component<{}, State> {
  state = {
    index: 0,
    routes: [
      { key: 'home', title: 'Home', icon: 'home' },
      // { key: 'calendar', title: 'Calendar', icon: 'date-range' },
      // { key: 'progress', title: 'Progress', icon: 'show-chart' },
      // { key: 'profile', title: 'Profile', icon: 'person' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    // calendar: Calendar,
    // progress: Progress,
    // profile: Profile,
  });

  render() {
    return (
      /* $FlowFixMe theme overriding error */
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
        shifting={false}
        barStyle={{ backgroundColor: '#212121' }}
        theme={{ colors: { primary: '#FFFFFF' } }}
      />
    );
  }
}
