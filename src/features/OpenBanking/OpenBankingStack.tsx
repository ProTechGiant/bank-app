import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { OpenBankingScreen } from "./screens";
import LinkedSuccessfullyScreen from "./screens/LinkedSuccessfullyScreen";

export const Stack = createNativeStackNavigator();

export type OpenBankingStackParams = {
  "OpenBanking.OpenBankingScreen": undefined;
  "OpenBanking.LinkedSuccessfullyScreen": undefined;
};

export default function OpenBankingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={OpenBankingScreen} name="OpenBanking.OpenBankingScreen" />
      <Stack.Screen component={LinkedSuccessfullyScreen} name="OpenBanking.LinkedSuccessfullyScreen" />
    </Stack.Navigator>
  );
}
