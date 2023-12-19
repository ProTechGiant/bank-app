import { useFocusEffect } from "@react-navigation/native";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { GoldWalletSection } from "@/components";
import InternalTransferTypeModal from "@/components/InternalTransferTypeModal";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import SelectTransferTypeModal from "@/components/SelectTransferTypeModal";
import Stack from "@/components/Stack";
import { useAuthContext } from "@/contexts/AuthContext";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useCheckCustomerExist } from "@/features/MutualFund/hooks/query-hooks";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { useCustomerProfile } from "@/hooks/use-customer-profile";
import useRegisterNotifications from "@/hooks/use-register-notifications";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import { getItemFromEncryptedStorage, hasItemInStorage } from "@/utils/encrypted-storage";

import {
  AppreciationFeedbackModal,
  AppreciationSection,
  BulletinBoardSection,
  CardSection,
  ChatLiveButton,
  HeaderHomePage,
  QuickActionsReordererModal,
  TopSpendingCategories,
  WhatsNextSection,
} from "../components";
import { useHomepageLayoutOrder } from "../contexts/HomepageLayoutOrderContext";
import {
  useAppreciationFeedback,
  useAppreciationsWithNoFeedback,
  useQuickActions,
  useRefetchHomepageLayout,
} from "../hooks/query-hooks";
import { FeedbackStatus } from "../types";

