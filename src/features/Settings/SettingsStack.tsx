import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { FinancialInformationScreen } from "../FinancialInformation/screens";
import LifeStyleScreen from "../LifeStyle/screens/LifeStyleScreen";
import { ConnectedServicesStatus } from "./constants";
import {
  AccountSettingsScreen,
  BiometricSettingScreen,
  ConnectedServicesScreen,
  ConsentDetailedScreen,
  CustomerAccountManagementScreen,
  DeviceManagementScreen,
  TemporarySubscriptionManagementScreen,
} from "./screens";
import TodosScreen from "./screens/TodosScreen";

export type SettingsStackParams = {
  "Settings.CustomerAccountManagementScreen": undefined;
  "Settings.AccountSettings": undefined;
  "Settings.BiometricScreen": undefined;
  "Settings.LanguageSettingsScreen": undefined;
  "Settings.FinancialInformationScreen": undefined;
  "Settings.TodosScreen": undefined;
  "Settings.LifeStyleScreen": undefined;
  // TODO: TemporarySubscriptionManagementScreen will be removed from this Stack when implemented by Smart Choices Domain team
  "Settings.TemporarySubscriptionManagementScreen": undefined;
  "Settings.ConnectedServicesScreen": undefined;
  "Settings.DeviceManagementScreen": undefined;
  "Settings.ConsentDetailedScreen": {
    consentId?: string;
    consentStatus: ConnectedServicesStatus;
  };
};

export const Stack = createNativeStackNavigator<SettingsStackParams>();

export default function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={CustomerAccountManagementScreen} name="Settings.CustomerAccountManagementScreen" />
      <Stack.Screen component={FinancialInformationScreen} name="Settings.FinancialInformationScreen" />
      <Stack.Screen component={TodosScreen} name="Settings.TodosScreen" />
      <Stack.Screen component={LifeStyleScreen} name="Settings.LifeStyleScreen" />
      <Stack.Screen component={BiometricSettingScreen} name="Settings.BiometricScreen" />
      <Stack.Screen component={AccountSettingsScreen} name="Settings.AccountSettings" />
      <Stack.Screen component={DeviceManagementScreen} name="Settings.DeviceManagementScreen" />
      <Stack.Screen component={ConnectedServicesScreen} name="Settings.ConnectedServicesScreen" />
      {/* TODO: TemporarySubscriptionManagementScreen will be removed from this Stack when implemented by Smart Choices domain team */}
      <Stack.Screen
        component={TemporarySubscriptionManagementScreen}
        name="Settings.TemporarySubscriptionManagementScreen"
      />
      <Stack.Screen component={ConsentDetailedScreen} name="Settings.ConsentDetailedScreen" />
    </Stack.Navigator>
  );
}
