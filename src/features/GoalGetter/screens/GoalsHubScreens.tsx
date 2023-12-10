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

import cardBackgroundImage from "../assets/card-background-image.png";
import cardFooterBackground from "../assets/footer-background-image.png";
import footerCardImage from "../assets/footer-card-image.png";
import { OneTimeIcon, PercentageIcon, RoundUpIcon } from "../assets/icons";
import OverviewInfoCard from "../components/OverviewInfoCard";
import TransactionCard from "../components/TransactionCard";
import { GoalDetailsType } from "../utils";

export default function GoalsHubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [chartType, setChartType] = useState(TabsTypes.Week);
  const { data: chartData } = useGoldPerformance(chartType);
  const insets = useSafeAreaInsets();

  const updateChartType = (type: any) => {
    setChartType(type);
  };

  const openDetailsHandler = () => {
    // TODO will be nagigate when the next screen created
  };

  const handleOnCollectButtonPress = () => {
    navigation.navigate("GoalGetter.GoalSummaryScreen");
  };

  const onViewAllTransactionsPress = () => {
    // TODO will be nagigate when the next screen created
    // navigation.navigate("");
  };

  const handleOnHeaderIconPress = () => {
    navigation.navigate("GoalGetter.GoalGetterStack", {
      screen: "GoalGetter.GoalManagementDetails",
      params: {
        // TODO mock details type
        goalType: GoalDetailsType.GOLD,
      },
    });
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
    paddingVertical: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["16p"],
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
  }));

  const collectExtendContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page insets={["bottom", "left", "right"]} backgroundColor="neutralBase-60">
      <ScrollView>
        <Stack direction="vertical" align="stretch" style={balanceCardContainer}>
          <ImageBackground source={cardBackgroundImage} style={styles.cardBackground} resizeMode="cover">
            {/* TODO title will replace actuall data once integrate with api */}
            <NavHeader
              title="Rainy Day"
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
                      {/* TODO will replace actuall data once integrate with api */}
                      50,400.00 SR
                    </Typography.Text>
                  </Stack>
                  <Stack direction="vertical" align="flex-end" gap="8p">
                    <Typography.Text size="caption1" color="neutralBase-60">
                      {t("GoalGetter.GoalsHubScreen.targetDate")}
                    </Typography.Text>
                    <Typography.Text size="caption1" color="neutralBase-60" style={targetDateValueStyle}>
                      {/* TODO will replace actuall data once integrate with api */}
                      01 May 2023
                    </Typography.Text>
                  </Stack>
                </Stack>
                <Stack direction="horizontal" justify="space-between" style={currentvalueStyle}>
                  <Stack direction="vertical" gap="8p">
                    <Typography.Text size="caption1" color="neutralBase-60">
                      {t("GoalGetter.GoalsHubScreen.currentValue")}
                    </Typography.Text>
                    <Typography.Text size="title3" weight="bold" color="neutralBase-60">
                      {/* TODO will replace actuall data once integrate with api */}
                      50,400.00 SR
                    </Typography.Text>
                  </Stack>
                </Stack>
              </Stack>
              {/* TODO will be replaced once add progressBar */}
              <View style={styles.progressSectionStyle} />
              <Stack direction="horizontal">
                <ImageBackground source={cardFooterBackground} style={styles.footerBackgroundStyle} resizeMode="cover">
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
                </ImageBackground>
              </Stack>
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
              {/* TODO will replace actuall data once integrate with api */}
              12,000.00 SR
            </Typography.Text>
          </Stack>
          <Stack direction="vertical" style={infoBoxStyle} gap="8p">
            <Typography.Text size="footnote" weight="bold" color="neutralBase+30">
              {t("GoalGetter.GoalsHubScreen.totalGainLoss")}
            </Typography.Text>
            <Typography.Text size="caption1" weight="medium" color="neutralBase">
              {/* TODO will replace actuall data once integrate with api */}
              11,000.00 SR
            </Typography.Text>
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
        <View style={transactionHeaderStyle}>
          <GoldLineChart
            updateChartType={updateChartType}
            data={chartType === TabsTypes.FiveYears ? chartData?.MonthlyData : chartData?.DailyData}
            hasFiveYears={true}
          />
        </View>
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
            {/* TODO will replace actuall data once integrate with api */}
            {new Array(3).fill("").map(() => {
              return <TransactionCard openDetailsHandler={openDetailsHandler} />;
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
    width: "100%",
  },
  footerBackgroundStyle: {
    marginTop: 0,
    width: "100%",
  },
  progressSectionStyle: {
    height: 72,
    width: "100%",
  },
  row: {
    width: "100%",
  },
});
