import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Card, CardStatus } from "../CardActions/types";
import { TransactionDetailed } from "../ViewTransactions/types";
import {
  CaseDetailsScreen,
  DisputeSubmittedScreen,
  MyCasesLandingScreen,
  PaymentDisputeScreen,
  TermsAndConditionsModal,
} from "./screens";
import { CaseType } from "./types";

export type PaymentDisputesStackParams = {
  "PaymentDisputes.PaymentDisputeScreen": {
    cardId: string;
    createDisputeUserId: string;
    transactionDetails: TransactionDetailed;
  };
  "PaymentDisputes.TermsAndConditionsModal": undefined;
  "PaymentDisputes.MyCasesLandingScreen": undefined;
  "PaymentDisputes.CaseDetailsScreen": { caseNumber: string; source: string };
  "PaymentDisputes.DisputeSubmittedScreen": {
    caseType: CaseType;
    cardType: Card["CardType"];
    cardStatus: CardStatus;
    caseId: string;
  };
};

export const Stack = createNativeStackNavigator<PaymentDisputesStackParams>();

export default function PaymentDisputesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen component={PaymentDisputeScreen} name="PaymentDisputes.PaymentDisputeScreen" />
        <Stack.Screen component={TermsAndConditionsModal} name="PaymentDisputes.TermsAndConditionsModal" />
        <Stack.Screen component={MyCasesLandingScreen} name="PaymentDisputes.MyCasesLandingScreen" />
        <Stack.Screen component={CaseDetailsScreen} name="PaymentDisputes.CaseDetailsScreen" />
      </Stack.Group>
      <Stack.Screen component={DisputeSubmittedScreen} name="PaymentDisputes.DisputeSubmittedScreen" />
    </Stack.Navigator>
  );
}
