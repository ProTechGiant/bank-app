import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";

import { DocumentsScreen, RequestDocumentScreen } from "./screens";

export const Stack = createNativeStackNavigator<DocumentsStackParams>();

export type DocumentsStackParams = {
  "Documents.DocumentsScreen": undefined;
  "Documents.RequestDocumentScreen": undefined;
};

export type StatementsStackParamsNavigationProp = NativeStackNavigationProp<DocumentsStackParams>;

export default function DocumentsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={RequestDocumentScreen} name="Documents.RequestDocumentScreen" />
      <Stack.Screen component={DocumentsScreen} name="Documents.DocumentsScreen" />
    </Stack.Navigator>
  );
}
