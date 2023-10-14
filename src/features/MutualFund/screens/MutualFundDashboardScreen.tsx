import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { ChevronRightIcon, DotIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Chip from "@/components/Chip";
import Divider from "@/components/Divider";
import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

import { HeaderContent, MutualFundCustomChart, MutualFundDashboardHeaderContent } from "../components";
//TODO: This data will be repalced with data from API
import { CHART_DATA } from "../mocks/chartData";

export default function MutualFundDashboardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [selectedDuration, setSelectedDuration] = useState("");
  const durationArray = ["1D", "7D", "1M", "3M", "6M", "1Y"];

  const handleOnPressPortfolio = (portfolioName: string) => {
    navigation.navigate("MutualFund.PortfolioDetails", { portfolioName: portfolioName });
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    marginBottom: theme.spacing["20p"],
  }));

  const portfolioPerformanceStackStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["48p"],
  }));

  const headerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: Platform.OS === "android" ? -theme.spacing["4p"] : -theme.spacing["24p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <View style={headerContainerStyle}>
        <HeaderContent headerTitle={t("MutualFund.MutualFundDashboardScreen.headerTitle")} showInfoIndicator={false}>
          <MutualFundDashboardHeaderContent />
        </HeaderContent>
      </View>
      <ScrollView>
        <Stack direction="vertical" gap="20p" style={portfolioPerformanceStackStyle} align="stretch">
          <Stack direction="vertical" style={contentStyle} gap="20p">
            <Typography.Text size="title3" weight="medium">
              {t("MutualFund.MutualFundDashboardScreen.portfolioPerformanceSectionLabel")}
            </Typography.Text>
            <Stack direction="horizontal" gap="8p">
              {durationArray.map(duration => {
                return (
                  <Chip
                    key={duration}
                    onPress={() => setSelectedDuration(duration)}
                    title={duration}
                    isRemovable={false}
                    isSelected={duration === selectedDuration}
                  />
                );
              })}
            </Stack>
            <MutualFundCustomChart
              tickLabelsColor="#808080"
              gridStrokeColor="#F2F2F2"
              chartBorderColor="#E2E2E2"
              mutualFundCustomChartList={CHART_DATA}
            />
          </Stack>
          <Divider color="neutralBase-40" height={3} />
          <Stack direction="vertical" style={contentStyle} align="stretch">
            <Stack direction="vertical" gap="32p" align="stretch">
              {CHART_DATA.map(portfolio => {
                return (
                  <Pressable
                    key={portfolio.name}
                    onPress={() => {
                      handleOnPressPortfolio(portfolio.name);
                    }}>
                    <Stack direction="horizontal" justify="space-between" align="center">
                      <Stack direction="horizontal" gap="8p">
                        <DotIcon color={portfolio.color} />
                        <Typography.Text size="footnote" weight="medium">
                          {portfolio.name}
                        </Typography.Text>
                      </Stack>
                      <ChevronRightIcon color="#B3B3B3" />
                    </Stack>
                  </Pressable>
                );
              })}
            </Stack>
          </Stack>
        </Stack>
      </ScrollView>
    </Page>
  );
}
