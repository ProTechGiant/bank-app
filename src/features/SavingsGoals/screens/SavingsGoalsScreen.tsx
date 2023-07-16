import { RouteProp, useRoute } from "@react-navigation/native";
import { compareAsc } from "date-fns";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, SafeAreaView, StatusBar, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { PlusIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToasts } from "@/contexts/ToastsContext";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import BackgroundBottom from "../assets/BackgroundBottom";
import { GoalCard } from "../components";
import { useSavingsPots } from "../hooks/query-hooks";

export default function SavingsGoalsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "SavingsGoals.SavingsGoalsScreen">>();
  const addToast = useToasts();
  const { data, error } = useSavingsPots();
  const auth = useAuthContext();

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
    //TODO: Once the temporary screen is removed, the navigation will be adjusted to directly navigate to the home screen.
    // navigation.navigate("Home.HomeStack", {
    //   screen: "Home.DashboardScreen",
    // });
    auth.logout();
  };

  const savingsGoals = useMemo(
    () => data?.SavingsPots.sort((a, b) => compareAsc(new Date(a.CreatedDate), new Date(b.CreatedDate))) ?? [],
    [data]
  );

  const handleOnPress = (PotId: string) => {
    navigation.navigate("SavingsGoals.GoalDetailsScreen", { PotId });
  };

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["supportBase-15"],
    zIndex: 1,
    paddingTop: theme.spacing["20p"],
  }));

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingBottom: theme.spacing["8p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["48p"],
  }));

  const backgroundBottomStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: -theme.spacing["24p"] + 1, // Small gap forms on iphone SE, 1 pixel added to remove this.
  }));

  const backgroundAngledColor = useThemeStyles(theme => theme.palette["supportBase-15"]);

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60" insets={["left", "right"]}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <SafeAreaView style={headerStyle}>
          <NavHeader onBackPress={handleOnBack} variant="background" />
          <View style={titleStyle}>
            <Typography.Text color="neutralBase+30" size="title1" weight="medium">
              {savingsGoals?.length < MAX_GOALS
                ? t("SavingsGoals.SavingsGoalsScreen.title")
                : t("SavingsGoals.SavingsGoalsScreen.maxGoalsTitle")}
            </Typography.Text>
          </View>
          <View style={backgroundBottomStyle}>
            <BackgroundBottom color={backgroundAngledColor} />
          </View>
        </SafeAreaView>

        <ContentContainer isScrollView style={contentContainerStyle}>
          <Stack direction="vertical" gap="16p" align="stretch">
            <View>
              <Stack align="stretch" direction="vertical" gap="16p">
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
                  <Stack direction="vertical" align="center" gap="24p">
                    <Typography.Text color="neutralBase" size="footnote" weight="regular">
                      {t("SavingsGoals.SavingsGoalsScreen.instructionText")}
                    </Typography.Text>
                    <Button onPress={handleOnCreateGoal} iconLeft={<PlusIcon />} variant="secondary" size="small">
                      {t("SavingsGoals.SavingsGoalsScreen.button")}
                    </Button>
                  </Stack>
                ) : null}
              </Stack>
            </View>
          </Stack>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}

const MAX_GOALS = 4;
