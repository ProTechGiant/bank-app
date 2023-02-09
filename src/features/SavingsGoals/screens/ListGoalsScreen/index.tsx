import { compareAsc } from "date-fns";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import { AddGoalIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import GoalCard from "./GoalCard";
import useSavingsPots from "./use-savings-pots";

const MAX_GOALS = 4;
const OVERRIDE_ENABLE_CREATE_GOAL = true; // TODO!

export default function SavingsGoalsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { data, error } = useSavingsPots();

  useEffect(() => {
    if (null === error) return;

    Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  }, [error]);

  const handleOnCreateGoal = () => {
    navigation.navigate("SavingsGoals.CreateGoalScreen");
  };

  const handleOnBack = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  const handleOnPress = (SavingsPotId: string) => {
    navigation.navigate("SavingsGoals.GoalDetailsScreen", {
      SavingsPotId,
    });
  };

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    padding: theme.spacing["16p"],
    marginTop: theme.spacing["8p"],
    minHeight: 100,
    justifyContent: "center",
    borderRadius: theme.radii.extraSmall,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  }));

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-30"],
    height: 44,
    width: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  }));

  const savingsGoals = useMemo(
    () => data?.SavingsPots.sort((a, b) => compareAsc(new Date(a.CreatedDate), new Date(b.CreatedDate))) ?? [],
    [data]
  );

  return (
    <Page>
      <NavHeader withBackButton={true} onBackPress={handleOnBack} />
      <ScrollView>
        <ContentContainer>
          <Stack direction="vertical" gap="16p" align="stretch">
            <Typography.Text size="large" weight="bold">
              {t("SavingsGoals.SavingsGoalsScreen.title")}
            </Typography.Text>
            <View>
              <Stack align="stretch" direction="vertical" gap="8p">
                {savingsGoals.map(data => (
                  <GoalCard
                    key={data.SavingsPotId}
                    title={data.GoalName}
                    amountSaved={data.SavedAmount}
                    totalAmount={data.SavingsPots}
                    date={data.TargetDate}
                    onPress={() => handleOnPress(data.SavingsPotId)}
                  />
                ))}
              </Stack>
              {(OVERRIDE_ENABLE_CREATE_GOAL || (data !== undefined && savingsGoals.length <= MAX_GOALS - 1)) && (
                <Pressable onPress={handleOnCreateGoal}>
                  <View style={buttonStyle}>
                    <Stack direction="horizontal" gap="16p" align="center">
                      <View style={iconContainerStyle}>
                        <AddGoalIcon />
                      </View>
                      <Typography.Text color="primaryBase" size="callout" weight="medium">
                        {t("SavingsGoals.SavingsGoalsScreen.button")}
                      </Typography.Text>
                    </Stack>
                  </View>
                </Pressable>
              )}
            </View>
            <Typography.Text size="footnote" color="neutralBase" style={styles.instructionText}>
              {t("SavingsGoals.SavingsGoalsScreen.instructionText")}
            </Typography.Text>
          </Stack>
        </ContentContainer>
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  instructionText: {
    textAlign: "center",
  },
});
