import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { FinancialInformationScreen } from "../FinancialInformation/screens";
import LifeStyleScreen from "../LifeStyle/screens/LifeStyleScreen";
import { AccountSettingsScreen, BiometricSettingScreen, CustomerAccountManagementScreen } from "./screens";

export type SettingsStackParams = {
  "Settings.CustomerAccountManagementScreen": undefined;
  "Settings.AccountSettings": undefined;
  "Settings.BiometricScreen": undefined;
  "Settings.LanguageSettingsScreen": undefined;
  "Settings.FinancialInformationScreen": undefined;
  "Settings.LifeStyleScreen": undefined;
};

export const Stack = createNativeStackNavigator<SettingsStackParams>();

export default function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={CustomerAccountManagementScreen} name="Settings.CustomerAccountManagementScreen" />
      <Stack.Screen component={FinancialInformationScreen} name="Settings.FinancialInformationScreen" />
      <Stack.Screen component={LifeStyleScreen} name="Settings.LifeStyleScreen" />
      <Stack.Screen component={BiometricSettingScreen} name="Settings.BiometricScreen" />
      <Stack.Screen component={AccountSettingsScreen} name="Settings.AccountSettings" />
    </Stack.Navigator>
  );
}
