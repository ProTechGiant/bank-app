import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, View } from "react-native";

import ApiError from "@/api/ApiError";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import { OTP_BLOCKED_TIME } from "@/constants";
import { useAuthContext } from "@/contexts/AuthContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useBlockedUserFlow from "@/hooks/use-blocked-user-handler";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { BLOCKED_TIME, PASSCODE_LENGTH } from "../constants";
import { useErrorMessages } from "../hooks";
import { useSendLoginOTP, useValidatePasscode } from "../hooks/query-hooks";

export default function ChangePasscodeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutateAsync: validatePasscode, error: isValidatePasscodeError, isLoading, isError } = useValidatePasscode();
  const loginUserError = isValidatePasscodeError as ApiError;
  const { errorMessages } = useErrorMessages(loginUserError);
  const [passCode, setPasscode] = useState<string>("");
  const otpFlow = useOtpFlow();
  const useSendLoginOtpAsync = useSendLoginOTP();
  const blockedUserFlow = useBlockedUserFlow();
  const auth = useAuthContext();

  useEffect(() => {
    handleOnChange();
  }, [passCode]);

  const handleUserLogin = async () => {
    try {
      await validatePasscode({ passCode, nationalId: auth.nationalId });
      handleNavigate();
    } catch (error: any) {
      const errorId = error?.errorContent?.Errors[0].ErrorId;
      if (errorId === "0009") blockedUserFlow.handle("passcode", BLOCKED_TIME);
      if (errorId === "0010") blockedUserFlow.handle("passcode");
      setPasscode("");
    }
  };

  const handleOnChange = () => {
    if (passCode.length === PASSCODE_LENGTH) {
      handleUserLogin();
      setPasscode("");
    }
  };

  const handleNavigate = async () => {
    try {
      otpFlow.handle({
        action: {
          to: "SignIn.ChangePasscode",
          params: {},
        },
        otpChallengeParams: {
          PhoneNumber: auth?.phoneNumber,
        },
        otpVerifyMethod: "change-passcode",
        onOtpRequest: () => {
          return useSendLoginOtpAsync.mutateAsync("change-passcode");
        },
        onFinish: (status: string) => {
          if (status === "success") {
            handleOtpVerification();
          }
        },
        onUserBlocked: () => {
          blockedUserFlow.handle("otp", OTP_BLOCKED_TIME);
        },
      });
    } catch (responseError) {
      warn("login-action", "Could not send login OTP: ", JSON.stringify(responseError));
    }
  };

  const whiteColor = useThemeStyles<string>(theme => theme.palette.transparent);

  const handleOtpVerification = async () => {
    navigation.navigate("SignIn.CreatePasscode", { currentPassCode: passCode });
    setPasscode("");
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }
  return (
    <Page>
      <NavHeader withBackButton={true} />
      <StatusBar barStyle="dark-content" backgroundColor={whiteColor} />
      <View style={styles.containerStyle}>
        <PasscodeInput
          testID="SignIn.ChangePasscodeScreen:PasscodeInput"
          title={t("SignIn.ChangePasscodeScreen.title")}
          subTitle={t("SignIn.ChangePasscodeScreen.subTitle")}
          errorMessage={errorMessages}
          passcode={passCode}
          isError={isError}
          length={PASSCODE_LENGTH}
        />
        <NumberPad passcode={passCode} setPasscode={setPasscode} />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    height: "100%",
  },
});
