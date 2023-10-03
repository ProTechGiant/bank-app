import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { PlusIcon } from "@/assets/icons";
import { RefreshSection } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { EmptyError, GoalCard } from "../components/";
import { useGetCustomerGoals } from "../hooks/query-hooks";

export default function GoalDashboardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState<"Goals" | "Products">("Goals");
  const { data: customerGoals, isLoading, isError, refetch } = useGetCustomerGoals();
  const { width } = useWindowDimensions();

  const handleOnPress = () => {
    navigation.navigate("GoalGetter.GoalMindScreen");
  };

  const handleOnBackPress = () => {
    navigation.navigate("Home.HomeTabs");
  };

  const segmentedControlStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const scrollViewStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: 0,
    marginTop: theme.spacing["24p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette.primaryBase);

  const stackStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
    marginBottom: theme.spacing["64p"],
  }));

  const refreshStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const loadingContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderRadius: theme.radii.small,
      height: width - theme.spacing["64p"],
      width: width - theme.spacing["64p"],
      justifyContent: "center",
    }),
    [width]
  );

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader title={t("GoalGetter.GoalDashboardScreen.title")} onBackPress={handleOnBackPress} />

      <View style={segmentedControlStyle}>
        <SegmentedControl onPress={value => setCurrentTab(value)} value={currentTab}>
          <SegmentedControl.Item value="Goals">{t("GoalGetter.GoalDashboardScreen.tabs.goal")}</SegmentedControl.Item>
          <SegmentedControl.Item value="Products">
            {t("GoalGetter.GoalDashboardScreen.tabs.product")}
          </SegmentedControl.Item>
        </SegmentedControl>
      </View>

      <ContentContainer isScrollView style={scrollViewStyle}>
        {isLoading ? (
          <View style={loadingContainerStyle}>
            <ActivityIndicator />
          </View>
        ) : isError ? (
          <View style={styles.errorContainerStyle}>
            <EmptyError
              variant="error"
              title={t("GoalGetter.GoalDashboardScreen.errors.title")}
              message={t("GoalGetter.GoalDashboardScreen.errors.message")}
              isVisible={true}
              buttons={{
                primary: (
                  <Button variant="secondary" onPress={() => refetch()}>
                    {t("GoalGetter.GoalDashboardScreen.errors.buttonReload")}
                  </Button>
                ),
              }}
            />
          </View>
        ) : customerGoals?.Goals ? (
          customerGoals.Goals.map(goal => {
            return goal.FetchingStatus === "SUCCESS" ? (
              <GoalCard
                key={goal.GoalId}
                goalName={goal.Name}
                currentBalance={goal.CurrentBalance}
                targetAmount={goal.TargetAmount}
                targetDate={goal.TargetDate}
                goalImage={goal.Image}
                productName={goal.ProductName}
                productColor={goal.ProductColor}
                productRisk={goal.ProductRisk}
                productRiskColor={goal.ProductRiskColor}
                goalPercentageStatus={goal.GoalPercentageStatus}
                goalPercentageAmount={goal.ShortFallStatus === "Y" ? goal.ShortFallValue : 0}
              />
            ) : (
              <View style={refreshStyle}>
                <RefreshSection
                  hint={t("GoalGetter.GoalDashboardScreen.refreshSection.hint", { goalName: goal.Name })}
                  hasIcon={true}
                  hasBorder={true}
                  onRefreshPress={refetch}
                />
              </View>
            );
          })
        ) : null}

        {isError ? (
          <Stack direction="vertical" gap="24p" align="center" style={stackStyle}>
            <Typography.Text color="neutralBase+10" align="center" size="footnote" weight="regular">
              {t("GoalGetter.GoalDashboardScreen.hint")}
            </Typography.Text>
            {customerGoals && customerGoals.CreationGoalAvailability === "Y" ? (
              <View style={styles.buttonContainerStyle}>
                <Button
                  onPress={handleOnPress}
                  variant="secondary"
                  size="regular"
                  iconLeft={<PlusIcon color={iconColor} />}>
                  {t("GoalGetter.GoalDashboardScreen.setNewGoal")}
                </Button>
              </View>
            ) : null}
          </Stack>
        ) : null}
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  buttonContainerStyle: {
    minWidth: "20%",
  },
  errorContainerStyle: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
