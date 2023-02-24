/* eslint-disable prettier/prettier */
/* eslint-env node */
module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    ["module:react-native-dotenv", {
      allowUndefined: false,
    }],
    ["module-resolver", {
        root: ["./src"],
        extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
        alias: {
          "@": "./src/",
        },
      },
    ],
    ["react-native-reanimated/plugin"], // Must be last in the plugins list.
  ],
};
