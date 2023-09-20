import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import DeviceInfo from "react-native-device-info";

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
import { useAuthContext } from "@/contexts/AuthContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useBlockedUserFlow from "@/hooks/use-blocked-user-handler";
import useLogout from "@/hooks/use-logout";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import BiometricsService from "@/services/biometrics/biometricService";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";
import delayTransition from "@/utils/delay-transition";
import {
  getItemFromEncryptedStorage,
  removeItemFromEncryptedStorage,
  setItemInEncryptedStorage,
} from "@/utils/encrypted-storage";

import { BLOCKED_TIME, PASSCODE_LENGTH } from "../constants";
import { useSignInContext } from "../contexts/SignInContext";
import { useErrorMessages } from "../hooks";
import { useLoginUser, useSendLoginOTP } from "../hooks/query-hooks";
import { logoutActionsIds, UserType } from "../types";

export default function PasscodeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const auth = useAuthContext();
  const { setNationalId } = useSignInContext();
  //TODO : will use it once API is ready
  /*
  const { mutateAsync, error: loginError, isError, isLoading: isLoadingLoginApi } = useLoginUser();
  const loginUserError = loginError as ApiError;
  const { errorMessages } = useErrorMessages(loginUserError);
  */
  const { mutateAsync, isLoading: isLoadingLoginApi, data } = useLoginUser();
  const { errorMessages } = useErrorMessages(data as ApiError);
  const [passCode, setPasscode] = useState<string>("");
  const [user, setUser] = useState<UserType | null>(null);
  const [tempUser, setTempUser] = useState<UserType | null>(null);
  const [biometricsKeyExist, setBiometricsKeyExist] = useState<boolean>(false);
  const [isSensorAvailable, setIsSensorAvailable] = useState<boolean>(false);
  const otpFlow = useOtpFlow();
  const useSendLoginOtpAsync = useSendLoginOTP();
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);
  const { setSignInCorrelationId } = useSignInContext();
  const blockedUserFlow = useBlockedUserFlow();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLogoutFailedModalVisible, setIsLogoutFailedModalVisible] = useState<boolean>(false);
  const signoutUser = useLogout();
  useEffect(() => {
    (async () => {
      setBiometricsKeyExist((await BiometricsService.biometricKeysExist()).keysExist);
      setIsSensorAvailable((await BiometricsService.isSensorAvailable()).available);
    })();
    handleOnChange();
  }, [passCode]);

  useEffect(() => {
    (async () => {
      const tempUserData = await getItemFromEncryptedStorage("tempUser");
      if (tempUserData) {
        setTempUser(JSON.parse(tempUserData));
        setUser(null);
        const _correlationId = generateRandomId();
        setSignInCorrelationId(_correlationId);
      } else {
        const userData = await getItemFromEncryptedStorage("user");
        if (userData) {
          setUser(JSON.parse(userData));
          setTempUser(null);
          const _correlationId = generateRandomId();
          setSignInCorrelationId(_correlationId);
        } else {
          setUser(null);
          setTempUser(null);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setPasscode("");
    }
  }, [isFocused]);

  const handleCheckUserDevice = async () => {
    if (tempUser) {
      if (tempUser.DeviceId !== DeviceInfo.getDeviceId()) {
        setShowSignInModal(true);
      } else {
        handleUserLogin(false);
      }
    } else {
      handleUserLogin(false);
    }
  };

  const navigateToHome = () => {
    if (tempUser) {
      setItemInEncryptedStorage("user", JSON.stringify(tempUser));
      removeItemFromEncryptedStorage("tempUser");
    }
    auth.authenticate(auth.userId ?? "");
  };

  const handleUserLogin = async (isNewUser: boolean) => {
    try {
      const response = await mutateAsync({ passCode, nationalId: isNewUser ? tempUser?.NationalId : user?.NationalId });
      if (response.AccessToken) {
        if (isNewUser) {
          handleNavigate();
        } else {
          navigateToHome();
        }
      }
      //TODO: This logic will be removed once API is ready
      const errorId = response?.errorContent?.Errors[0].ErrorId;
      if (errorId === "0009") blockedUserFlow.handle("passcode", BLOCKED_TIME);
      if (errorId === "0010") blockedUserFlow.handle("passcode");
      setPasscode("");
    } catch (error: any) {
      const errorId = error?.errorContent?.Errors?.[0].ErrorId;
      if (errorId === "0009") blockedUserFlow.handle("passcode", BLOCKED_TIME);
      if (errorId === "0010") blockedUserFlow.handle("passcode");
      setPasscode("");
    }
  };

  const storeUserToLocalStorage = () => {
    setNationalId(tempUser?.NationalId);
    auth.updatePhoneNumber(tempUser?.MobileNumber);
    setItemInEncryptedStorage("user", JSON.stringify(tempUser));
  };

  const handleSignin = async () => {
    setShowSignInModal(false);
    handleUserLogin(true);
  };

  const handleCancelButton = () => {
    setShowSignInModal(false);
    setPasscode("");
    if (!user) {
      navigation.navigate("SignIn.Iqama");
    }
  };

  const handleOnChange = () => {
    if (passCode.length === PASSCODE_LENGTH) handleCheckUserDevice();
  };

  const handleOtpVerification = async () => {
    storeUserToLocalStorage();
    setPasscode("");
    navigateToHome();
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
          blockedUserFlow.handle("otp", OTP_BLOCKED_TIME);
        },
      });
    } catch (responseError) {
      warn("login-action", "Could not send login OTP: ", JSON.stringify(responseError));
    }
  };

  const handleBioMatric = async () => {
    navigation.navigate("SignIn.Biometric");
  };

  const handleOnSignOut = async () => {
    try {
      await signoutUser(logoutActionsIds.MANUALLY_ID);
    } catch (error) {
      const typedError = error as Error;
      warn("logout-api error: ", typedError.message);
      setIsLogoutFailedModalVisible(true);
    }
    setIsModalVisible(false);
  };

  const forgotPasscodeTextStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: theme.spacing["64p"],
    width: "100%",
    textAlign: "center",
  }));

  const signOutTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
    bottom: theme.spacing["64p"],
    width: "100%",
    textAlign: "center",
  }));

  return (
    <Page>
      <NavHeader withBackButton={!user} />
      <View style={styles.containerStyle}>
        <PasscodeInput
          user={user}
          title={
            !user
              ? t("SignIn.PasscodeScreen.title")
              : t("SignIn.PasscodeScreen.userTitle", { username: user.CustomerName.split(" ")[0] })
          }
          errorMessage={errorMessages}
          isError={true} //TODO: This will be handled by the isError state managing the API call
          subTitle={user ? t("SignIn.PasscodeScreen.subTitle") : ""}
          length={6}
          passcode={passCode}
        />
        <NumberPad
          handleBiometric={handleBioMatric}
          isBiometric={biometricsKeyExist && isSensorAvailable}
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
      {user ? (
        <Pressable style={signOutTextStyle} onPress={() => setIsModalVisible(true)}>
          <Typography.Text color="errorBase" align="center" weight="medium" size="body">
            {t("SignIn.PasscodeScreen.signOut")}
          </Typography.Text>
        </Pressable>
      ) : null}
      <NotificationModal
        variant="warning"
        title={t("Settings.AccountSettings.youSure")}
        message={t("Settings.AccountSettings.message")}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        buttons={{
          primary: <Button onPress={handleOnSignOut}>{t("Settings.AccountSettings.button")}</Button>,
          secondary: (
            <Button onPress={() => setIsModalVisible(false)}>{t("Settings.AccountSettings.cancelButton")}</Button>
          ),
        }}
      />
      <NotificationModal
        variant="error"
        title={t("Settings.LogoutFailedModal.title")}
        message={t("Settings.LogoutFailedModal.message")}
        isVisible={isLogoutFailedModalVisible}
        onClose={() => setIsLogoutFailedModalVisible(false)}
      />
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
      {isLoadingLoginApi && <LoadingIndicatorModal />}
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
