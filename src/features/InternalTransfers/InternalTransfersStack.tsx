import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SendToBeneficiaryScreen } from "./screens";

export type InternalTransfersStackParams = {
  "InternalTransfers.SendToBeneficiaryScreen": undefined;
};

export const Stack = createNativeStackNavigator<InternalTransfersStackParams>();

export default function InternalTransfersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={SendToBeneficiaryScreen} name="InternalTransfers.SendToBeneficiaryScreen" />
    </Stack.Navigator>
  );
}
