import { useFocusEffect } from "@react-navigation/native";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { AngledIcon } from "@/assets/icons";
import InternalTransferTypeModal from "@/components/InternalTransferTypeModal";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { useAuthContext } from "@/contexts/AuthContext";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useCheckCustomerExist } from "@/features/MutualFund/hooks/query-hooks";
import { useCustomerProfile } from "@/hooks/use-customer-profile";
import useRegisterNotifications from "@/hooks/use-register-notifications";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { WidgetTypesEnum } from "@/types/Homepage";
import { TransferType } from "@/types/InternalTransfer";
import { getItemFromEncryptedStorage, hasItemInStorage } from "@/utils/encrypted-storage";

import { BackgroundIcon } from "../assets/icons";
import {
  AppreciationFeedbackModal,
  AppreciationSection,
  BalanceCard,
  BulletinBoardSection,
  CardSection,
  ChatLiveButton,
  HeaderHomePage,
  QuickActionsReordererModal,
  QuickActionsSection,
  TopSpendingCategories,
  WhatsNextSection,
} from "../components";
import { useHomepageContent } from "../contexts/HomepageContentContext";
import { useAppreciationFeedback, useAppreciationsWithNoFeedback } from "../hooks/query-hooks";
import { FeedbackStatus } from "../types";

export default function DashboardScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { layout, refetchHomeConfigurations, account, refetchCurrentAccount, isError } = useHomepageContent();

  const [layoutErrorIsVisible, setLayoutErrorIsVisible] = useState(false);
  const { clearContext, setTransferType } = useInternalTransferContext();
  const { phoneNumber } = useAuthContext();
  const registerForNotifications = useRegisterNotifications();
  const { data: customerProfile } = useCustomerProfile();
  const auth = useAuthContext();

  const appreciationFeedback = useAppreciationFeedback();
  const { data: appreciationsWithNoFeedback } = useAppreciationsWithNoFeedback(i18n.language);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isInternalTransferTypeModalVisible, setIsInternalTransferTypeModalVisible] = useState<boolean>(false);
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
    if (isError) {
      setLayoutErrorIsVisible(true);
    }
  }, [isError]);

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
      if (screen === "InternalTransfers.LocalTransfer") {
        handleOnLocalTransferPress();
      }
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
    refetchHomeConfigurations();
    handleOnLoadingErrorClose();
  };

  const handleOnRefreshShortcutRefreshSection = () => {
    refetchHomeConfigurations();
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

  const handleOnLocalTransferPress = () => {
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.QuickTransferScreen",
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
    refetchCurrentAccount();
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["32p"],
  }));

  const balanceCardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+30"],
    paddingVertical: theme.spacing["12p"],
  }));

  const sectionsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const statusBarColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);
  const platformInsets = Platform.OS === "ios" ? ["left", "right"] : ["left", "right", "top"];

  return (
    <Page backgroundColor="neutralBase-60" insets={platformInsets}>
      <StatusBar barStyle="light-content" backgroundColor={statusBarColor} />

      <HeaderHomePage
        testID="Home.DashboardScreen:HeaderHomePage"
        firstName={customerProfile?.FirstName}
        isNotificationIconHighlighted={auth.notificationsReadStatus}
      />
      <ScrollView contentContainerStyle={contentStyle} scrollEventThrottle={16} bounces={false}>
        <View style={balanceCardContainerStyle}>
          <View style={styles.backgroundIcon}>
            <BackgroundIcon />
          </View>
          <BalanceCard
            testID="Home.DashboardScreen:BalanceCard"
            balance={account?.balance}
            accountNumber={account?.id}
            onBalanceRefresh={handleOnBalanceRefresh}
          />
        </View>
        <View style={styles.angledIcon}>
          <AngledIcon width="101%" color={statusBarColor} />
        </View>

        <QuickActionsSection
          testID="Home.DashboardScreen:QuickActionsSection"
          onRefresh={handleOnRefreshShortcutRefreshSection}
          onQuickActionPress={handleOnQuickActionPressed}
          onEditPress={handleOnEditShortcutsPress}
          isError={isError}
        />

        <View style={styles.dividerStyle} />
        <BulletinBoardSection testID="Home.DashboardScreen:BulletinBoardSection" isError={isError} />
        <Stack align="stretch" direction="vertical" gap="32p" style={sectionsContainerStyle}>
          {layout?.length !== 0 ? (
            <>
              {layout.map(section => {
                if (section.Name === WidgetTypesEnum.APPRECIATIONS && section.CustomerConfiguration.IsVisible) {
                  return (
                    <AppreciationSection
                      testID="Home.DashboardScreen:AppreciationSection"
                      key={section.Name}
                      onViewAllPress={handleOnAppreciationsPress}
                    />
                  );
                }
                if (section.Name === WidgetTypesEnum.ARTICLES && section.CustomerConfiguration.IsVisible) {
                  return (
                    <WhatsNextSection
                      testID="Home.DashboardScreen:WhatsNextSection"
                      key={section.Name}
                      onViewAllPress={handleOnWhatsNextPress}
                    />
                  );
                }
                if (section.Name === WidgetTypesEnum.INVITE_FRIEND && section.CustomerConfiguration.IsVisible) {
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

                if (section.Name === WidgetTypesEnum.MONEY_SPEND && section.CustomerConfiguration.IsVisible) {
                  return <TopSpendingCategories testID="Home.DashboardScreen:MoneySpendCategory" account={account} />;
                }

                return <Fragment key={section.Name} />;
              })}
            </>
          ) : layoutErrorIsVisible === true ? (
            <LoadingErrorNotification
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
      {/* TODO: remove byconfirm By PO team */}
      {/* {isAppreciationFeedbackModalVisible && (
        <AppreciationFeedbackModal
          testID="Home.DashboardScreen:AppreciationFeedbackModal"
          visible={isAppreciationFeedbackModalVisible}
          onClose={handleOnCloseFeedbackModal}
          onSubmitFeedback={handleOnSubmitAppreciationFeedback}
          title={appreciationsWithNoFeedback[feedbackIndex].AppreciationName}
          imageUrl={appreciationsWithNoFeedback[feedbackIndex].ImageUrl}
        />
      )} */}
    </Page>
  );
}

const styles = StyleSheet.create({
  angledIcon: {
    marginTop: -4,
    zIndex: -2,
  },
  backgroundIcon: {
    position: "absolute",
    right: 0,
    zIndex: -1,
  },
  dividerStyle: { height: 54 },
});
