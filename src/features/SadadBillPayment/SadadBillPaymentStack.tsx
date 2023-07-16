import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { BillPaymentHomeScreen } from "./screens";

export type SadadBillPaymentStackParams = {
  "SadadBillPayments.BillPaymentHomeScreen": undefined;
};

export const Stack = createNativeStackNavigator<SadadBillPaymentStackParams>();

export default function SadadBillPaymentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={BillPaymentHomeScreen} name="SadadBillPayments.BillPaymentHomeScreen" />
    </Stack.Navigator>
  );
}
