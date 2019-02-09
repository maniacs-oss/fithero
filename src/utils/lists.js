/* @flow */

import sortedIndexBy from 'lodash/sortedIndexBy';

export function insertInSortedList<T>(
  sortedList: Array<T>,
  newElement: T,
  sortFn: T => string
): Array<T> {
  const sortIndex = sortedIndexBy(sortedList, newElement, elem => sortFn(elem));
  return [
    ...sortedList.slice(0, sortIndex),
    newElement,
    ...sortedList.slice(sortIndex),
  ];
}

export function updateInSortedList<T>(
  sortedList: Array<T>,
  updateElement: T,
  compareFn: T => boolean,
  sortFn: T => string
): Array<T> {
  return insertInSortedList(
    sortedList.filter(e => !compareFn(e)),
    updateElement,
    e => sortFn(e)
  );
}
