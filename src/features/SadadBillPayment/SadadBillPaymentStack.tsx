import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  BillDescriptionScreen,
  BillDetailsScreen,
  BillPaymentHomeScreen,
  BillSavedSuccessScreen,
  EditBillDescriptionModalScreen,
  EditBillDescriptionScreen,
  EnterAccountNoScreen,
  EnterBillDescriptionScreen,
  SelectBillerCategoryScreen,
  SelectBillerScreen,
} from "./screens";

export type SadadBillPaymentStackParams = {
  "SadadBillPayments.BillPaymentHomeScreen": undefined;
  "SadadBillPayments.BillDetailsScreen": undefined;
  "SadadBillPayments.SelectBillerCategoryScreen": undefined;
  "SadadBillPayments.EditBillDescriptionScreen": undefined;
  "SadadBillPayments.SelectBillerScreen": { category: string };
  "SadadBillPayments.EnterAccountNoScreen": {
    category: string;
    biller: string;
  };
  "SadadBillPayments.EnterBillDescScreen": {
    category: string;
    biller: string;
    AccountNumber: string;
  };
  "SadadBillPayments.BillDescriptionScreen": {
    category: string;
    biller: string;
    AccountNumber: string;
    BillDescription: string;
  };
  "SadadBillPayments.BillSavedSuccessScreen": undefined;
  "SadadBillPayments.EditBillDescModal": undefined;
  "SadadBillPayments.EditBillDescriptionModalScreen": {
    BillDescription: string;
    updateBillDescription: (value: string) => void;
  };
};

export const Stack = createNativeStackNavigator<SadadBillPaymentStackParams>();

export default function SadadBillPaymentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={BillPaymentHomeScreen} name="SadadBillPayments.BillPaymentHomeScreen" />
      <Stack.Screen component={SelectBillerCategoryScreen} name="SadadBillPayments.SelectBillerCategoryScreen" />
      <Stack.Screen
        component={SelectBillerScreen}
        name="SadadBillPayments.SelectBillerScreen"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        component={BillDetailsScreen}
        name="SadadBillPayments.BillDetailsScreen"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen component={EnterAccountNoScreen} name="SadadBillPayments.EnterAccountNoScreen" />
      <Stack.Screen component={EnterBillDescriptionScreen} name="SadadBillPayments.EnterBillDescScreen" />
      <Stack.Screen component={BillDescriptionScreen} name="SadadBillPayments.BillDescriptionScreen" />
      <Stack.Screen component={BillSavedSuccessScreen} name="SadadBillPayments.BillSavedSuccessScreen" />
      <Stack.Screen
        component={EditBillDescriptionScreen}
        name="SadadBillPayments.EditBillDescriptionScreen"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        component={EditBillDescriptionModalScreen}
        name="SadadBillPayments.EditBillDescriptionModalScreen"
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}
