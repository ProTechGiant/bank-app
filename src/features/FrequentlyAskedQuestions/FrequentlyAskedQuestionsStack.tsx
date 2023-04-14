import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DetailedScreen, LandingPage, SectionScreen } from "./screens";
import { DetailedFaq, FAQSection } from "./types";

export type FrequentlyAskedQuestionsStackParams = {
  "FrequentlyAskedQuestions.LandingPage": undefined;
  "FrequentlyAskedQuestions.SectionScreen": { data: FAQSection[]; title: string };
  "FrequentlyAskedQuestions.DetailedScreen": { data: DetailedFaq; title: string } | { faqId: string };
};

const Stack = createNativeStackNavigator<FrequentlyAskedQuestionsStackParams>();

export default function FrequentlyAskedQuestionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={LandingPage} name="FrequentlyAskedQuestions.LandingPage" />
      <Stack.Screen component={SectionScreen} name="FrequentlyAskedQuestions.SectionScreen" />
      <Stack.Screen component={DetailedScreen} name="FrequentlyAskedQuestions.DetailedScreen" />
    </Stack.Navigator>
  );
}
