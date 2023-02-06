export default {
  stories: [
    "../src/**/*.stories.@(ts|tsx)"
  ],
  addons: [
    {
      name: '@storybook/addon-react-native-web',
      options: {
        modulesToTranspile: ['react-native-reanimated'],
        babelPlugins: ['react-native-reanimated/plugin', '@babel/plugin-proposal-export-namespace-from'],
      },
    },
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  core: {
    builder: 'webpack5',
  },
  framework: "@storybook/react",
  features: {
    interactionsDebugger: true,
    postcss: false,
  },
}
