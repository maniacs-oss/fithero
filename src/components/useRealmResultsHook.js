/* @flow */

import { useState, useEffect } from 'react';

type ResultType<T> = {
  data: Array<T>,
  timestamp: number,
};

type QueryType<T> = () => {
  addListener: ((Array<T>) => void) => void,
  removeAllListeners: () => void,
};

export default function useRealmResultsHook<T>(
  query: QueryType<T>
): ResultType<T> {
  const [data, setData] = useState({
    data: query(),
    timestamp: Date.now(),
  });

  useEffect(() => {
    function handleChange(newData: Array<T>) {
      setData({
        data: newData,
        // Realm mutates the array instead of returning a new copy,
        // thus for a FlatList to update, we can use a timestamp as
        // extraData prop
        timestamp: Date.now(),
      });
    }

    const dataQuery = query();
    dataQuery.addListener(handleChange);
    return () => {
      dataQuery.removeAllListeners();
    };
  }, [query]);

  // $FlowFixMe type Realm results here properly
  return data;
}
