import { RouteProp, useRoute } from "@react-navigation/native";
import { StatusBar } from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { SectionsOverview } from "../components";

export default function SectionScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "FrequentlyAskedQuestions.SectionScreen">>();
  const { data, title } = route.params;

  const handleOnSectionPress = (faqId: string) => {
    navigation.navigate("FrequentlyAskedQuestions.DetailedScreen", { faqId });
  };

  const statusBarColor = useThemeStyles<string>(theme => theme.palette.transparent);
  return (
    <Page>
      <NavHeader title={title} />
      <StatusBar barStyle="dark-content" backgroundColor={statusBarColor} translucent />
      <SectionsOverview data={data} onPress={handleOnSectionPress} />
    </Page>
  );
}
