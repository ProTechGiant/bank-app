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
import { usePredfinedGoals } from "../hooks/query-hooks";

export default function GoalMindScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { data } = usePredfinedGoals();
  const { predefinedGoalId, setGoalContextState } = useGoalGetterContext();
  const [selectedPredefinedGoalId, setSelectedPredefinedGoalId] = useState<number>(predefinedGoalId);

  const handleOnSelectPredefinedGoal = (value: number) => {
    setSelectedPredefinedGoalId(value);
  };

  const handleOnPressCreateGoal = () => {
    const selectedPredefinedGoalIndex = data?.Predefined.findIndex(element => element.Id === selectedPredefinedGoalId);
    if (selectedPredefinedGoalIndex !== undefined) {
      setGoalContextState({
        predefinedGoalId: selectedPredefinedGoalId,
        predefinedGoalName: data?.Predefined[selectedPredefinedGoalIndex].Name,
        goalImage: data?.Predefined[selectedPredefinedGoalIndex].Default_Image,
      });
      navigation.navigate("GoalGetter.CreateGoalScreen");
    }
  };

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnPressEndButton = () => {
    navigation.navigate("Home.HomeTabs");
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
    flex: 1,
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader
        title={t("GoalGetter.GoalMindScreen.title")}
        onBackPress={handleOnBackPress}
        end={<NavHeader.CloseEndButton onPress={handleOnPressEndButton} />}
        withBackButton={true}
      />
      <Stack direction="vertical" style={contentStyle} align="stretch" gap="16p" justify="space-between">
        <HeaderTitle
          headerText={t("GoalGetter.GoalMindScreen.headerText")}
          headerDescriptionText={t("GoalGetter.GoalMindScreen.headerDescriptionText")}
        />
        <PredefinedOptionsList
          predefinedOptionList={data?.Predefined}
          onSelectPredefindOption={handleOnSelectPredefinedGoal}
          predefinedValue={selectedPredefinedGoalId}
        />
        <Button onPress={handleOnPressCreateGoal} disabled={selectedPredefinedGoalId === 0}>
          {t("GoalGetter.GoalMindScreen.buttonText")}
        </Button>
      </Stack>
    </Page>
  );
}
