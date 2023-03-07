import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddMoneyViaBankTransferScreen from "./screens/AddMoneyViaBankTransfer";

export type AddMoneyStackParams = {
  "AddMoney.AddMoneyInfoScreen": undefined;
};

export const Stack = createNativeStackNavigator<AddMoneyStackParams>();

export default function AddMoneyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={AddMoneyViaBankTransferScreen} name="AddMoney.AddMoneyInfoScreen" />
    </Stack.Navigator>
  );
}
