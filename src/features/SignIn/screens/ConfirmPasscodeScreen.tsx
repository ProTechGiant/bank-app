import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import Passcode from "@/components/PasscodeInput";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { MAX_FAILED_ATTEMPTS } from "../constants";
import { SignInStackParams } from "../SignInStack";

type ConfirmPasscodeScreenRouteProp = RouteProp<SignInStackParams, "SignIn.ConfirmPasscode">;

const ConfirmPasscodeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<ConfirmPasscodeScreenRouteProp>();
  const [passCode, setPasscode] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [passCodeConfirmed, setPassCodeConfirmed] = useState<boolean>(false);

  useEffect(() => {
    if (passCode.length !== 6) {
      return;
    }
    if (passCode === params.passCode) {
      setIsError(false);
      setPassCodeConfirmed(true);
    } else {
      setIsError(true);
    }
    setPasscode("");
  }, [passCode, params.passCode]);

  const resetError = () => {
    setPassCodeConfirmed(false);
    navigation.navigate("SignIn.Passcode");
  };

  const container = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing.full,
  }));

  return (
    <Page>
      <NavHeader withBackButton={true} />
      <View style={container}>
        <Passcode
          failedAttemptsLimit={MAX_FAILED_ATTEMPTS}
          title={t("SignIn.ConfirmPasscodeScreen.title")}
          subTitle={t("SignIn.ConfirmPasscodeScreen.subTitle")}
          notification={t("SignIn.ConfirmPasscodeScreen.notification")}
          isError={isError}
          length={6}
          passcode={passCode}
        />
        <NumberPad passcode={passCode} setPasscode={setPasscode} />
      </View>
      <NotificationModal
        message={t("SignIn.ConfirmPasscodeScreen.notificationModelMessage")}
        isVisible={passCodeConfirmed}
        title={t("SignIn.ConfirmPasscodeScreen.notificationModelTitle")}
        onClose={resetError}
        variant="success"
      />
    </Page>
  );
};
export default ConfirmPasscodeScreen;
