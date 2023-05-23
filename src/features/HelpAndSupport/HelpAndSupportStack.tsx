import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HubScreen, LiveChatScreen } from "./screens";

export type HelpAndSupportStackParams = {
  "HelpAndSupport.HubScreen": undefined;
  "HelpAndSupport.LiveChatScreen": undefined;
};

export const Stack = createNativeStackNavigator<HelpAndSupportStackParams>();

export default function HelpAndSupportStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={HubScreen} name="HelpAndSupport.HubScreen" />
      <Stack.Screen component={LiveChatScreen} name="HelpAndSupport.LiveChatScreen" />
    </Stack.Navigator>
  );
}
