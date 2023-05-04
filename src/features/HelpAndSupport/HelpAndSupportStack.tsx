import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HubScreen, LiveChatScreen } from "./screens";

export type HelpAndSuportStackParams = {
  "HelpAndSupport.HubScreen": undefined;
  "HelpAndSupport.LiveChatScreen": undefined;
};

export const Stack = createNativeStackNavigator<HelpAndSuportStackParams>();

export default function WhatsNextStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={HubScreen} name="HelpAndSupport.HubScreen" />
      <Stack.Screen component={LiveChatScreen} name="HelpAndSupport.LiveChatScreen" />
    </Stack.Navigator>
  );
}
