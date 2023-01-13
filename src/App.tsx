import "./i18n";

import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "react-query";

import { OrderCardContext, orderCardInitValues } from "@/features/ApplyCards/context/OrderCardContext";
import MainStack from "@/navigation/MainStack";

import { GlobalContext } from "./contexts/GlobalContext";
import { homepageOrderData, quickActionOrderData } from "./mocks/quickActionOrderData";

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
            <MainStack />
          </GestureHandlerRootView>
        </OrderCardContext.Provider>
      </GlobalContext.Provider>
    </QueryClientProvider>
  );
}
