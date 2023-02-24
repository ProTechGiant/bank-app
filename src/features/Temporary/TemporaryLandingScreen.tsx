import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, I18nManager, SafeAreaView, ScrollView, View } from "react-native";

import Button from "@/components/Button";
import TextInput from "@/components/Form/TextInput";
import { useAuthContext } from "@/contexts/AuthContext";
import reloadApp from "@/i18n/reload-app";
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

      __DEV__ && console.error("Could not get number of savings goal: ", error);
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
    navigation.navigate("Home.Dashboard");
  };

  const handleOnOpenOnboarding = () => {
    navigation.navigate("Onboarding.OnboardingStack");
  };

  const handleOnCardActions = () => {
    navigation.navigate("CardActions.CardActionsStack");
  };

  const handleOnSwitchDirection = () => {
    I18nManager.forceRTL(!I18nManager.isRTL);
    reloadApp();
  };

  const handleOpenSingleUseCards = () => {
    navigation.navigate("SingleUseCards.SingleUserCardsStack");
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
          <Button onPress={handleOnOpenApplyForCard}>Card Modal</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleOnHomepage}>Homepage</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleOnOpenOnboarding}>Onboarding</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleOnCardActions}>Card Actions</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleOnSwitchDirection}>Switch LTR/ RTL</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleOpenSingleUseCards}>Single Use Cards</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
