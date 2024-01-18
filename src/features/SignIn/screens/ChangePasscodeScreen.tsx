import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import ApiError from "@/api/ApiError";
import Alert from "@/components/Alert";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import { OTP_BLOCKED_TIME } from "@/constants";
import { useAuthContext } from "@/contexts/AuthContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { useGetAuthenticationToken } from "@/hooks/use-api-authentication-token";
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
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken(true);
  const {
    mutateAsync: validatePasscode,
    error: isValidatePasscodeError,
    isLoading,
    isError,
  } = useValidatePasscode(true);
  const loginUserError = isValidatePasscodeError as ApiError;
  const { errorMessages } = useErrorMessages(loginUserError);
  const [passCode, setPasscode] = useState<string>("");
  const [remainingAttempts, setRemainingAttempts] = useState(PASSCODE_MAX_TRIES);
  const [authToken, setAuthToken] = useState<null | string>(null);
  const otpFlow = useOtpFlow();
  const useSendLoginOtpAsync = useSendLoginOTP();
  const blockedUserFlow = useBlockedUserFlow();
  const auth = useAuthContext();

  useEffect(() => {
    handleOnChange();
  }, [passCode]);

  useEffect(() => {
    // Getting Auth Token here
    (async () => {
      try {
        const { AccessToken } = await getAuthenticationToken();
        setAuthToken(AccessToken);
      } catch (err) {}
    })();
  }, []);

  const handleUserLogin = async () => {
    try {
      await validatePasscode({
        passCode,
        nationalId: auth.nationalId ?? "",
        tokenFromUpdatePasscodeFlow: authToken ?? "",
      });
      handleNavigate();
    } catch (error: any) {
      remainingAttempts > 1 && setRemainingAttempts(remainingAttempts - 1);
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

  const bannerStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "flex-end",
    paddingHorizontal: theme.spacing["20p"],
  }));

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
        {remainingAttempts < 4 ? (
          <View style={bannerStyle}>
            <Alert
              variant="error"
              message={
                remainingAttempts === 3
                  ? t("SignIn.ChangePasscodeScreen.errorTwoAttempt")
                  : remainingAttempts === 2
                  ? t("SignIn.ChangePasscodeScreen.errorOneAttempt")
                  : t("SignIn.ChangePasscodeScreen.errorFinalAttempt")
              }
            />
          </View>
        ) : null}
        <NumberPad passcode={passCode} setPasscode={setPasscode} />
      </View>
    </Page>
  );
}

const PASSCODE_MAX_TRIES = 4;

const styles = StyleSheet.create({
  containerStyle: {
    height: "100%",
  },
});
