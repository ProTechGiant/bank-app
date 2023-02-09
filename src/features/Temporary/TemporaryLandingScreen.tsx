import { useTranslation } from "react-i18next";
import { Alert, I18nManager, SafeAreaView, View } from "react-native";

import Button from "@/components/Button";
import reloadApp from "@/i18n/reload-app";
import useNavigation from "@/navigation/use-navigation";

import useGetSavingsGoalNumber from "./use-get-savings-goal-number";

export default function TemporaryLandingScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  // PC-4353 show or skip saving goals instructions
  const getSavingsGoalNumAsync = useGetSavingsGoalNumber();

  const handleOnSavingsGoals = async () => {
    try {
      const response = await getSavingsGoalNumAsync.mutateAsync();
      // @TODO: uncomment this once we have response 0
      // parseInt(response.SavingsPotsNumber) > 0
      //   ? navigation.navigate("SavingsGoals.SavingsGoalsScreen")
      //   : navigation.navigate("SavingsGoals.InstructionsScreen");
      navigation.navigate("SavingsGoals.InstructionsScreen");
    } catch (error) {
      Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);

      __DEV__ && console.error("Could not get number of savings goal: ", error);
    }
  };

  const handleOnOpenApplyForCard = () => {
    navigation.navigate("ApplyCards.ApplyForCardStack");
  };

  const handleOnHomepage = () => {
    navigation.navigate("Home.Dashboard");
  };

  const handleOnOpenOnboarding = () => {
    navigation.navigate("Onboarding.OnboardingStack");
  };

  const handleOnSwitchDirection = () => {
    I18nManager.forceRTL(!I18nManager.isRTL);
    reloadApp();
  };

  return (
    <SafeAreaView>
      <View style={{ margin: 20 }}>
        <Button onPress={handleOnOpenApplyForCard}>Card Modal</Button>
      </View>
      <View style={{ margin: 20 }}>
        <Button onPress={handleOnHomepage}>Homepage</Button>
      </View>
      <View style={{ margin: 20 }}>
        <Button onPress={handleOnOpenOnboarding}>Onboarding</Button>
      </View>
      <View style={{ margin: 20 }}>
        <Button onPress={handleOnSavingsGoals}>Savings Goals</Button>
      </View>
      <View style={{ margin: 20 }}>
        <Button onPress={handleOnSwitchDirection}>Switch LTR/ RTL</Button>
      </View>
    </SafeAreaView>
  );
}
