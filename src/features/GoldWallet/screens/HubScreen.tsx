import { StackActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { NotificationIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import InfoBox from "@/components/InfoBox";
import { LoadingErrorNotification } from "@/components/LoadingError";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AlertSettingsModal } from "../components";
import GoldBalanceCard from "../components/GoldBalanceCard";
import GoldChart from "../components/GoldChart";
import TransactionCard from "../components/TransactionCard";
import { useAlertSettings, useWallet } from "../hooks/query-hooks";
import { AlertConditionsEnum, AlertStatus, ConditionWithLabelsType } from "../types";

export default function HubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

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

  const { refetch, isLoading, isError, data: walletData } = useWallet();
  const {
    data: alertSettingsData,
    isError: isAlertSettingsError,
    isLoading: isLoadingAlertSettings,
  } = useAlertSettings();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [isAlertSettingsModalVisible, setIsAlertSettingsModalVisible] = useState<boolean>(false);

  //TODO change this condition to the correct one on integration
  if (walletData === undefined) {
    navigation.dispatch(StackActions.replace("GoldWallet.OnboardingScreen"));
  }

  const handleOnSellGoldPress = () => {
    //TODO
  };

  const handleOnBuyGoldPress = () => {
    //TODO
  };

  const handleOnNotificationIconPress = () => {
    setIsAlertSettingsModalVisible(true);
  };

  const onViewAllTransactionsPress = () => {
    navigation.navigate("GoldWallet.TransactionsScreen");
  };

  useEffect(() => {
    if (isError || isAlertSettingsError) setIsErrorModalVisible(isError);
  }, [isError, isAlertSettingsError]);

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
    marginBottom: theme.spacing["4p"],
  }));

  const circularIconContainer = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.spacing["48p"],
    backgroundColor: "#000000",
    padding: theme.spacing["8p"],
    marginHorizontal: theme.spacing["32p"],
  }));

  const transactionsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["16p"],
  }));

  const rowHorizontalStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
  }));

  const alertBannerStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["20p"],
  }));

  const NotificationIconColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);

  return (
    <Page insets={["bottom", "left", "right"]} backgroundColor="neutralBase-60">
      {isLoading || isLoadingAlertSettings ? (
        <ActivityIndicator />
      ) : (
        <ContentContainer isScrollView style={styles.contentContainer}>
          <Stack direction="vertical" align="stretch">
            <GoldBalanceCard balance={0} />
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
                <Typography.Text color="neutralBase+30" size="footnote" weight="regular">
                  {t("GoldWallet.currentGoldPrice")}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="footnote" weight="bold">
                  201 {t("GoldWallet.SARG")}
                </Typography.Text>
                <Typography.Text color="successBase" size="footnote" weight="regular">
                  +10%
                </Typography.Text>
                <Pressable onPress={handleOnNotificationIconPress} style={circularIconContainer}>
                  <NotificationIcon color={NotificationIconColor} />
                </Pressable>
              </Stack>
            </Stack>
            <Stack direction="horizontal" align="center" justify="space-between" style={buttonsContainerStyle}>
              <View style={styles.buttonContainer}>
                <Button variant="secondary" onPress={handleOnSellGoldPress}>
                  {t("GoldWallet.sellGold")}
                </Button>
              </View>
              <View style={styles.buttonContainer}>
                <Button color="light" variant="primary" onPress={handleOnBuyGoldPress}>
                  {t("GoldWallet.buyGold")}
                </Button>
              </View>
            </Stack>
            <View style={rowHorizontalStyle}>
              <GoldChart />
            </View>
            <Stack direction="vertical" align="stretch">
              <Stack direction="horizontal" align="center" justify="space-between" style={transactionsContainerStyle}>
                <Typography.Text color="neutralBase+30" size="title3" weight="bold">
                  {t("GoldWallet.transactions")}
                </Typography.Text>
                <Pressable onPress={onViewAllTransactionsPress}>
                  <Typography.Text color="neutralBase+30" size="footnote" weight="regular">
                    {t("GoldWallet.viewAll")}
                  </Typography.Text>
                </Pressable>
              </Stack>
              <View style={rowHorizontalStyle}>
                {new Array(5).fill("").map(() => {
                  return <TransactionCard />;
                })}
              </View>
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
