import { useState } from "react";

import MainStack from "@/navigation/MainStack";
import { flags } from "@/config/feature-flag";
import { FlagsProvider } from "flagged";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalContext } from "./contexts/GlobalContext";
import { OrderCardContext, orderCardInitValues } from "@/features/ApplyCards/context/OrderCardContext";

import { quickActionOrderData, homepageOrderData } from "./mocks/quickActionOrderData";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function App() {
  const [homeScreenLayout, setHomeScreenLayout] = useState({
    quickActionOrderData,
    homepageOrderData,
  });

  const [orderCardValues, setOrderCardValues] = useState(orderCardInitValues);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContext.Provider value={{ homeScreenLayout, setHomeScreenLayout }}>
        <OrderCardContext.Provider
          value={{
            orderCardValues,
            setOrderCardValues,
          }}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <FlagsProvider features={flags}>
              <MainStack />
            </FlagsProvider>
          </GestureHandlerRootView>
        </OrderCardContext.Provider>
      </GlobalContext.Provider>
    </QueryClientProvider>
  );
}
