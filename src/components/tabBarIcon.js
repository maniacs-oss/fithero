/* @flow */

import * as React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const tabBarIcon = (name: string) => ({ tintColor }: { tintColor: string }) => (
  <MaterialIcons
    style={{ backgroundColor: 'transparent' }}
    name={name}
    color={tintColor}
    size={24}
  />
);

export default tabBarIcon;
