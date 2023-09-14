import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import ApiError from "@/api/ApiError";
import Button from "@/components/Button";
import LoadingIndicatorModal from "@/components/LoadingIndicatorModal";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import Typography from "@/components/Typography";
import { OTP_BLOCKED_TIME } from "@/constants";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import BiometricsService from "@/services/biometrics/biometricService";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";
import delayTransition from "@/utils/delay-transition";
import { getItemFromEncryptedStorage, setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import { BLOCKED_TIME, PASSCODE_LENGTH } from "../constants";
import { useSignInContext } from "../contexts/SignInContext";
import { useErrorMessages } from "../hooks";
import { useLoginUser, useRegistration, useSendLoginOTP, useSignIn, useValidateDevice } from "../hooks/query-hooks";

export default function PasscodeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { mutateAsync, error: loginError, isError, isLoading: isLoadingLoginApi } = useLoginUser();
  const loginUserError = loginError as ApiError;
  const { errorMessages } = useErrorMessages(loginUserError);
  const signinUser = useSignIn();
  const registerUser = useRegistration();
  const { mutateAsync: validateDeviceMutateAsync, isLoading: isLoadingValidateApi } = useValidateDevice();
  const [passCode, setPasscode] = useState<string>("");
  const [user, setUser] = useState<{ name: string; mobileNumber: string } | null>(null);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [biometricsKeyExist, setBiometricsKeyExist] = useState<boolean>(false);
  const [isSensorAvailable, setIsSensorAvailable] = useState<boolean>(false);
  const otpFlow = useOtpFlow();
  const useSendLoginOtpAsync = useSendLoginOTP();
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);
  const { mobileNumber, setSignInCorrelationId } = useSignInContext();

  useEffect(() => {
    (async () => {
      setBiometricsKeyExist((await BiometricsService.biometricKeysExist()).keysExist);
      setIsSensorAvailable((await BiometricsService.isSensorAvailable()).available);
    })();
    handleOnChange();
  }, [passCode]);

  useEffect(() => {
    (async () => {
      const userData = await getItemFromEncryptedStorage("user");
      if (userData) {
        setUser(JSON.parse(userData));
        const _correlationId = generateRandomId();
        setSignInCorrelationId(_correlationId);
      } else setUser(null);
    })();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setPasscode("");
    }
  }, [isFocused]);

  const handleUserLogin = async () => {
    try {
      await mutateAsync(passCode);
      const response = await validateDeviceMutateAsync(passCode);
      if (response.SameDevice) {
        handleNavigate();
      } else {
        setShowSignInModal(true);
      }
    } catch (error: any) {
      const errorId = error?.errorContent?.Errors?.[0].ErrorId;
      if (errorId === "0009") handleBlocked(BLOCKED_TIME);
      if (errorId === "0010") handleBlocked();
      setPasscode("");
    }
  };

  //TODO: Will retrieve from api
  const storeUserToLocalStorage = () => {
    const dummyUser = { name: "Hamza Malik", mobileNumber: mobileNumber || "" };
    setItemInEncryptedStorage("user", JSON.stringify(dummyUser));
  };

  const handleSignin = async () => {
    try {
      await signinUser.mutateAsync(passCode);
      setShowSignInModal(false);
      handleNavigate();
    } catch (error: any) {
      const errorId = error?.errorContent?.Errors?.[0].ErrorId;
      if (errorId === "0009") handleBlocked(BLOCKED_TIME);
      if (errorId === "0010") handleBlocked();
    }
  };

  const handleCancelButton = () => {
    setShowSignInModal(false);
    setPasscode("");
    if (!user) {
      navigation.navigate("SignIn.Iqama");
    }
  };

  const handleOnChange = () => {
    if (passCode.length === PASSCODE_LENGTH) handleUserLogin();
  };

  const handleOtpVerification = async () => {
    try {
      await registerUser.mutateAsync(passCode);
      storeUserToLocalStorage();
      navigation.navigate("SignIn.Biometric");
    } catch (err) {
      warn("Register-User-api", JSON.stringify(err));
    } finally {
      setPasscode("");
    }
  };

  const handleNavigate = () => {
    try {
      otpFlow.handle({
        action: {
          to: "SignIn.Passcode",
          params: {},
        },
        otpVerifyMethod: "login",
        onOtpRequest: () => {
          return useSendLoginOtpAsync.mutateAsync("login");
        },
        onFinish: (status: string) => {
          if (status === "cancel") {
            return;
          } else if (status === "success") {
            delayTransition(() => handleOtpVerification());
          }
        },
        onUserBlocked: () => {
          handleBlocked(OTP_BLOCKED_TIME);
          navigation.navigate("SignIn.UserBlocked", {
            type: "otp",
          });
        },
      });
    } catch (responseError) {
      warn("login-action", "Could not send login OTP: ", JSON.stringify(responseError));
    }
  };

  const handleBlocked = async (blockTime?: number) => {
    setShowModel(true);
    if (!blockTime) {
      await setItemInEncryptedStorage("UserBlocked", JSON.stringify(true));
      handleNavigateToBlockScreen();
    } else {
      const userBlockTime = new Date().getTime() + blockTime * 60 * 1000; //TODO: replace with the value from API
      await setItemInEncryptedStorage("UserBlocked", JSON.stringify(userBlockTime));
    }
  };

  const handleNavigateToBlockScreen = () => {
    setShowModel(false);
    navigation.navigate("SignIn.UserBlocked", {
      type: "passcode",
    });
  };

  const handleBioMatric = async () => {
    navigation.navigate("SignIn.Biometric");
  };

  const forgotPasscodeTextStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: theme.spacing["64p"],
    width: "100%",
    textAlign: "center",
  }));

  return (
    <Page>
      <NavHeader withBackButton={true} />
      <View style={styles.containerStyle}>
        <PasscodeInput
          user={user}
          title={
            !user
              ? t("SignIn.PasscodeScreen.title")
              : t("SignIn.PasscodeScreen.userTitle", { username: user.name.split(" ")[0] })
          }
          errorMessage={errorMessages}
          isError={isError}
          showModel={showModel}
          subTitle={user ? t("SignIn.PasscodeScreen.subTitle") : ""}
          length={6}
          passcode={passCode}
          resetError={handleNavigateToBlockScreen}
        />
        <NumberPad
          handleBioMatric={handleBioMatric}
          isBiomatric={biometricsKeyExist && isSensorAvailable}
          passcode={passCode}
          setPasscode={setPasscode}
        />
        <Pressable style={forgotPasscodeTextStyle} onPress={() => navigation.navigate("SignIn.ForgotPassword")}>
          <Typography.Text
            color="primaryBase-30"
            align="center"
            weight="medium"
            size="footnote"
            style={styles.underline}>
            {t("SignIn.PasscodeScreen.forgotPassword")}
          </Typography.Text>
        </Pressable>
      </View>
      <NotificationModal
        variant="confirmations"
        title={t("SignIn.PasscodeScreen.signInModal.title")}
        message={t("SignIn.PasscodeScreen.signInModal.message")}
        isVisible={showSignInModal}
        buttons={{
          primary: <Button onPress={handleSignin}>{t("SignIn.PasscodeScreen.signInModal.signInButton")}</Button>,
          secondary: (
            <Button onPress={handleCancelButton}>{t("SignIn.PasscodeScreen.signInModal.cancelButton")}</Button>
          ),
        }}
      />
      {(isLoadingLoginApi || isLoadingValidateApi) && <LoadingIndicatorModal />}
    </Page>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    height: "100%",
  },
  underline: {
    textDecorationLine: "underline",
  },
});
