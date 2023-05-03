import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  DisputeDetailsModal,
  PaymentDisputesLandingModal,
  SelectDisputeReasonModal,
  TermsAndConditionsModal,
} from "./screens";
import { TransactionType } from "./types";

export type PaymentDisputesStackParams = {
  "PaymentDisputes.PaymentDisputesLandingModal": undefined;
  "PaymentDisputes.SelectDisputeReasonModal": {
    transactionType: TransactionType;
  };
  "PaymentDisputes.DisputeDetailsModal": { disputeReasonsCode: string };
  "PaymentDisputes.TermsAndConditionsModal": undefined;
};

export const Stack = createNativeStackNavigator<PaymentDisputesStackParams>();

export default function PaymentDisputesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen component={PaymentDisputesLandingModal} name="PaymentDisputes.PaymentDisputesLandingModal" />
        <Stack.Screen component={SelectDisputeReasonModal} name="PaymentDisputes.SelectDisputeReasonModal" />
        <Stack.Screen component={DisputeDetailsModal} name="PaymentDisputes.DisputeDetailsModal" />
        <Stack.Screen component={TermsAndConditionsModal} name="PaymentDisputes.TermsAndConditionsModal" />
      </Stack.Group>
    </Stack.Navigator>
  );
}
