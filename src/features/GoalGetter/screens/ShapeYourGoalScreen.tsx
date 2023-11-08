import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

import { ProgressIndicator } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";

import { BalanceCard, ProductList, SliderProgressBar } from "../components";
import RiskType from "../components/RiskType";
// import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { useGoalGetterProducts } from "../hooks/query-hooks";
import { GoalGetterProduct } from "../types";

export default function ShapeYourGoalScreen() {
  const { t } = useTranslation();
  // TODO: add values from context with equations
  // const { setGoalContextState, TargetAmount, TargetDate, MonthlyContribution } = useGoalGetterContext();
  const { data: goalGetterProducts } = useGoalGetterProducts("12", "6000", "850");

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
          {/* TODO: replace static with equations calculation in separate PR after checking with BE team */}
          <BalanceCard goalAmount="23,400.00 SAR" goalDuration="12 Months" />
          <RiskType
            selectedRisk={selectedBox || goalGetterProducts.BestMatchRisk}
            onRiskPress={handleBoxPress}
            data={goalGetterProducts}
            bestMatchRisk={goalGetterProducts.BestMatchRisk}
          />
          <SliderProgressBar productList={getProductListByRiskId(selectedBox || goalGetterProducts.BestMatchRisk)} />
          <ProductList productList={getProductListByRiskId(selectedBox || goalGetterProducts.BestMatchRisk)} />
        </ScrollView>
      ) : null}
    </Page>
  );
}
