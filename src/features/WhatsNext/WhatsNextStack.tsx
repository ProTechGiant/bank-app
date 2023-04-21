import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ExploreArticleScreen, TopTenArticleScreen, WhatsNextHubScreen } from "./screens";

export type WhatsNextStackParams = {
  "WhatsNext.HubScreen": undefined;
  "WhatsNext.ExploreArticleScreen": undefined;
  "WhatsNext.TopTenArticleScreen": undefined;
};

export const Stack = createNativeStackNavigator<WhatsNextStackParams>();

export default function WhatsNextStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={WhatsNextHubScreen} name="WhatsNext.HubScreen" />
      <Stack.Screen component={ExploreArticleScreen} name="WhatsNext.ExploreArticleScreen" />
      <Stack.Screen component={TopTenArticleScreen} name="WhatsNext.TopTenArticleScreen" />
    </Stack.Navigator>
  );
}
