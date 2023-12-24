import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HubScreen } from "./screens";
export type IpsStackParams = {
  "IpsStack.HubScreen": undefined;
};
const Stack = createNativeStackNavigator();
export default function IpsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Ips.HubScreen" component={HubScreen} />
    </Stack.Navigator>
  );
}
