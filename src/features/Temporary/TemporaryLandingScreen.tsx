import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, I18nManager, Platform, SafeAreaView, ScrollView, Share, View } from "react-native";
import appsFlyer from "react-native-appsflyer";

import Button from "@/components/Button";
import TextInput from "@/components/Form/TextInput";
import { useAuthContext } from "@/contexts/AuthContext";
import reloadApp from "@/i18n/reload-app";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";

import { useInternalTransferContext } from "../InternalTransfers/context/InternalTransfersContext";
import useSavingsGoalNumber from "./use-savings-goal-number";

interface TemporaryUserId {
  UserId: string;
}

export default function TemporaryLandingScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const auth = useAuthContext();
  const { setInternalTransferEntryPoint } = useInternalTransferContext();

  // Appsflyer listens for onDeepLink to be triggered and then we navigate to correct screen using data passed by Appsflyer
  // TODO: Should be placed inside the first screen in the nav stack so that it is always called but can also handle navigation
  useEffect(() => {
    appsFlyer.onDeepLink(result => {
      if (result.deepLinkStatus !== "FOUND") return;
      if (result.data?.stack !== undefined && result.data?.screen !== undefined) {
        navigation.navigate(result.data.stack, {
          screen: result.data.screen,
          params: JSON.parse(result.data.params),
        });
      }
    });
  }, []);

  // PC-4353 show or skip saving goals instructions
  const getSavingsGoalNumAsync = useSavingsGoalNumber();
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
    navigation.navigate("CardActions.CardActionsStack", {
      screen: "CardActions.ApplyCardScreen",
    });
  };

  const handleOnOpenInternalTransfers = (values: TemporaryUserId) => {
    auth.authenticate(values.UserId);
    setInternalTransferEntryPoint("homepage");
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.PaymentsHubScreen",
    });
  };

  const handleOnHomepage = (values: TemporaryUserId) => {
    auth.authenticate(values.UserId);
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

  const handleOnCardsHomeSubmit = (values: TemporaryUserId) => {
    auth.authenticate(values.UserId);
    handleOnOpenCardsHome();
  };

  const handleOnOpenCardsHome = () => {
    navigation.navigate("CardActions.CardActionsStack", {
      screen: "CardActions.HomeScreen",
    });
  };

  const handleOnPressPaymentDisputes = () => {
    navigation.navigate("PaymentDisputes.PaymentDisputesStack");
  };

  const handleOnSwitchDirection = () => {
    I18nManager.forceRTL(!I18nManager.isRTL);
    reloadApp();
  };

  const handleOnArticleSharePress = () => {
    const faqId = "faq_1";

    appsFlyer.generateInviteLink(
      {
        channel: "Article",
        userParams: {
          stack: "FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack",
          screen: "FrequentlyAskedQuestions.DetailedScreen",
          params: JSON.stringify({ faqId }),
        },
      },
      link => {
        return Share.share(Platform.OS === "ios" ? { url: link } : { message: link });
      },
      error => {
        warn("appsflyer-sdk", "Could not generate Article link", JSON.stringify(error));
      }
    );
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
          <Button onPress={handleSubmit(handleOnHomepage)}>Homepage</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleSubmit(handleOnOpenInternalTransfers)}>Internal Transfers</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleSubmit(handleOnOpenOnboarding)}>Onboarding</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleSubmit(handleOnCardsHomeSubmit)}>Cards Home</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleOnPressPaymentDisputes}>Payment Disputes</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleOnSwitchDirection}>Switch LTR/ RTL</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleOnArticleSharePress}>Article Share button</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
