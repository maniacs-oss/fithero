/* @flow */

function Realm(): {
  // eslint-disable-next-line flowtype/no-weak-types
  [key: string]: Function,
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
