import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { OrderCardContextProvider } from "./context/OrderCardContext";
import AddToAppleWalletScreen from "./screens/AddToAppleWalletScreen";
import ApplyForLuxCardScreen from "./screens/ApplyForLuxCardScreen";
import CardOrderedScreen from "./screens/CardOrderedScreen";
import PickCardTypeScreen from "./screens/PickCardTypeScreen";
import SetPinAndAddressScreen from "./screens/SetPinAndAddressScreen";
import SetTemporaryAddressScreen from "./screens/SetTemporaryAddressScreen";

export type ApplyCardModalStackParams = {
  "ApplyCards.PickCardType": undefined;
  "ApplyCards.ApplyForLuxCard": undefined;
  "ApplyCards.SetPinAndAddress": undefined;
  "ApplyCards.SetTemporaryAddress": undefined;
  "ApplyCards.CardOrdered": undefined;
  "ApplyCards.AddToAppleWallet": undefined;
};

export const Stack = createNativeStackNavigator<ApplyCardModalStackParams>();

export default function ApplyCardsStack() {
  return (
    <OrderCardContextProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={PickCardTypeScreen} name="ApplyCards.PickCardType" />
        <Stack.Screen component={ApplyForLuxCardScreen} name="ApplyCards.ApplyForLuxCard" />
        <Stack.Screen component={SetPinAndAddressScreen} name="ApplyCards.SetPinAndAddress" />
        <Stack.Screen
          component={SetTemporaryAddressScreen}
          name="ApplyCards.SetTemporaryAddress"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen component={CardOrderedScreen} name="ApplyCards.CardOrdered" />
        <Stack.Screen component={AddToAppleWalletScreen} name="ApplyCards.AddToAppleWallet" />
      </Stack.Navigator>
    </OrderCardContextProvider>
  );
}
