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
  };
})();
