/* @flow */

import type { JestMockFn } from 'jest';

function Realm(): {
  [key: string]: JestMockFn,
} {
  return {
    create: jest.fn(),
    delete: jest.fn(),
    objectForPrimaryKey: jest.fn(),
    write: jest.fn(f => f()),
  };
}

export default Realm;
