import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CardDeliveryDetailsScreen from "./screens/CardDeliveryDetailsScreen";
import CardOrderedScreen from "./screens/CardOrderedScreen";
import CreateCardPinScreen from "./screens/CreateCardPinScreen";

export type ApplyCardModalStackParams = {
  "ApplyCards.CreateCardPin": undefined;
  "ApplyCards.CardDeliveryDetails": undefined;
  "ApplyCards.CardOrdered": undefined;
};

export const ModalStack = createNativeStackNavigator<ApplyCardModalStackParams>();

export const ApplyCardsStack = () => (
  <ModalStack.Navigator
    screenOptions={{
      headerShown: true,
    }}>
    <ModalStack.Screen
      options={{ animation: "default", headerShown: false }}
      component={CreateCardPinScreen}
      name="ApplyCards.CreateCardPin"
    />
    <ModalStack.Screen
      options={{ animation: "default", headerShown: false }}
      component={CardDeliveryDetailsScreen}
      name="ApplyCards.CardDeliveryDetails"
    />
    <ModalStack.Screen
      options={{ animation: "default", headerShown: false }}
      component={CardOrderedScreen}
      name="ApplyCards.CardOrdered"
    />
  </ModalStack.Navigator>
);

export default ApplyCardsStack;
