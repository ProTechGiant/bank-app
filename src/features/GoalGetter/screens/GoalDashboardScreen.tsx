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
import { useGetCustomerGoals, useGoldWallet } from "../hooks/query-hooks";
import { Goal, GoalStatusEnum, ProductTypeName } from "../types";

export default function GoalDashboardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState<"Goals" | "Products">("Goals");
  const { data: customerGoals, isLoading } = useGetCustomerGoals();
  const { data: goldWalletData } = useGoldWallet();

  const pendingGoals = customerGoals?.filter(goal => goal.Status === GoalStatusEnum.PENDING);

  const { width } = useWindowDimensions();

  const handleOnBackPress = () => {
    navigation.navigate("Home.HomeTabs");
  };

  const handleOnAddGoalPress = () => {
    navigation.navigate("GoalGetter.ShapeGoalScreen");
  };

  const handleOnViewTasksPress = (goal: Goal) => {
    const type = goal.ProductType;
    if (type === ProductTypeName.SAVING_POT) {
    } else if (type === ProductTypeName.GOLD) {
      navigation.navigate("GoalGetter.GoldPending", {
        initialContribution: goal.PendingContribution?.Initial ?? 0,
        recurringContribution: goal.PendingContribution?.RecurringContribution ?? 0,
        recurringFrequency: goal.PendingContribution?.RecurringFrequency ?? "",
        goldToMoneyRatio: goldWalletData?.MarketBuyPrice ?? 120,
        walletId: goldWalletData?.WalletId ?? "",
        goalId: goal.GoalId,
      });
    } else {
      navigation.navigate("MutualFund.MutualFundStack", { screen: "MutualFund.MutualFundOnboardingScreen" });
    }
  };

  const OpenDetailsHandler = (
    goalId: number,
    goalName: string,
    productType: ProductTypeName,
    goalImage: string,
    ProductId: string
  ) => {
    navigation.navigate("GoalGetter.GoalsHubScreen", {
      goalId,
      goalName, // TODO missing from details screen  so it should be deleted from here and also from screen params type
      productType,
      goalImage,
      ProductId,
      accountNumber: goldWalletData?.AccountNumber ?? "",
    });
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
                      onPress={() => handleOnViewTasksPress(goal)}
                      key={goal.GoalId}
                      name={goal.Name}
                      completed={0}
                      total={goal.PendingTask || 1}
                    />
                  ))
                : null}
              {customerGoals !== undefined && customerGoals.length !== 0
                ? customerGoals
                    .filter(item => item.Status !== GoalStatusEnum.PENDING)
                    .map(goal => (
                      <GoalCard
                        key={goal.GoalId}
                        name={goal.Name}
                        percentage={goal.GoalPercentageStatus ?? 0}
                        totalAmount={goal.TargetAmount}
                        amountLeft={goal.AmountLeft}
                        timeLeft={goal.TimeLeft}
                        imageUri={goal.Image}
                        handleOnCardPress={() =>
                          OpenDetailsHandler(goal.GoalId, goal.Name, goal.ProductType, goal.Image, goal.ProductId)
                        }
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
