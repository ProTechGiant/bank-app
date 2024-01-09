import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";

import { Stack } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { LinkItem } from "../components";
import { useGetMutualFundManagment } from "../hooks/query-hooks";
import { MutualFundStackParams } from "../MutualFundStack";

export default function MutualFundManagmentScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MutualFundStackParams, "MutualFund.MutualFundManagmentScreen">>();
  const { data, isLoading } = useGetMutualFundManagment(route.params.id);
  const [showModel, setShowModel] = useState<boolean>(false);

  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]} testID="MutualFund.MutualFundManagmentScreen:Page">
      <NavHeader
        variant="white"
        title={t("MutualFund.MutualFundManagmantScreen.title")}
        testID="MutualFund.MutualFundManagmantScreen:NavHeader"
        withBackButton={true}
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ContentContainer>
          <Stack direction="vertical" gap="24p">
            {data
              ? data.MutualFundManagement &&
                data.MutualFundManagement.map(el => {
                  const onPress = () => {
                    if (el.Name === t("MutualFund.MutualFundManagmantScreen.faq")) {
                      navigation.navigate("FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack", {
                        screen: "FrequentlyAskedQuestions.LandingScreen",
                      });
                    } else if (el.Name === t("MutualFund.MutualFundManagmantScreen.report")) {
                      navigation.navigate("HelpAndSupport.HelpAndSupportStack", {
                        screen: "HelpAndSupport.HubScreen",
                      });
                    } else if (el.Name === t("MutualFund.MutualFundManagmantScreen.sell")) {
                      setShowModel(true);
                    } else if (el.Name === t("MutualFund.MutualFundManagmantScreen.printStatement")) {
                      navigation.navigate("MutualFund.PrintFileScreen");
                    } else if (
                      el.Name === t("MutualFund.MutualFundManagmantScreen.fundOrders") ||
                      el.Name === t("MutualFund.MutualFundManagmantScreen.viewOrders") ||
                      el.Name === t("MutualFund.MutualFundManagmantScreen.unitOrders")
                    ) {
                      navigation.navigate("MutualFund.MutualFundOrderScreen");
                    } else if (el.Name === t("MutualFund.MutualFundManagmantScreen.monthlyPayments")) {
                      navigation.navigate("MutualFund.MutualFundMonthlyPaymentScreen");
                    } else if (el.Name === t("MutualFund.MutualFundManagmantScreen.fundDetails")) {
                      navigation.navigate("MutualFund.MutualFundOverViewDetailsScreen");
                    }
                  };
                  return <LinkItem name={el.Name} description={el.Description} onPress={onPress} />;
                })
              : null}
          </Stack>
        </ContentContainer>
      )}
      <NotificationModal
        message={t("MutualFund.MutualFundManagmantScreen.notificationMessage")}
        title={t("MutualFund.MutualFundManagmantScreen.sell")}
        isVisible={showModel}
        onClose={() => setShowModel(false)}
        buttons={{
          primary: (
            <Button onPress={() => setShowModel(false)}>
              {t("MutualFund.MutualFundManagmantScreen.notificationBtn")}
            </Button>
          ),
        }}
        variant="warning"
      />
    </Page>
  );
}
