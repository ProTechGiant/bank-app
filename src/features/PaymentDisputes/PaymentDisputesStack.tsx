import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  CreateDisputeModal,
  PaymentDisputesLandingModal,
  SelectDisputeReasonModal,
  TermsAndConditionsModal,
} from "./screens";
import { CaseType, TransactionType } from "./types";

export type PaymentDisputesStackParams = {
  "PaymentDisputes.PaymentDisputesLandingModal": undefined;
  "PaymentDisputes.DisputeReasonsModal": undefined;
  "PaymentDisputes.CreateDisputeModal": { caseType: CaseType; reasonCode?: string };
  "PaymentDisputes.SelectDisputeReasonModal": {
    transactionType: TransactionType;
  };
  "PaymentDisputes.TermsAndConditionsModal": undefined;
};

export const Stack = createNativeStackNavigator<PaymentDisputesStackParams>();

export default function PaymentDisputesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen component={PaymentDisputesLandingModal} name="PaymentDisputes.PaymentDisputesLandingModal" />
        <Stack.Screen component={CreateDisputeModal} name="PaymentDisputes.CreateDisputeModal" />
        <Stack.Screen component={SelectDisputeReasonModal} name="PaymentDisputes.SelectDisputeReasonModal" />
        <Stack.Screen component={TermsAndConditionsModal} name="PaymentDisputes.TermsAndConditionsModal" />
      </Stack.Group>
    </Stack.Navigator>
  );
}
