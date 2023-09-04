import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import InternalTransferTypeModal from "@/components/InternalTransferTypeModal";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import SelectTransferTypeModal from "@/components/SelectTransferTypeModal";
import Stack from "@/components/Stack";
import { useAuthContext } from "@/contexts/AuthContext";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useAppreciationFeedback, useAppreciationsWithNoFeedback } from "@/features/Appreciation/hooks/query-hooks";
import { TransferType } from "@/features/InternalTransfers/types";
import { useCurrentAccount } from "@/hooks/use-accounts";
import useRegisterNotifications from "@/hooks/use-register-notifications";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { ProfileIcon } from "../assets";
import HeaderSvg from "../assets/Header-homepage.svg";
import {
  AppreciationFeedbackModal,
  BalanceCard,
  QuickActionsSection,
  RewardsSection,
  TasksPreviewer,
  WhatsNextSection,
} from "../components";
import { useHomepageLayoutOrder } from "../contexts/HomepageLayoutOrderContext";
import { useRefetchHomepageLayout, useTasks } from "../hooks/query-hooks";
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

  const appreciationFeedback = useAppreciationFeedback();
  const { data: appreciationsWithNoFeedback } = useAppreciationsWithNoFeedback(i18n.language);

  const [isInternalTransferTypeModalVisible, setIsInternalTransferTypeModalVisible] = useState<boolean>(false);
  const [isLocalTransferModalVisible, setIsLocalTransferModalVisible] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [feedbackIndex, setFeedbackIndex] = useState<number>(0);
  const isAppreciationFeedbackModalVisible =
    appreciationsWithNoFeedback !== undefined && feedbackIndex < appreciationsWithNoFeedback.length;

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

  const handleOnEditLayoutPress = () => {
    navigation.navigate("Home.SectionsReordererModal");
  };

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

  const profileSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    height: 34,
    flexDirection: "row-reverse",
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.backgroundImage}>
        <HeaderSvg />
      </View>
      <SafeAreaView edges={["top"]} style={styles.container}>
        <View style={profileSectionStyle}>
          <Pressable onPress={handleOnEditLayoutPress}>
            <ProfileIcon />
          </Pressable>
        </View>
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
                  if (section.type === "rewards") {
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
