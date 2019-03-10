/* @flow */

import * as React from 'react';
import isEqual from 'lodash/isEqual';

import type { RealmResults } from '../types';

type Props<T, A> = {
  args?: Array<A>,
  query: (...args: Array<A>) => RealmResults<*>,
  parse: (*) => T,
  render: (*) => React.Node,
};

type State<R> = {
  data: ?R,
};

class DataProvider<T, A> extends React.Component<Props<T, A>, State<*>> {
  dataListener: RealmResults<*>;

  constructor(props: Props<T, A>) {
    super(props);
    const { args, query, parse } = props;
    this.dataListener = args ? query(...args) : query();
    this.state = {
      data: parse(this.dataListener),
    };
  }

  componentDidMount() {
    this._startListening(this.props);
  }

  componentWillReceiveProps(nextProps: Props<T, A>) {
    if (!isEqual(this.props.args, nextProps.args)) {
      const { args, query } = nextProps;

      this.dataListener.removeAllListeners();
      this.dataListener = args ? query(...args) : query();
      this._startListening(nextProps);
    }
  }

  componentWillUnmount() {
    this.dataListener.removeAllListeners();
  }

  _startListening(props: Props<T, A>) {
    const { parse } = props;

    this.dataListener.addListener(data => {
      const newData = parse(data);
      if (newData !== this.state.data) {
        this.setState({ data: newData });
      }
    });
  }

  render() {
    try {
      return this.props.render(this.state.data);
    } catch (e) {
      // Deleting Realm objects might cause crashes here
      // Instead of having a lot of isValid() around all the files,
      // this seems to do the trick
      if (e.message.includes('Accessing object of type')) {
        return null;
      }
      // TODO send to bugsnag
      throw e;
    }
  }
}

export default DataProvider;
