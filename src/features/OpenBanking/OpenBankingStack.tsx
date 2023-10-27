import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { OpenBankingScreen } from "./screens";
import LinkedSuccessfullyScreen from "./screens/LinkedSuccessfullyScreen";
import SessionExpiredScreen from "./screens/SessionExpiredScreen";

export const Stack = createNativeStackNavigator();

export type OpenBankingStackParams = {
  "OpenBanking.OpenBankingScreen": undefined;
  "OpenBanking.LinkedSuccessfullyScreen": undefined;
  "OpenBanking.SessionExpiredScreen": undefined;
};

export default function OpenBankingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={OpenBankingScreen} name="OpenBanking.OpenBankingScreen" />
      <Stack.Screen component={LinkedSuccessfullyScreen} name="OpenBanking.LinkedSuccessfullyScreen" />
      <Stack.Screen component={SessionExpiredScreen} name="OpenBanking.SessionExpiredScreen" />
    </Stack.Navigator>
  );
}
