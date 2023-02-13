import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, I18nManager, SafeAreaView, View } from "react-native";

import Button from "@/components/Button";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import { useTemporaryContext } from "@/contexts/TemporaryContext";
import reloadApp from "@/i18n/reload-app";
import useNavigation from "@/navigation/use-navigation";

import useGetSavingsGoalNumber from "./use-get-savings-goal-number";

interface TemporaryUserId {
  UserId: string;
}

export default function TemporaryLandingScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  // PC-4353 show or skip saving goals instructions
  const getSavingsGoalNumAsync = useGetSavingsGoalNumber();

  const { control, handleSubmit } = useForm<TemporaryUserId>({});

  const { setTemporaryUserId } = useTemporaryContext();

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
    setTemporaryUserId(values.UserId);
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

  const handleOnSwitchDirection = () => {
    I18nManager.forceRTL(!I18nManager.isRTL);
    reloadApp();
  };

  return (
    <SafeAreaView>
      {/* Temporary UserId for testing the instructions screen  */}
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <TextInput
          name="UserId"
          control={control}
          keyboardType="number-pad"
          blurOnSubmit={false}
          label="User ID for Savings Goals Screens"
          placeholder="E.g. 2222225"
        />
      </View>
      <View style={{ margin: 20 }}>
        <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
          Savings Goals
        </SubmitButton>
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
        <Button onPress={handleOnSwitchDirection}>Switch LTR/ RTL</Button>
      </View>
    </SafeAreaView>
  );
}
