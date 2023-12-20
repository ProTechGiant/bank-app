import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Radio from "@/components/Radio";
import { useToasts } from "@/contexts/ToastsContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CloseCardIcon } from "../assets/icons";
import { PermanentCard } from "../components";
import { useAllInOneCardOTP, useCardCloseOrReplaceReasons } from "../hooks/query-hooks";
import {
  feesNotPaidRejectionReason,
  pendingTransactionsRejectionReason,
  remainingBalanceRejectionReason,
} from "../mocks";

export default function PermanentCardClosureScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const otpFlow = useOtpFlow();
  const addToast = useToasts();
  const otpAIO = useAllInOneCardOTP();
  const { data: dataReasons, isLoading } = useCardCloseOrReplaceReasons({ ReasonType: "Closure" });
  const [isWarningModalVisible, setIsWarningModalVisible] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [reasonIsToggled, setReasonIsToggled] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleCloseCardMainButton = () => {
    if (pendingTransactionsRejectionReason) {
      setErrorMessage(t("AllInOneCard.PermanentCardClosureScreen.errorModal.rejectPendingTransactions"));
      setIsErrorModalVisible(true);
      return;
    }
    if (remainingBalanceRejectionReason) {
      setErrorMessage(t("AllInOneCard.PermanentCardClosureScreen.errorModal.rejectRemainingBalance"));
      setIsErrorModalVisible(true);
      return;
    }
    if (feesNotPaidRejectionReason) {
      setErrorMessage(t("AllInOneCard.PermanentCardClosureScreen.errorModal.rejectFeesNotPaid"));
      setIsErrorModalVisible(true);
      return;
    }
    setIsWarningModalVisible(true);
  };

  const handleOnCloseCard = () => {
    setIsWarningModalVisible(false);
    try {
      otpFlow.handle({
        action: {
          to: "AllInOneCard.PermanentCardClosureScreen",
        },
        otpVerifyMethod: "aio-card/closure/validate",
        // TODO: Add otpOptionalParams when api finished from BE team
        onOtpRequest: async () => {
          return await otpAIO.mutateAsync();
        },
        onFinish: async status => {
          if (status === "success") {
            navigation.navigate("AllInOneCard.RequestSuccessfullyScreen", {
              title: t("AllInOneCard.PermanentCardClosureScreen.successRequest.title"),
              description: t("AllInOneCard.PermanentCardClosureScreen.successRequest.description"),
              buttonText: t("AllInOneCard.PermanentCardClosureScreen.successRequest.buttonText"),
              onPress: () => {
                navigation.navigate("Home.HomeTabs", { screen: "Home" });
              },
              imageLogo: <CloseCardIcon />,
            });
          }
          if (status === "fail") {
            addToast({
              variant: "warning",
              message: t("AllInOneCard.ActivatedCardScreen.subscriptionFailed"),
            });
          }
        },
      });
    } catch (error) {
      warn("All In One Card", "error subscribing to All In One Card", JSON.stringify(error));
    }
  };

  const handleOnFailedCloseCard = () => {
    setIsErrorModalVisible(false);
    navigation.navigate("Home.HomeTabs", { screen: "Cards" });
  };

  const bodyContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));
  const textPaddingStyle = useThemeStyles<TextStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
    paddingBottom: theme.spacing["24p"],
  }));
  const boxContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["16p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.medium,
    width: "100%",
  }));
  const paddingContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
  }));

  return (
    <Page testID="AllInOneCard.PermanentCardClosureScreen:Page" insets={["left", "right", "top"]}>
      <NavHeader
        title={t("AllInOneCard.PermanentCardClosureScreen.title")}
        testID="AllInOneCard.PermanentCardClosureScreen:navHeader"
      />
      <View style={styles.container}>
        <ScrollView>
          <PermanentCard />
          <Stack direction="vertical" style={bodyContainerStyle}>
            <Typography.Text size="large" weight="medium">
              {t("AllInOneCard.PermanentCardClosureScreen.reason")}
            </Typography.Text>

            <Typography.Text size="callout" color="neutralBase+20" style={textPaddingStyle}>
              {t("AllInOneCard.PermanentCardClosureScreen.reasonDescription")}{" "}
            </Typography.Text>
            <Stack direction="vertical" gap="16p" style={styles.fullWidth}>
              {dataReasons !== undefined ? (
                dataReasons.ReasonsList.map(item => (
                  <Pressable onPress={() => setReasonIsToggled(item.Code)} key={item.Code} style={styles.fullWidth}>
                    <Stack
                      direction="horizontal"
                      justify="space-between"
                      align="center"
                      gap="8p"
                      key={item.Code}
                      style={boxContainerStyle}>
                      <Typography.Text
                        size="callout"
                        weight={item.Code === reasonIsToggled ? "medium" : undefined}
                        color="neutralBase+30">
                        {item.Name}
                      </Typography.Text>
                      <Radio
                        isSelected={item.Code === reasonIsToggled}
                        onPress={() => setReasonIsToggled(item.Code)}
                        testID="AllInOneCard.RewardsScreen:Radio"
                      />
                    </Stack>
                  </Pressable>
                ))
              ) : isLoading ? (
                <View style={styles.loadingContainer}>
                  <FullScreenLoader />
                </View>
              ) : null}
            </Stack>
          </Stack>
        </ScrollView>
        <View style={paddingContainerStyle}>
          <Button
            disabled={!reasonIsToggled}
            onPress={handleCloseCardMainButton}
            testID="AllInOneCard.PermanentCardClosureScreen:Button">
            {t("AllInOneCard.PermanentCardClosureScreen.mainButton")}
          </Button>
        </View>
      </View>
      <NotificationModal
        variant="warning"
        title={t("AllInOneCard.PermanentCardClosureScreen.warningModal.title")}
        message={t("AllInOneCard.PermanentCardClosureScreen.warningModal.message")}
        isVisible={isWarningModalVisible}
        buttons={{
          primary: (
            <Button onPress={handleOnCloseCard} testID="AllInOneCard.PermanentCardClosureScreen:primaryButton">
              {t("AllInOneCard.PermanentCardClosureScreen.warningModal.closeButton")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={() => setIsWarningModalVisible(false)}
              testID="AllInOneCard.PermanentCardClosureScreen:secondaryButton">
              {t("AllInOneCard.PermanentCardClosureScreen.warningModal.cancelButton")}
            </Button>
          ),
        }}
        testID="AllInOneCard.PermanentCardClosureScreen:WarningModal"
      />
      <NotificationModal
        variant="error"
        title={t("AllInOneCard.PermanentCardClosureScreen.errorModal.title")}
        message={errorMessage}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
        buttons={{
          primary: (
            <Button
              onPress={handleOnFailedCloseCard}
              testID="AllInOneCard.PermanentCardClosureScreen:primaryErrorButton">
              {t("AllInOneCard.PermanentCardClosureScreen.errorModal.closeButton")}
            </Button>
          ),
        }}
        testID="AllInOneCard.PermanentCardClosureScreen:WarningModal"
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullWidth: {
    width: "100%",
  },
  loadingContainer: {
    alignSelf: "center",
    flex: 1,
  },
});
