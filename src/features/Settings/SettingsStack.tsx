import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AccountSettingsScreen, BiometricSettingScreen, CustomerAccountManagementScreen } from "./screens";

export type SettingsStackParams = {
  "Settings.CustomerAccountManagementScreen": undefined;
  "Settings.AccountSettings": undefined;
  "Settings.BiometricScreen": undefined;
};

export const Stack = createNativeStackNavigator<SettingsStackParams>();

export default function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={CustomerAccountManagementScreen} name="Settings.CustomerAccountManagementScreen" />
      <Stack.Screen component={BiometricSettingScreen} name="Settings.BiometricScreen" />
      <Stack.Screen component={AccountSettingsScreen} name="Settings.AccountSettings" />
    </Stack.Navigator>
  );
}
