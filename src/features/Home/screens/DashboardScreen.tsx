import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import InternalTransferTypeModal from "@/components/InternalTransferTypeModal";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import SelectTransferTypeModal from "@/components/SelectTransferTypeModal";
import Stack from "@/components/Stack";
import { useAuthContext } from "@/contexts/AuthContext";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { useCustomerProfile } from "@/hooks/use-customer-profile";
import useNotificationHandler from "@/hooks/use-notification-handler";
import useRegisterNotifications from "@/hooks/use-register-notifications";
import { mockRemoteMessageAppreciation } from "@/mocks/remoteNotificationData";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";

import HeaderSvg from "../assets/Header-homepage.svg";
import {
  AppreciationFeedbackModal,
  BalanceCard,
  CardSection,
  HeaderHomePage,
  QuickActionsSection,
  RewardsSection,
  TasksPreviewer,
  TopSpendingCategories,
  WhatsNextSection,
} from "../components";
import { useHomepageLayoutOrder } from "../contexts/HomepageLayoutOrderContext";
import {
  useAppreciationFeedback,
  useAppreciationsWithNoFeedback,
  useRefetchHomepageLayout,
  useTasks,
} from "../hooks/query-hooks";
import { FeedbackStatus } from "../types";

export default function DashboardScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { sections, homepageLayout } = useHomepageLayoutOrder();

  const [layoutErrorIsVisible, setLayoutErrorIsVisible] = useState(false);
  const { data: tasks } = useTasks();
  const { refetchAll } = useRefetchHomepageLayout();
  const account = useCurrentAccount();
  const { setInternalTransferEntryPoint, clearContext, setTransferType } = useInternalTransferContext();
  const { phoneNumber } = useAuthContext();
  const registerForNotifications = useRegisterNotifications();
  const { data: customerProfile } = useCustomerProfile();

  const appreciationFeedback = useAppreciationFeedback();
  const { data: appreciationsWithNoFeedback } = useAppreciationsWithNoFeedback(i18n.language);

  const [isInternalTransferTypeModalVisible, setIsInternalTransferTypeModalVisible] = useState<boolean>(false);
  const [isLocalTransferModalVisible, setIsLocalTransferModalVisible] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [feedbackIndex, setFeedbackIndex] = useState<number>(0);
  const isAppreciationFeedbackModalVisible =
    appreciationsWithNoFeedback !== undefined && feedbackIndex < appreciationsWithNoFeedback.length;
  //TODO will be removed once t2 finish some issue
  useNotificationHandler(mockRemoteMessageAppreciation);

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

  useEffect(() => {
    if (homepageLayout?.isError === true) {
      setLayoutErrorIsVisible(true);
    }
  }, [homepageLayout]);

  const handleOnQuickActionPressed = (screen: string, stack: string) => {
    if (screen === undefined || screen === "") return;
    if (stack === "InternalTransfers.InternalTransfersStack") {
      setInternalTransferEntryPoint("homepage");
      clearContext();
      setIsInternalTransferTypeModalVisible(screen === "InternalTransfers.PaymentsHubScreen");
      setIsLocalTransferModalVisible(screen === "InternalTransfers.LocalTransfer");
    } else navigation.navigate(stack, { screen });
  };

  const handleOnEditShortcutsPress = () => {
    navigation.navigate("Home.QuickActionsReorderModal");
  };

  const handleOnRewardsPress = () => {
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
      appreciationId: appreciationsWithNoFeedback[feedbackIndex].VoucherId,
      comment,
      voteId: status,
    });
  };

  const handleOnCloseFeedbackModal = () => {
    setFeedbackIndex(feedbackIndex + 1);
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
      <View style={styles.backgroundImage}>
        <HeaderSvg />
      </View>
      <SafeAreaView edges={["top"]} style={styles.container}>
        <HeaderHomePage firstName={customerProfile?.FirstName} />
        <BalanceCard
          balance={account.data?.balance}
          accountNumber={account.data?.id}
          currency={account.data?.currencyType}
        />
        <ScrollView contentContainerStyle={contentStyle} scrollEventThrottle={16}>
          <Stack align="stretch" direction="vertical" gap="32p">
            {tasks?.length > 0 ? <TasksPreviewer tasks={tasks} /> : null}
            {sections?.length !== 0 ? (
              <>
                {sections.map(section => {
                  if (section.type === "quick-actions") {
                    return (
                      <QuickActionsSection
                        key={section.type}
                        onViewAllPress={handleOnEditShortcutsPress}
                        onQuickActionPress={handleOnQuickActionPressed}
                      />
                    );
                  }
                  if (section.type === "appreciations") {
                    return <RewardsSection key={section.type} onViewAllPress={handleOnRewardsPress} />;
                  }
                  if (section.type === "articles") {
                    return <WhatsNextSection key={section.type} onViewAllPress={handleOnWhatsNextPress} />;
                  }
                  return <Fragment key={section.type} />;
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
          <TopSpendingCategories account={account} />
          
          {/* TODO: When the API is ready  */}
          <CardSection
            isReferFriend={false}
            onPress={() => navigation.navigate("GoalGetter.GoalGetterStack", { screen: "GoalGetter.GoalsAndProducts" })}
            title={t("Home.DashboardScreen.GoalGetter.title")}
            description={t("Home.DashboardScreen.GoalGetter.description")}
            buttonText={t("Home.DashboardScreen.GoalGetter.button")}
          />
          {/* TODO: When the API is ready  */}
          <CardSection
            onPress={() => navigation.navigate("Referral.ReferralStack", { screen: "Referral.HubScreen" })}
            isReferFriend={true}
            title={t("Home.DashboardScreen.ReferFriend.title")}
            description={t("Home.DashboardScreen.ReferFriend.description")}
            buttonText={t("Home.DashboardScreen.ReferFriend.button")}
          />
        </ScrollView>
      </SafeAreaView>
      <SelectTransferTypeModal
        isVisible={isLocalTransferModalVisible}
        onClose={() => setIsLocalTransferModalVisible(false)}
        setIsErrorModalVisible={setIsErrorModalVisible}
        entryPoint="homepage"
      />
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
      {isInternalTransferTypeModalVisible ? (
        <InternalTransferTypeModal
          onClose={() => setIsInternalTransferTypeModalVisible(false)}
          onCroatiaPress={handleOnCroatiaTransferPress}
          onAlrajhiPress={handleOnAlrajhiTransferPress}
        />
      ) : null}
      {isAppreciationFeedbackModalVisible && (
        <AppreciationFeedbackModal
          visible={isAppreciationFeedbackModalVisible}
          onClose={handleOnCloseFeedbackModal}
          onSubmitFeedback={handleOnSubmitAppreciationFeedback}
          title={appreciationsWithNoFeedback[feedbackIndex].VoucherName}
          imageUrl={appreciationsWithNoFeedback[feedbackIndex].ImageUrl}
        />
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
  },
});
