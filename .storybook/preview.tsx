import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { I18nextProvider } from 'react-i18next';
import type { Preview } from "@storybook/react";

import { initializeI18n } from "../src/i18n";

const i18n = initializeI18n("en");

const preview: Preview = {
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <Story />
        </I18nextProvider>
      </SafeAreaProvider>
    )
  ],
  parameters: {
    options: {
      storySort: {
        method: "alphabetical",
      },
    },
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
};

export default preview;
