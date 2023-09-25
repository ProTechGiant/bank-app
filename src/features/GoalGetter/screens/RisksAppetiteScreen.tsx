import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { HeaderTitle, PredefinedOptionsList } from "../components";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { RISK_APPETITE } from "../mocks/mockRiskAppetite";
//////TODO: Replace MockData with API response data

export default function RisksAppetiteScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { riskId, setGoalContextState } = useGoalGetterContext();
  const [selectedPredefinedRiskId, setSelectedPredefinedRiskId] = useState<number>(riskId);

  const handleOnSelectPredefinedRisk = (value: number) => {
    setSelectedPredefinedRiskId(value);
  };

  const handleOnPressContinue = () => {
    setGoalContextState({ riskId: selectedPredefinedRiskId });
    //TODO: Navigate to next screen after select Risk
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
        title={t("GoalGetter.RisksAppetiteScreen.headerText")}
        onBackPress={handleOnBackPress}
        end={<NavHeader.CloseEndButton onPress={handleOnBackPress} />}
      />
      <Stack direction="vertical" style={contentStyle} align="stretch" gap="16p">
        <HeaderTitle
          headerText={t("GoalGetter.RisksAppetiteScreen.headerText")}
          headerDescriptionText={t("GoalGetter.RisksAppetiteScreen.headerDescriptionText")}
        />
        <PredefinedOptionsList
          predefinedOptionList={RISK_APPETITE}
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
