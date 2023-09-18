import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import ApiError from "@/api/ApiError";
import { ErrorFilledCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import LoadingIndicatorModal from "@/components/LoadingIndicatorModal";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import { useAuthContext } from "@/contexts/AuthContext";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";

import { PASSCODE_LENGTH } from "../constants";
import { useSignInContext } from "../contexts/SignInContext";
import { useErrorMessages } from "../hooks";
import { useMockResetPasscode } from "../hooks/query-hooks";
import { SignInStackParams } from "../SignInStack";

type ConfirmPasscodeScreenRouteProp = RouteProp<SignInStackParams, "SignIn.ConfirmPasscode">;

export default function ConfirmPasscodeScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { params } = useRoute<ConfirmPasscodeScreenRouteProp>();
  // TODO will be updated when API is ready
  const { resetPasscode, error, isLoading } = useMockResetPasscode(); // Use the mock API hook
  const loginUserError = error as ApiError;
  const { errorMessages } = useErrorMessages(loginUserError);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [passCode, setPasscode] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const { isAuthenticated } = useAuthContext();
  const { isPasscodeCreated, setIsPasscodeCreated } = useSignInContext();

  const errorMessage = [
    {
      message: t("SignIn.ConfirmPasscodeScreen.notification"),
      icon: <ErrorFilledCircleIcon />,
      variant: "error",
    },
  ];

  const handleOnChangeText = (passcode: string) => {
    setPasscode(passcode);

    if (passcode.length === PASSCODE_LENGTH) {
      if (passcode === params.passCode) {
        handleSubmit(passcode);
        setIsError(false);
      } else {
        setIsError(true);
      }
      setPasscode("");
    }
  };

  const handleSuccessModal = () => {
    setIsPasscodeCreated(true);
    setShowSuccessModal(false);

    if (isAuthenticated) navigation.navigate("Settings.CustomerAccountManagementScreen");
    else navigation.navigate("SignIn.Passcode");
  };

  const resetError = () => {
    setIsError(false);
  };

  const handleSubmit = async (passcode: string) => {
    try {
      await resetPasscode(passcode);
      setShowSuccessModal(true);
    } catch (exception) {
      setIsError(true);
      warn("Error resetting user passcode ", JSON.stringify(exception)); // log the error for debugging purposes
    }
  };

  return (
    <Page>
      {isLoading ? <LoadingIndicatorModal /> : null}
      <NavHeader
        withBackButton={true}
        onBackPress={isAuthenticated ? () => navigation.navigate("Settings.AccountSettings") : undefined}
      />
      <View style={styles.containerStyle}>
        <PasscodeInput
          errorMessage={errorMessages.length ? errorMessages : errorMessage}
          title={t("SignIn.ConfirmPasscodeScreen.title")}
          subTitle={t("SignIn.ConfirmPasscodeScreen.subTitle")}
          isError={isError}
          length={6}
          resetError={resetError}
          passcode={passCode}
          showModel={errorMessages.length}
        />
        <View style={styles.bottomSpace}>
          <NumberPad passcode={passCode} setPasscode={handleOnChangeText} />
        </View>
      </View>
      <NotificationModal
        message={
          !isPasscodeCreated
            ? t("SignIn.ConfirmPasscodeScreen.createPasscodeModalMessage")
            : t("SignIn.ConfirmPasscodeScreen.updatePasscodeModalMessage")
        }
        isVisible={showSuccessModal}
        title={
          !isPasscodeCreated
            ? t("SignIn.ConfirmPasscodeScreen.createPasscodeModalTitle")
            : t("SignIn.ConfirmPasscodeScreen.updatePasscodeModalTitle")
        }
        variant="success"
        buttons={{
          primary: <Button onPress={handleSuccessModal}>{t("SignIn.ConfirmPasscodeScreen.goBack")}</Button>,
        }}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    height: "100%",
  },
  bottomSpace: {
    bottom: 40
  },
});
