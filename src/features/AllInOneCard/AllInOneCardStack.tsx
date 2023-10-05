import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { DashboardScreen, EntryPointScreen } from "./screens";

export const Stack = createNativeStackNavigator();

export type AllInOneCardParams = {
  "AllInOneCard.Dashboard": undefined;
  "AllInOneCard.EntryPoint": undefined;
};

export default function AllInCardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={DashboardScreen} name="AllInOneCard.Dashboard" />
      <Stack.Screen component={EntryPointScreen} name="AllInOneCard.EntryPoint" />
    </Stack.Navigator>
  );
}
