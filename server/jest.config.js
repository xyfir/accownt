module.exports = {
  setupFilesAfterEnv: ['<rootDir>/lib/tests/setup.ts'],
  testEnvironment: 'node',
  modulePaths: ['<rootDir>'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
