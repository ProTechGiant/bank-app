import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context"
import i18n from "../src/i18n";
import { I18nextProvider } from 'react-i18next';

export const parameters = {
  options: {
    storySort: {
      method: "alphabetical",
    },
  },
  viewport: {
    defaultViewport: 'mobile2',
  },
};

export const decorators = [
  (Story) => (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    </SafeAreaProvider>
  )
];