export default function DashboardScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { sections, homepageLayout } = useHomepageLayoutOrder();

  const [layoutErrorIsVisible, setLayoutErrorIsVisible] = useState(false);
  const { refetchAll } = useRefetchHomepageLayout();
  const account = useCurrentAccount();
  const { clearContext, setTransferType } = useInternalTransferContext();
  const { phoneNumber } = useAuthContext();
  const registerForNotifications = useRegisterNotifications();
  const { data: customerProfile } = useCustomerProfile();
  const { refetch: refetchQuickActions } = useQuickActions();
  const auth = useAuthContext();

  const appreciationFeedback = useAppreciationFeedback();
  const { data: appreciationsWithNoFeedback } = useAppreciationsWithNoFeedback(i18n.language);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isInternalTransferTypeModalVisible, setIsInternalTransferTypeModalVisible] = useState<boolean>(false);
  const [isLocalTransferModalVisible, setIsLocalTransferModalVisible] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [feedbackIndex, setFeedbackIndex] = useState<number>(0);
  const [hasOngoingLiveChat, setHasOngoingLiveChat] = useState<boolean>(false);
  const [ongoingLiveChatParams, setOngoingLiveChatParams] = useState({});
  const isAppreciationFeedbackModalVisible =
    appreciationsWithNoFeedback !== undefined && feedbackIndex < appreciationsWithNoFeedback.length;
  const { data: checkCustomerExist } = useCheckCustomerExist();

  useEffect(() => {
    async function main() {
      if (phoneNumber === undefined) {
        return;
      }

      await registerForNotifications.register(phoneNumber);
    }
    main();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      const hasOngoingLiveChatToStorage = async () => {
        const hasOngoingChat = await hasItemInStorage("hasOngoingLiveChat");
        handleOngoingLiveChat(hasOngoingChat);
      };
      hasOngoingLiveChatToStorage();
    }, [])
  );

  useEffect(() => {
    if (homepageLayout?.isError === true) {
      setLayoutErrorIsVisible(true);
    }
  }, [homepageLayout]);

  const handleOngoingLiveChat = async (hasOngoingChat: boolean) => {
    setHasOngoingLiveChat(hasOngoingChat);
    if (hasOngoingChat) {
      const ongoingChatParams = await getItemFromEncryptedStorage("hasOngoingLiveChat");
      if (ongoingChatParams) {
        setOngoingLiveChatParams(JSON.parse(ongoingChatParams));
      }
    }
  };

  const handleGoalGetterNavigation = async () => {
    const pendingGoalAttributes = await getItemFromEncryptedStorage("pendingGoalGetter");
    if (pendingGoalAttributes) {
      navigation.navigate("GoalGetter.GoalGetterStack", {
        screen: "GoalGetter.ReviewGoalScreen",
        params: { pendingGoalAttributes: JSON.parse(pendingGoalAttributes) },
      });
    } else {
      // TODO: check goal onboarding flow
      navigation.navigate("GoalGetter.GoalGetterStack", { screen: "GoalGetter.GoalsAndProducts" });
    }
  };

  const handleMutualFund = async () => {
    const isCustomerOnboarding =
      checkCustomerExist?.CustomerId && checkCustomerExist.CustomerPortfolioNumber ? true : false;

    if (isCustomerOnboarding) {
      navigation.navigate("MutualFund.MutualFundStack", {
        screen: "MutualFund.PortfolioDetails",
      });
    } else {
      navigation.navigate("MutualFund.MutualFundStack", { screen: "MutualFund.EntryPoint" });
    }
  };

  const handleOnQuickActionPressed = (screen: string, stack: string) => {
    if (screen === undefined || screen === "") return;
    if (stack === "GoalGetter.GoalGetterStack") {
      handleGoalGetterNavigation();
      return;
    }
    if (stack === "MutualFund.MutualFundStack") {
      handleMutualFund();
      return;
    }
    if (stack === "InternalTransfers.InternalTransfersStack") {
      clearContext();
      setIsInternalTransferTypeModalVisible(screen === "Home.HomeTabs.tabTransfer");
      setIsInternalTransferTypeModalVisible(screen === "InternalTransfers.InternalTransferScreen");
      setIsLocalTransferModalVisible(screen === "InternalTransfers.LocalTransfer");
    } else navigation.navigate(stack, { screen });
  };

  const handleOnEditShortcutsPress = () => {
    setIsVisible(true);
  };

  const handleOnAppreciationsPress = () => {
    navigation.navigate("Appreciation.AppreciationStack");
  };

  const handleOnWhatsNextPress = () => {
    navigation.navigate("WhatsNext.WhatsNextStack");
  };

  const handleOnLoadingErrorClose = () => {
    setLayoutErrorIsVisible(false);
  };

  const handleOnLoadingErrorRefresh = () => {
    refetchAll();
    handleOnLoadingErrorClose();
  };

  const handleOnRefreshShortcutRefreshSection = () => {
    refetchQuickActions();
  };

  const handleOnCroatiaTransferPress = () => {
    setIsInternalTransferTypeModalVisible(false);
    setTransferType(TransferType.InternalTransferAction);
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.InternalTransferScreen",
    });
  };

  const handleOnAlrajhiTransferPress = () => {
    setIsInternalTransferTypeModalVisible(false);
    setTransferType(TransferType.CroatiaToArbTransferAction);
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.InternalTransferScreen",
    });
  };

  const handleOnSubmitAppreciationFeedback = (comment: string, status: FeedbackStatus) => {
    appreciationFeedback.mutateAsync({
      appreciationId: appreciationsWithNoFeedback[feedbackIndex].AppreciationId,
      comment,
      voteId: status,
    });
  };

  const handleOnCloseFeedbackModal = () => {
    setFeedbackIndex(feedbackIndex + 1);
  };

  const handleOnGoldWalletExplorePress = async () => {
    // TODO  will be changed once BE  return flag to can know if terms  changed to navigate to terms screens
    const isgoldWalletTermsAccepted = (await getItemFromEncryptedStorage("goldWalletTermsAcceptance")) === "1";
    if (isgoldWalletTermsAccepted) {
      navigation.navigate("GoldWallet.GoldWalletStack", {
        screen: "GoldWallet.HubScreen",
      });
    } else {
      navigation.navigate("GoldWallet.GoldWalletStack", {
        screen: "GoldWallet.OnboardingScreen",
      });
    }
  };

  const handleOnChatButtonPress = () => {
    navigation.navigate("HelpAndSupport.HelpAndSupportStack", {
      screen: "HelpAndSupport.ChatScreen",
      params: {
        isOngoingChat: true,
        ...ongoingLiveChatParams,
      },
    });
  };

  const handleOnBalanceRefresh = () => {
    account.refetch();
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["32p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const statusBarColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor={statusBarColor} translucent />

      <HeaderHomePage
        testID="Home.DashboardScreen:HeaderHomePage"
        firstName={customerProfile?.FirstName}
        isNotificationIconHighlighted={auth.notificationsReadStatus}
        balance={account.data?.balance}
        accountNumber={account.data?.id}
        onBalanceRefresh={handleOnBalanceRefresh}
        onQuickActionsRefresh={handleOnRefreshShortcutRefreshSection}
        onQuickActionPress={handleOnQuickActionPressed}
        onEditQuickActionPress={handleOnEditShortcutsPress}
      />
      <View style={styles.dividerStyle} />
      <ScrollView contentContainerStyle={contentStyle} scrollEventThrottle={16}>
        <BulletinBoardSection testID="Home.DashboardScreen:BulletinBoardSection" />
        <Stack align="stretch" direction="vertical" gap="32p">
          {sections?.length !== 0 ? (
            <>
              {sections.map(section => {
                if (section.type === "appreciations" && section.isItemChecked) {
                  return (
                    <AppreciationSection
                      testID="Home.DashboardScreen:AppreciationSection"
                      key={section.type}
                      onViewAllPress={handleOnAppreciationsPress}
                    />
                  );
                }
                if (section.type === "articles" && section.isItemChecked) {
                  return (
                    <WhatsNextSection
                      testID="Home.DashboardScreen:WhatsNextSection"
                      key={section.type}
                      onViewAllPress={handleOnWhatsNextPress}
                    />
                  );
                }
                if (section.type === "invite-friend" && section.isItemChecked) {
                  return (
                    <CardSection
                      testID="Home.DashboardScreen:ReferFriendCard"
                      onPress={() => navigation.navigate("Referral.ReferralStack", { screen: "Referral.HubScreen" })}
                      isReferFriend={true}
                      title={t("Home.DashboardScreen.ReferFriend.title")}
                      description={t("Home.DashboardScreen.ReferFriend.description")}
                      buttonText={t("Home.DashboardScreen.ReferFriend.button")}
                    />
                  );
                }
                if (section.type === "goal-getter" && section.isItemChecked) {
                  return (
                    <CardSection
                      testID="Home.DashboardScreen:GoalGetterCard"
                      isReferFriend={false}
                      onPress={() =>
                        navigation.navigate("GoalGetter.GoalGetterStack", { screen: "GoalGetter.GoalsAndProducts" })
                      }
                      title={t("Home.DashboardScreen.GoalGetter.title")}
                      description={t("Home.DashboardScreen.GoalGetter.description")}
                      buttonText={t("Home.DashboardScreen.GoalGetter.button")}
                    />
                  );
                }
                if (section.type === "money-spend" && section.isItemChecked) {
                  return <TopSpendingCategories testID="Home.DashboardScreen:MoneySpendCategory" account={account} />;
                }

                return <Fragment key={section.type} />;
              })}
              {/* //TODO add the right condition to visualize this section while finished by backend*/}
              <GoldWalletSection
                testID="Home.DashboardScreen:MoneySpendCategory"
                onPress={handleOnGoldWalletExplorePress}
              />
            </>
          ) : layoutErrorIsVisible === true ? (
            <LoadingErrorNotification
              testID="Home.DashboardScreen:LoadingErrorNotificationModal"
              isVisible={layoutErrorIsVisible}
              onClose={handleOnLoadingErrorClose}
              onRefresh={handleOnLoadingErrorRefresh}
            />
          ) : null}
        </Stack>

        {/* TODO: When the API is ready  */}
      </ScrollView>
      {hasOngoingLiveChat ? (
        <ChatLiveButton testID="Home.DashboardScreen:ChatLiveButton" onPress={handleOnChatButtonPress} />
      ) : null}
      <QuickActionsReordererModal
        testID="Home.DashboardScreen:QuickActionsReordererModal"
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />
      <SelectTransferTypeModal
        testID="Home.DashboardScreen:SelectTransferTypeModal"
        isVisible={isLocalTransferModalVisible}
        onClose={() => setIsLocalTransferModalVisible(false)}
        setIsErrorModalVisible={setIsErrorModalVisible}
      />
      <NotificationModal
        testID="Home.DashboardScreen:NotificationModal"
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
      <InternalTransferTypeModal
        testID="Home.DashboardScreen:InternalTransferTypeModal"
        onClose={() => setIsInternalTransferTypeModalVisible(false)}
        onCroatiaPress={handleOnCroatiaTransferPress}
        onAlrajhiPress={handleOnAlrajhiTransferPress}
        isVisible={isInternalTransferTypeModalVisible}
      />
      {isAppreciationFeedbackModalVisible && (
        <AppreciationFeedbackModal
          testID="Home.DashboardScreen:AppreciationFeedbackModal"
          visible={isAppreciationFeedbackModalVisible}
          onClose={handleOnCloseFeedbackModal}
          onSubmitFeedback={handleOnSubmitAppreciationFeedback}
          title={appreciationsWithNoFeedback[feedbackIndex].AppreciationName}
          imageUrl={appreciationsWithNoFeedback[feedbackIndex].ImageUrl}
        />
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  dividerStyle: { height: 54 },
});
