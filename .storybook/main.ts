import path from "path";

module.exports = {
  "stories": [
    "../src/**/*.stories.@(ts|tsx)"
  ],
  "addons": [
    {
      name: '@storybook/addon-react-native-web',
      options: {
        modulesToTranspile: ['react-native-reanimated'],
        babelPlugins: ['react-native-reanimated/plugin', '@babel/plugin-proposal-export-namespace-from'],
        projectRoot: path.resolve(__dirname, '../../../'),
      },
    },
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  features: {
    interactionsDebugger: true,
    postcss: false,
  },
}
