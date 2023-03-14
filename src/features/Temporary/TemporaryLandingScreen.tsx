import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, I18nManager, SafeAreaView, ScrollView, View } from "react-native";

import Button from "@/components/Button";
import TextInput from "@/components/Form/TextInput";
import { useAuthContext } from "@/contexts/AuthContext";
import reloadApp from "@/i18n/reload-app";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";

import useGetSavingsGoalNumber from "./use-get-savings-goal-number";

interface TemporaryUserId {
  UserId: string;
}

export default function TemporaryLandingScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const auth = useAuthContext();

  // PC-4353 show or skip saving goals instructions
  const getSavingsGoalNumAsync = useGetSavingsGoalNumber();
  const { control, handleSubmit } = useForm<TemporaryUserId>({
    defaultValues: {
      UserId: auth.userId,
    },
  });

  const handleOnSavingsGoals = async () => {
    try {
      const response = await getSavingsGoalNumAsync.mutateAsync();
      navigation.navigate("SavingsGoals.SavingsGoalsStack", { savingsPotsNumber: response.SavingsPotsNumber });
    } catch (error) {
      Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);

      warn("savings-goals", "Could not get number of savings goal: ", JSON.stringify(error));
    }
  };

  const handleOnSubmit = (values: TemporaryUserId) => {
    auth.authenticate(values.UserId);
    handleOnSavingsGoals();
  };

  const handleOnOpenApplyForCard = () => {
    navigation.navigate("ApplyCards.ApplyForCardStack");
  };

  const handleOnHomepage = () => {
    navigation.navigate("Home.HomeStack", {
      screen: "Home.DashboardScreen",
    });
  };

  const handleOnOpenOnboarding = (values: TemporaryUserId) => {
    auth.authenticate(values.UserId);
    navigation.navigate("Onboarding.OnboardingStack", {
      screen: "Onboarding.SplashScreen",
    });
  };

  const handleOnOpenViewAccountDetails = () => {
    navigation.navigate("Home.AccountDetailsScreen");
  };

  const handleOnCardsHomeSubmit = (values: TemporaryUserId) => {
    auth.authenticate(values.UserId);
    handleOnOpenCardsHome();
  };

  const handleOnOpenCardsHome = () => {
    navigation.navigate("CardActions.CardActionsStack", {
      screen: "CardActions.HomeScreen",
    });
  };

  const handleOnSwitchDirection = () => {
    I18nManager.forceRTL(!I18nManager.isRTL);
    reloadApp();
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ margin: 20 }}>
          <TextInput
            name="UserId"
            control={control}
            keyboardType="number-pad"
            blurOnSubmit={false}
            label="Change User ID"
            placeholder="E.g. 2222225"
          />
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleSubmit(handleOnSubmit)}>Savings Goals</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleOnOpenApplyForCard}>Order Card</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleOnHomepage}>Homepage</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleSubmit(handleOnOpenOnboarding)}>Onboarding</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleOnOpenViewAccountDetails}>View Account Details</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleSubmit(handleOnCardsHomeSubmit)}>Cards Home</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleOnSwitchDirection}>Switch LTR/ RTL</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
