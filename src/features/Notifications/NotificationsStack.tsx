import { createNativeStackNavigator } from "@react-navigation/native-stack";

import NotificationsHubScreen from "./screens/NotificationsHubScreen";

export type NotificationsStackParams = {
  "Notifications.HubScreen": undefined;
};

export const Stack = createNativeStackNavigator<NotificationsStackParams>();

export default function NotificationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={NotificationsHubScreen} name="Notifications.HubScreen" />
    </Stack.Navigator>
  );
}
