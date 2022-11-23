/* eslint-env node */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "react-native",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.spec.json",
    },
  },
  transform: {
    "^.+\\.jsx$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: ["node_modules/?!(expo-file-system)"],
  moduleNameMapper: {
    "\\.svg": "<rootDir>/__mocks__/svgMock.js",
    "@/(.*)": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/__mocks__/setupTests.js"],
};
