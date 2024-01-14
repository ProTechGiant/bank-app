import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  DocumentsEntryScreen,
  DocumentsScreen,
  PreviewDocumentScreen,
  RequestDocumentScreen,
  RequestDocumentTypeScreen,
} from "./screens";
import { DownloadDocumentResponse } from "./types";

export const Stack = createNativeStackNavigator<DocumentsStackParams>();

export type DocumentsStackParams = {
  "Documents.DocumentsScreen": undefined | DownloadDocumentResponse;
  "Documents.RequestDocumentScreen": undefined;
  "Documents.PreviewDocumentScreen": { documentId: string };
  "Documents.RequestDocumentTypeScreen": undefined;
  "Documents.DocumentsEntryScreen": undefined;
};

export type DocumentParamsNavigationProp = NativeStackNavigationProp<DocumentsStackParams>;

export default function DocumentsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={DocumentsEntryScreen} name="Documents.DocumentsEntryScreen" />
      <Stack.Screen component={DocumentsScreen} name="Documents.DocumentsScreen" />
      <Stack.Screen component={RequestDocumentScreen} name="Documents.RequestDocumentScreen" />
      <Stack.Screen component={RequestDocumentTypeScreen} name="Documents.RequestDocumentTypeScreen" />
      <Stack.Screen component={PreviewDocumentScreen} name="Documents.PreviewDocumentScreen" />
    </Stack.Navigator>
  );
}
