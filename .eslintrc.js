/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:storybook/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  // eslint-disable-next-line prettier/prettier
  plugins: [
    "eslint-comments",
    "react-native",
    "@react-native-community",
    "simple-import-sort",
    "@typescript-eslint"
  ],
  root: true,
  rules: {
    "arrow-parens": ["error", "as-needed"],
    "array-bracket-spacing": 0,
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/ban-ts-comment": 1,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/member-ordering": 0,
    "sort-imports": 0,
    "sort-keys": 0,
    "no-extra-boolean-cast": 1,
    "no-console": 1,
    "no-unused-vars": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "react/jsx-curly-brace-presence": [
      "error",
      {
        props: "never",
        children: "never",
      },
    ],
    "react/jsx-no-bind": 0,
    "react/jsx-boolean-value": 0,
    "react/react-in-jsx-scope": 0,
    "react/self-closing-comp": [
      "error",
      {
        component: true,
      },
    ],
    "react-native/no-unused-styles": 2,
    "react-native/split-platform-components": 2,
    "react-native/no-color-literals": 2,
    "react-native/no-raw-text": 2,
    "react-native/sort-styles": [
      "error",
      "asc",
      {
        ignoreClassNames: false,
        ignoreStyleProperties: false,
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
