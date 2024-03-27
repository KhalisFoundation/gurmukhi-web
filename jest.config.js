/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['src', 'node_modules'],
  transformIgnorePatterns: ['node_modules/(?!(firebase/firestore)/)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^firebase/app$': '<rootDir>/__mocks__/firebase/app.ts',
  },
};
