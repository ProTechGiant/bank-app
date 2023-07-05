import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DetailedScreen, LandingScreen, SectionScreen } from "./screens";
import { FAQData } from "./types";

export type FrequentlyAskedQuestionsStackParams = {
  "FrequentlyAskedQuestions.LandingScreen": undefined;
  "FrequentlyAskedQuestions.SectionScreen": { data: FAQData; title: string };
  "FrequentlyAskedQuestions.DetailedScreen": { faqId: string };
};

const Stack = createNativeStackNavigator<FrequentlyAskedQuestionsStackParams>();

export default function FrequentlyAskedQuestionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={LandingScreen} name="FrequentlyAskedQuestions.LandingScreen" />
      <Stack.Screen component={SectionScreen} name="FrequentlyAskedQuestions.SectionScreen" />
      <Stack.Screen component={DetailedScreen} name="FrequentlyAskedQuestions.DetailedScreen" />
    </Stack.Navigator>
  );
}
