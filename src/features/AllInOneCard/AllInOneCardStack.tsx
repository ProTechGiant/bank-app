import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { Address } from "@/types/CustomerProfile";

import { AllInOneCardContextProvider } from "./contexts/AllInOneCardContext";
import {
  AddMoneyScreen,
  AddMoneySummaryScreen,
  AllTransactionsScreen,
  CallBackVerificationScreen,
  CardActivatedScreen,
  CardComingSoonScreen,
  CardControlScreen,
  CardPinScreen,
  CardReadyMessageScreen,
  CardReplacementFeesScreen,
  CardReviewScreen,
  CardToWalletScreen,
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
  PermanentCardClosureScreen,
  PINAddressScreen,
  ReplacementCardScreen,
  RequestSuccessfullyScreen,
  RewardsScreen,
  SelectCardScreen,
  SelectPaymentOptionScreen,
  SetAddressScreen,
  SettingsScreen,
  SuccessMoneyAdditionScreen,
  SummaryAddressScreen,
  TermsAndConditionsScreen,
  TransactionDetailsScreen,
  WaitingActivationScreen,
  WaitingAppleActivationScreen,
  WelcomeAddedToAppleWalletScreen,
  WelcomeScreen,
} from "./screens";
import { CurrenciesType, TransactionItem } from "./types";

export type AllInOneCardParams = {
  "AllInOneCard.Dashboard": undefined;
  "AllInOneCard.EntryPoint": undefined;
  "AllInOneCard.ChooseRedemptionMethod": undefined;
  "AllInOneCard.SelectPaymentOption": undefined;
  "AllInOneCard.CardReview": undefined;
  "AllInOneCard.SelectCard": undefined;
  "AllInOneCard.CallBackVerification": undefined;
  "AllInOneCard.WaitingActivationScreen": undefined;
  "AllInOneCard.WaitingAppleActivationScreen": undefined;
  "AllInOneCard.WelcomeScreen": undefined;
  "AllInOneCard.WelcomeAddedToAppleWalletScreen": undefined;
  "AllInOneCard.CardReadyMessage": undefined;
  "AllInOneCard.CreatePINScreen": undefined;
  "AllInOneCard.ActivatedCardScreen": undefined;
  "AllInOneCard.MyCurrenciesScreen": undefined;
  "AllInOneCard.DefineCurrenciesScreen": {
    myCurrencies?: CurrenciesType[];
  };
  "AllInOneCard.PaymentScreen": {
    selectedCurrencies: CurrenciesType[];
    myCurrencies?: CurrenciesType[];
  };
  "AllInOneCard.CardPinScreen": undefined;
  "AllInOneCard.CardControlScreen": {
    pinVerified: boolean;
  };
  "AllInOneCard.ConfirmPINScreen": {
    passCode: string;
  };
  "AllInOneCard.TermsAndConditions": undefined;
  "AllInOneCard.AddToAppleWallet": undefined;
  "AllInOneCard.AllTransactionsScreen": undefined;
  "AllInOneCard.TransactionDetailsScreen": {
    transactionDetails: TransactionItem;
  };
  "AllInOneCard.SettingsScreen": undefined;
  "AllInOneCard.Rewards": { cardType: string };
  "AllInOneCard.SummaryAddressScreen": { address: Address };
  "AllInOneCard.CardComingSoonScreen": undefined;
  "AllInOneCard.transactionDetail": { cardType: string; currency: CurrenciesType };
  "AllInOneCard.DeliveryAddressScreen": undefined;
  "AllInOneCard.PINAddressScreen": undefined;
  "AllInOneCard.SetAddressScreen": { address: Address | undefined };
  "AllInOneCard.changePin": undefined;
  "AllInOneCard.PermanentCardClosureScreen": undefined;
  "AllInOneCard.ReplacementCardScreen": undefined;
  "AllInOneCard.CardReplacementFeesScreen": undefined;
  "AllInOneCard.RequestSuccessfullyScreen": {
    title: string;
    description: string;
    buttonText: string;
    onPress: () => void;
    imageLogo: React.ReactNode;
  };
  "AllInOneCard.confirmChangePin": {
    passCode: string;
  };
  "AllInOneCard.AddMoneyScreen": undefined;
  "AllInOneCard.AddMoneySummaryScreen": { source: string; destination: string; amount: string };
  "AllInOneCard.SuccessMoneyAdditionScreen": undefined;
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
        <Stack.Screen component={WaitingAppleActivationScreen} name="AllInOneCard.WaitingAppleActivationScreen" />
        <Stack.Screen component={WelcomeScreen} name="AllInOneCard.WelcomeScreen" />
        <Stack.Screen component={WelcomeAddedToAppleWalletScreen} name="AllInOneCard.WelcomeAddedToAppleWalletScreen" />
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
        <Stack.Screen component={CardToWalletScreen} name="AllInOneCard.AddToAppleWallet" />
        <Stack.Screen component={SettingsScreen} name="AllInOneCard.SettingsScreen" />
        <Stack.Screen component={CardPinScreen} name="AllInOneCard.CardPinScreen" />
        <Stack.Screen component={SummaryAddressScreen} name="AllInOneCard.SummaryAddressScreen" />
        <Stack.Screen component={CardComingSoonScreen} name="AllInOneCard.CardComingSoonScreen" />
        <Stack.Screen component={CurrencyTransactionDetail} name="AllInOneCard.transactionDetail" />
        <Stack.Screen component={DeliveryAddressScreen} name="AllInOneCard.DeliveryAddressScreen" />
        <Stack.Screen
          component={SetAddressScreen}
          name="AllInOneCard.SetAddressScreen"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen component={ChangePINScreen} name="AllInOneCard.changePin" />
        <Stack.Screen component={ConfirmChangePINScreen} name="AllInOneCard.confirmChangePin" />
        <Stack.Screen component={PermanentCardClosureScreen} name="AllInOneCard.PermanentCardClosureScreen" />
        <Stack.Screen component={RequestSuccessfullyScreen} name="AllInOneCard.RequestSuccessfullyScreen" />
        <Stack.Screen component={ReplacementCardScreen} name="AllInOneCard.ReplacementCardScreen" />
        <Stack.Screen component={CardReplacementFeesScreen} name="AllInOneCard.CardReplacementFeesScreen" />
        <Stack.Screen
          component={PINAddressScreen}
          name="AllInOneCard.PINAddressScreen"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen component={AddMoneyScreen} name="AllInOneCard.AddMoneyScreen" />
        <Stack.Screen
          component={AddMoneySummaryScreen}
          name="AllInOneCard.AddMoneySummaryScreen"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen component={SuccessMoneyAdditionScreen} name="AllInOneCard.SuccessMoneyAdditionScreen" />
      </Stack.Navigator>
    </AllInOneCardContextProvider>
  );
}
