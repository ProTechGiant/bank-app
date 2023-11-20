import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import ApiError from "@/api/ApiError";
import NavHeader from "@/components/NavHeader";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import { OTP_BLOCKED_TIME } from "@/constants";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useBlockedUserFlow from "@/hooks/use-blocked-user-handler";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { getItemFromEncryptedStorage } from "@/utils/encrypted-storage";

import { BLOCKED_TIME, PASSCODE_LENGTH } from "../constants";
import { useErrorMessages } from "../hooks";
import { useLoginUser, useSendLoginOTP } from "../hooks/query-hooks";
import { UserType } from "../types";

export default function ChangePasscodeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutateAsync, error: loginError, isError } = useLoginUser();
  const loginUserError = loginError as ApiError;
  const { errorMessages } = useErrorMessages(loginUserError);
  const [passCode, setPasscode] = useState<string>("");
  const [user, setUser] = useState<UserType | null>(null);
  const otpFlow = useOtpFlow();
  const useSendLoginOtpAsync = useSendLoginOTP();
  const blockedUserFlow = useBlockedUserFlow();

  useEffect(() => {
    handleOnChange();
  }, [passCode]);

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

  const handleUserLogin = async () => {
    try {
      const response = await mutateAsync({ passCode, nationalId: user?.NationalId });
      if (response.AccessToken) {
        handleNavigate();
      }
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
          PhoneNumber: user?.MobileNumber,
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

  const handleOtpVerification = async () => {
    navigation.navigate("SignIn.CreatePasscode", { currentPassCode: passCode });
    setPasscode("");
  };

  return (
    <Page>
      <NavHeader withBackButton={true} />
      <View style={styles.containerStyle}>
        <PasscodeInput
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
