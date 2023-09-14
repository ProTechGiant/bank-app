import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import InternalTransferTypeModal from "@/components/InternalTransferTypeModal";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import SelectTransferTypeModal from "@/components/SelectTransferTypeModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
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
  QuickActionsReordererModal,
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
  useQuickActions,
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
  const { refetch: refetchQuickActions } = useQuickActions();

  const appreciationFeedback = useAppreciationFeedback();
  const { data: appreciationsWithNoFeedback } = useAppreciationsWithNoFeedback(i18n.language);

  const [isVisible, setIsVisible] = useState<boolean>(false);
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
    setIsVisible(true);
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

  const shortcutSectionStackStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
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
          <Stack direction="vertical" gap="20p" align="stretch" style={shortcutSectionStackStyle}>
            <Stack direction="horizontal" justify="space-between" align="center">
              <Typography.Text size="title3" weight="medium" disabled={true}>
                {t("Home.DashboardScreen.yourShortcutsLabel")}
              </Typography.Text>
              <Pressable onPress={handleOnEditShortcutsPress}>
                <Typography.Text size="footnote" weight="medium">
                  {t("Home.DashboardScreen.editShortcutsButton")}
                </Typography.Text>
              </Pressable>
            </Stack>
            <QuickActionsSection
              onRefresh={handleOnRefreshShortcutRefreshSection}
              onQuickActionPress={handleOnQuickActionPressed}
            />
          </Stack>
          <Stack align="stretch" direction="vertical" gap="32p">
            {tasks?.length > 0 ? <TasksPreviewer tasks={tasks} /> : null}
            {sections?.length !== 0 ? (
              <>
                {sections.map(section => {
                  if (section.type === "appreciations" && section.isItemChecked) {
                    return <RewardsSection key={section.type} onViewAllPress={handleOnRewardsPress} />;
                  }
                  if (section.type === "articles" && section.isItemChecked) {
                    return <WhatsNextSection key={section.type} onViewAllPress={handleOnWhatsNextPress} />;
                  }
                  if (section.type === "invite-friend" && section.isItemChecked) {
                    return (
                      <CardSection
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
                    return <TopSpendingCategories account={account} />;
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
        </ScrollView>
      </SafeAreaView>
      <QuickActionsReordererModal isVisible={isVisible} onClose={() => setIsVisible(false)} />
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
