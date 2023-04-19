import { RouteProp, useRoute } from "@react-navigation/native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import MainStackParams from "@/navigation/mainStackParams";

import { SectionsOverview } from "../components";

export default function SectionScreen() {
  const route = useRoute<RouteProp<MainStackParams, "FrequentlyAskedQuestions.SectionScreen">>();
  const { data, title } = route.params;

  return (
    <Page>
      <NavHeader title={title} />
      <SectionsOverview data={data} />
    </Page>
  );
}
