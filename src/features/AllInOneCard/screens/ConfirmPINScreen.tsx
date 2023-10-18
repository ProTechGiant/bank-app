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
import useNavigation from "@/navigation/use-navigation";

import { AllInOneCardParams } from "../AllInOneCardStack";

export default function ConfirmPINScreen() {
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.ConfirmPINScreen">>();
  const { passCode } = route.params;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [confirmedPassCode, setConfirmedPassCode] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const PASSCODE_LENGTH = 4;
  const [numberOfAttempts, setNumberOfAttempts] = useState(0);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

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
        navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.CallBackVerification" });
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
  const handleSetNewPIN = () => {
    setConfirmedPassCode("");
    setIsError(false);
    navigation.navigate("AllInOneCard.CreatePINScreen");
  };

  const handleOnClose = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.CardReadyMessage" });
  };
  return (
    <Page>
      <NavHeader
        title={
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={2} totalStep={2} />
          </View>
        }
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
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
