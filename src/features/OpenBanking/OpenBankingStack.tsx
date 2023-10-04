import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { OpenBankingScreen } from "./screens";

export const Stack = createNativeStackNavigator();

export type OpenBankingStackParams = {
  "OpenBanking.OpenBankingScreen": undefined;
};

export default function OpenBankingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={OpenBankingScreen} name="OpenBanking.OpenBankingScreen" />
    </Stack.Navigator>
  );
}
