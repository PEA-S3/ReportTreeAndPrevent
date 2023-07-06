// module.exports = {
//     // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
//     // testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
//     preset: 'ts-jest',
//     testEnvironment: 'node',
//     transformIgnorePatterns: ['^.+\\.js$'],
//   };

const nextJest = require('next/jest')
const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
};
module.exports = createJestConfig(customJestConfig);