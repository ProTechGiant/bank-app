import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CreateRequestScreen, HubScreen, ReceivedRequestsScreen, RequestDetailsScreen } from "./screens";
import SuccessfulRequestScreen from "./screens/SuccessfulRequestScreen";
import { RequestDetailsScreenTypeEnum, RequestStatusEnum } from "./type";
export type IpsStackParams = {
  "IpsStack.HubScreen": undefined;
  "IpsStack.ReceivedRequests": undefined;
  "IpsStack.CreateRequest": undefined;
  "IpsStack.RequestDetails": {
    name: string;
    amount: number;
    IBAN: string;
    bank: string;
    type: RequestDetailsScreenTypeEnum;
    referenceNumber?: string;
    status?: RequestStatusEnum;
    expireAfter?: string;
  };
  "IpsStack.SuccessfulRequest": {
    name: string;
    referenceNumber: string;
    amount: number;
  };
};

const Stack = createNativeStackNavigator();
export default function IpsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IpsStack.ReceivedRequests" component={ReceivedRequestsScreen} />
      <Stack.Screen name="IpsStack.HubScreen" component={HubScreen} />
      <Stack.Screen name="IpsStack.CreateRequest" component={CreateRequestScreen} />
      <Stack.Screen name="IpsStack.RequestDetails" component={RequestDetailsScreen} />
      <Stack.Screen name="IpsStack.SuccessfulRequest" component={SuccessfulRequestScreen} />
    </Stack.Navigator>
  );
}
