import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  ConfirmNewBeneficiaryScreen,
  EnterBeneficiaryDetailsScreen,
  InternalTransferScreen,
  ReviewTransferScreen,
  SendToBeneficiaryScreen,
} from "./screens";

export type InternalTransfersStackParams = {
  "InternalTransfers.SendToBeneficiaryScreen": undefined;
  "InternalTransfers.ReviewTransferScreen": undefined;
  "InternalTransfers.EnterBeneficiaryDetailsScreen": undefined;
  "InternalTransfers.ConfirmNewBeneficiaryScreen": undefined;
  "InternalTransfers.InternalTransferScreen": undefined;
};

export const Stack = createNativeStackNavigator<InternalTransfersStackParams>();

export default function InternalTransfersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={InternalTransferScreen} name="InternalTransfers.InternalTransferScreen" />
      <Stack.Screen component={SendToBeneficiaryScreen} name="InternalTransfers.SendToBeneficiaryScreen" />
      <Stack.Screen component={ReviewTransferScreen} name="InternalTransfers.ReviewTransferScreen" />
      <Stack.Screen component={EnterBeneficiaryDetailsScreen} name="InternalTransfers.EnterBeneficiaryDetailsScreen" />
      <Stack.Screen component={ConfirmNewBeneficiaryScreen} name="InternalTransfers.ConfirmNewBeneficiaryScreen" />
    </Stack.Navigator>
  );
}
