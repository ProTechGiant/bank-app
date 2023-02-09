import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { AddGoalIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import GoalCard from "./GoalCard";
import useGetSavingsGoals from "./use-get-savings-goals";

const MAX_GOALS = 4;

export default function SavingsGoalsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { data, error } = useGetSavingsGoals();

  useEffect(() => {
    if (error) {
      Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  }, [error]);

  const handleOnSetGoal = () => {
    navigation.navigate("SavingsGoals.CreateGoalScreen");
  };

  const handleOnBack = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  const buttonStyle = useThemeStyles<ViewStyle>(
    theme => ({
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
    }),
    []
  );
  const iconContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-30"],
      height: 44,
      width: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    }),
    []
  );

  return (
    <Page>
      <NavHeader withBackButton={true} onBackPress={handleOnBack} />
      <ContentContainer>
        <Stack direction="vertical" gap="16p" align="stretch">
          <Typography.Text size="large" weight="bold">
            {t("SavingsGoals.SavingsGoalsScreen.title")}
          </Typography.Text>
          <View>
            {data?.SavingsPots.map(data => (
              <GoalCard
                key={data.SavingsPotId}
                title={data.GoalName}
                amountSaved={data.SavedAmount}
                totalAmount={data.SavingsPots}
                date={data.TargetDate}
              />
            ))}
            {data !== undefined && data.SavingsPots.length <= MAX_GOALS - 1 && (
              <Pressable onPress={handleOnSetGoal}>
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
    </Page>
  );
}

const styles = StyleSheet.create({
  instructionText: {
    textAlign: "center",
  },
});
