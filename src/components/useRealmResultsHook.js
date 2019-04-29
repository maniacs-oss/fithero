/* @flow */

import { useState, useEffect } from 'react';

type ResultType<T> = {
  data: Array<T>,
  timestamp: number,
};

type ArgsType = Array<*>;

type QueryType<T> = (
  ...args: ArgsType
) => {
  addListener: ((Array<T>) => void) => void,
  removeAllListeners: () => void,
};

export default function useRealmResultsHook<T>(
  query: QueryType<T>,
  args: ArgsType
): ResultType<T> {
  const [data, setData] = useState({
    data: args ? query(...args) : query(),
    timestamp: Date.now(),
  });

  useEffect(
    () => {
      function handleChange(newData: Array<T>) {
        setData({
          data: newData,
          // Realm mutates the array instead of returning a new copy,
          // thus for a FlatList to update, we can use a timestamp as
          // extraData prop
          timestamp: Date.now(),
        });
      }

      const dataQuery = args ? query(...args) : query();
      dataQuery.addListener(handleChange);
      return () => {
        dataQuery.removeAllListeners();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, ...args]
  );

  // $FlowFixMe type Realm results here properly
  return data;
}
