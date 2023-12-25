import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { StatusBar, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useAuthContext } from "@/contexts/AuthContext";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AllInOneCardParams } from "../AllInOneCardStack";
import { FormattedPrice } from "../components";
import { useCardTopUpAndRefund } from "../hooks/query-hooks";
import { CurrencyConversion } from "../mocks";
import { convertCurrency } from "../utils/convertCurrency";

export default function TopUpAndRefundSummaryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.TopUpAndRefundSummaryScreen">>();
  const { source, destination, amount, isAddMoney } = route.params;
  const {
    otherAioCardProperties: { aioCardId },
  } = useAuthContext();

  const { mutate, isLoading } = useCardTopUpAndRefund(isAddMoney);

  const handleAddMoney = async () => {
    mutate(
      {
        CardEXID: aioCardId ?? "",
        Currency: destination.CurrencyCode ?? "",
        Amount: (amount ?? 0).toString(),
      },
      {
        onSuccess: () => {
          navigation.navigate("AllInOneCard.SuccessMoneyAdditionScreen", {
            destination: destination,
            addedValue: convertCurrency(amount, source.CurrencyCode, destination.CurrencyCode),
            isAddMoney: isAddMoney,
          });
        },
        onError: errorApi => {
          warn("All In One Card", "error topping up money", JSON.stringify(errorApi));
        },
      }
    );
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
    <Page backgroundColor="neutralBase-60" testID="AllInOneCard.TopUpAndRefundSummaryScreen:Page">
      <NavHeader testID="AllInOneCard.TopUpAndRefundSummaryScreen:NavHeader" />
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <ContentContainer>
        <Stack direction="vertical" justify="space-between" align="stretch" flex={1}>
          <View>
            <Typography.Text color="neutralBase+30" size="title1" weight="bold">
              {t("AllInOneCard.TopUpAndRefundSummaryScreen.title")}
            </Typography.Text>
            <Stack direction="vertical" style={summaryDateStyle}>
              <Stack direction="vertical" style={summaryTableStyle}>
                <Typography.Text color="neutralBase" size="footnote" weight="regular">
                  {t("AllInOneCard.TopUpAndRefundSummaryScreen.from")}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                  {source.Name}
                </Typography.Text>
              </Stack>
              <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
                <Typography.Text color="neutralBase" size="footnote" weight="regular">
                  {t("AllInOneCard.TopUpAndRefundSummaryScreen.debitAmount") + " (" + source.CurrencyCode + ")"}
                </Typography.Text>

                <FormattedPrice price={String(amount)} currency={source.CurrencyCode} />
              </Stack>
              <Stack direction="vertical" style={summaryTableStyle} justify="space-between">
                <Typography.Text color="neutralBase" size="footnote" weight="regular">
                  {t("AllInOneCard.TopUpAndRefundSummaryScreen.to")}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                  {destination.Name}
                </Typography.Text>
              </Stack>
              {source.CurrencyCode !== "SAR" || destination.CurrencyCode !== "SAR" ? (
                <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
                  <Typography.Text color="neutralBase" size="footnote" weight="regular">
                    {t("AllInOneCard.TopUpAndRefundSummaryScreen.exchangeRate")}
                  </Typography.Text>
                  <Stack direction="horizontal">
                    <FormattedPrice price="1.00" currency={source.CurrencyCode} />
                    <Typography.Text color="neutralBase+30" size="callout" weight="bold">
                      {" " + "=" + " "}
                    </Typography.Text>
                    {/* Updated */}
                    <FormattedPrice
                      price={
                        isAddMoney
                          ? CurrencyConversion[destination.CurrencyCode].split(" ")[3]
                          : CurrencyConversion[source.CurrencyCode].split(" ")[3]
                      }
                      currency={t("AllInOneCard.TopUpAndRefundSummaryScreen.sar")}
                    />
                  </Stack>
                </Stack>
              ) : (
                <></>
              )}

              <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
                <Typography.Text color="neutralBase" size="footnote" weight="regular">
                  {t("AllInOneCard.TopUpAndRefundSummaryScreen.creditAmount") + " (" + destination.CurrencyCode + ")"}
                </Typography.Text>
                <FormattedPrice
                  price={String(convertCurrency(amount, source.CurrencyCode, destination.CurrencyCode))}
                  currency={destination.CurrencyCode}
                />
              </Stack>
            </Stack>
          </View>
          <Button
            loading={isLoading}
            testID="AllInOneCard.TopUpAndRefundSummaryScreen:ContinueButton"
            onPress={handleAddMoney}>
            {t("AllInOneCard.TopUpAndRefundSummaryScreen.continueButton")}
          </Button>
        </Stack>
      </ContentContainer>
    </Page>
  );
}
