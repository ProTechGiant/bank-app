import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AliasManagementScreen, RegisterEmailScreen } from "./screens";

export const Stack = createNativeStackNavigator();

export type ProxyAliasStackParams = {
  "ProxyAlias.AliasManagementScreen": undefined;
  "ProxyAlias.RegisterEmailScreen": undefined;
};

export default function ProxyAliasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={AliasManagementScreen} name="ProxyAlias.AliasManagementScreen" />
      <Stack.Screen component={RegisterEmailScreen} name="ProxyAlias.RegisterEmailScreen" />
    </Stack.Navigator>
  );
}
