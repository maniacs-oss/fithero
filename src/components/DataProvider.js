/* @flow */

import * as React from 'react';
import type { RealmListener } from '../types';

type Props<T> = {
  dataQuery: () => RealmListener<*>,
  dataParse: (*) => T,
  render: (*) => React.Node,
};

type State<R> = {
  data: ?R,
};

class DataProvider<T> extends React.Component<Props<T>, State<*>> {
  dataListener: RealmListener<*>;

  state = {
    data: null,
  };

  componentDidMount() {
    this.dataListener = this.props.dataQuery();
    this.dataListener.addListener(data => {
      const newData = this.props.dataParse(data);
      if (newData !== this.state.data) {
        this.setState({ data: newData });
      }
    });
  }

  componentWillUnmount() {
    this.dataListener.removeAllListeners();
  }

  render() {
    return this.props.render(this.state.data);
  }
}

export default DataProvider;
