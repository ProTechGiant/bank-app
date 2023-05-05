import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PaymentDisputeScreen, TermsAndConditionsModal } from "./screens";

export type PaymentDisputesStackParams = {
  "PaymentDisputes.PaymentDisputeScreen": {
    cardId: string;
  };
  "PaymentDisputes.TermsAndConditionsModal": undefined;
};

export const Stack = createNativeStackNavigator<PaymentDisputesStackParams>();

export default function PaymentDisputesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen component={PaymentDisputeScreen} name="PaymentDisputes.PaymentDisputeScreen" />
        <Stack.Screen component={TermsAndConditionsModal} name="PaymentDisputes.TermsAndConditionsModal" />
      </Stack.Group>
    </Stack.Navigator>
  );
}
