import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { AllInOneCardContextProvider } from "./contexts/AllInOneCardContext";
import {
  CallBackVerificationScreen,
  CardReadyMessageScreen,
  CardReviewScreen,
  ChooseRedemptionMethodScreen,
  ConfirmPINScreen,
  CreatePINScreen,
  DashboardScreen,
  EntryPointScreen,
  SelectCardScreen,
  SelectPaymentOptionScreen,
  TermsAndConditionsScreen,
  WaitingActivationScreen,
  WelcomeScreen,
} from "./screens";

export type AllInOneCardParams = {
  "AllInOneCard.Dashboard": undefined;
  "AllInOneCard.EntryPoint": undefined;
  "AllInOneCard.ChooseRedemptionMethod": undefined;
  "AllInOneCard.SelectPaymentOption": undefined;
  "AllInOneCard.CardReview": undefined;
  "AllInOneCard.SelectCard": undefined;
  "AllInOneCard.CallBackVerification": undefined;
  "AllInOneCard.WaitingActivationScreen": undefined;
  "AllInOneCard.WelcomeScreen": undefined;
  "AllInOneCard.CardReadyMessage": undefined;
  "AllInOneCard.CreatePINScreen": undefined;
  "AllInOneCard.ConfirmPINScreen": {
    passCode: string;
  };
  "AllInOneCard.TermsAndConditions": undefined;
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
        <Stack.Screen component={CallBackVerificationScreen} name="AllInOneCard.CallBackVerification" />
        <Stack.Screen component={WaitingActivationScreen} name="AllInOneCard.WaitingActivationScreen" />
        <Stack.Screen component={WelcomeScreen} name="AllInOneCard.WelcomeScreen" />
        <Stack.Screen component={SelectPaymentOptionScreen} name="AllInOneCard.SelectPaymentOption" />
        <Stack.Screen component={CardReviewScreen} name="AllInOneCard.CardReview" />
        <Stack.Screen component={SelectCardScreen} name="AllInOneCard.SelectCard" />
        <Stack.Screen component={CardReadyMessageScreen} name="AllInOneCard.CardReadyMessage" />
        <Stack.Screen component={CreatePINScreen} name="AllInOneCard.CreatePINScreen" />
        <Stack.Screen component={ConfirmPINScreen} name="AllInOneCard.ConfirmPINScreen" />
        <Stack.Screen
          component={TermsAndConditionsScreen}
          name="AllInOneCard.TermsAndConditions"
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </AllInOneCardContextProvider>
  );
}
