import { useState } from "react";
import { ScrollView } from "react-native";

import CustomStatusBar from "@/components/CustomStatusBar/CustomStatusBar";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

import { BalanceCard, ProductList, SliderProgressBar } from "../components";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { useGoalGetterProducts } from "../hooks/query-hooks";
import { GoalGetterProduct } from "../types";
import { getMonthsFromToday } from "../utils";

export default function ShapeYourGoalScreen() {
  const { TargetAmount, TargetDate, MonthlyContribution } = useGoalGetterContext();

  const { data: goalGetterProducts } = useGoalGetterProducts(
    `${getMonthsFromToday(TargetDate)}`,
    `${TargetAmount || ""}`,
    `${MonthlyContribution || ""}`
  );

  const [selectedBox, setSelectedBox] = useState<number | undefined>(goalGetterProducts?.BestMatchRisk);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBoxPress = (id: number) => {
    setSelectedBox(id);
  };

  const getProductListByRiskId = (riskId: number | undefined): GoalGetterProduct[] | undefined => {
    if (goalGetterProducts) {
      for (const risk of goalGetterProducts.Risks) {
        if (risk.Id === riskId) {
          return risk.Products;
        }
      }
    }
  };
  const statusBarColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Page insets={["bottom", "left", "right"]} backgroundColor="neutralBase-60">
      <CustomStatusBar backgroundColor={statusBarColor} barStyle="light-content" />
      {goalGetterProducts !== undefined ? (
        <ScrollView style={{ flex: 1 }}>
          <BalanceCard
            goalDuration={getMonthsFromToday(TargetDate)}
            monthlyContribution={MonthlyContribution || 0}
            updateBoxPressHandler={() => {
              // TODO updateBoxPressHandler
            }}
          />

          <SliderProgressBar
            monthlyContribution={goalGetterProducts.MonthlyContribution}
            productList={getProductListByRiskId(selectedBox || goalGetterProducts.BestMatchRisk)}
          />
          <ProductList productList={getProductListByRiskId(selectedBox || goalGetterProducts.BestMatchRisk)} />
        </ScrollView>
      ) : (
        <FlexActivityIndicator />
      )}
    </Page>
  );
}
