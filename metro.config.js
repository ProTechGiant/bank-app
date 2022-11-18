/* eslint-env node */
module.exports = {
  resolver: ["sbmodern"],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  watchFolders: ["./.ondevice"],
};
