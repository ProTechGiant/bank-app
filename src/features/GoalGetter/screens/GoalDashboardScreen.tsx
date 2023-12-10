import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, useWindowDimensions, View, ViewStyle } from "react-native";

import { GoldWalletSection } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CircledAddIcon } from "../assets/icons";
import { DashboardHeader, GoalCard, MutualFundSection, PendingGoalCard } from "../components/";
import { ProductTypeName } from "../types";
import { CUSTOMER_GOALS, PENDING_GOALS } from "./mock";

export default function GoalDashboardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState<"Goals" | "Products">("Goals");

  //TODO remove mock once finished by BE team
  const customerGoals = CUSTOMER_GOALS;
  const pendingGoals = PENDING_GOALS;
  const isLoading = false;

  const { width } = useWindowDimensions();

  const handleOnBackPress = () => {
    navigation.navigate("Home.HomeTabs");
  };

  const handleOnAddGoalPress = () => {
    //TODO change this and put it in the details page
    navigation.navigate("GoalGetter.EditGoalScreen", {
      goalName: "Rainy Day",
      targetAmount: 500,
      targetDate: new Date(),
      goalId: 1,
    });
  };

  const handleOnViewTasksPress = (type: ProductTypeName, name: string) => {
    //TODO use this name in navigation
    console.log(name);
    if (type === ProductTypeName.SAVING_POT) {
    } else if (type === ProductTypeName.GOLD) {
      navigation.navigate("GoalGetter.GoldPending");
    } else {
      navigation.navigate("GoalGetter.MutualFundPending");
    }
  };

  const handleOnGoldWalletSectionPress = () => {
    navigation.navigate("GoldWallet.GoldWalletStack");
  };

  const segmentedControlStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.spacing["64p"],
    borderColor: "black",
    backgroundColor: theme.palette["neutralBase-40"],
    justifyContent: "space-around",
    margin: theme.spacing["20p"],
  }));

  const scrollViewStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingBottom: theme.spacing["48p"],
    marginTop: theme.spacing["24p"],
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
      <NavHeader
        title={t("GoalGetter.GoalDashboardScreen.title")}
        onBackPress={handleOnBackPress}
        end={
          <NavHeader.IconEndButton icon={<CircledAddIcon width={36} height={36} />} onPress={handleOnAddGoalPress} />
        }
        variant="white"
        backgroundColor="#1E1A25"
      />
      <DashboardHeader username="Reema" />

      <SegmentedControl onPress={value => setCurrentTab(value)} value={currentTab} style={segmentedControlStyle}>
        <SegmentedControl.Item withUnderline={false} value="Goals">
          {t("GoalGetter.GoalDashboardScreen.tabs.goal")}
        </SegmentedControl.Item>
        <SegmentedControl.Item value="Products" withUnderline={false}>
          {t("GoalGetter.GoalDashboardScreen.tabs.product")}
        </SegmentedControl.Item>
      </SegmentedControl>

      <ContentContainer isScrollView style={scrollViewStyle}>
        {currentTab === "Goals" ? (
          isLoading ? (
            <View style={loadingContainerStyle}>
              <ActivityIndicator />
            </View>
          ) : (
            <>
              {pendingGoals !== undefined && pendingGoals.length !== 0
                ? pendingGoals.map(goal => (
                    <PendingGoalCard
                      onPress={() => handleOnViewTasksPress(goal.type, goal.name)}
                      key={goal.name}
                      name={goal.name}
                      completed={goal.completed}
                      total={goal.total}
                    />
                  ))
                : null}
              {customerGoals !== undefined && customerGoals.length !== 0
                ? customerGoals.map(goal => (
                    <GoalCard
                      key={goal.name}
                      name={goal.name}
                      percentage={goal.percentage}
                      totalAmount={goal.totalAmount}
                      dueDate={goal.dueDate}
                      imageUri={goal.imageUri}
                    />
                  ))
                : null}
            </>
          )
        ) : (
          <>
            {/* TODO remove the total amount dummy data */}
            <MutualFundSection totalAmount={23450} />
            <Typography.Text size="title2">{t("GoalGetter.GoalDashboardScreen.otherProducts")}</Typography.Text>
            <GoldWalletSection
              onPress={handleOnGoldWalletSectionPress}
              testID="Home.DashboardScreen:MoneySpendCategory"
            />
          </>
        )}
      </ContentContainer>
    </Page>
  );
}
