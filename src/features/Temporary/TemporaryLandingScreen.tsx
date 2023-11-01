import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, I18nManager, StyleSheet, View } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import TextInput from "@/components/Form/TextInput";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { useAuthContext } from "@/contexts/AuthContext";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import useAppsFlyer from "@/hooks/use-appsflyer";
import useOpenLink from "@/hooks/use-open-link";
import reloadApp from "@/i18n/reload-app";
import { warn } from "@/logger";
import { mockRemoteMessageDocuments } from "@/mocks/remoteNotificationData";
import useNavigation from "@/navigation/use-navigation";
import { generateRandomId } from "@/utils";
import { getItemFromEncryptedStorage, setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import useNotificationHandler from "../../hooks/use-notification-handler";
import useSavingsGoalNumber from "./use-savings-goal-number";

interface TemporaryForm {
  UserId: string;
  cardId: string;
  createDisputeUserId: string;
  phoneNumber: string;
}
export default function TemporaryLandingScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const openLink = useOpenLink();

  const auth = useAuthContext();
  const { setInternalTransferEntryPoint } = useInternalTransferContext();
  const appsFlyer = useAppsFlyer();
  useNotificationHandler(mockRemoteMessageDocuments);

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => checkUserIsBlocked());

    return focusListener;
  }, [checkUserIsBlocked, navigation]);

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
      UserId: "1000001102", //TODO: use 1000002357 as temporary user for temporary landing screen to get data in Home page
      cardId: "",
      createDisputeUserId: "",
      phoneNumber: "01555266403", //TODO: use 01555266403 as temporary user phone  for testing to can register to T2 without go with login ,register path
    },
  });

  const checkUserIsBlocked = useCallback(async () => {
    const userBlocked = await getItemFromEncryptedStorage("UserBlocked"); // TODO: check if user is blocked or not API needs to be developed
    const userBlockedFromProfileDetailsScreen = await getItemFromEncryptedStorage("UserBlockedFromProfileDetails");
    const blockedFrom = userBlockedFromProfileDetailsScreen ? "otp" : "passcode";
    if (userBlocked)
      navigation.navigate("SignIn.SignInStack", { screen: "SignIn.UserBlocked", params: { type: blockedFrom } });
  }, [navigation]);

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
    auth.authenticate(values.UserId, generateRandomId());
    setInternalTransferEntryPoint("homepage");
    setImmediate(() => {
      navigation.navigate("InternalTransfers.InternalTransfersStack", {
        screen: "InternalTransfers.PaymentsHubScreen",
      });
    });
  };

  const handleOnHomepage = async (values: TemporaryForm) => {
    auth.updatePhoneNumber(values.phoneNumber);
    auth.authenticate(values.UserId, auth.authToken);
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

  const handleOnAccessStatements = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    setImmediate(() => {
      navigation.navigate("Statements.StatementsStack", {
        screen: "Statements.AccessStatementScreen",
      });
    });
  };

  const handleOnDocuments = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    setImmediate(() => {
      navigation.navigate("Documents.DocumentsStack");
    });
  };

  const handleOnTopSpendingInsights = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    setImmediate(() => {
      navigation.navigate("TopSpending.TopSpendingStack", {
        screen: "TopSpending.TopSpendingScreen",
      });
    });
  };

  const handleOnOpenOnboarding = () => {
    navigation.navigate("Onboarding.OnboardingStack", {
      screen: "Onboarding.AppIntroAnimation",
    });
  };

  const handleOnOpenBanking = (values: TemporaryForm) => {
    // TODO this is to handle TPP service
    setItemInEncryptedStorage("COMING_FROM_TPP", "true");

    auth.authenticateAnonymously(values.UserId, auth.authToken);
    navigation.navigate("Onboarding.OnboardingStack", {
      screen: "Onboarding.AppIntroAnimation",
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

  const handleOnProxyAlias = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    setImmediate(() => {
      navigation.navigate("ProxyAlias.ProxyAliasStack", {
        screen: "ProxyAlias.AliasManagementScreen",
      });
    });
  };

  const handleOnFaqs = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    setImmediate(() => {
      navigation.navigate("FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack", {
        screen: "FrequentlyAskedQuestions.LandingScreen",
      });
    });
  };

  const handleAllInOneCard = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    setImmediate(() => {
      navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.Dashboard" });
    });
  };

  const handleOnGoalGetter = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    setImmediate(() => {
      navigation.navigate("GoalGetter.GoalGetterStack", { screen: "GoalGetter.GoalDashboardScreen" });
    });
  };

  const handleOnMutualFund = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    setImmediate(() => {
      navigation.navigate("MutualFund.MutualFundStack", { screen: "MutualFund.EntryPoint" });
    });
  };

  const handleOnHelpAndSupport = async (values: TemporaryForm) => {
    auth.authenticate(values.UserId);
    setImmediate(() => {
      navigation.navigate("HelpAndSupport.HelpAndSupportStack");
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
    <Page backgroundColor="neutralBase-60" testID="TemporaryLandingScreen">
      <ContentContainer isScrollView>
        <Stack direction="vertical" gap="12p" align="stretch">
          <TextInput
            name="UserId"
            control={control}
            keyboardType="number-pad"
            blurOnSubmit={false}
            label="Change User ID"
            variant="small"
          />
          <TextInput
            name="cardId"
            control={control}
            keyboardType="default"
            blurOnSubmit={false}
            label="Change Card ID"
            variant="simple"
          />
          <TextInput
            name="createDisputeUserId"
            control={control}
            keyboardType="number-pad"
            blurOnSubmit={false}
            label="Change User ID for create dispute case"
            variant="simple"
          />
          <TextInput
            name="phoneNumber"
            control={control}
            keyboardType="default"
            blurOnSubmit={false}
            label="Change phone number"
            variant="simple"
          />
        </Stack>
        {/* Implemented for testing, navigate from temp landing screen to goal getter dashboard screen */}
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleAllInOneCard)}>All In One Card</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnGoalGetter)}>Goal Getter</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnMutualFund)}>Mutual fund</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnHelpAndSupport)}>Help And Support Hub</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnFaqs)}>Faqs</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnProxyAlias)}>Proxy Alias Landing</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnTopSpendingInsights)}>Top Spending</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnDocuments)}>Documents</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnAccessStatements)}>Statements</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnPressPaymentDisputesLanding)}>Payment Disputes Landing</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnViewTransactions)}>View Transactions</Button>
        </View>
        <View style={styles.margin20}>
          <Button
            onPress={handleSubmit(handleOnOpenInternalTransfers)}
            testID="TemporaryLandingScreen:InternalTransfersButton">
            Internal Transfers
          </Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnSubmit)} testID="TemporaryLandingScreen:SavingsGoalsButton">
            Savings Goals
          </Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnOpenApplyForCard)}>Order Card</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnHomepage)}>Homepage</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnOpenOnboarding)} testID="TemporaryLandingScreen:OnboardingButton">
            Onboarding
          </Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnOpenBanking)} testID="TemporaryLandingScreen:OnboardingButton">
            OpenBanking
          </Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleSubmit(handleOnCardsHomeSubmit)}>Cards Home</Button>
        </View>
        <View style={styles.margin20}>
          <Button onPress={handleOnSwitchDirection}>Switch LTR/ RTL</Button>
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  margin20: { marginVertical: 20 },
});
