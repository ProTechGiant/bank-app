import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ExploreArticleScreen, TopTenArticleScreen, WhatsNextHubScreen } from "./screens";
import { ArticleSectionType } from "./types";

export type WhatsNextStackParams = {
  "WhatsNext.HubScreen": undefined;
  "WhatsNext.ExploreArticleScreen": { articleId: string };
  "WhatsNext.TopTenArticleScreen": { topTenArticlesData: ArticleSectionType };
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
