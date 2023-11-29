import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, useWindowDimensions, View } from "react-native";

import ApiError from "@/api/ApiError";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import delayTransition from "@/utils/delay-transition";

import { useCardReplacement, useFreezeCard } from "../../hooks/query-hooks";
import SetPinScreen from "../SetPinScreen";
import ReportCardSuccessScreen from "./ReportCardSuccessScreen";
import SelectReportReason from "./SelectReportReason";

export default function ReportCardScreen() {
  const route = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.ReportCardScreen">>();
  const { t } = useTranslation();

  const navigation = useNavigation();
  const dimensions = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const cardStatus = route.params.cardStatus;

  const freezeCardAsync = useFreezeCard();
  const useCardReplacementAsync = useCardReplacement();

  const [mode, setMode] = useState<"input" | "setpin" | "done">("input");
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState<"stolen" | "lost" | "Card fraud">();
  const [isLockedSuccess, setIsLockedSuccess] = useState(false);
  const [cardId] = useState(route.params.cardId);
  const [isWaitPeriodModalVisible, setIsWaitPeriodModalVisible] = useState(false);
  const [isLockConfirmationModalVisible, setIsLockConfirmationModalVisible] = useState(false);

  const currentStep = mode === "input" ? 1 : 2;
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: dimensions.width * (currentStep - 1) });
  }, [currentStep, dimensions.width, mode]);

  const handleOnSelectReasonPress = (selectedReason: "stolen" | "lost" | "Card fraud") => {
    setReportReason(selectedReason);
    setIsConfirmationModalVisible(true);
  };

  const handleLockConfirmationModalConfirmPress = async () => {
    try {
      const response = await freezeCardAsync.mutateAsync({ cardId });
      if (response.Status !== "LOCK") {
        setIsLockedSuccess(false);
        throw new Error("Received unexpected response from back-end");
      } else {
        setIsLockedSuccess(true);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errorContent.Message.includes(ERROR_CARD_STATUS_WAIT_PERIOD)) {
          setIsWaitPeriodModalVisible(true);
        } else {
          setIsErrorModalVisible(true);
        }
      }
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
    }
  };

  const handleLockConfirmationModalCancelPress = () => {
    setIsLockConfirmationModalVisible(false);
  };

  const handleOnFreezePress = () => {
    setIsLockConfirmationModalVisible(true);
  };

  const handleOnConfirm = async () => {
    if (reportReason === undefined) return;
    try {
      setIsConfirmationModalVisible(false);
      delayTransition(() => {
        setMode("setpin");
      });
    } catch (error) {
      setIsConfirmationModalVisible(false);
      delayTransition(() => {
        setIsErrorModalVisible(true);
      });
      warn("card-actions", "Could not replace the card ", JSON.stringify(error));
    }
  };

  const handleOnOk = () => {
    setIsLockedSuccess(false);
    navigation.goBack();
  };

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnPinSet = (pin: string | undefined) => {
    if (pin === undefined || cardId === undefined || reportReason === undefined) {
      setIsErrorModalVisible(true);
      return;
    }
    navigation.navigate("CardActions.CallBackVerificationScreen", { cardId: cardId, pin: pin, reason: reportReason });
  };

  return mode === "done" ? (
    <ReportCardSuccessScreen cardId={cardId} />
  ) : (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader onBackPress={handleOnBackPress} testID="CardActions.ReportCardScreen:NavHeader">
          <ProgressIndicator currentStep={currentStep} totalStep={2} />
        </NavHeader>
        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          keyboardShouldPersistTaps="always"
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}>
          <View style={{ width: dimensions.width }}>
            {mode === "input" ? (
              <SelectReportReason
                cardStatus={cardStatus}
                onContinuePress={handleOnSelectReasonPress}
                onFreezePress={handleOnFreezePress}
              />
            ) : mode === "setpin" ? (
              <SetPinScreen showSteps={false} getPin={handleOnPinSet} />
            ) : null}
          </View>
        </ScrollView>
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />

      <NotificationModal
        variant="success"
        title={t("CardActions.ReportCardScreen.CardLockedSuccess.title")}
        isVisible={isLockedSuccess}
        buttons={{
          primary: (
            <Button onPress={handleOnOk} testID="CardActions.ReportCardScreen:CardLockedSuccessModalOkButton">
              {t("CardActions.ReportCardScreen.CardLockedSuccess.okButton")}
            </Button>
          ),
        }}
        testID="CardActions.ReportCardScreen:CardLockedSuccessModal"
      />

      <NotificationModal
        variant="warning"
        title={t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.alertTitle")}
        message={t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.alertMessage")}
        isVisible={isConfirmationModalVisible}
        buttons={{
          primary: (
            <Button
              loading={useCardReplacementAsync.isLoading}
              onPress={handleOnConfirm}
              testID="CardActions.ReportCardScreen:ConfirmDeliveryAddressModalConfirmButton">
              {t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.confirmButton")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={() => setIsConfirmationModalVisible(false)}
              testID="CardActions.ReportCardScreen:ConfirmDeliveryAddressModalCancelButton">
              {t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.cancelButton")}
            </Button>
          ),
        }}
        testID="CardActions.ReportCardScreen:ConfirmDeliveryAddressModal"
      />

      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button onPress={() => setIsWaitPeriodModalVisible(false)}>
              {t("CardActions.ReportCardScreen.waitPeriodModal.okButton")}
            </Button>
          ),
        }}
        message={t("CardActions.ReportCardScreen.waitPeriodModal.message")}
        title={t("CardActions.ReportCardScreen.waitPeriodModal.title", {
          cardState: t("CardActions.ReportCardScreen.waitPeriodModal.lockState"),
        })}
        isVisible={isWaitPeriodModalVisible}
        testID="CardActions.ReportCardScreen:CardStatusChangeWaitModal"
      />

      {/* Lock confirmation modal */}
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button
              loading={freezeCardAsync.isLoading}
              disabled={freezeCardAsync.isLoading}
              onPress={handleLockConfirmationModalConfirmPress}
              testID="CardActions.ReportCardScreen:CardLockedModalConfirmButton">
              {t("CardActions.ReportCardScreen.lockConfirmationModal.confirm")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={handleLockConfirmationModalCancelPress}
              testID="CardActions.ReportCardScreen:CardLockedModalCancelButton">
              {t("CardActions.ReportCardScreen.lockConfirmationModal.cancel")}
            </Button>
          ),
        }}
        message={t("CardActions.ReportCardScreen.lockConfirmationModal.description")}
        title={t("CardActions.ReportCardScreen.lockConfirmationModal.title")}
        isVisible={isLockConfirmationModalVisible}
        testID="CardActions.ReportCardScreen:CardLockedModal"
      />
    </>
  );
}

const ERROR_CARD_STATUS_WAIT_PERIOD = "Cannot Update State Until 5 Minutes Pass";
