import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { PlusIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { GoalCard } from "../components/";
import mockGoals from "../mocks/mockGoals"; //TODO - remove mockObject when api is ready

export default function GoalDashboardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState<"Goals" | "Products">("Goals");

  const handleOnPress = () => {
    //TODO - handle navigation
  };

  const handleOnBackPress = () => {
    navigation.goBack();
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
        {mockGoals.Goals.map(goal => {
          return (
            <GoalCard
              key={goal.GoalId}
              goalName={goal.GoalName}
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
          );
        })}

        <Stack direction="vertical" gap="24p" align="center" style={stackStyle}>
          <Typography.Text color="neutralBase+10" align="center" size="footnote" weight="regular">
            {t("GoalGetter.GoalDashboardScreen.hint")}
          </Typography.Text>
          {mockGoals.CreationGoalAvailability === "Y" ? (
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
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  buttonContainerStyle: {
    minWidth: "20%",
  },
});
