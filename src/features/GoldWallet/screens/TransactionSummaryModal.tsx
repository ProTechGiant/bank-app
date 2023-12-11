import { toInteger } from "lodash";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, BackHandler, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { IconProps, InfoCircleIcon } from "@/assets/icons";
import { Modal, Stack, Typography } from "@/components";
import Accordion from "@/components/Accordion";
import Button from "@/components/Button";
import useTimer from "@/hooks/timer-hook";
import { useThemeStyles } from "@/theme";
import { GoldFinalDealResponseType, MeasureUnitEnum, TransactionTypeEnum } from "@/types/GoldTransactions";
import { TimerStatusEnum } from "@/types/timer";
import { formatCurrency } from "@/utils";

import { ClockIcon } from "../assets";
import { useFinalDeal } from "../hooks/query-hooks";
import { MarketStatusEnum } from "../types";

interface TransactionSummaryModalProps {
  isVisible: boolean;
  changeVisibility: (status: boolean) => void;
  walletId: string;
  weight: number;
  type: TransactionTypeEnum;
  measureUnit: MeasureUnitEnum;
  marketStatus: MarketStatusEnum;
  onAcceptDeal: (finalDealData: GoldFinalDealResponseType) => void;
  isAcceptingTheDeal: boolean;
  handleGoBackPress: () => void;
}
export default function TransactionSummaryModal({
  isVisible,
  changeVisibility,
  walletId,
  weight,
  type,
  measureUnit,
  marketStatus,
  onAcceptDeal,
  isAcceptingTheDeal,
  handleGoBackPress,
}: TransactionSummaryModalProps) {
  const { t } = useTranslation();
  const {
    data: finalDealData,
    isFetching: isFetchingFinalDeal,
    refetch,
  } = useFinalDeal({ walletId, weight, type, measureUnit });

  const { timer, startTimer, resumeTimer, timerStatus } = useTimer();

  const measureUnitText =
    finalDealData?.MeasureUnit === MeasureUnitEnum.GM
      ? t("GoldWallet.TransactionSummaryModal.gram")
      : t("GoldWallet.TransactionSummaryModal.kiloGram");

  const operationTypeText =
    type === TransactionTypeEnum.BUY
      ? t("GoldWallet.TransactionSummaryModal.buy")
      : t("GoldWallet.TransactionSummaryModal.sell");

  const isContinueButtonDisabled = marketStatus === MarketStatusEnum.CLOSED || timerStatus !== TimerStatusEnum.RUNNING;

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleGoBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleGoBackPress);
    };
  }, [isVisible]);

  const handleOnRefreshTimerPress = () => {
    refetch();
    resumeTimer();
  };

  if (timerStatus === TimerStatusEnum.NOT_STARTED && finalDealData !== undefined && !isFetchingFinalDeal) {
    startTimer({ timeToLive: finalDealData.TimeToLive, autoRetryCount: finalDealData.AutoRetryCount });
  } else if (timerStatus === TimerStatusEnum.PAUSED) {
    handleOnRefreshTimerPress();
  }

  const scrollViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
    paddingBottom: theme.spacing["32p"],
  }));

  const walletInfoStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    padding: theme.spacing["16p"],
    borderTopLeftRadius: theme.spacing["8p"],
    borderTopRightRadius: theme.spacing["8p"],
    width: "100%",
  }));

  const currentAccountCardStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-20"],
    borderRadius: theme.spacing["8p"],
    padding: theme.spacing["8p"],
    marginRight: theme.spacing["12p"],
  }));

  const detailsCardStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["neutralBase-30"],
    padding: theme.spacing["16p"],
    borderWidth: 0.5,
    justifyContent: "space-between",
    width: "100%",
  }));

  const totalAmountCardStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["neutralBase-30"],
    borderBottomLeftRadius: theme.spacing["8p"],
    borderBottomRightRadius: theme.spacing["8p"],
    padding: theme.spacing["16p"],
    borderWidth: 0.5,
    justifyContent: "space-between",
    width: "100%",
  }));

  const statusSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: theme.spacing["20p"],
  }));

  const titleTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginVertical: theme.spacing["16p"],
  }));

  const timerTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  const timerExpiredTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    marginTop: theme.spacing["8p"],
  }));

  const infoIconColor = useThemeStyles<IconProps>(theme => ({ color: theme.palette["complimentBase-20"] }));

  const continueButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    marginVertical: theme.spacing["16p"],
    bottom: 0,
  }));
  return (
    <Modal
      visible={isVisible}
      onBack={() => changeVisibility(false)}
      onClose={() => changeVisibility(false)}
      style={styles.modalStyle}>
      {isFetchingFinalDeal ? (
        <ActivityIndicator />
      ) : finalDealData !== undefined ? (
        <ScrollView showsVerticalScrollIndicator={false} style={scrollViewStyle}>
          <View>
            <View style={titleTextStyle}>
              <Typography.Text size="title1" weight="medium">
                {t("GoldWallet.TransactionSummaryModal.orderSummary")}
              </Typography.Text>
              <Typography.Text color="neutralBase+10">
                {t("GoldWallet.TransactionSummaryModal.youSelectedTo")} {operationTypeText}{" "}
                {t("GoldWallet.TransactionSummaryModal.amountOfGold")}
              </Typography.Text>
            </View>
            <Stack direction="vertical" style={walletInfoStyle} gap="12p">
              <Typography.Text color="neutralBase">
                {t("GoldWallet.TransactionSummaryModal.fundsTransferred")}
              </Typography.Text>
              <Stack direction="horizontal">
                <Stack direction="vertical" style={currentAccountCardStyle}>
                  <Typography.Text color="neutralBase-60" size="caption2">
                    {t("GoldWallet.TransactionSummaryModal.currentAccount")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase-60" size="caption2">
                    {t("GoldWallet.TransactionSummaryModal.stars")} {walletId.slice(-4)}
                  </Typography.Text>
                </Stack>

                <Stack direction="vertical">
                  <Typography.Text color="neutralBase+20">
                    {t("GoldWallet.TransactionSummaryModal.availableBalance")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+20" weight="bold">
                    {finalDealData.AccountBalance}
                    <Typography.Text color="neutralBase+20">
                      {` ${t("GoldWallet.TransactionSummaryModal.currency")}`}
                    </Typography.Text>
                  </Typography.Text>
                </Stack>
              </Stack>
            </Stack>

            <Stack direction="vertical" style={styles.fullWidth}>
              <Stack direction="horizontal" style={detailsCardStyle}>
                <Typography.Text color="neutralBase">
                  {t("GoldWallet.TransactionSummaryModal.goldPrice")} ( {t("GoldWallet.TransactionSummaryModal.per")}{" "}
                  {measureUnitText} )
                </Typography.Text>
                <Typography.Text>
                  {formatCurrency(finalDealData.Rate, t("GoldWallet.TransactionSummaryModal.currency"), 2)}/
                  {measureUnitText}
                </Typography.Text>
              </Stack>

              <Stack direction="horizontal" style={detailsCardStyle}>
                <Typography.Text color="neutralBase">
                  {t("GoldWallet.TransactionSummaryModal.quantity")}
                </Typography.Text>
                <Typography.Text>
                  {finalDealData.Qty}
                  {measureUnitText}
                </Typography.Text>
              </Stack>

              <Stack direction="vertical" style={detailsCardStyle}>
                <Typography.Text color="neutralBase">{t("GoldWallet.TransactionSummaryModal.total")}</Typography.Text>
                <Stack direction="horizontal" style={styles.fullWidth}>
                  <Typography.Text>
                    {t("GoldWallet.TransactionSummaryModal.quantity")} {t("GoldWallet.TransactionSummaryModal.times")}{" "}
                    {t("GoldWallet.TransactionSummaryModal.goldPrice")}
                  </Typography.Text>
                  <Typography.Text>
                    {finalDealData.Qty}
                    {measureUnitText} x{" "}
                    {formatCurrency(finalDealData.Rate, t("GoldWallet.TransactionSummaryModal.currency"), 2)}
                  </Typography.Text>
                </Stack>
              </Stack>

              <Stack direction="horizontal" style={totalAmountCardStyle}>
                <Typography.Text color="neutralBase">
                  {t("GoldWallet.TransactionSummaryModal.totalAmount")}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" weight="bold">
                  {formatCurrency(finalDealData.TotalAmount, t("GoldWallet.TransactionSummaryModal.currency"), 2)}
                </Typography.Text>
              </Stack>
            </Stack>
            <Stack direction="vertical" style={statusSectionStyle}>
              <ClockIcon />
              {marketStatus === MarketStatusEnum.CLOSED ? (
                <>
                  <Typography.Text color="errorBase-10" size="footnote">
                    {t("GoldWallet.TransactionSummaryModal.marketClosed")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase-10" align="center" size="footnote">
                    {t("GoldWallet.TransactionSummaryModal.tryAgainWhenMarketOpen")}
                  </Typography.Text>
                </>
              ) : (
                <>
                  {timerStatus === TimerStatusEnum.RUNNING ? (
                    <Typography.Text style={timerTextStyle}>
                      {t("GoldWallet.TransactionSummaryModal.priceWillExpireIn")} {toInteger(timer / 60.0)}:{timer % 60}{" "}
                      {t("GoldWallet.TransactionSummaryModal.seconds")}
                    </Typography.Text>
                  ) : (
                    <>
                      <Typography.Text style={timerExpiredTextStyle}>
                        {t("GoldWallet.TransactionSummaryModal.priceExpired")}
                      </Typography.Text>
                      <Button size="mini" variant="secondary" onPress={handleOnRefreshTimerPress}>
                        <Typography.Text color="neutralBase+30">
                          {t("GoldWallet.TransactionSummaryModal.refresh")}
                        </Typography.Text>
                      </Button>
                    </>
                  )}
                </>
              )}
            </Stack>
            <Accordion
              backgroundColor="supportBase-30"
              title={t("GoldWallet.TransactionSummaryModal.whyPricesChange")}
              icon={<InfoCircleIcon color={infoIconColor.color} />}>
              <Typography.Text color="neutralBase+10" size="footnote">
                {t("GoldWallet.TransactionSummaryModal.goldPricesChanging")}
              </Typography.Text>
            </Accordion>
            <View style={continueButtonContainerStyle}>
              <Button
                disabled={isContinueButtonDisabled}
                onPress={() => onAcceptDeal(finalDealData)}
                loading={isAcceptingTheDeal}>
                <Typography.Text color="neutralBase-60" align="center">
                  {t("GoldWallet.TransactionSummaryModal.continue")}
                </Typography.Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      ) : null}
    </Modal>
  );
}
const styles = StyleSheet.create({
  fullWidth: {
    justifyContent: "space-between",
    width: "100%",
  },
  modalStyle: {
    height: "90%",
    width: "100%",
  },
});
