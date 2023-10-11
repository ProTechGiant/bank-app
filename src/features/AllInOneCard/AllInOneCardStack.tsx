import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { AllInOneCardContextProvider } from "./contexts/AllInOneCardContext";
import { ChooseRedemptionMethodScreen, DashboardScreen, EntryPointScreen, SelectPaymentOptionScreen } from "./screens";

export type AllInOneCardParams = {
  "AllInOneCard.Dashboard": undefined;
  "AllInOneCard.EntryPoint": undefined;
  "AllInOneCard.ChooseRedemptionMethod": undefined;
  "AllInOneCard.SelectPaymentOption": undefined;
};
const Stack = createNativeStackNavigator<AllInOneCardParams>();

export default function AllInCardStack() {
  return (
    <AllInOneCardContextProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen component={EntryPointScreen} name="AllInOneCard.EntryPoint" />
        <Stack.Screen component={DashboardScreen} name="AllInOneCard.Dashboard" />
        <Stack.Screen component={ChooseRedemptionMethodScreen} name="AllInOneCard.ChooseRedemptionMethod" />
        <Stack.Screen component={SelectPaymentOptionScreen} name="AllInOneCard.SelectPaymentOption" />
      </Stack.Navigator>
    </AllInOneCardContextProvider>
  );
}
