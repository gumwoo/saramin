export default {
    testEnvironment: 'node',
    transform: {},
    extensionsToTreatAsEsm: ['.js'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1'
    }
  };