import { RouteProp, useRoute } from "@react-navigation/native";
import { compareAsc } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, I18nManager, Pressable, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { FilledCircleTickIcon, PlusIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import DismissibleBanner from "@/components/DismissibleBanner";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import MainStackParams from "@/navigation/mainStackParams";
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
  const route = useRoute<RouteProp<MainStackParams, "SavingsGoals.ListGoalsScreen">>();
  const [showCloseNotification, setShowCloseNotification] = useState(false);

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
      const timeout = setTimeout(() => {
        setShowCloseNotification(true);
        setTimeout(() => setShowCloseNotification(false), 3000);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [error, navigation, route.params, t]);

  const handleOnCreateGoal = () => {
    navigation.navigate("SavingsGoals.CreateGoalScreen");
  };

  const handleOnBack = () => {
    navigation.navigate("Temporary.LandingScreen");
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

  const handleOnPress = (PotId: string) => {
    navigation.navigate("SavingsGoals.GoalDetailsScreen", { PotId });
  };

  return (
    <Page backgroundColor="neutralBase-60">
      {showCloseNotification && (
        <DismissibleBanner
          visible={showCloseNotification}
          message={t("SavingsGoals.SavingsGoalsScreen.notifications.goalClosed")}
          variant="success"
          icon={<FilledCircleTickIcon />}
        />
      )}
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
