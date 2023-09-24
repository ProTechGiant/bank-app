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
import { GOALS_IN_MIND } from "../mocks/mockGoalMind";
//////TODO: Replace MockData with API response data

export default function GoalMindScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [selectedPredefinedGoalId, setSelectedPredefinedGoalId] = useState<number>(0);

  const handleOnSelectPredefinedGoal = (value: number) => {
    setSelectedPredefinedGoalId(value);
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
        title={t("GoalGetter.GoalMindScreen.title")}
        onBackPress={handleOnBackPress}
        end={<NavHeader.CloseEndButton onPress={handleOnBackPress} />}
        withBackButton={true}
      />
      <Stack direction="vertical" style={contentStyle} align="stretch" gap="16p" justify="space-between">
        <HeaderTitle
          headerText={t("GoalGetter.GoalMindScreen.headerText")}
          headerDescriptionText={t("GoalGetter.GoalMindScreen.headerDescriptionText")}
        />
        <PredefinedOptionsList
          predefinedOptionList={GOALS_IN_MIND}
          onSelectPredefindOption={handleOnSelectPredefinedGoal}
          predefinedValue={selectedPredefinedGoalId}
        />
        <Button
          onPress={() => {
            // TODO : Navigate to next screen after select goal
          }}
          disabled={selectedPredefinedGoalId === 0}>
          {t("GoalGetter.GoalMindScreen.buttonText")}
        </Button>
      </Stack>
    </Page>
  );
}
