import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CategoryScreen, HubScreen } from "./screens";

export type NotificationManagementStackParams = {
  "NotificationManagement.HubScreen": undefined;
  "NotificationManagement.CategoryScreen": { categoryId: string; title: string };
};

const Stack = createNativeStackNavigator<NotificationManagementStackParams>();

export default function NotificationManagementStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={HubScreen} name="NotificationManagement.HubScreen" />
      <Stack.Screen component={CategoryScreen} name="NotificationManagement.CategoryScreen" />
    </Stack.Navigator>
  );
}
