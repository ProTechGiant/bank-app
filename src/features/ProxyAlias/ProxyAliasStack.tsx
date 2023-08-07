import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AliasManagementScreen } from "./screens";

export const Stack = createNativeStackNavigator();

export type ProxyAliasStackParams = {
  "ProxyAlias.AliasManagementScreen": undefined;
};

export default function ProxyAliasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={AliasManagementScreen} name="ProxyAlias.AliasManagementScreen" />
    </Stack.Navigator>
  );
}
