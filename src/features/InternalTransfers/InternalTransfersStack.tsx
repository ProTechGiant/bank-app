import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  AddNoteScreen,
  BeneficiaryDeclarationScreen,
  ConfirmationScreen,
  ConfirmNewBeneficiaryScreen,
  EnterBeneficiaryDetailsScreen,
  InternalTransferScreen,
  PaymentsHubScreen,
  ReviewTransferScreen,
  SendToBeneficiaryScreen,
} from "./screens";
import { AddNoteParams } from "./types";

export type InternalTransfersStackParams = {
  "InternalTransfers.SendToBeneficiaryScreen": undefined;
  "InternalTransfers.EnterBeneficiaryDetailsScreen": undefined;
  "InternalTransfers.PaymentsHubScreen": undefined;
  "InternalTransfers.ConfirmNewBeneficiaryScreen": undefined;
  "InternalTransfers.InternalTransferScreen": undefined;
  "InternalTransfers.ReviewTransferScreen": undefined;
  "InternalTransfers.AddNoteScreen": AddNoteParams;
  "InternalTransfers.BeneficiaryDeclarationScreen": undefined;
  "InternalTransfers.ConfirmationScreen": undefined;
};

export const Stack = createNativeStackNavigator<InternalTransfersStackParams>();

export default function InternalTransfersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={PaymentsHubScreen} name="InternalTransfers.PaymentsHubScreen" />
      <Stack.Screen component={InternalTransferScreen} name="InternalTransfers.InternalTransferScreen" />
      <Stack.Screen component={SendToBeneficiaryScreen} name="InternalTransfers.SendToBeneficiaryScreen" />
      <Stack.Screen component={ReviewTransferScreen} name="InternalTransfers.ReviewTransferScreen" />
      <Stack.Screen component={AddNoteScreen} name="InternalTransfers.AddNoteScreen" />
      <Stack.Screen component={EnterBeneficiaryDetailsScreen} name="InternalTransfers.EnterBeneficiaryDetailsScreen" />
      <Stack.Screen component={ConfirmNewBeneficiaryScreen} name="InternalTransfers.ConfirmNewBeneficiaryScreen" />
      <Stack.Screen
        component={BeneficiaryDeclarationScreen}
        name="InternalTransfers.BeneficiaryDeclarationScreen"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen component={ConfirmationScreen} name="InternalTransfers.ConfirmationScreen" />
    </Stack.Navigator>
  );
}
