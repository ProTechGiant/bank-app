import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";

import { StatementTypes } from "./constants";
import { AccessStatementScreen, PreviewStatementScreen, RequestStatementScreen } from "./screens";

export const Stack = createNativeStackNavigator<StatementsStackParams>();

export type StatementsStackParams = {
  "Statements.AccessStatementScreen": {
    type?: StatementTypes;
  };
  "Statements.RequestStatementScreen": undefined;
  "Statements.CustomDateStatementScreen": undefined;
  "Statements.PreviewStatementScreen": { documentId: string };
};

export type StatementsStackParamsNavigationProp = NativeStackNavigationProp<StatementsStackParams>;

export default function StatementsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={AccessStatementScreen} name="Statements.AccessStatementScreen" />
      <Stack.Screen component={RequestStatementScreen} name="Statements.RequestStatementScreen" />
      <Stack.Screen component={PreviewStatementScreen} name="Statements.PreviewStatementScreen" />
    </Stack.Navigator>
  );
}
