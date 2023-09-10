import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ChatScreen, HubScreen, LiveChatScreen } from "./screens";
import { AwaitTimeData, ChatResponse, LiveChatScreenParams } from "./types";

export type HelpAndSupportStackParams = {
  "HelpAndSupport.HubScreen": undefined;
  "HelpAndSupport.LiveChatScreen": undefined | LiveChatScreenParams;
  "HelpAndSupport.ChatScreen": {
    chatResponse: ChatResponse;
    awaitTimeData: AwaitTimeData;
    enquiryType: string;
    subEnquiryType: string;
  };
};

export const Stack = createNativeStackNavigator<HelpAndSupportStackParams>();

export default function HelpAndSupportStack() {
  // TODO: change screen name from LiveChatScreen to ChatSupportScreen
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={HubScreen} name="HelpAndSupport.HubScreen" />
      <Stack.Screen component={LiveChatScreen} name="HelpAndSupport.LiveChatScreen" />
      <Stack.Screen component={ChatScreen} name="HelpAndSupport.ChatScreen" />
    </Stack.Navigator>
  );
}
