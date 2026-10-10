jest.mock('@react-native-async-storage/async-storage', () => {
  const mockMemory = new Map();
  return {
    __esModule: true,
    default: {
      setItem: async (key, value) => {
        mockMemory.set(key, value);
      },
      getItem: async key => (mockMemory.has(key) ? mockMemory.get(key) : null),
      removeItem: async key => {
        mockMemory.delete(key);
      },
      clear: async () => {
        mockMemory.clear();
      },
    },
  };
});

jest.mock('@react-native-community/geolocation', () => ({
  __esModule: true,
  default: {
    setRNConfiguration: jest.fn(),
    requestAuthorization: jest.fn(success => {
      success();
    }),
    getCurrentPosition: jest.fn(success => {
      success({
        coords: {
          latitude: 25.08012,
          longitude: 55.14098,
          altitude: null,
          accuracy: 5,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: 1,
      });
    }),
  },
}));

jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View } = require('react-native');
  return props => React.createElement(View, { testID: 'date-picker', ...props });
});

const { setMockLatency } = require('./src/utils/delay');
setMockLatency(0);

const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    message.includes('not configured to support act')
  ) {
    return;
  }
  originalConsoleError(...args);
};
