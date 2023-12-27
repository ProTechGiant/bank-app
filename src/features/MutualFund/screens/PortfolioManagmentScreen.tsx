import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";

import { Stack } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { LinkItem } from "../components";
import { useGetPortfolioManagment } from "../hooks/query-hooks";
import { MutualFundStackParams } from "../MutualFundStack";

export default function PortfolioManagmentScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MutualFundStackParams, "MutualFund.PortfolioManagmentScreen">>();
  const { data, isLoading } = useGetPortfolioManagment(route.params.id);

  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]} testID="MutualFund.PortfolioManagmentScreen:Page">
      <NavHeader
        variant="white"
        title={t("MutualFund.PortfolioManagmantScreen.title")}
        testID="MutualFund.PortfolioManagmantScreen:NavHeader"
        withBackButton={true}
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ContentContainer>
          <Stack direction="vertical" gap="24p">
            {data
              ? data.PortfolioManagement.length > 0 &&
                data.PortfolioManagement.map(el => {
                  const onPress = () => {
                    if (el.Name === t("MutualFund.PortfolioManagmantScreen.faq")) {
                      navigation.navigate("FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack", {
                        screen: "FrequentlyAskedQuestions.LandingScreen",
                      });
                    } else if (el.Name === t("MutualFund.PortfolioManagmantScreen.report")) {
                      navigation.navigate("HelpAndSupport.HelpAndSupportStack", {
                        screen: "HelpAndSupport.HubScreen",
                      });
                    } else {
                      navigation.navigate("MutualFund.ViewOrderScreen");
                    }
                  };
                  return <LinkItem name={el.Name} description={el.Description} onPress={onPress} />;
                })
              : null}
          </Stack>
        </ContentContainer>
      )}
    </Page>
  );
}
