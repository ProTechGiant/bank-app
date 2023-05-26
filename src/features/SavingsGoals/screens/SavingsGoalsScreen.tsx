import { RouteProp, useRoute } from "@react-navigation/native";
import { compareAsc } from "date-fns";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, I18nManager, Pressable, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { PlusIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useToasts } from "@/contexts/ToastsContext";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import BackgroundBottomStartSvg from "../assets/background-bottom-start.svg";
import BackgroundTopEndSvg from "../assets/background-top-end.svg";
import { GoalCard } from "../components";
import { useSavingsPots } from "../hooks/query-hooks";

export default function SavingsGoalsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<MainStackParams, "SavingsGoals.SavingsGoalsScreen">>();
  const addToast = useToasts();
  const { data, error } = useSavingsPots();

  useEffect(() => {
    if (error) {
      Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    }

    if (route.params !== undefined) {
      addToast({ variant: "confirm", message: t("SavingsGoals.SavingsGoalsScreen.notifications.goalClosed") });
    }
  }, [error, navigation, route.params, t, addToast]);

  const handleOnCreateGoal = () => {
    navigation.navigate("SavingsGoals.CreateGoalScreen");
  };

  const handleOnBack = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["20p"],
    rowGap: 2,
    justifyContent: "center",
  }));

  const iconColor = useThemeStyles(theme => theme.palette.primaryBase);

  const savingsGoals = useMemo(
    () => data?.SavingsPots.sort((a, b) => compareAsc(new Date(a.CreatedDate), new Date(b.CreatedDate))) ?? [],
    [data]
  );

  const handleOnPress = (PotId: string) => {
    navigation.navigate("SavingsGoals.GoalDetailsScreen", { PotId });
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <StatusBar backgroundColor="transparent" translucent />
      <View style={styles.backgroundTopEnd}>
        <BackgroundTopEndSvg />
      </View>
      <View style={styles.backgroundBottomStart}>
        <BackgroundBottomStartSvg />
      </View>
      <NavHeader title={t("SavingsGoals.SavingsGoalsScreen.navTitle")} onBackPress={handleOnBack} />
      <ContentContainer isScrollView>
        <Stack direction="vertical" gap="16p" align="stretch">
          <Typography.Text color="neutralBase+30" size="large" weight="bold">
            {savingsGoals?.length < MAX_GOALS
              ? t("SavingsGoals.SavingsGoalsScreen.title")
              : t("SavingsGoals.SavingsGoalsScreen.maxGoalsTitle")}
          </Typography.Text>

          <Typography.Text color="neutralBase+30" size="callout">
            {t("SavingsGoals.SavingsGoalsScreen.text")}
          </Typography.Text>

          <View>
            <Stack align="stretch" direction="vertical" gap="8p">
              {savingsGoals.map(element => (
                <GoalCard
                  key={element.PotId}
                  title={element.GoalName}
                  amountSaved={Number(element.AvailableBalanceAmount)}
                  totalAmount={Number(element.TargetAmount)}
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
    left: 0,
    position: "absolute",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  backgroundTopEnd: {
    position: "absolute",
    right: 0,
    top: 0,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});

const MAX_GOALS = 4;
