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
import SignOutModal from "@/components/SignOutModal";
import Typography from "@/components/Typography";
import { OTP_BLOCKED_TIME } from "@/constants";
import { useAuthContext } from "@/contexts/AuthContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { useGetAuthenticationToken } from "@/hooks/use-api-authentication-token";
import useBlockedUserFlow from "@/hooks/use-blocked-user-handler";
import useCheckTPPService from "@/hooks/use-tpp-service";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import BiometricsService from "@/services/biometrics/biometricService";
import { useThemeStyles } from "@/theme";
import { generateRandomId, getUniqueDeviceId } from "@/utils";
import delayTransition from "@/utils/delay-transition";
import {
  getItemFromEncryptedStorage,
  removeItemFromEncryptedStorage,
  setItemInEncryptedStorage,
} from "@/utils/encrypted-storage";

import { PanicIcon } from "../assets/icons";
import { BLOCKED_TIME, PASSCODE_LENGTH } from "../constants";
import { useSignInContext } from "../contexts/SignInContext";
import { useErrorMessages } from "../hooks";
import { useLoginUser, usePanicMode, useSendLoginOTP } from "../hooks/query-hooks";
import { UserType } from "../types";

export default function PasscodeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const auth = useAuthContext();
  const { setNationalId } = useSignInContext();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();
  const { mutateAsync: editPanicMode } = usePanicMode();

  const { mutateAsync, error: loginError, isError, isLoading: isLoadingLoginApi } = useLoginUser();
  const loginUserError = loginError as ApiError;
  const { errorMessages } = useErrorMessages(loginUserError);

  const [passCode, setPasscode] = useState<string>("");
  const [user, setUser] = useState<UserType | null>(null);
  const [tempUser, setTempUser] = useState<UserType | null>(null);
  const [biometricsKeyExist, setBiometricsKeyExist] = useState<boolean>(false);
  const [isSensorAvailable, setIsSensorAvailable] = useState<boolean>(false);
  const otpFlow = useOtpFlow();
  const useSendLoginOtpAsync = useSendLoginOTP();
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);
  const { setSignInCorrelationId, setIsPanicMode, isPanicMode } = useSignInContext();
  const blockedUserFlow = useBlockedUserFlow();
  const [isPanicModalVisible, setIsPanicModalVisible] = useState(false);

  const [isSignOutModalVisible, setIsSignOutModalVisible] = useState<boolean>(false);
  const [isLogoutFailedModalVisible, setIsLogoutFailedModalVisible] = useState<boolean>(false);
  const [isActiveModalVisible, setIsActiveModalVisible] = useState<boolean>(false);
  const [isSubmitPanicErrorVisible, setIsSubmitPanicErrorVisible] = useState<boolean>(false);

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
        getAuthenticationToken();

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

  const comingFromTPP = useCheckTPPService();

  const handleCheckUserDevice = async () => {
    if (tempUser) {
      if (tempUser.DeviceId !== (await getUniqueDeviceId())) {
        if (comingFromTPP || isPanicMode) {
          handleUserLogin(true);
        } else {
          setShowSignInModal(true);
        }
      } else {
        handleUserLogin(false);
      }
    } else {
      handleUserLogin(false);
    }
  };

  const navigateToHome = async (accessToken: string) => {
    if (tempUser) {
      setItemInEncryptedStorage("user", JSON.stringify({ ...tempUser, DeviceId: await getUniqueDeviceId() }));
      removeItemFromEncryptedStorage("tempUser");
    }
    auth.authenticate(auth.userId ?? "", accessToken);
    if (auth.navigationTarget) {
      const { stack, screen } = auth.navigationTarget;
      setImmediate(() => {
        navigation.navigate(stack, { screen }); // TODO will add params later navigation.navigate(stack, { screen , param });
      });
    }
  };

  const handleUserLogin = async (isNewUser: boolean) => {
    try {
      const response = await mutateAsync({ passCode, nationalId: tempUser ? tempUser.NationalId : user?.NationalId });
      if (response.AccessToken) {
        if (isPanicMode) {
          setIsActiveModalVisible(true);
          return;
        }
        if (isNewUser || comingFromTPP) {
          delayTransition(() => handleNavigate(response.AccessToken));
        } else {
          storeUserToLocalStorage();
          navigateToHome(response.AccessToken);
        }
      }
      setPasscode("");
    } catch (error: any) {
      const errorId = error?.errorContent?.Errors?.[0].ErrorId;
      if (!errorId) setIsLogoutFailedModalVisible(true);
      if (errorId === "0009") blockedUserFlow.handle("passcode", BLOCKED_TIME);
      if (errorId === "0010") blockedUserFlow.handle("passcode");
      setPasscode("");
    }
  };

  const storeUserToLocalStorage = () => {
    setNationalId(tempUser?.NationalId || user?.NationalId);
    auth.updatePhoneNumber(tempUser?.MobileNumber || user?.MobileNumber);
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

  const handleOnActivePanicMode = async () => {
    try {
      await editPanicMode({
        isPanic: true,
        nationalId: tempUser?.NationalId || user?.NationalId,
        mobileNumber: tempUser?.MobileNumber || user?.MobileNumber,
      });
      removeItemFromEncryptedStorage("user");
      removeItemFromEncryptedStorage("tempUser");

      setIsActiveModalVisible(false);
      setIsPanicMode(false);
      navigation.navigate("SignIn.SignInStack", {
        screen: "SignIn.Iqama",
      });
    } catch (error) {
      setIsActiveModalVisible(false);
      delayTransition(() => {
        setIsSubmitPanicErrorVisible(true);
      });
      setPasscode("");
    }
  };

  const handleOtpVerification = async (accessToken: string) => {
    storeUserToLocalStorage();
    setPasscode("");

    if (comingFromTPP) {
      auth.authenticate(auth.userId ?? "", accessToken);
      setImmediate(() => {
        navigation.navigate("OpenBanking.OpenBankingStack", {
          screen: "OpenBanking.OpenBankingScreen",
        });
      });
    } else {
      navigateToHome(accessToken);
    }
  };

  const handleNavigate = (accessToken: string) => {
    try {
      otpFlow.handle({
        action: {
          to: "SignIn.Passcode",
          params: {},
        },
        otpChallengeParams: {
          PhoneNumber: tempUser?.MobileNumber,
        },
        otpVerifyMethod: "login",
        onOtpRequest: () => {
          return useSendLoginOtpAsync.mutateAsync("login");
        },
        onFinish: (status: string) => {
          if (status === "cancel") {
            return;
          } else if (status === "success") {
            handleOtpVerification(accessToken);
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

  const handleOnClose = () => {
    setIsSignOutModalVisible(false);
  };

  const handleOnCloseError = () => {
    setIsSignOutModalVisible(false);
    delayTransition(() => {
      setIsLogoutFailedModalVisible(true);
    });
  };

  const handleOnNavigateToPancMode = () => {
    navigation.navigate("SignIn.PanicModeScreen");
    setIsPanicModalVisible(false);
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

  const panicIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <Page>
      <NavHeader
        withBackButton={!user || (user && isPanicMode)}
        end={
          user && !isPanicMode ? (
            <Pressable onPress={() => setIsPanicModalVisible(true)}>
              <PanicIcon color={panicIconColor} width={34} height={34} />
            </Pressable>
          ) : undefined
        }
      />
      <View style={styles.containerStyle}>
        <PasscodeInput
          isPanicMode={isPanicMode}
          user={user}
          title={
            !user || (user && isPanicMode)
              ? t("SignIn.PasscodeScreen.title")
              : t("SignIn.PasscodeScreen.userTitle", { username: user.CustomerName.split(" ")[0] })
          }
          errorMessage={errorMessages}
          isError={isError}
          subTitle={user || !(user && isPanicMode) ? t("SignIn.PasscodeScreen.subTitle") : ""}
          length={6}
          passcode={passCode}
        />
        <NumberPad
          handleBiometric={handleBioMatric}
          isBiometric={biometricsKeyExist && isSensorAvailable}
          passcode={passCode}
          setPasscode={setPasscode}
        />
        {!comingFromTPP ? (
          <Pressable
            style={forgotPasscodeTextStyle}
            onPress={
              !isPanicMode
                ? () => navigation.navigate("SignIn.ForgotPassword")
                : () => {
                    setIsPanicMode(true);
                    navigation.navigate("SignIn.CardPin");
                  }
            }>
            <Typography.Text color="neutralBase+30" align="center" weight="medium" size="footnote">
              {t("SignIn.PasscodeScreen.forgotPassword")}
            </Typography.Text>
          </Pressable>
        ) : null}
      </View>

      {!isPanicMode ? (
        user ? (
          <Pressable style={signOutTextStyle} onPress={() => setIsSignOutModalVisible(true)}>
            <Typography.Text color="errorBase" align="center" weight="medium" size="body">
              {t("SignIn.PasscodeScreen.signOut")}
            </Typography.Text>
          </Pressable>
        ) : null
      ) : null}

      <SignOutModal isVisible={isSignOutModalVisible} onClose={handleOnClose} onCloseError={handleOnCloseError} />
      <NotificationModal
        variant="error"
        title={t("Settings.LogoutFailedModal.title")}
        message={t("Settings.LogoutFailedModal.message")}
        isVisible={isLogoutFailedModalVisible}
        onClose={() => setIsLogoutFailedModalVisible(false)}
      />
      <NotificationModal
        variant="warning"
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
      <NotificationModal
        testID="SignIn.PasscodeScreen:PanicModal"
        variant="warning"
        title={t("SignIn.PanicModeScreen.modal.activeTitle")}
        message={t("SignIn.PanicModeScreen.modal.activeMessage")}
        isVisible={isActiveModalVisible}
        buttons={{
          primary: (
            <Button testID="SignIn.PasscodeScreen:ProccedButton" onPress={handleOnActivePanicMode}>
              {t("SignIn.PanicModeScreen.buttons.confirm")}
            </Button>
          ),
          secondary: (
            <Button
              testID="SignIn.PasscodeScreen:CancelButton"
              onPress={() => {
                if (user) {
                  navigation.navigate("SignIn.SignInStack", {
                    screen: "SignIn.Passcode",
                  });
                  setIsActiveModalVisible(false);
                  setPasscode("");
                  setIsPanicMode(false);
                } else {
                  navigation.navigate("SignIn.SignInStack", {
                    screen: "SignIn.Iqama",
                  });
                  setIsPanicMode(false);
                }
              }}>
              {t("SignIn.PasscodeScreen.signInModal.cancelButton")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        testID="SignIn.IqamaInputScreen:PanicScreenModal"
        variant="warning"
        title={t("SignIn.PanicModeScreen.modal.activeTitle")}
        message={t("SignIn.PanicModeScreen.modal.customerMessage")}
        isVisible={isPanicModalVisible}
        onClose={() => setIsPanicModalVisible(false)}
        buttons={{
          primary: (
            <Button testID="SignIn.IqamaInputScreen:ProceedButton" onPress={handleOnNavigateToPancMode}>
              {t("SignIn.IqamaInputScreen.proceed")}
            </Button>
          ),
          secondary: (
            <Button testID="SignIn.IqamaInputScreen:CancelButton" onPress={() => setIsPanicModalVisible(false)}>
              {t("SignIn.IqamaInputScreen.cancel")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        testID="CardActions.VerifyPinScreen:errorPanicModal"
        variant="error"
        title={t("CardActions.VerifyPinScreen.errorPanicModal.title")}
        message={t("CardActions.VerifyPinScreen.errorPanicModal.message")}
        isVisible={isSubmitPanicErrorVisible}
        onClose={() => setIsSubmitPanicErrorVisible(false)}
      />
      {isLoadingLoginApi && !comingFromTPP ? <LoadingIndicatorModal /> : null}
    </Page>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    height: "100%",
  },
});
