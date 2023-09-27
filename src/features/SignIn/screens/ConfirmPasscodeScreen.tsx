import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
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
import { getItemFromEncryptedStorage } from "@/utils/encrypted-storage";

import { PASSCODE_LENGTH } from "../constants";
import { useSignInContext } from "../contexts/SignInContext";
import { useErrorMessages } from "../hooks";
import { useCreatePasscode, useResetPasscode } from "../hooks/query-hooks";
import { SignInStackParams } from "../SignInStack";
import { UserType } from "../types";

type ConfirmPasscodeScreenRouteProp = RouteProp<SignInStackParams, "SignIn.ConfirmPasscode">;

export default function ConfirmPasscodeScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { params } = useRoute<ConfirmPasscodeScreenRouteProp>();
  const {
    mutateAsync: resetPasscode,
    error: errorResetPassCode,
    isLoading: isLoadingResetPassCode,
  } = useResetPasscode();
  const { mutateAsync, error, isLoading } = useCreatePasscode();
  const loginUserError = params.currentPassCode ? (error as ApiError) : (errorResetPassCode as ApiError);
  const { errorMessages } = useErrorMessages(loginUserError);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [passCode, setPasscode] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const { isAuthenticated } = useAuthContext();
  const { isPasscodeCreated, setIsPasscodeCreated } = useSignInContext();
  const [user, setUser] = useState<UserType | null>(null);

  const errorMessage = [
    {
      message: t("SignIn.ConfirmPasscodeScreen.notification"),
      icon: <ErrorFilledCircleIcon />,
      variant: "error",
    },
  ];

  useEffect(() => {
    (async () => {
      const userData = await getItemFromEncryptedStorage("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    })();
  }, []);

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
      if (params.currentPassCode) {
        await mutateAsync({
          passCode: passcode,
          currentPasscode: params.currentPassCode,
        });
      } else {
        await resetPasscode({
          Passcode: passcode,
          isvaUserId: user?.UserId,
        });
      }
      setShowSuccessModal(true);
    } catch (exception) {
      setIsError(true);
      warn("Error update user passcode ", JSON.stringify(exception)); // log the error for debugging purposes
    }
  };

  return (
    <Page>
      {isLoading || isLoadingResetPassCode ? <LoadingIndicatorModal /> : null}
      <NavHeader
        withBackButton={true}
        onBackPress={
          isAuthenticated ? () => navigation.navigate("Settings.CustomerAccountManagementScreen") : undefined
        }
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
});
