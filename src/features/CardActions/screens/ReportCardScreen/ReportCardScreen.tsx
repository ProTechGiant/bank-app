import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, useWindowDimensions, View } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import delayTransition from "@/utils/delay-transition";

import { useChangeCardStatus, useFreezeCard } from "../../hooks/query-hooks";
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
  const useReportCardAsync = useChangeCardStatus();
  const otpFlow = useOtpFlow<AuthenticatedStackParams>();

  const [mode, setMode] = useState<"input" | "done">("input");
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState<"stolen" | "lost" | "damaged">();
  const [isLockedSuccess, setIsLockedSuccess] = useState(false);
  const [cardId] = useState(route.params.cardId);

  const currentStep = mode === "input" ? 1 : 2;
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: dimensions.width * (currentStep - 1) });
  }, [currentStep, dimensions.width, mode]);

  const handleOnSelectReasonPress = (selectedReason: "stolen" | "lost" | "damaged") => {
    setReportReason(selectedReason);
    setIsConfirmationModalVisible(true);
  };

  const handleOnFreezePress = async () => {
    try {
      const response = await freezeCardAsync.mutateAsync({ cardId });
      if (response.Status !== "lock") {
        setIsLockedSuccess(false);
        throw new Error("Received unexpected response from back-end");
      } else {
        setIsLockedSuccess(true);
      }
    } catch (error) {
      setIsErrorModalVisible(true);
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
    }
  };

  const handleOnConfirm = async () => {
    if (reportReason === undefined) return;
    setIsConfirmationModalVisible(false);
    delayTransition(() => {
      try {
        otpFlow.handle({
          action: {
            to: "CardActions.ReportCardScreen",
            params: {
              cardId: cardId,
            },
          },
          otpOptionalParams: {
            CardId: cardId,
          },

          otpVerifyMethod: "card-actions",
          onOtpRequest: async () => {
            const resendResponse = await useReportCardAsync.mutateAsync({
              cardId: cardId,
              status: "CANCELLED",
              Reason: reportReason,
            });

            return resendResponse;
          },
          onFinish: status => {
            if (status === "cancel") {
              return;
            }
            if (status === "fail") {
              setIsErrorModalVisible(true);
            } else {
              setMode("done");
            }
          },
        });
      } catch (error) {
        setIsErrorModalVisible(true);
      }
    });
  };

  const handleOnOk = () => {
    setIsLockedSuccess(false);
    navigation.goBack();
  };

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  return mode === "done" ? (
    <ReportCardSuccessScreen cardId={cardId} />
  ) : (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader title={t("CardActions.ReportCardScreen.navTitle")} onBackPress={handleOnBackPress}>
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
            <SelectReportReason
              cardStatus={cardStatus}
              onContinuePress={handleOnSelectReasonPress}
              onFreezePress={handleOnFreezePress}
            />
          </View>
          {/* need to finalize this in next PR as confirmation need from POS */}
          {/* <View style={{ width: dimensions.width }}>
            <PickCardTypeScreen
              onCancel={() => {
                console.log("");
              }}
              onSelected={() => console.log("HEllo")}
              variant="order"
            />
          </View> */}
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
          primary: <Button onPress={handleOnOk}>{t("CardActions.ReportCardScreen.CardLockedSuccess.okButton")}</Button>,
        }}
      />

      <NotificationModal
        variant="warning"
        title={t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.alertTitle")}
        message={t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.alertMessage")}
        isVisible={isConfirmationModalVisible}
        buttons={{
          primary: (
            <Button onPress={handleOnConfirm}>
              {t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.confirmButton")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => setIsConfirmationModalVisible(false)}>
              {t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.cancelButton")}
            </Button>
          ),
        }}
      />
    </>
  );
}
