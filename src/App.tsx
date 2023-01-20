import "./i18n";

import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "react-query";

import useI18nDirection from "@/i18n/use-i18n-direction";
import MainStack from "@/navigation/MainStack";

import { GlobalContext } from "./contexts/GlobalContext";
import { homepageOrderData, quickActionOrderData } from "./mocks/quickActionOrderData";

const queryClient = new QueryClient();

export default function App() {
  useI18nDirection();

  const [homeScreenLayout, setHomeScreenLayout] = useState({
    quickActionOrderData,
    homepageOrderData,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContext.Provider value={{ homeScreenLayout, setHomeScreenLayout }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <MainStack />
        </GestureHandlerRootView>
      </GlobalContext.Provider>
    </QueryClientProvider>
  );
}
