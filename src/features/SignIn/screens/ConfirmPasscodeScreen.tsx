import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import ApiError from "@/api/ApiError";
import { ErrorFilledCircleIcon } from "@/assets/icons";
import LoadingIndicatorModal from "@/components/LoadingIndicatorModal";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import { useAuthContext } from "@/contexts/AuthContext";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { PASSCODE_LENGTH } from "../constants";
import { useSignInContext } from "../contexts/SignInContext";
import { useErrorMessages } from "../hooks";
import { useCreatePasscode } from "../hooks/query-hooks";
import { SignInStackParams } from "../SignInStack";

type ConfirmPasscodeScreenRouteProp = RouteProp<SignInStackParams, "SignIn.ConfirmPasscode">;

const ConfirmPasscodeScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { params } = useRoute<ConfirmPasscodeScreenRouteProp>();
  const { mutateAsync, error, isLoading } = useCreatePasscode();
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
    },
  ];

  const handleOnChangeText = (passcode: string) => {
    setPasscode(passcode);

    if (passcode.length === PASSCODE_LENGTH) {
      if (passcode === params.passCode) {
        handleSubmit();
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
    if (isAuthenticated) navigation.navigate("Settings.AccountSettings");
    else navigation.navigate("SignIn.Passcode");
  };

  const resetError = () => {
    setIsError(false);
  };

  const handleSubmit = async () => {
    try {
      await mutateAsync(passCode);
      setShowSuccessModal(true);
    } catch (exception) {
      setIsError(true);
      warn("Error updating user passcode ", JSON.stringify(exception)); // log the error for debugging purposes
    }
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing.full,
  }));

  return (
    <Page>
      {isLoading ? <LoadingIndicatorModal /> : null}
      <NavHeader
        withBackButton={true}
        onBackPress={isAuthenticated ? () => navigation.navigate("Settings.AccountSettings") : undefined}
      />
      <View style={containerStyle}>
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
        <NumberPad passcode={passCode} setPasscode={handleOnChangeText} />
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
        onClose={handleSuccessModal}
        variant="success"
      />
    </Page>
  );
};
export default ConfirmPasscodeScreen;
