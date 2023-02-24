import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LoadingSingleCardScreen from "./screens/LoadingSingleCardScreen";
import SingleUseCardInfo from "./screens/SingleUseCardsInfo";
import SingleUseCardsScreen from "./screens/SingleUseCardsScreen";

export type SingleUseCardsStackParams = {
  "SingleUseCards.SingleUseCardsScreen": undefined;
  "SingleUseCards.SingleUseCardInfo": undefined;
  "SingleUseCards.LoadingSingleCardScreen": undefined;
};

export const Stack = createNativeStackNavigator<SingleUseCardsStackParams>();

export default function SingleUseCardsStack() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={SingleUseCardsScreen} name="SingleUseCards.SingleUseCardsScreen" />
        <Stack.Screen component={SingleUseCardInfo} name="SingleUseCards.SingleUseCardInfo" />
        <Stack.Screen component={LoadingSingleCardScreen} name="SingleUseCards.LoadingSingleCardScreen" />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
