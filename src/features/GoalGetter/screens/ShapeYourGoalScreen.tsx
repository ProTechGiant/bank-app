import { useState } from "react";
import { ScrollView } from "react-native";

import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import Page from "@/components/Page";

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

  return (
    <Page insets={["bottom", "left", "right"]} backgroundColor="neutralBase-60">
      {goalGetterProducts !== undefined ? (
        <ScrollView style={{ flex: 1 }}>
          <BalanceCard goalDuration={getMonthsFromToday(TargetDate)} monthlyContribution={MonthlyContribution || 0} />

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
