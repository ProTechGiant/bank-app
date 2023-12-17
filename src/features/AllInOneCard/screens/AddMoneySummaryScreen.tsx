import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { StatusBar, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AllInOneCardParams } from "../AllInOneCardStack";
import { FormattedPrice } from "../components";

export default function AddMoneySummaryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.AddMoneySummaryScreen">>();
  const { source, destination, amount } = route.params;

  const handleAddMoney = () => {
    navigation.navigate("AllInOneCard.SuccessMoneyAdditionScreen");
  };

  const summaryDateStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme.palette["neutralBase-30"],
    marginTop: theme.spacing["24p"],
  }));
  const summaryTableStyle = useThemeStyles<ViewStyle>(theme => ({
    borderBottomWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    padding: theme.spacing["16p"],
    width: "100%",
  }));

  return (
    <Page backgroundColor="neutralBase-60" testID="AllInOneCard.AddMoneySummaryScreen:Page">
      <NavHeader testID="AllInOneCard.AddMoneySummaryScreen:NavHeader" />
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <ContentContainer>
        <Stack direction="vertical" justify="space-between" align="stretch" flex={1}>
          <View>
            <Typography.Text color="neutralBase+30" size="title1" weight="bold">
              {t("AllInOneCard.AddMoneySummaryScreen.title")}
            </Typography.Text>
            <Stack direction="vertical" style={summaryDateStyle}>
              <Stack direction="vertical" style={summaryTableStyle}>
                <Typography.Text color="neutralBase" size="footnote" weight="regular">
                  {t("AllInOneCard.AddMoneySummaryScreen.from")}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                  {source}
                </Typography.Text>
              </Stack>
              <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
                <Typography.Text color="neutralBase" size="footnote" weight="regular">
                  {t("AllInOneCard.AddMoneySummaryScreen.debitAmount")}
                </Typography.Text>
                <FormattedPrice price={amount} currency={t("AllInOneCard.AddMoneySummaryScreen.sar")} />
              </Stack>
              <Stack direction="vertical" style={summaryTableStyle} justify="space-between">
                <Typography.Text color="neutralBase" size="footnote" weight="regular">
                  {t("AllInOneCard.AddMoneySummaryScreen.to")}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                  {destination}
                </Typography.Text>
              </Stack>
              <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
                <Typography.Text color="neutralBase" size="footnote" weight="regular">
                  {t("AllInOneCard.AddMoneySummaryScreen.creditAmount")}
                </Typography.Text>
                <FormattedPrice price={amount} currency={t("AllInOneCard.AddMoneySummaryScreen.sar")} />
              </Stack>
            </Stack>
          </View>
          <Button testID="AllInOneCard.AddMoneySummaryScreen:ContinueButton" onPress={handleAddMoney}>
            {t("AllInOneCard.AddMoneySummaryScreen.continueButton")}
          </Button>
        </Stack>
      </ContentContainer>
    </Page>
  );
}
