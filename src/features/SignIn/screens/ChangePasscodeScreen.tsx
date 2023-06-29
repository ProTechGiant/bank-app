import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import ApiError from "@/api/ApiError";
import NavHeader from "@/components/NavHeader";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { setItemInEncryptedStorage } from "@/utils/encrypted-storage";
import delayTransition from "@/utils/delay-transition";

import { BLOCKED_TIME, PASSCODE_LENGTH } from "../constants";
import { useErrorMessages } from "../hooks";
import { useLoginUser, useSendLoginOTP } from "../hooks/query-hooks";

const ChangePasscodeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutateAsync, error: loginError, isError } = useLoginUser();
  const loginUserError = loginError as ApiError;
  const { errorMessages } = useErrorMessages(loginUserError);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [passCode, setPasscode] = useState<string>("");
  const otpFlow = useOtpFlow();
  const useSendLoginOtpAsync = useSendLoginOTP();

  useEffect(() => {
    handleOnChange();
  }, [passCode]);

  const handleUserLogin = async () => {
    try {
      await mutateAsync(passCode);
      handleNavigate();
    } catch (error: any) {
      setPasscode("");
      const errorId = error.errorContent.Errors[0].ErrorId;
      if (errorId === "0009") handleBlocked(BLOCKED_TIME);
      if (errorId === "0010") handleBlocked();
    }
  };

  const handleBlocked = async (blockTime?: number) => {
    setShowModel(true);
    if (!blockTime) {
      await setItemInEncryptedStorage("UserBlocked", JSON.stringify(true));
    } else {
      const userBlockTime = new Date().getTime() + blockTime * 60 * 1000;
      await setItemInEncryptedStorage("UserBlocked", JSON.stringify(userBlockTime));
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
        otpVerifyMethod: "change-passcode",
        onOtpRequest: () => {
          return useSendLoginOtpAsync.mutateAsync("change-passcode");
        },
        onFinish: (status: string) => {
          if (status === "success") {
            delayTransition(() => handleOtpVerification());
          }
        },
        onUserBlocked: () => {
          navigation.navigate("SignIn.UserBlocked", {
            type: "otp",
          });
        },
      });
    } catch (responseError) {
      warn("login-action", "Could not send login OTP: ", JSON.stringify(responseError));
    }
  };

  const handleNavigateToBlockScreen = () => {
    setShowModel(false);
    navigation.navigate("SignIn.UserBlocked", {
      type: "passcode",
    });
  };

  const handleOtpVerification = async () => {
    navigation.navigate("SignIn.CreatePasscode");
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing.full,
  }));

  return (
    <Page>
      <NavHeader withBackButton={true} />
      <View style={containerStyle}>
        <PasscodeInput
          title={t("SignIn.ChangePasscodeScreen.title")}
          subTitle={t("SignIn.ChangePasscodeScreen.subTitle")}
          errorMessage={errorMessages}
          showModel={showModel}
          resetError={handleNavigateToBlockScreen}
          passcode={passCode}
          isError={isError}
          length={PASSCODE_LENGTH}
        />
        <NumberPad passcode={passCode} setPasscode={setPasscode} />
      </View>
    </Page>
  );
};
export default ChangePasscodeScreen;
