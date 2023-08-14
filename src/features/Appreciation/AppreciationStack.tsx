import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AppreciationHubScreen } from "./screens";

export type AppreciationStackParams = {
  "Appreciation.HubScreen": undefined;
};

export const Stack = createNativeStackNavigator<AppreciationStackParams>();

export default function AppreciationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={AppreciationHubScreen} name="Appreciation.HubScreen" />
    </Stack.Navigator>
  );
}
