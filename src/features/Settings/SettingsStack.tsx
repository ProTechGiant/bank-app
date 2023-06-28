import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CustomerAccountManagementScreen } from "./screens";

export type SettingsStackParams = {
  "Settings.CustomerAccountManagementScreen": undefined;
};

export const Stack = createNativeStackNavigator<SettingsStackParams>();

export default function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={CustomerAccountManagementScreen} name="Settings.CustomerAccountManagementScreen" />
    </Stack.Navigator>
  );
}
