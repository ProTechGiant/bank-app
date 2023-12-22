import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ErrorFilledCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
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
import { handleOnResetPasscode, useCreatePasscode } from "../hooks/query-hooks";
import { SignInStackParams } from "../SignInStack";
import { UserType } from "../types";

type ConfirmPasscodeScreenRouteProp = RouteProp<SignInStackParams, "SignIn.ConfirmPasscode">;

export default function ConfirmPasscodeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isAuthenticated } = useAuthContext();
  const { correlationId, setIsPasscodeCreated, isPasscodeCreated } = useSignInContext();
  const { params } = useRoute<ConfirmPasscodeScreenRouteProp>();
  const [passCode, setPasscode] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const { mutateAsync: createPasscodeMutateAsync, isLoading } = useCreatePasscode();

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

  const handleSuccessModal = () => {
    setIsPasscodeCreated(true);
    setShowSuccessModal(false);
    navigation.navigate("Settings.CustomerAccountManagementScreen");
  };

  const handleOnChangeText = async (passcode: string) => {
    setPasscode(passcode);

    if (passcode.length === PASSCODE_LENGTH) {
      if (passcode === params.passCode) {
        setIsError(false);
        if (params.currentPassCode) {
          handleOnChangePasscode();
        } else {
          if (!correlationId) {
            warn("ERROR", "a valid correlationId must be required");
          } else {
            navigation.navigate("Ivr.IvrWaitingScreen", {
              onApiCall: () =>
                handleOnResetPasscode({
                  correlationId: correlationId,
                  isvaUserId: user?.IsvaUserId,
                  Passcode: params.passCode,
                }),
              onError: handleOnCloseErrorModal,
              onSuccess: () => navigation.navigate("SignIn.Iqama"),
              onBack: () => navigation.navigate("SignIn.Iqama"),
              varient: "modal",
            });
          }
        }
      } else {
        setIsError(true);
      }
      setPasscode("");
    }
  };

  const handleOnChangePasscode = () => {
    try {
      createPasscodeMutateAsync({ passCode: passCode, currentPasscode: params.currentPassCode });
      setShowSuccessModal(true);
    } catch (error) {
      warn("Error", error?.message);
    }
  };

  const handleOnCloseErrorModal = () => {
    navigation.navigate("SignIn.CreatePasscode", {
      currentPassCode: params.currentPassCode,
    });
  };

  const resetError = () => {
    setIsError(false);
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Page>
      <NavHeader
        withBackButton={true}
        onBackPress={
          isAuthenticated ? () => navigation.navigate("Settings.CustomerAccountManagementScreen") : undefined
        }
      />
      <View style={styles.containerStyle}>
        <PasscodeInput
          errorMessage={errorMessage}
          title={t("SignIn.ConfirmPasscodeScreen.title")}
          subTitle={t("SignIn.ConfirmPasscodeScreen.subTitle")}
          isError={isError}
          length={6}
          resetError={resetError}
          passcode={passCode}
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
            : isAuthenticated
            ? t("SignIn.ConfirmPasscodeScreen.updatePasscodeModalTitle")
            : t("SignIn.ConfirmPasscodeScreen.resetPasscodeModalTitle")
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
