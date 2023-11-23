import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { AllInOneCardContextProvider } from "./contexts/AllInOneCardContext";
import {
  AllTransactionsScreen,
  CallBackVerificationScreen,
  CardActivatedScreen,
  CardControlScreen,
  CardPinScreen,
  CardReadyMessageScreen,
  CardReviewScreen,
  ChangePINScreen,
  ChooseRedemptionMethodScreen,
  ConfirmChangePINScreen,
  ConfirmPINScreen,
  CreatePINScreen,
  CurrencyTransactionDetail,
  DashboardScreen,
  DefineCurrenciesScreen,
  DeliveryAddressScreen,
  EntryPointScreen,
  MyCurrenciesScreen,
  PaymentScreen,
  RewardsScreen,
  SelectCardScreen,
  SelectPaymentOptionScreen,
  SetAddressScreen,
  SettingsScreen,
  TermsAndConditionsScreen,
  TransactionDetailsScreen,
  WaitingActivationScreen,
  WelcomeScreen,
} from "./screens";
import { Address, CurrenciesType, TransactionItem } from "./types";

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
  "AllInOneCard.ActivatedCardScreen": undefined;
  "AllInOneCard.MyCurrenciesScreen": undefined;
  "AllInOneCard.DefineCurrenciesScreen": undefined;
  "AllInOneCard.PaymentScreen": {
    selectedCurrencies: CurrenciesType[];
  };
  "AllInOneCard.CardPinScreen": undefined;
  "AllInOneCard.CardControlScreen": {
    pinVerified: boolean;
  };
  "AllInOneCard.ConfirmPINScreen": {
    passCode: string;
  };
  "AllInOneCard.TermsAndConditions": undefined;
  "AllInOneCard.AllTransactionsScreen": undefined;
  "AllInOneCard.TransactionDetailsScreen": {
    transactionDetails: TransactionItem;
  };
  "AllInOneCard.SettingsScreen": undefined;
  "AllInOneCard.Rewards": { cardType: string };
  "AllInOneCard.transactionDetail": { cardType: string; currency: CurrenciesType };
  "AllInOneCard.DeliveryAddressScreen": undefined;
  "AllInOneCard.SetAddressScreen": { address: Address };
  "AllInOneCard.changePin": undefined;
  "AllInOneCard.confirmChangePin": {
    passCode: string;
  };
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
        <Stack.Screen component={CardActivatedScreen} name="AllInOneCard.ActivatedCardScreen" />
        <Stack.Screen component={AllTransactionsScreen} name="AllInOneCard.AllTransactionsScreen" />
        <Stack.Screen component={TransactionDetailsScreen} name="AllInOneCard.TransactionDetailsScreen" />
        <Stack.Screen component={MyCurrenciesScreen} name="AllInOneCard.MyCurrenciesScreen" />
        <Stack.Screen component={DefineCurrenciesScreen} name="AllInOneCard.DefineCurrenciesScreen" />
        <Stack.Screen component={PaymentScreen} name="AllInOneCard.PaymentScreen" />
        <Stack.Screen component={CardControlScreen} name="AllInOneCard.CardControlScreen" />
        <Stack.Screen component={RewardsScreen} name="AllInOneCard.Rewards" />
        <Stack.Screen
          component={TermsAndConditionsScreen}
          name="AllInOneCard.TermsAndConditions"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen component={SettingsScreen} name="AllInOneCard.SettingsScreen" />
        <Stack.Screen component={CardPinScreen} name="AllInOneCard.CardPinScreen" />
        <Stack.Screen component={CurrencyTransactionDetail} name="AllInOneCard.transactionDetail" />
        <Stack.Screen component={DeliveryAddressScreen} name="AllInOneCard.DeliveryAddressScreen" />
        <Stack.Screen
          component={SetAddressScreen}
          name="AllInOneCard.SetAddressScreen"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen component={ChangePINScreen} name="AllInOneCard.changePin" />
        <Stack.Screen component={ConfirmChangePINScreen} name="AllInOneCard.confirmChangePin" />
      </Stack.Navigator>
    </AllInOneCardContextProvider>
  );
}
