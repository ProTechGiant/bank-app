import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  CompleteTransactionScreen,
  GoldWalletInfoModal,
  HubScreen,
  OnboardingScreen,
  TermsAndConditionsModal,
  TradeGoldScreen,
  TransactionsDetailsModal,
  TransactionsScreen,
} from "./screens";
import { MarketStatusEnum, TransactionType, TransactionTypeEnum } from "./types";

export type GoldWalletStackParams = {
  "GoldWalletStack.TermsAndConditions": undefined;
  "GoldWallet.HubScreen": undefined;
  "GoldWallet.OnboardingScreen": undefined;
  "GoldWallet.TransactionsScreen": { walletId: string };
  "GoldWallet.TransactionsDetailsModal": { transaction: TransactionType };
  "GoldWallet.GoldWalletInfoModal": { accountNumber: string; walletNumber: string };
  "GoldWallet.TradeGoldScreen": {
    walletId: string;
    totalBalance: number;
    marketPrice: number;
    tradeType: TransactionTypeEnum;
    marketStatus: MarketStatusEnum;
    walletWeight: number;
  };
  "GoldWallet.CompleteTransactionScreen": { transactionType: TransactionTypeEnum; walletId: string };
};

export const Stack = createNativeStackNavigator<GoldWalletStackParams>();

export default function GoldWalletStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={HubScreen} name="GoldWallet.HubScreen" />
      <Stack.Screen component={TermsAndConditionsModal} name="GoldWalletStack.TermsAndConditions" />
      <Stack.Screen component={OnboardingScreen} name="GoldWallet.OnboardingScreen" />
      <Stack.Screen component={TransactionsScreen} name="GoldWallet.TransactionsScreen" />
      <Stack.Screen component={CompleteTransactionScreen} name="GoldWallet.CompleteTransactionScreen" />
      <Stack.Screen
        component={TransactionsDetailsModal}
        name="GoldWallet.TransactionsDetailsModal"
        options={{ presentation: "transparentModal" }}
      />
      <Stack.Screen
        component={GoldWalletInfoModal}
        name="GoldWallet.GoldWalletInfoModal"
        options={{ presentation: "transparentModal" }}
      />
      <Stack.Screen component={TradeGoldScreen} name="GoldWallet.TradeGoldScreen" />
    </Stack.Navigator>
  );
}
