import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ImageBackground, Platform, Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { ThreeDotsVerticalIcon } from "@/assets/icons";
import GoldLineChart from "@/components/GoldLineChart";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useGoldPerformance from "@/hooks/use-gold-performance";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TabsTypes } from "@/types/GoldChart";
import { formatCurrency } from "@/utils";

import cardFooterBackground from "../assets/footer-background-image.png";
import footerCardImage from "../assets/footer-card-image.png";
import { OneTimeIcon, PercentageIcon, RaiseArrowIcon, RectangleIcon, RoundUpIcon } from "../assets/icons";
import { ProgressBar } from "../components";
import OverviewInfoCard from "../components/OverviewInfoCard";
import TransactionCard from "../components/TransactionCard";
import { GoalGetterStackParams } from "../GoalGetterStack";
import { useGoalDetails, useGoldTransaction } from "../hooks/query-hooks";
import { ProductTypeName, TransactionType } from "../types";

export default function GoalsHubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [chartType, setChartType] = useState(TabsTypes.Week);
  const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.GoalsHubScreen">>();
  const { goalId, goalName, productType, goalImage } = params; // TODO  goalName missing from details screen  so it should be deleted from here and also from screen params type
  const { data: goalDetails } = useGoalDetails(goalId, productType);
  const { data: transactions } = useGoldTransaction(goalId, 3);
  const { data: chartData } = useGoldPerformance(chartType);
  const insets = useSafeAreaInsets();

  const updateChartType = (type: any) => {
    setChartType(type);
  };

  const openDetailsHandler = (transaction: TransactionType) => {
    navigation.navigate("GoalGetter.TransactionsDetailsModal", {
      transaction,
    });
  };

  const handleOnCollectButtonPress = () => {
    if (goalDetails) {
      navigation.navigate("GoalGetter.GoalSummaryScreen", {
        goal: goalDetails,
        productType,
        goalImage,
        goalName,
        goalId,
      });
    }
  };

  const onViewAllTransactionsPress = () => {
    navigation.navigate("GoalGetter.TransactionsScreen", {
      goalId,
    });
  };

  const handleOnHeaderIconPress = () => {
    if (goalDetails) {
      navigation.navigate("GoalGetter.GoalGetterStack", {
        screen: "GoalGetter.GoalManagementDetails",
        params: {
          goalType: productType,
          goal: goalDetails,
          goalImage,
          goalName,
          goalId,
        },
      });
    }
  };

  const overViewData = [
    {
      title: t("GoalGetter.GoalsHubScreen.roundUps"),
      Icon: <RoundUpIcon />,
      backgroundColor: "#D8F3EF", // TODO color doesnot exist in theme
    },
    {
      title: t("GoalGetter.GoalsHubScreen.recurring"),
      Icon: <RoundUpIcon />,
      backgroundColor: "#DEEDC4", // TODO color doesnot exist in theme
    },
    {
      title: t("GoalGetter.GoalsHubScreen.percentage"),
      Icon: <PercentageIcon />,
      backgroundColor: "#DFD8F3", // TODO color doesnot exist in theme
    },
    {
      title: t("GoalGetter.GoalsHubScreen.onetime"),
      Icon: <OneTimeIcon />,
      backgroundColor: "#E3E0BF", // TODO color doesnot exist in theme
    },
  ];

  const balanceCardContainer = useThemeStyles<ViewStyle>(() => ({
    position: "relative",
    height: Platform.OS === "android" ? 300 : 300 + insets.top,
  }));

  const rowHorizontalStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
  }));
  const transactionsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["20p"],
    marginTop: theme.spacing["20p"],
  }));

  const infoContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    marginBottom: theme.spacing["20p"],
    height: 117,
  }));

  const targetDateValueStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["4p"],
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)", // TODO doesnot exist in theme
    paddingHorizontal: theme.spacing["8p"],
    borderRadius: theme.radii.small,
    backgroundColor: "rgba(255, 255, 255, 0.10)", // TODO doesnot exist in theme
  }));

  const currentvalueStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 2,
    borderColor: "#fff", // TODO doesnot exist in theme
    borderRadius: theme.radii.xlarge, // TODO doesnot exist in theme
    width: 108,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  }));

  const infoBoxContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    padding: theme.spacing["20p"],
  }));

  const infoBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "45%",
    backgroundColor: "#FFF", // TODO doesnot exist in theme
    padding: theme.spacing["12p"],
    borderRadius: theme.radii.small,
  }));

  const transactionHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["20p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.medium,
    padding: theme.spacing["16p"],
  }));

  const collectExtendContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["4p"],
  }));

  const chartSubTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["8p"],
    paddingBottom: theme.spacing["12p"],
  }));

  const progressBarContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page insets={["bottom", "left", "right"]} backgroundColor="neutralBase-60">
      <ScrollView>
        <Stack direction="vertical" align="stretch" style={balanceCardContainer}>
          <ImageBackground source={{ uri: goalImage }} style={styles.cardBackground} resizeMode="cover">
            <NavHeader
              title={goalName}
              variant="white"
              end={<NavHeader.IconEndButton icon={<ThreeDotsVerticalIcon />} onPress={handleOnHeaderIconPress} />}
            />
            <SafeAreaView edges={["top"]}>
              <Stack direction="vertical" style={infoContainerStyle}>
                <Stack direction="horizontal" justify="space-between" style={styles.row}>
                  <Stack direction="vertical" justify="space-between" gap="8p">
                    <Typography.Text size="caption1" color="neutralBase-60">
                      {t("GoalGetter.GoalsHubScreen.targetAmount")}
                    </Typography.Text>
                    <Typography.Text size="title3" weight="bold" color="neutralBase-60">
                      {goalDetails?.TargetAmount && formatCurrency(goalDetails.TargetAmount, "SAR")}
                    </Typography.Text>
                  </Stack>
                  <Stack direction="vertical" align="flex-end" gap="8p">
                    <Typography.Text size="caption1" color="neutralBase-60">
                      {t("GoalGetter.GoalsHubScreen.targetDate")}
                    </Typography.Text>
                    <Typography.Text size="caption1" color="neutralBase-60" style={targetDateValueStyle}>
                      {goalDetails?.TargetAmount && formatCurrency(goalDetails.TargetAmount, "SAR")}
                    </Typography.Text>
                  </Stack>
                </Stack>
                <Stack direction="horizontal" justify="space-between" style={currentvalueStyle}>
                  <Stack direction="vertical" gap="8p">
                    <Typography.Text size="caption1" color="neutralBase-60">
                      {t("GoalGetter.GoalsHubScreen.currentValue")}
                    </Typography.Text>
                    <Typography.Text size="title3" weight="bold" color="neutralBase-60">
                      {goalDetails?.CurrentValue && formatCurrency(goalDetails?.CurrentValue, "SAR")}
                    </Typography.Text>
                  </Stack>
                </Stack>
              </Stack>
              <ImageBackground source={cardFooterBackground} style={styles.footerBackgroundStyle} resizeMode="cover">
                <Stack direction="vertical" gap="20p" style={progressBarContainerStyle}>
                  <ProgressBar percentage={goalDetails?.GoalPercentageStatus ?? 0} />
                  <Stack direction="vertical" style={collectExtendContainer}>
                    <Stack direction="horizontal" gap="20p">
                      <Pressable style={buttonContainerStyle} onPress={handleOnCollectButtonPress}>
                        <Typography.Text size="footnote" weight="medium" color="neutralBase-60">
                          ${"  "}
                          {t("GoalGetter.GoalsHubScreen.collect")}
                        </Typography.Text>
                      </Pressable>
                      <Pressable style={buttonContainerStyle}>
                        <Typography.Text size="footnote" weight="medium" color="neutralBase-60">
                          +{"  "}
                          {t("GoalGetter.GoalsHubScreen.extend")}
                        </Typography.Text>
                      </Pressable>
                    </Stack>
                  </Stack>
                </Stack>
              </ImageBackground>
            </SafeAreaView>
          </ImageBackground>
        </Stack>
        <Image source={footerCardImage} style={styles.cardBackgroundImage} />
        <Stack direction="horizontal" justify="space-between" style={infoBoxContainerStyle}>
          <Stack direction="vertical" style={infoBoxStyle} gap="8p">
            <Typography.Text size="footnote" weight="bold" color="neutralBase+30">
              {t("GoalGetter.GoalsHubScreen.investedAmount")}
            </Typography.Text>
            <Typography.Text size="caption1" weight="medium" color="neutralBase">
              {goalDetails?.InvestedAmount && formatCurrency(goalDetails?.InvestedAmount, "SAR")}
            </Typography.Text>
          </Stack>
          <Stack direction="vertical" style={infoBoxStyle} gap="8p">
            <Typography.Text size="footnote" weight="bold" color="neutralBase+30">
              {t("GoalGetter.GoalsHubScreen.totalGainLoss")}
            </Typography.Text>
            <Stack direction="horizontal" justify="space-between" align="center">
              <Typography.Text size="caption1" weight="medium" color="neutralBase">
                {goalDetails?.ProfitLoss && formatCurrency(goalDetails?.ProfitLoss, "SAR")} {"   "} <RaiseArrowIcon />
              </Typography.Text>
              <Typography.Text size="caption1" weight="medium" color="successBase-10">
                {"  "}+{goalDetails?.GoldProfitLoss} %
              </Typography.Text>
            </Stack>
          </Stack>
        </Stack>
        {/* TODO false will be added remove and add another condition , with style  */}
        {false && (
          <Stack direction="horizontal" justify="space-between" align="flex-start">
            {overViewData.map((item, index) => {
              return <OverviewInfoCard key={index} {...item} />;
            })}
          </Stack>
        )}
        {productType === ProductTypeName.GOLD || productType === ProductTypeName.MUTUAL_FUND ? (
          <View style={transactionHeaderStyle}>
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {productType === ProductTypeName.GOLD
                ? t("GoalGetter.GoalsHubScreen.goldMarketPerformance")
                : t("GoalGetter.GoalsHubScreen.fundMarketPerformance")}
            </Typography.Text>
            <Typography.Text color="primaryBase-50" size="footnote" weight="bold" style={chartSubTitleStyle}>
              <RectangleIcon /> % 16.70+
            </Typography.Text>
            <GoldLineChart
              updateChartType={updateChartType}
              data={chartType === TabsTypes.FiveYears ? chartData?.MonthlyData : chartData?.DailyData}
              hasFiveYears={true}
            />
          </View>
        ) : null}
        <Stack direction="vertical" align="stretch">
          <Stack direction="horizontal" align="center" justify="space-between" style={transactionsContainerStyle}>
            <Typography.Text color="neutralBase+30" size="title3" weight="bold">
              {t("GoalGetter.GoalsHubScreen.transactions")}
            </Typography.Text>
            <Pressable onPress={onViewAllTransactionsPress}>
              <Typography.Text color="successBase" size="footnote" weight="regular">
                {t("GoalGetter.GoalsHubScreen.viewAll")}
              </Typography.Text>
            </Pressable>
          </Stack>
          <View style={rowHorizontalStyle}>
            {transactions &&
              transactions.map(item => {
                return (
                  <TransactionCard
                    transaction={item}
                    key={item.TransactionId}
                    openDetailsHandler={() => openDetailsHandler(item)}
                  />
                );
              })}
          </View>
        </Stack>
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  cardBackground: {
    height: "100%",
    width: "100%",
  },
  cardBackgroundImage: {
    height: 56,
    width: "100%",
  },
  footerBackgroundStyle: {
    height: 86,
    marginTop: 0,
    width: "100%",
  },
  row: {
    width: "100%",
  },
});
