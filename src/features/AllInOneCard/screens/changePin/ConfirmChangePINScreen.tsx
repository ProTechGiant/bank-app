import { RouteProp, useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ProgressIndicator } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import { useToasts } from "@/contexts/ToastsContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";

import { AllInOneCardParams } from "../../AllInOneCardStack";
import { useAIOPinChange } from "../../hooks/query-hooks";
import { mockPinChangeRequest } from "../../mocks";

export default function ConfirmChangePINScreen() {
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.ConfirmPINScreen">>();
  const { passCode } = route.params;
  const { t } = useTranslation();
  const addToast = useToasts();
  const navigation = useNavigation();
  const otpFlow = useOtpFlow();
  const [confirmedPassCode, setConfirmedPassCode] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const PASSCODE_LENGTH = 4;
  const [numberOfAttempts, setNumberOfAttempts] = useState(0);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const { mutateAsync: changeCardPin } = useAIOPinChange();

  useFocusEffect(
    React.useCallback(() => {
      setNumberOfAttempts(0);
      setIsErrorModalVisible(false);
      setConfirmedPassCode("");
      setIsError(false);
    }, [])
  );

  const errorMessages = [
    {
      message: t("AllInOneCard.ConfirmPINScreen.errorMessage"),
    },
  ];

  const handleOnChangeText = (enteredPassCode: string) => {
    setConfirmedPassCode(enteredPassCode);
    if (enteredPassCode.length === PASSCODE_LENGTH) {
      if (enteredPassCode === passCode) {
        handleOnPinSuccess();
      } else {
        if (numberOfAttempts < 2) {
          setIsError(true);
          setNumberOfAttempts(numberOfAttempts + 1);
          setTimeout(() => {
            setConfirmedPassCode("");
          }, 200);
        } else {
          setIsErrorModalVisible(true);
        }
      }
    }
  };

  const handleOnPinSuccess = async () => {
    try {
      const request = mockPinChangeRequest;
      const { OtpId } = await changeCardPin(request);
      otpFlow.handle({
        action: {
          to: "AllInOneCard.confirmChangePin",
        },
        otpVerifyMethod: "aio-card/pin-change/otp-validation",
        // TODO: Add otpOptionalParams when api finished from BE team

        otpChallengeParams: {
          OtpId: OtpId,
        },
        onFinish: async status => {
          if (status === "success") {
            addToast({
              variant: "success",
              message: t("AllInOneCard.ChangePin.successPinChanged"),
            });
            navigation.navigate("AllInOneCard.SettingsScreen");
          } else if (status === "fail") {
            warn("All In One Card", "error changing pin of All In One Card");
          }
        },
      });
    } catch (error) {
      warn("All In One Card", "error changing pin of All In One Card", JSON.stringify(error));
    }
  };

  const handleSetNewPIN = () => {
    setConfirmedPassCode("");
    setIsError(false);
    navigation.navigate("AllInOneCard.changePin");
  };

  const handleOnClose = () => {
    setIsErrorModalVisible(false);
    navigation.navigate("AllInOneCard.SettingsScreen");
  };

  return (
    <Page testID="AllInOneCard.ConfirmChangePINScreen:Page">
      <NavHeader
        title={
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={2} totalStep={2} />
          </View>
        }
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
        testID="AllInOneCard.ConfirmChangePINScreen:NavHeader"
      />
      <ContentContainer>
        <View style={styles.containerStyle}>
          <PasscodeInput
            errorMessage={errorMessages}
            title={t("AllInOneCard.ConfirmPINScreen.title")}
            subTitle={t("AllInOneCard.ConfirmPINScreen.description")}
            isError={isError}
            length={PASSCODE_LENGTH}
            passcode={confirmedPassCode}
            testID="AllInOneCard.ConfirmChangePINScreen:PasscodeInput"
          />
          <NumberPad passcode={confirmedPassCode} setPasscode={handleOnChangeText} />
        </View>
      </ContentContainer>

      <NotificationModal
        variant="error"
        title={t("AllInOneCard.ConfirmPINScreen.errorModal.title")}
        message={t("AllInOneCard.ConfirmPINScreen.errorModal.content")}
        isVisible={isErrorModalVisible}
        onClose={handleOnClose}
        buttons={{
          primary: (
            <Button onPress={handleSetNewPIN}>{t("AllInOneCard.ConfirmPINScreen.errorModal.setNewButton")}</Button>
          ),
        }}
      />
    </Page>
  );
}
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  progressIndicator: { width: "80%" },
});
