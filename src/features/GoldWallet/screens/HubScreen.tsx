import { StackActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { NotificationIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { LoadingErrorNotification } from "@/components/LoadingError";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import GoldBalanceCard from "../components/GoldBalanceCard";
import GoldChart from "../components/GoldChart";
import TransactionCard from "../components/TransactionCard";
import { useWallet } from "../hooks/query-hooks";

export default function HubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { refetch, isLoading, isError, data: walletData } = useWallet();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

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
    //TODO
  };

  const onViewAllTransactionsPress = () => {
    navigation.navigate("GoldWallet.TransactionsScreen");
  };

  useEffect(() => {
    if (isError) setIsErrorModalVisible(isError);
  }, [isError]);

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

  const NotificationIconColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);

  return (
    <Page insets={["bottom", "left", "right"]} backgroundColor="neutralBase-60">
      {isLoading ? (
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
          </Stack>
        </ContentContainer>
      )}
      <LoadingErrorNotification
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
        onRefresh={refetch}
      />
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
