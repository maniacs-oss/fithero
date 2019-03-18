/* @flow */

import { insertInSortedList, updateInSortedList } from '../lists';

const list = [
  {
    id: 1,
    name: 'A',
  },
  {
    id: 2,
    name: 'B',
  },
  {
    id: 3,
    name: 'C',
  },
  {
    id: 4,
    name: 'D',
  },
  {
    id: 5,
    name: 'E',
  },
];

describe('insertInSortedList', () => {
  it('adds an element to a sorted list returning a new list', () => {
    const newElement = { id: 6, name: 'A1' };
    const newList = insertInSortedList(
      list,
      { id: 6, name: 'A1' },
      e => e.name
    );
    expect(newList).toHaveLength(list.length + 1);
    expect(newList[1]).toEqual(newElement);
  });
});

describe('updateInSortedList', () => {
  it('updates an element and we need to re-sort', () => {
    const updateElement = { id: 5, name: 'B1' };
    const newList = updateInSortedList(
      list,
      updateElement,
      e => e.id === updateElement.id,
      e => e.name
    );

    expect(newList).toHaveLength(list.length);
    expect(newList[2]).toEqual(updateElement);
    expect(newList[newList.length - 1]).toEqual(list[newList.length - 2]);
  });
});
