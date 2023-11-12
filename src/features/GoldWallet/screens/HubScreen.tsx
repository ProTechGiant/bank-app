import { StackActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { NotificationIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import GoldLineChart from "@/components/GoldLineChart";
import InfoBox from "@/components/InfoBox";
import { LoadingErrorNotification } from "@/components/LoadingError";
import Page from "@/components/Page";
import useGoldPerformance from "@/hooks/use-gold-performance";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TabsTypes } from "@/types/GoldChart";

import { AlertSettingsModal } from "../components";
import EmptyTransactionsContent from "../components/EmptyTransactionsContent";
import GoldBalanceCard from "../components/GoldBalanceCard";
import TransactionCard from "../components/TransactionCard";
import { useAlertSettings, useWallet, useWalletTransaction } from "../hooks/query-hooks";
import { TransactionType, TransactionTypeEnum } from "../types";
import { AlertConditionsEnum, AlertStatus, ConditionWithLabelsType } from "../types";

export default function HubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { refetch, isLoading, isError, data: walletData, isFetching } = useWallet();
  const {
    data: transactionsList,
    isLoading: isTransactionsLoading,
    isError: isLoadingTransactionsError,
    refetch: handleOnTransactionRefetch,
  } = useWalletTransaction(walletData?.WalletId);

  const {
    data: alertSettingsData,
    isError: isAlertSettingsError,
    isLoading: isLoadingAlertSettings,
  } = useAlertSettings();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [isAlertSettingsModalVisible, setIsAlertSettingsModalVisible] = useState<boolean>(false);
  const [isTransactionsErrorModalVisible, setIsTransactionsErrorModalVisible] = useState<boolean>(false);
  const [chartType, setChartType] = useState(TabsTypes.Week);
  const { data: chartData } = useGoldPerformance(chartType);

  const updateChartType = (type: any) => {
    setChartType(type);
  };

  const conditionsWithLabels: ConditionWithLabelsType[] = [
    { label: t("GoldWallet.AlertSettingsModal.ConditionsModal.greaterThan"), value: AlertConditionsEnum.GREATER_THAN },
    {
      label: t("GoldWallet.AlertSettingsModal.ConditionsModal.greaterThanOrEqual"),
      value: AlertConditionsEnum.GREATER_THAN_OR_EQUAL,
    },
    { label: t("GoldWallet.AlertSettingsModal.ConditionsModal.lessThan"), value: AlertConditionsEnum.LESS_THAN },
    {
      label: t("GoldWallet.AlertSettingsModal.ConditionsModal.lessThanOrEqual"),
      value: AlertConditionsEnum.LESS_THAN_OR_EQUAL,
    },
    { label: t("GoldWallet.AlertSettingsModal.ConditionsModal.equal"), value: AlertConditionsEnum.EQUAL },
  ];

  if (!isFetching && !walletData) {
    navigation.dispatch(StackActions.replace("GoldWallet.OnboardingScreen"));
  }

  const tradeGoldHandler = (tradeType: TransactionTypeEnum) => {
    if (walletData) {
      navigation.navigate("GoldWallet.TradeGoldScreen", {
        walletId: walletData.WalletId,
        totalBalance: walletData.TotalBalance,
        marketPrice: walletData.MarketBuyPrice,
        tradeType,
        marketStatus: walletData.MarketStatus,
      });
    }
  };

  const handleOnNotificationIconPress = () => {
    setIsAlertSettingsModalVisible(true);
  };

  const onViewAllTransactionsPress = () => {
    if (walletData) {
      navigation.navigate("GoldWallet.TransactionsScreen", {
        walletId: walletData.WalletId,
      });
    }
  };

  const handleOnInfoIconPress = () => {
    if (walletData) {
      navigation.navigate("GoldWallet.GoldWalletInfoModal", {
        accountNumber: walletData.AccountNumber,
        walletNumber: walletData.WalletId,
      });
    }
  };

  useEffect(() => {
    if (isError || isAlertSettingsError) setIsErrorModalVisible(isError);
  }, [isError, isAlertSettingsError]);

  useEffect(() => {
    if (isLoadingTransactionsError) setIsTransactionsErrorModalVisible(isLoadingTransactionsError);
  }, [isLoadingTransactionsError]);

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    width: "100%",
    marginBottom: theme.spacing["24p"],
  }));

  const chartTitleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    marginHorizontal: theme.spacing["16p"],
  }));

  const ChartSubTitleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    marginBottom: theme.spacing["4p"],
  }));

  const circularIconContainer = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.spacing["48p"],
    backgroundColor: theme.palette["neutralBase+30"],
    padding: theme.spacing["8p"],
  }));

  const transactionsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["12p"],
    marginTop: theme.spacing["20p"],
  }));

  const rowHorizontalStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
  }));

  const buyButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: Dimensions.get("screen").width - theme.spacing["32p"],
    marginHorizontal: theme.spacing["16p"],
    marginVertical: theme.spacing["16p"],
  }));

  const alertBannerStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["20p"],
  }));

  const currentGoldTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["8p"],
  }));

  const NotificationIconColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);

  return (
    <Page insets={["bottom", "left", "right"]} backgroundColor="neutralBase-60">
      {isLoading || isLoadingAlertSettings ? (
        <ActivityIndicator />
      ) : (
        <ContentContainer isScrollView style={styles.contentContainer}>
          <Stack direction="vertical" align="stretch">
            <GoldBalanceCard
              balance={walletData?.TotalBalance}
              goldWeight={walletData?.TotalFixedWeight}
              profitLoss={walletData?.profitLoss}
              onInfoIconPress={handleOnInfoIconPress}
            />
            {walletData && walletData.TotalFixedWeight > 0 ? (
              <>
                <Stack direction="vertical" style={chartTitleContainerStyle}>
                  <Typography.Text color="neutralBase+30" size="title3" weight="bold">
                    {t("GoldWallet.goldMarketperformance")}
                  </Typography.Text>
                  <Stack
                    direction="horizontal"
                    align="center"
                    justify="space-between"
                    gap="16p"
                    style={ChartSubTitleContainerStyle}>
                    <Stack direction="horizontal" align="center">
                      <Typography.Text color="neutralBase+30" size="footnote" weight="regular">
                        {t("GoldWallet.currentGoldPrice")}
                      </Typography.Text>
                      <Typography.Text
                        color="neutralBase+30"
                        size="footnote"
                        weight="bold"
                        style={currentGoldTextStyle}>
                        {walletData?.MarketSellPrice} {t("GoldWallet.SARG")}
                      </Typography.Text>
                      <Typography.Text color="successBase" size="footnote" weight="regular">
                        {walletData?.profitLoss} %
                      </Typography.Text>
                    </Stack>
                    <Pressable onPress={handleOnNotificationIconPress} style={circularIconContainer}>
                      <NotificationIcon color={NotificationIconColor} />
                    </Pressable>
                  </Stack>
                </Stack>
                <Stack direction="horizontal" align="center" justify="space-between" style={buttonsContainerStyle}>
                  <View style={styles.buttonContainer}>
                    <Button color="light" variant="primary" onPress={() => tradeGoldHandler(TransactionTypeEnum.BUY)}>
                      {t("GoldWallet.buyGold")}
                    </Button>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button variant="secondary" onPress={() => tradeGoldHandler(TransactionTypeEnum.SELL)}>
                      {t("GoldWallet.sellGold")}
                    </Button>
                  </View>
                </Stack>
              </>
            ) : (
              <View style={buyButtonContainerStyle}>
                <Button color="light" variant="primary" onPress={() => tradeGoldHandler(TransactionTypeEnum.BUY)}>
                  {t("GoldWallet.buyGold")}
                </Button>
              </View>
            )}
            <View style={rowHorizontalStyle}>
              <GoldLineChart
                updateChartType={updateChartType}
                data={chartType === TabsTypes.FiveYears ? chartData?.MonthlyData : chartData?.DailyData}
                hasFiveYears={true}
              />
            </View>
            <Stack direction="vertical" align="stretch">
              <Stack direction="horizontal" align="center" justify="space-between" style={transactionsContainerStyle}>
                <Typography.Text color="neutralBase+30" size="title3" weight="bold">
                  {t("GoldWallet.transactions")}
                </Typography.Text>
                {transactionsList?.length ? (
                  <Pressable onPress={onViewAllTransactionsPress}>
                    <Typography.Text color="neutralBase+30" size="footnote" weight="regular">
                      {t("GoldWallet.viewAll")}
                    </Typography.Text>
                  </Pressable>
                ) : null}
              </Stack>
              {isTransactionsLoading ? (
                <ActivityIndicator />
              ) : transactionsList && transactionsList.length > 0 ? (
                <View style={rowHorizontalStyle}>
                  {transactionsList.map((transaction: TransactionType, index: number) => {
                    return <TransactionCard transaction={transaction} key={index} />;
                  })}
                </View>
              ) : (
                <EmptyTransactionsContent onBuyGoldPress={() => tradeGoldHandler(TransactionTypeEnum.BUY)} />
              )}
            </Stack>

            {alertSettingsData !== undefined ? (
              <View style={alertBannerStyle}>
                <InfoBox
                  variant="compliment"
                  title={
                    alertSettingsData.ActiveFlag === AlertStatus.ACTIVE
                      ? `${t("GoldWallet.alertInfoBoxOn")} ${
                          conditionsWithLabels.find(alertSetting => alertSetting.value === alertSettingsData.Operator)
                            ?.label
                        } ${alertSettingsData.TargetPrice} ${t("GoldWallet.alertInfoBoxOnSecondHalf")}`
                      : t("GoldWallet.alertInfoBoxOff")
                  }
                />
              </View>
            ) : null}
          </Stack>
        </ContentContainer>
      )}
      <LoadingErrorNotification
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
        onRefresh={refetch}
      />
      <LoadingErrorNotification
        isVisible={isTransactionsErrorModalVisible}
        onClose={() => setIsTransactionsErrorModalVisible(false)}
        onRefresh={handleOnTransactionRefetch}
      />
      {alertSettingsData !== undefined ? (
        <AlertSettingsModal
          currentAlertSettings={alertSettingsData}
          isVisible={isAlertSettingsModalVisible}
          onChangeVisibility={setIsAlertSettingsModalVisible}
          conditionsWithLabels={conditionsWithLabels}
        />
      ) : null}
    </Page>
  );
}

const styles = StyleSheet.create({
  buttonContainer: { width: "48%" },
  contentContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});
