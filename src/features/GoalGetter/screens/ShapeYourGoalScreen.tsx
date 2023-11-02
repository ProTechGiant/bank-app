import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

import { ProgressIndicator } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";

import { BalanceCard, ProductList, SliderProgressBar } from "../components";
import RiskType from "../components/RiskType";

export default function ShapeYourGoalScreen() {
  const { t } = useTranslation();

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
      <ScrollView style={{ flex: 1 }}>
        {/* TODO: replace with api data */}
        <BalanceCard goalAmount="23,400.00 SAR" goalDuration="12 Months" />
        <RiskType />
        {/* TODO: replace with api data */}
        <SliderProgressBar productId="11" />
        <ProductList />
      </ScrollView>
    </Page>
  );
}
