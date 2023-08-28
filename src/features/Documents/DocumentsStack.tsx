import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";

import { DocumentsScreen } from "./screens";

export const Stack = createNativeStackNavigator<DocumentsStackParams>();

export type DocumentsStackParams = {
  "Documents.DocumentsScreen": undefined;
};

export type StatementsStackParamsNavigationProp = NativeStackNavigationProp<DocumentsStackParams>;

export default function DocumentsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={DocumentsScreen} name="Documents.DocumentsScreen" />
    </Stack.Navigator>
  );
}
