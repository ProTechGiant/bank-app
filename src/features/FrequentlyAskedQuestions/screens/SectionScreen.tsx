import { RouteProp, useRoute } from "@react-navigation/native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";

import { SectionsOverview } from "../components";

export default function SectionScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "FrequentlyAskedQuestions.SectionScreen">>();
  const { data, title } = route.params;

  const handleOnSectionPress = (faqId: string) => {
    navigation.navigate("FrequentlyAskedQuestions.DetailedScreen", { faqId });
  };

  return (
    <Page>
      <NavHeader title={title} />
      <SectionsOverview data={data} onPress={handleOnSectionPress} />
    </Page>
  );
}
