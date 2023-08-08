import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AccessStatementScreen, RequestStatementScreen } from "./screens";

export const Stack = createNativeStackNavigator();

export type StatmentsStackParams = {
  "Statements.AccessStatementScreen": undefined;
  "Statements.RequestStatementScreen": undefined;
};

export default function StatementsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={AccessStatementScreen} name="Statements.AccessStatementScreen" />
      <Stack.Screen component={RequestStatementScreen} name="Statements.RequestStatementScreen" />
    </Stack.Navigator>
  );
}
