import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, I18nManager, SafeAreaView, ScrollView, View } from "react-native";

import Button from "@/components/Button";
import TextInput from "@/components/Form/TextInput";
import { useAuthContext } from "@/contexts/AuthContext";
import useAppsFlyer from "@/hooks/use-appsflyer";
import reloadApp from "@/i18n/reload-app";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";

import { useInternalTransferContext } from "../InternalTransfers/context/InternalTransfersContext";
import useSavingsGoalNumber from "./use-savings-goal-number";

interface TemporaryForm {
  UserId: string;
  cardId: string;
}

export default function TemporaryLandingScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const auth = useAuthContext();
  const { setInternalTransferEntryPoint } = useInternalTransferContext();
  const appsFlyer = useAppsFlyer();

  // Appsflyer listens for onDeepLink to be triggered and then we navigate to correct screen using data passed by Appsflyer
  // TODO: Should be placed inside the first screen in the nav stack so that it is always called but can also handle navigation
  useEffect(() => {
    const listener = appsFlyer.onDeepLink(result => {
      // If no deep linking or deep link is deffered then we do not handle navigation
      if (result.deepLinkStatus !== "FOUND" || result.isDeferred === true) return;

      if (result.data?.stack !== undefined && result.data?.screen !== undefined) {
        // TODO: handle navigation using method in developement for internal links
        navigation.navigate("WhatsNext.WhatsNextStack", {
          screen: "WhatsNext.HubScreen",
        });
      }
    });

    return () => listener();
  }, []);

  // PC-4353 show or skip saving goals instructions
  const getSavingsGoalNumAsync = useSavingsGoalNumber();
  const { control, handleSubmit } = useForm<TemporaryForm>({
    defaultValues: {
      UserId: auth.userId,
      cardId: "",
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

  const handleOnSubmit = (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    handleOnSavingsGoals();
  };

  const handleOnOpenApplyForCard = () => {
    navigation.navigate("CardActions.CardActionsStack", {
      screen: "CardActions.ApplyCardScreen",
    });
  };

  const handleOnOpenInternalTransfers = (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    setInternalTransferEntryPoint("homepage");
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.PaymentsHubScreen",
    });
  };

  const handleOnHomepage = (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    navigation.navigate("Home.HomeStack", {
      screen: "Home.DashboardScreen",
    });
  };

  const handleOnViewTransactions = () => {
    navigation.navigate("ViewTransactions.ViewTransactionsStack", {
      screen: "ViewTransactions.TransactionsScreen",
    });
  };

  const handleOnOpenOnboarding = (values: TemporaryUserId) => {
    auth.authenticate(values.UserId);
    navigation.navigate("Onboarding.OnboardingStack", {
      screen: "Onboarding.SplashScreen",
    });
  };

  const handleOnCardsHomeSubmit = (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    handleOnOpenCardsHome();
  };

  const handleOnOpenCardsHome = () => {
    navigation.navigate("CardActions.CardActionsStack", {
      screen: "CardActions.HomeScreen",
    });
  };

  const handleOnPressPaymentDisputes = (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    navigation.navigate("PaymentDisputes.PaymentDisputesStack", {
      screen: "PaymentDisputes.PaymentDisputeScreen",
      params: {
        cardId: values.cardId,
      },
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
          <TextInput
            name="cardId"
            control={control}
            keyboardType="default"
            blurOnSubmit={false}
            label="Change Card ID"
            placeholder="E.g. 2222225"
          />
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleSubmit(handleOnSubmit)}>Savings Goals</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleOnViewTransactions}>View Transactions</Button>
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
          <Button onPress={handleSubmit(handleOnPressPaymentDisputes)}>Payment Disputes</Button>
        </View>
        <View style={{ margin: 20 }}>
          <Button onPress={handleOnSwitchDirection}>Switch LTR/ RTL</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
