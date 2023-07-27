import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert as RNAlert, StyleSheet, View, ViewStyle } from "react-native";

import ApiError from "@/api/ApiError";
import Alert from "@/components/Alert";
import NavHeader from "@/components/NavHeader";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";
import { setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import { BLOCKED_TIME, OTP_BLOCKED_TIME, PINCODE_LENGTH } from "../constants";
// import { useSignInContext } from "../contexts/SignInContext";
import { useErrorMessages } from "../hooks";
import { useSendLoginOTP, useValidatePincode } from "../hooks/query-hooks";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutateAsync: validatePincode, error: validateError, isError } = useValidatePincode();
  const validatePincodeError = validateError as ApiError;
  const { errorMessages } = useErrorMessages(validatePincodeError);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>("");
  const useSendLoginOtpAsync = useSendLoginOTP();
  // not in use yet
  // const { mobileNumber } = useSignInContext();
  const otpFlow = useOtpFlow();

  useEffect(() => {
    handleOnChange();
  }, [pinCode]);

  const handleOnChange = () => {
    if (pinCode.length === PINCODE_LENGTH) {
      handleSubmit();
      setPinCode("");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await validatePincode(pinCode);
      if (response.Status) {
        handleNavigate();
      } else {
        RNAlert.alert("Wrong card pin");
      }
    } catch (error: any) {
      setPinCode("");
      const errorId = error?.errorContent?.Errors[0]?.ErrorId;
      if (errorId === "0032") handleBlocked(BLOCKED_TIME);
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

  const handleNavigate = async () => {
    try {
      otpFlow.handle({
        action: {
          to: "SignIn.ForgotPassword",
          params: {},
        },
        otpVerifyMethod: "reset-passcode",
        onOtpRequest: () => {
          return useSendLoginOtpAsync.mutateAsync("reset-passcode");
        },
        onUserBlocked: () => {
          handleBlocked(OTP_BLOCKED_TIME);
          navigation.navigate("SignIn.UserBlocked", {
            type: "otp",
            navigateTo: "SignIn.ForgotPassword",
          });
        },
        onFinish: (status: string) => {
          if (status === "cancel") {
            return;
          } else if (status === "success") {
            delayTransition(() => handleOtpVerification());
          }
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

  const bannerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={true} />
      <View style={styles.containerStyle}>
        <PasscodeInput
          title={t("SignIn.ForgotPasscodeScreen.title")}
          errorMessage={errorMessages}
          isError={isError}
          showModel={showModel}
          subTitle={t("SignIn.ForgotPasscodeScreen.subTitle")}
          resetError={handleNavigateToBlockScreen}
          length={4}
          passcode={pinCode}
        />
        <View style={bannerStyle}>
          <Alert variant="default" message={t("SignIn.ForgotPasscodeScreen.needHelpInfo")} />
        </View>
        <NumberPad passcode={pinCode} setPasscode={setPinCode} />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    height: "100%",
  },
});
