import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";

import { DocumentsScreen, PreviewDocumentScreen, RequestDocumentScreen } from "./screens";
import { DocumentInterface } from "./types";

export const Stack = createNativeStackNavigator<DocumentsStackParams>();

export type DocumentsStackParams = {
  "Documents.DocumentsScreen": { doc?: DocumentInterface };
  "Documents.RequestDocumentScreen": undefined;
  "Documents.PreviewDocumentScreen": { documentId: string };
};

export type DocumentParamsNavigationProp = NativeStackNavigationProp<DocumentsStackParams>;

export default function DocumentsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={DocumentsScreen} name="Documents.DocumentsScreen" />
      <Stack.Screen component={RequestDocumentScreen} name="Documents.RequestDocumentScreen" />
      <Stack.Screen component={PreviewDocumentScreen} name="Documents.PreviewDocumentScreen" />
    </Stack.Navigator>
  );
}
