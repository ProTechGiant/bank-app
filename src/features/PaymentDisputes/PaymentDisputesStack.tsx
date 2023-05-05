import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Card } from "../CardActions/types";
import { DisputeSubmittedScreen, PaymentDisputeScreen, TermsAndConditionsModal } from "./screens";
import { CaseType } from "./types";

export type PaymentDisputesStackParams = {
  "PaymentDisputes.PaymentDisputeScreen": {
    cardId: string;
  };
  "PaymentDisputes.TermsAndConditionsModal": undefined;
  "PaymentDisputes.DisputeSubmittedScreen": {
    caseType: CaseType;
    cardType: Card["CardType"];
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
      </Stack.Group>
      <Stack.Screen component={DisputeSubmittedScreen} name="PaymentDisputes.DisputeSubmittedScreen" />
    </Stack.Navigator>
  );
}
