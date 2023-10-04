import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { DashboardScreen } from "./screens";

export const Stack = createNativeStackNavigator();

export type AllInOneCardParams = {
  "AllInOneCard.Dashboard": undefined;
};

export default function AllInCardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={DashboardScreen} name="AllInOneCard.Dashboard" />
    </Stack.Navigator>
  );
}
