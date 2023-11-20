import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

import { ProgressIndicator } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";

import { BalanceCard, ProductList, SliderProgressBar } from "../components";
import RiskType from "../components/RiskType";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { useGoalGetterProducts } from "../hooks/query-hooks";
import { GoalGetterProduct } from "../types";
import { getMonthsFromToday } from "../utils";

export default function ShapeYourGoalScreen() {
  const { t } = useTranslation();
  const { TargetAmount, TargetDate, MonthlyContribution } = useGoalGetterContext();
  const { data: goalGetterProducts } = useGoalGetterProducts(
    `${getMonthsFromToday(TargetDate) || ""}`,
    `${TargetAmount || ""}`,
    `${MonthlyContribution || ""}`
  );

  const [selectedBox, setSelectedBox] = useState<number | undefined>(goalGetterProducts?.BestMatchRisk);

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
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        variant="background"
        title={t("GoalGetter.ShapeYourGoalScreen.shapeYourGoal")}
        end={
          <NavHeader.CloseEndButton
            onPress={() => {
              // TODO: add navigation based on LLD
              return;
            }}
          />
        }
      />
      <ContentContainer style={{ flexGrow: 0 }}>
        <ProgressIndicator currentStep={2} totalStep={5} />
      </ContentContainer>
      {goalGetterProducts !== undefined ? (
        <ScrollView style={{ flex: 1 }}>
          <BalanceCard />
          <RiskType
            selectedRisk={selectedBox || goalGetterProducts.BestMatchRisk}
            onRiskPress={handleBoxPress}
            data={goalGetterProducts}
            bestMatchRisk={goalGetterProducts.BestMatchRisk}
          />
          <SliderProgressBar productList={getProductListByRiskId(selectedBox || goalGetterProducts.BestMatchRisk)} />
          <ProductList productList={getProductListByRiskId(selectedBox || goalGetterProducts.BestMatchRisk)} />
        </ScrollView>
      ) : (
        <FlexActivityIndicator />
      )}
    </Page>
  );
}
