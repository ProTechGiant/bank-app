import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { BillDetailsScreen, BillPaymentHomeScreen, EditBillDescriptionScreen } from "./screens";

export type SadadBillPaymentStackParams = {
  "SadadBillPayments.BillPaymentHomeScreen": undefined;
  "SadadBillPayments.BillDetailsScreen": undefined;
  "SadadBillPayments.EditBillDescriptionScreen": undefined;
};

export const Stack = createNativeStackNavigator<SadadBillPaymentStackParams>();

export default function SadadBillPaymentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={BillPaymentHomeScreen} name="SadadBillPayments.BillPaymentHomeScreen" />
      <Stack.Screen
        component={BillDetailsScreen}
        name="SadadBillPayments.BillDetailsScreen"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        component={EditBillDescriptionScreen}
        name="SadadBillPayments.EditBillDescriptionScreen"
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}
