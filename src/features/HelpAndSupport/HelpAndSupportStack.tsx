import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HubScreen } from "./screens";

export type HelpAndSuportStackParams = {
  "HelpAndSupport.HubScreen": undefined;
};

export const Stack = createNativeStackNavigator<HelpAndSuportStackParams>();

export default function WhatsNextStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={HubScreen} name="HelpAndSupport.HubScreen" />
    </Stack.Navigator>
  );
}
