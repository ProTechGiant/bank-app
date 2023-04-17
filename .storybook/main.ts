const path = require("path");
import { path as appRootPath } from "app-root-path";

export default {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    {
      name: "@storybook/addon-react-native-web",
      options: {
        modulesToTranspile: ["react-native-reanimated"],
        babelPlugins: ["react-native-reanimated/plugin", "@babel/plugin-proposal-export-namespace-from"],
      },
    },
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  core: {
    builder: "webpack5",
  },
  webpackFinal: async (config: any) => {
    config.resolve.alias["react-native-linear-gradient"] = path.resolve(
      appRootPath,
      "__mocks__/react-native-linear-gradient.tsx"
    );

    return config;
  },
  framework: "@storybook/react",
  features: {
    interactionsDebugger: true,
    postcss: false,
  },
};
