module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFilesAfterEnv: ['./test/config.ts'],
    moduleNameMapper:{
      '^@utils': '<rootDir>/src/utils',
      '^@domains/(.*)': '<rootDir>/src/domains/$1'
    }
  }