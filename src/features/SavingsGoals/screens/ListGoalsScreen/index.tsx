import { compareAsc } from "date-fns";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { PlusIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useSavingsPots } from "../../query-hooks";
import BackgroundBottomStartSvg from "./background-bottom-start.svg";
import BackgroundTopEndSvg from "./background-top-end.svg";
import GoalCard from "./GoalCard";

const MAX_GOALS = 4;

export default function SavingsGoalsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { data, error } = useSavingsPots();

  useEffect(() => {
    if (error === null) return;

    Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  }, [error, navigation, t]);

  const handleOnCreateGoal = () => {
    navigation.navigate("SavingsGoals.CreateGoalScreen");
  };

  const handleOnBack = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  const handleOnPress = (PotId: string) => {
    navigation.navigate("SavingsGoals.GoalDetailsScreen", { PotId });
  };

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.radii.extraSmall,
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["20p"],
    rowGap: 2,
    justifyContent: "center",
    shadowColor: theme.palette.primaryBase,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.14,
    elevation: 5,
  }));

  const iconColor = useThemeStyles(theme => theme.palette.primaryBase);

  const savingsGoals = useMemo(
    () => data?.SavingsPots.sort((a, b) => compareAsc(new Date(a.CreatedDate), new Date(b.CreatedDate))) ?? [],
    [data]
  );

  return (
    <Page backgroundColor="neutralBase-60">
      <StatusBar backgroundColor="transparent" translucent />
      <View style={styles.backgroundTopEnd}>
        <BackgroundTopEndSvg />
      </View>
      <View style={styles.backgroundBottomStart}>
        <BackgroundBottomStartSvg />
      </View>
      <NavHeader onBackPress={handleOnBack} />
      <ContentContainer isScrollView>
        <Stack direction="vertical" gap="16p" align="stretch">
          <Typography.Text color="neutralBase+30" size="large" weight="bold">
            {t("SavingsGoals.SavingsGoalsScreen.title")}
          </Typography.Text>
          <View>
            <Stack align="stretch" direction="vertical" gap="8p">
              {savingsGoals.map(element => (
                <GoalCard
                  key={element.PotId}
                  title={element.GoalName}
                  amountSaved={element.AvailableBalanceAmount}
                  totalAmount={element.TargetAmount}
                  date={element.TargetDate}
                  onPress={() => handleOnPress(element.PotId)}
                />
              ))}
              {data !== undefined && savingsGoals.length <= MAX_GOALS - 1 ? (
                <Pressable onPress={handleOnCreateGoal} style={buttonStyle}>
                  <Stack align="center" direction="horizontal" gap="4p">
                    <PlusIcon color={iconColor} width={24} height={24} />
                    <Typography.Text color="primaryBase" size="callout" weight="medium">
                      {t("SavingsGoals.SavingsGoalsScreen.button")}
                    </Typography.Text>
                  </Stack>
                  <Typography.Text color="neutralBase" size="footnote" weight="regular">
                    {t("SavingsGoals.SavingsGoalsScreen.instructionText")}
                  </Typography.Text>
                </Pressable>
              ) : null}
            </Stack>
          </View>
        </Stack>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  backgroundBottomStart: {
    bottom: 0,
    position: "absolute",
    start: 0,
  },
  backgroundTopEnd: {
    end: 0,
    position: "absolute",
    top: 0,
  },
});
