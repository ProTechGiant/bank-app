/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */
const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  // eslint-disable-next-line prettier/prettier
  const { resolver: { sourceExts, assetExts } } = await getDefaultConfig();

  return {
    transformer: {
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"],
    },
    // see https://github.com/facebook/react-native/issues/36794#issuecomment-1500880284
    server: {
      rewriteRequestUrl: url => {
        if (!url.endsWith(".bundle")) {
          return url;
        }

        // JavaScriptCore strips query strings, so try to re-add them with a best guess.
        return url + "?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true";
      },
    },
  };
})();
