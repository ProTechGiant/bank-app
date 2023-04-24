import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  DisputeDetailsModal,
  DisputeReasonsModal,
  PaymentDisputesLandingModal,
  TermsAndConditionsModal,
} from "./screens";

export type PaymentDisputesStackParams = {
  "PaymentDisputes.PaymentDisputesLandingModal": undefined;
  "PaymentDisputes.DisputeReasonsModal": undefined;
  "PaymentDisputes.DisputeDetailsModal": undefined;
  "PaymentDisputes.TermsAndConditionsModal": undefined;
};

export const Stack = createNativeStackNavigator<PaymentDisputesStackParams>();

export default function PaymentDisputesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen component={PaymentDisputesLandingModal} name="PaymentDisputes.PaymentDisputesLandingModal" />
        <Stack.Screen component={DisputeReasonsModal} name="PaymentDisputes.DisputeReasonsModal" />
        <Stack.Screen component={DisputeDetailsModal} name="PaymentDisputes.DisputeDetailsModal" />
        <Stack.Screen component={TermsAndConditionsModal} name="PaymentDisputes.TermsAndConditionsModal" />
      </Stack.Group>
    </Stack.Navigator>
  );
}
