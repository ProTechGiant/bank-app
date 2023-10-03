import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { HeaderTitle, PredefinedOptionsList } from "../components";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { usePredfinedRisks } from "../hooks/query-hooks";

export default function RisksAppetiteScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { riskId, setGoalContextState, predefinedGoalId } = useGoalGetterContext();
  const [selectedPredefinedRiskId, setSelectedPredefinedRiskId] = useState<number>(riskId);
  const { data } = usePredfinedRisks(predefinedGoalId);

  const handleOnSelectPredefinedRisk = (value: number) => {
    setSelectedPredefinedRiskId(value);
  };

  const handleOnPressContinue = () => {
    setGoalContextState({ riskId: selectedPredefinedRiskId });
    navigation.navigate("GoalGetter.MatchProductsScreen");
  };

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
    flex: 1,
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader
        title={
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={3} totalStep={5} />
          </View>
        }
        onBackPress={handleOnBackPress}
        end={<NavHeader.CloseEndButton onPress={handleOnBackPress} />}
      />
      <Stack direction="vertical" style={contentStyle} align="stretch" gap="16p">
        <HeaderTitle
          headerText={t("GoalGetter.RisksAppetiteScreen.headerText")}
          headerDescriptionText={t("GoalGetter.RisksAppetiteScreen.headerDescriptionText")}
        />
        <PredefinedOptionsList
          predefinedOptionList={data?.Predefined}
          onSelectPredefindOption={handleOnSelectPredefinedRisk}
          predefinedValue={selectedPredefinedRiskId}
        />
        <Button onPress={handleOnPressContinue} disabled={selectedPredefinedRiskId === 0}>
          {t("GoalGetter.RisksAppetiteScreen.buttonText")}
        </Button>
      </Stack>
    </Page>
  );
}
const styles = StyleSheet.create({
  progressIndicator: { width: "80%" },
});
