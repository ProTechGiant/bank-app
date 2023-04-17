import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { WhatsNextHubScreen } from "./screens";

export type WhatsNextStackParams = {
  "WhatsNext.HubScreen": undefined;
};

export const Stack = createNativeStackNavigator<WhatsNextStackParams>();

export default function WhatsNextStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={WhatsNextHubScreen} name="WhatsNext.HubScreen" />
    </Stack.Navigator>
  );
}
