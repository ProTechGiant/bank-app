import MainStack from "@/navigation/MainStack";
import { flags } from "@/config/feature-flag";
import { FlagsProvider } from "flagged";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalContext } from "./contexts/GlobalContext";
import { useState } from "react";
import { quickActionOrderData, homepageOrderData } from "./mocks/quickActionOrderData";

export default function App() {
  const [homeScreenLayout, setHomeScreenLayout] = useState({
    quickActionOrderData,
    homepageOrderData,
  });
  return (
    <GlobalContext.Provider value={{ homeScreenLayout, setHomeScreenLayout }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <FlagsProvider features={flags}>
          <MainStack />
        </FlagsProvider>
      </GestureHandlerRootView>
    </GlobalContext.Provider>
  );
}
