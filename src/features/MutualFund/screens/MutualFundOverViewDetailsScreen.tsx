import { useTranslation } from "react-i18next";
import { ScrollView, StatusBar, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ArrowLeftIcon } from "@/assets/icons";
import { Stack } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useGetFundManagementDetails } from "../hooks/query-hooks";

export default function MutualFundOverViewDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { data: fundManagementDetails } = useGetFundManagementDetails(28253); // TODO: add id from navigation

  const tableContent = {
    OrderList: [
      {
        title: t("MutualFund.MutualFundOverViewDetailsScreen.subscriptionFee"),
        value: `${fundManagementDetails?.SubscriptionFees} %`,
      },
      {
        title: t("MutualFund.MutualFundOverViewDetailsScreen.minimumSubscription"),
        value: t("MutualFund.MutualFundDetailsScreen.sar", { value: fundManagementDetails?.MinimumSubscriptionAmount }),
      },
      {
        title: t("MutualFund.MutualFundOverViewDetailsScreen.minimumAdditionalSubscription"),
        value: fundManagementDetails?.MinimumAdditionalSubscriptionAmount,
      },
      {
        title: t("MutualFund.MutualFundOverViewDetailsScreen.riskLevel"),
        value: fundManagementDetails?.RiskLevel,
      },
      {
        title: t("MutualFund.MutualFundOverViewDetailsScreen.expectedReturn"),
        value: `${fundManagementDetails?.YTD} %`,
      },
      {
        title: t("MutualFund.MutualFundOverViewDetailsScreen.inceptionDate"),
        value: fundManagementDetails?.InceptionDate,
        boldText: false,
      },
    ],
  };

  const contentStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: insets.top,
      backgroundColor: theme.palette.primaryBase,
    }),
    [insets.top]
  );

  const backButtonStyle = useThemeStyles<string>(theme => theme.palette["neutralBase-60"]);

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["24p"],
    paddingBottom: theme.spacing["32p"],
  }));

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
    paddingHorizontal: theme.spacing["20p"],
    backgroundColor: theme.palette.primaryBase,
  }));

  const tableStackStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-30"],
    borderWidth: 1,
  }));

  const orderDetailsTableContentStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]}>
      <Stack direction="vertical" align="stretch" style={contentStyle}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <NavHeader
          variant="white"
          title={
            <Typography.Text color="neutralBase-60">
              {t("MutualFund.MutualFundOverViewDetailsScreen.mutualFundsDetailsTitle")}
            </Typography.Text>
          }
          backButton={<ArrowLeftIcon color={backButtonStyle} width={20} height={20} />}
        />
      </Stack>
      <ScrollView style={{ flex: 1 }}>
        <Stack direction="vertical" align="stretch">
          <Stack direction="vertical" gap="16p" align="stretch" style={titleContainerStyle}>
            <Typography.Text size="title3" color="neutralBase-60" weight="bold">
              {fundManagementDetails?.Name}
            </Typography.Text>
          </Stack>
        </Stack>
        <ContentContainer style={contentContainerStyle}>
          <Typography.Text color="neutralBase+30" size="title3" weight="medium">
            {t("MutualFund.MutualFundOverViewDetailsScreen.fundDetails")}
          </Typography.Text>

          <Stack direction="vertical" style={tableStackStyle} align="stretch">
            {tableContent.OrderList.map(orderDetail => {
              return (
                <Stack direction="vertical" align="stretch" key={orderDetail.title}>
                  <Divider color="neutralBase-30" />
                  <Stack direction="horizontal" justify="space-between" style={orderDetailsTableContentStyle}>
                    <Stack direction="vertical" flex={1}>
                      <Typography.Text weight="regular" size="footnote" color="neutralBase">
                        {orderDetail.title}
                      </Typography.Text>
                    </Stack>
                    <Stack direction="vertical" flex={1} align="flex-end">
                      <Typography.Text weight={orderDetail.boldText ? "bold" : "regular"} size="callout">
                        {orderDetail.value}
                      </Typography.Text>
                    </Stack>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
          <Stack direction="horizontal" align="center" justify="center" gap="4p">
            <Typography.Text weight="regular" size="footnote">
              {t("MutualFund.MutualFundOverViewDetailsScreen.pleaseVisit")}
            </Typography.Text>
            <Typography.Text
              onPress={() => {
                // TODO: add pdf link once BE team fix api issue
                navigation.navigate("MutualFund.TermsAndConditions");
              }}
              weight="regular"
              size="footnote"
              color="complimentBase"
              style={{ textDecorationLine: "underline" }}>
              {t("MutualFund.MutualFundOverViewDetailsScreen.link")}
            </Typography.Text>
          </Stack>
        </ContentContainer>
      </ScrollView>
    </Page>
  );
}
