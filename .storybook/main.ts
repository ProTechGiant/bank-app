import type { Configuration } from "webpack";

export default {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-controls",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-react-native-web",
      options: {
        modulesToTranspile: ["react-native-reanimated", "victory-native", "@kichiyaki/react-native-barcode-generator"],
        babelPlugins: ["react-native-reanimated/plugin"]
      }
    }
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  docs: {
    autodoc: "tag",
    autodocs: true
  },
  features: {
    interactionsDebugger: true,
    postcss: false
  },
  webpackFinal: (config: Configuration) => {
    if (config.resolve === undefined) {
      config.resolve = {};
    }

    config.resolve.extensions = [
      ...config.resolve.extensions ?? [],
      '.android.js',
      '.ios.js',
    ];

    return config;
  },
};
