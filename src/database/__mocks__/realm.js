/* @flow */

import type { JestMockFn } from 'jest';

function Realm(): {
  [key: string]: JestMockFn,
} {
  return {
    create: jest.fn(),
    delete: jest.fn(),
    objectForPrimaryKey: jest.fn(),
    objects: jest.fn(() => ({
      addListener: jest.fn(),
      removeAllListeners: jest.fn(),
      filtered: jest.fn(() => ({
        sorted: jest.fn(),
      })),
    })),
    write: jest.fn(f => f()),
  };
}

export default Realm;
