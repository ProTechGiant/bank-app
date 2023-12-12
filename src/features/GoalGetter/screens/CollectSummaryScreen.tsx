import { RouteProp, useRoute } from "@react-navigation/native";
import { toInteger } from "lodash";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, TextStyle, View, ViewStyle } from "react-native";

import { IconProps, InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Accordion from "@/components/Accordion";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ClockIcon from "@/features/GoldWallet/assets/ClockIcon";
import useTimer from "@/hooks/timer-hook";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { MeasureUnitEnum, TransactionTypeEnum } from "@/types/GoldTransactions";
import { MarketStatusEnum, TimerStatusEnum } from "@/types/timer";

import { GoalGetterStackParams } from "../GoalGetterStack";
import { useGoldFinalDeal } from "../hooks/query-hooks";
import { ProductTypeName } from "../types";

export default function CollectSummaryScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { timer, resumeTimer, timerStatus, startTimer } = useTimer(); //TODO will destruct startTimer here when integrate with api
  const route = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.CollectSummaryScreen">>();
  const { walletId, weight, transactionType, onDonePress, productType } = route.params;
  const {
    data: finalDealData,
    isFetching: isFetchingFinalDeal,
    refetch,
  } = useGoldFinalDeal({
    walletId,
    weight,
    measureUnit: MeasureUnitEnum.GM,
    type: transactionType,
  });

  const detailsData =
    productType === ProductTypeName.SAVING_POT
      ? [
          {
            label: t("GoalGetter.CollectSummaryScreen.from"),
            value: "Saving Pot",
          },
          {
            label: t("GoalGetter.CollectSummaryScreen.to"),
            value: "Current account",
          },
          {
            label: t("GoalGetter.CollectSummaryScreen.originalAmount"),
            value: "50,400.00 SAR",
          },
          {
            label: "Invested Amount",
            value: "50,400.00 SAR",
          },
          {
            label: "Remaining Balance",
            value: "0.00 SAR",
          },
        ]
      : [
          {
            label: t("GoalGetter.CollectSummaryScreen.from"),
            value: transactionType === TransactionTypeEnum.BUY ? "Current account" : "Gold Wallet",
          },
          {
            label: t("GoalGetter.CollectSummaryScreen.to"),
            value: transactionType === TransactionTypeEnum.SELL ? "Current account" : "Gold Wallet",
          },
          {
            label: t("GoalGetter.CollectSummaryScreen.originalAmount"),
            value: finalDealData?.TotalAmount,
          },
          {
            label: t("GoalGetter.CollectSummaryScreen.withdrawalQty"),
            value: finalDealData?.Qty,
          },
          {
            label: t("GoalGetter.CollectSummaryScreen.gramValue"),
            value: finalDealData?.Rate,
          },
          {
            label: t("GoalGetter.CollectSummaryScreen.total"),
            value: `${finalDealData?.Qty} g x ${finalDealData?.Rate} = ${finalDealData?.Rate * finalDealData?.Qty} SAR`,
          },
          {
            label: t("GoalGetter.CollectSummaryScreen.remainingAmount"),
            value: `${finalDealData?.Qty} Grams (${finalDealData?.Rate * finalDealData?.Qty} SAR)`,
          },
        ];
  const isContinueButtonDisabled =
    productType === ProductTypeName.SAVING_POT ? false : timerStatus !== TimerStatusEnum.RUNNING;

  const handleOnDonePress = async () => {
    if (finalDealData && productType !== ProductTypeName.SAVING_POT) {
      onDonePress(finalDealData);
    } else {
      onDonePress();
    }
  };

  const handleOnRefreshTimerPress = () => {
    refetch();
    resumeTimer();
  };

  if (timerStatus === TimerStatusEnum.NOT_STARTED && finalDealData !== undefined && !isFetchingFinalDeal) {
    startTimer({ timeToLive: finalDealData.TimeToLive, autoRetryCount: finalDealData.AutoRetryCount });
  } else if (timerStatus === TimerStatusEnum.PAUSED) {
    handleOnRefreshTimerPress();
  }

  const modalContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
    borderRadius: theme.radii.medium,
    flex: 1,
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const detailsRowStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    padding: theme.spacing["12p"],
    borderColor: theme.palette["neutralBase-30"],
  }));

  const detailsTableContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    marginTop: theme.spacing["20p"],
    borderRadius: theme.radii.small,
  }));

  const doneButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-end",
    width: "100%",
    paddingHorizontal: theme.spacing["20p"],
    marginVertical: theme.spacing["20p"],
  }));

  const timerTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  const timerExpiredTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    marginTop: theme.spacing["8p"],
  }));

  const statusSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: theme.spacing["48p"],
  }));

  const timerIconColor = useThemeStyles<IconProps>(theme => ({ color: theme.palette["primaryBase-40"] }));
  const infoIconColor = useThemeStyles<IconProps>(theme => ({ color: theme.palette["complimentBase-20"] }));

  return (
    <Page backgroundColor="neutralBase+30">
      <View style={modalContainerStyle}>
        {isFetchingFinalDeal ? (
          <ActivityIndicator />
        ) : (
          <>
            <NavHeader title="" end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
            <ContentContainer>
              <Stack direction="vertical">
                <Typography.Text color="neutralBase+30" size="title1" weight="bold">
                  {t("GoalGetter.CollectSummaryScreen.collectSummary")}
                </Typography.Text>
              </Stack>
              <Stack direction="vertical" style={detailsTableContainerStyle}>
                {detailsData.map((item, index) => {
                  if (index === 0 || index === 1) {
                    return (
                      <Stack direction="vertical" key={index} style={[detailsRowStyle, { borderBottomWidth: 1 }]}>
                        <Typography.Text color="neutralBase" size="footnote" weight="regular">
                          {item?.label}
                        </Typography.Text>
                        <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                          {item?.value}
                        </Typography.Text>
                      </Stack>
                    );
                  } else {
                    return (
                      <Stack
                        direction="horizontal"
                        align="center"
                        justify="space-between"
                        key={index}
                        style={[detailsRowStyle, { borderBottomWidth: index < detailsData.length - 1 ? 1 : 0 }]}>
                        <Typography.Text color="neutralBase" size="footnote" weight="regular">
                          {item.label}
                        </Typography.Text>
                        <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                          {item.value}
                        </Typography.Text>
                      </Stack>
                    );
                  }
                })}
              </Stack>
              {productType !== ProductTypeName.SAVING_POT && (
                <Stack direction="vertical" style={statusSectionStyle}>
                  <ClockIcon color={timerIconColor.color} />
                  {/* condition will be marketStatus === MarketStatusEnum.CLOSED ? */}
                  {MarketStatusEnum.CLOSED ? (
                    <>
                      <Typography.Text color="errorBase-10" size="footnote">
                        {t("GoalGetter.CollectSummaryScreen.marketClosed")}
                      </Typography.Text>
                      <Typography.Text color="neutralBase-10" align="center" size="footnote">
                        {t("GoalGetter.CollectSummaryScreen.tryAgainWhenMarketOpen")}
                      </Typography.Text>
                    </>
                  ) : (
                    <>
                      {timerStatus === TimerStatusEnum.RUNNING ? (
                        <Typography.Text style={timerTextStyle}>
                          {t("GoalGetter.CollectSummaryScreen.priceWillExpireIn")} {toInteger(timer / 60.0)}:
                          {timer % 60} {t("GoalGetter.CollectSummaryScreen.seconds")}
                        </Typography.Text>
                      ) : (
                        <>
                          <Typography.Text style={timerExpiredTextStyle}>
                            {t("GoalGetter.CollectSummaryScreen.priceExpired")}
                          </Typography.Text>
                          <Button size="mini" variant="primary-warning" onPress={handleOnRefreshTimerPress}>
                            <Typography.Text color="complimentBase">
                              {t("GoalGetter.CollectSummaryScreen.refresh")}
                            </Typography.Text>
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </Stack>
              )}
              {productType !== ProductTypeName.SAVING_POT && (
                <Accordion
                  title={t("GoalGetter.CollectSummaryScreen.whyPricesChange")}
                  icon={<InfoCircleIcon color={infoIconColor.color} />}>
                  <Typography.Text color="neutralBase+10" size="footnote">
                    {t("GoalGetter.CollectSummaryScreen.goldPricesChanging")}
                  </Typography.Text>
                </Accordion>
              )}
            </ContentContainer>
            <View style={doneButtonContainerStyle}>
              <Button onPress={handleOnDonePress} disabled={isContinueButtonDisabled}>
                {t("GoldWallet.done")}
              </Button>
            </View>
          </>
        )}
      </View>
    </Page>
  );
}
