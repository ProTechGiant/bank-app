import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, I18nManager, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import Button from "@/components/Button";
import TextInput from "@/components/Form/TextInput";
import Stack from "@/components/Stack";
import { useAuthContext } from "@/contexts/AuthContext";
import useAppsFlyer from "@/hooks/use-appsflyer";
import useOpenLink from "@/hooks/use-open-link";
import reloadApp from "@/i18n/reload-app";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { getItemFromEncryptedStorage } from "@/utils/encrypted-storage";

import useNotificationHandler from "../../hooks/use-notification-handler";
import { useInternalTransferContext } from "../InternalTransfers/context/InternalTransfersContext";
import useSavingsGoalNumber from "./use-savings-goal-number";

interface TemporaryForm {
  UserId: string;
  cardId: string;
  createDisputeUserId: string;
}
export default function TemporaryLandingScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const openLink = useOpenLink();

  const auth = useAuthContext();
  const { setInternalTransferEntryPoint } = useInternalTransferContext();
  const appsFlyer = useAppsFlyer();
  useNotificationHandler();

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => checkUserIsBlocked());

    return focusListener;
  }, [navigation]);

  // Appsflyer listens for onDeepLink to be triggered and then we navigate to correct screen using data passed by Appsflyer
  // TODO: Should be placed inside the first screen in the nav stack so that it is always called but can also handle navigation
  useEffect(() => {
    const listener = appsFlyer.onDeepLink(result => {
      // If no deep linking or deep link is deferred then we do not handle navigation
      if (result.deepLinkStatus !== "FOUND" || result.isDeferred === true) return;

      if (result.data?.internalUrl !== undefined) {
        openLink(result.data.internalUrl);
      }
    });

    return () => listener();
  }, [appsFlyer, openLink]);

  // PC-4353 show or skip saving goals instructions
  const getSavingsGoalNumAsync = useSavingsGoalNumber();
  const { control, handleSubmit } = useForm<TemporaryForm>({
    defaultValues: {
      UserId: "301", //TODO: use 301 as temporary user for temporary landing screen
      cardId: "",
      createDisputeUserId: "",
    },
  });

  const checkUserIsBlocked = async () => {
    const userBlocked = await getItemFromEncryptedStorage("UserBlocked"); // TODO: check if user is blocked or not API needs to be developed
    if (userBlocked)
      navigation.navigate("SignIn.SignInStack", { screen: "SignIn.UserBlocked", params: { type: "passcode" } });
  };

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

  const handleOnSubmit = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    handleOnSavingsGoals();
  };

  const handleOnOpenApplyForCard = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    setImmediate(() => {
      navigation.navigate("CardActions.CardActionsStack", {
        screen: "CardActions.ApplyCardScreen",
      });
    });
  };

  const handleOnOpenInternalTransfers = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    setInternalTransferEntryPoint("homepage");
    setImmediate(() => {
      navigation.navigate("InternalTransfers.InternalTransfersStack", {
        screen: "InternalTransfers.PaymentsHubScreen",
      });
    });
  };

  const handleOnHomepage = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
  };

  const handleOnViewTransactions = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    setImmediate(() => {
      navigation.navigate("ViewTransactions.ViewTransactionsStack", {
        screen: "ViewTransactions.TransactionsScreen",
        params: {
          cardId: values.cardId,
          createDisputeUserId: values.createDisputeUserId,
        },
      });
    });
  };

  const handleOnOpenOnboarding = (values: TemporaryForm) => {
    auth.authenticateAnonymously(values.UserId);
    navigation.navigate("Onboarding.OnboardingStack", {
      screen: "Onboarding.SplashScreen",
    });
  };

  const handleOnCardsHomeSubmit = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    setImmediate(() => {
      navigation.navigate("CardActions.CardActionsStack", {
        screen: "CardActions.HomeScreen",
      });
    });
  };

  const handleOnPressPaymentDisputesLanding = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    setImmediate(() => {
      navigation.navigate("PaymentDisputes.PaymentDisputesStack", {
        screen: "PaymentDisputes.MyCasesLandingScreen",
      });
    });
  };

  const handleOnSwitchDirection = () => {
    I18nManager.forceRTL(!I18nManager.isRTL);
    reloadApp();
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.margin20}>
          <Stack direction="vertical" gap="12p" align="stretch">
            <TextInput
              name="UserId"
              control={control}
              keyboardType="number-pad"
              blurOnSubmit={false}
              label="Change User ID"
            />
            <TextInput
              name="cardId"
              control={control}
              keyboardType="default"
              blurOnSubmit={false}
              label="Change Card ID"
            />
            <TextInput
              name="createDisputeUserId"
              control={control}
              keyboardType="number-pad"
              blurOnSubmit={false}
              label="Change User ID for create dispute case"
            />
          </Stack>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnPressPaymentDisputesLanding)}>Payment Disputes Landing</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnViewTransactions)}>View Transactions</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnOpenInternalTransfers)}>Internal Transfers</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnSubmit)}>Savings Goals</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnOpenApplyForCard)}>Order Card</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnHomepage)}>Homepage</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnOpenOnboarding)}>Onboarding</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnCardsHomeSubmit)}>Cards Home</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleOnSwitchDirection}>Switch LTR/ RTL</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  margin20: { margin: 20 },
});
