import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, StyleSheet, View, ViewStyle } from "react-native";

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
import biometricsService from "@/services/biometrics/biometricService";
import { useThemeStyles } from "@/theme";
import { generateRandomId, getUniqueDeviceId } from "@/utils";
import delayTransition from "@/utils/delay-transition";
import {
  getItemFromEncryptedStorage,
  removeItemFromEncryptedStorage,
  setItemInEncryptedStorage,
} from "@/utils/encrypted-storage";

import { PanicIcon } from "../assets/icons";
import { BLOCKED_TIME, deviceStatusEnum, PASSCODE_LENGTH, SIGN_IN_METHOD } from "../constants";
import { useSignInContext } from "../contexts/SignInContext";
import { useErrorMessages } from "../hooks";
import {
  handleOnOneTimeLogin,
  handleOnRegisterNewDevice,
  useLoginUser,
  usePanicMode,
  useSendLoginOTP,
  useValidatePasscode,
} from "../hooks/query-hooks";
import { UserType } from "../types";

export default function PasscodeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const auth = useAuthContext();
  const { setNationalId, correlationId } = useSignInContext();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();
  const { mutateAsync: editPanicMode } = usePanicMode();
  const { mutateAsync, error: loginError, isError, isLoading: isLoadingLoginApi } = useLoginUser();
  const loginUserError = loginError as ApiError;
  const { errorMessages } = useErrorMessages(loginUserError);
  const [passCode, setPasscode] = useState<string>("");
  const [user, setUser] = useState<UserType | null>(null);
  const [biometricsKeyExist, setBiometricsKeyExist] = useState<boolean>(false);
  const [isSensorAvailable, setIsSensorAvailable] = useState<boolean>(false);
  const otpFlow = useOtpFlow();
  const useSendLoginOtpAsync = useSendLoginOTP();
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);
  const isOneTimeDevice = useRef(false);
  const { setSignInCorrelationId, setIsPanicMode, isPanicMode } = useSignInContext();
  const blockedUserFlow = useBlockedUserFlow();
  const [isPanicModalVisible, setIsPanicModalVisible] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState<string>(deviceStatusEnum.NEW);
  const [isSignOutModalVisible, setIsSignOutModalVisible] = useState<boolean>(false);
  const [isErrorModalVisible, setErrorModalVisible] = useState<boolean>(false);
  const [isActiveModalVisible, setIsActiveModalVisible] = useState<boolean>(false);
  const [isSubmitPanicErrorVisible, setIsSubmitPanicErrorVisible] = useState<boolean>(false);
  const comingFromTPP = useCheckTPPService();
  const { mutateAsync: validatePasscode } = useValidatePasscode();

  useEffect(() => {
    handleOnChange();
  }, [passCode]);

  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        const { keysExist } = await biometricsService.biometricKeysExist();
        setBiometricsKeyExist(keysExist);
        if (keysExist) {
          handleBioMetrics();
        }
        setIsSensorAvailable((await biometricsService.isSensorAvailable()).available);
      } catch (error) {
        warn("Error checking biometrics:", JSON.stringify(error));
      }
    };
    if (isRegisteredDevice) checkBiometrics();
  }, []);

  useEffect(() => {
    (async () => {
      const userData = await getItemFromEncryptedStorage("user");
      getAuthenticationToken();

      if (userData) {
        setUser(JSON.parse(userData));
        const _correlationId = generateRandomId();
        setSignInCorrelationId(_correlationId);
      }
    })();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setPasscode("");
    }
  }, [isFocused]);

  const handleCheckUserDevice = async () => {
    if (isRegisteredDevice || comingFromTPP || isPanicMode) {
      handleUserLogin();
    } else {
      setShowSignInModal(true);
    }
  };

  useEffect(() => {
    const checkDeviceRegistration = async () => {
      try {
        if (!user) return;

        const deviceId = await getUniqueDeviceId();

        if (user.DeviceId === deviceId && user.DeviceStatus === "R") {
          setDeviceStatus(deviceStatusEnum.REGISTERED);
        } else if (user.DeviceId !== deviceId && user.DeviceStatus !== "R") {
          setDeviceStatus(deviceStatusEnum.NEW);
        }
      } catch (error) {
        warn("Error checking device registration:", JSON.stringify(error));
      }
    };

    checkDeviceRegistration();
  }, [user]);

  const navigateToHome = async (accessToken: string) => {
    try {
      const deviceId = await getUniqueDeviceId();
      setItemInEncryptedStorage("user", JSON.stringify({ ...user, DeviceId: deviceId, isDeviceRegistered: true }));
      auth.userId && auth.authenticate(auth.userId, accessToken);
      if (auth.navigationTarget) {
        const { stack, screen } = auth.navigationTarget;
        setImmediate(() => {
          navigation.navigate(stack, { screen }); // TODO will add params later navigation.navigate(stack, { screen , param });
        });
      }
    } catch (e) {
      warn("Error", JSON.stringify(e));
    }
  };

  const handleOneTimeUse = async () => {
    isOneTimeDevice.current = true;
    handleNavigate();
  };

  const handleUserLogin = async (method?: SIGN_IN_METHOD) => {
    try {
      if (isPanicMode) {
        setIsActiveModalVisible(true);
        return;
      }
      if (isRegisteredDevice && user) {
        const response = await mutateAsync({
          passCode,
          nationalId: user?.NationalId,
          method: method || SIGN_IN_METHOD.PASS_CODE,
        });
        storeUserToLocalStorage();
        navigateToHome(response.AccessToken);
      } else {
        delayTransition(() => handleNavigate());
      }

      setPasscode("");
    } catch (error: any) {
      setErrorModalVisible(true);
      setPasscode("");
    }
  };

  const storeUserToLocalStorage = () => {
    if (!user) return;

    setNationalId(user.NationalId);
    auth.updatePhoneNumber(user.MobileNumber);
  };

  const handleSignin = async () => {
    if (!user) return;
    setShowSignInModal(false);

    handleNavigate();
  };

  const handleCancelButton = () => {
    setShowSignInModal(false);
    setPasscode("");
    if (!user) {
      navigation.navigate("SignIn.Iqama");
    }
  };

  const handleOnChange = async () => {
    try {
      if (passCode.length === PASSCODE_LENGTH && user) {
        const response = await validatePasscode({ passCode, nationalId: user?.NationalId });
        if (response.DiffUserFlag) setDeviceStatus(deviceStatusEnum.REGISTERED_WITH_USER);
        handleCheckUserDevice();
      }
    } catch (error: any) {
      const errorId = error?.errorContent?.Errors?.[0].ErrorId;
      if (!errorId) setErrorModalVisible(true);
      if (errorId === "0009") blockedUserFlow.handle("passcode", BLOCKED_TIME);
      if (errorId === "0010") blockedUserFlow.handle("passcode");
      setPasscode("");
      warn("Error while validating the passcode", JSON.stringify(error));
    }
  };

  const handleOnActivePanicMode = async () => {
    try {
      if (!user) {
        setIsActiveModalVisible(false);
        delayTransition(() => {
          setIsSubmitPanicErrorVisible(true);
        });
        return;
      }

      await editPanicMode({
        isPanic: true,
        nationalId: user.NationalId,
        mobileNumber: user.MobileNumber,
      });
      removeItemFromEncryptedStorage("user");

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

  const navigateToTpp = () => {
    auth.authenticate(auth.userId ?? "", auth.authToken);
    setImmediate(() => {
      navigation.navigate("OpenBanking.OpenBankingStack", {
        screen: "OpenBanking.OpenBankingScreen",
      });
    });
  };

  const handleOtpVerification = async () => {
    storeUserToLocalStorage();
    setPasscode("");

    if (comingFromTPP) {
      navigateToTpp();
    } else {
      if (isOneTimeDevice.current) {
        navigation.navigate("Ivr.IvrWaitingScreen", {
          onApiCall: async () =>
            handleOnOneTimeLogin({ correlationId: correlationId!, nationalId: user?.NationalId!, passCode }),
          onBack: () => navigation.navigate("SignIn.Iqama"),
          onError: () => navigation.navigate("SignIn.Iqama"),
          onSuccess: () => {
            auth.authenticate(auth.userId!);
          },
          varient: "modal",
        });
      } else {
        navigation.navigate("Ivr.IvrWaitingScreen", {
          onApiCall: async () =>
            handleOnRegisterNewDevice({ correlationId: correlationId!, nationalId: user?.NationalId!, passCode }),
          onBack: () => navigation.navigate("SignIn.Iqama"),
          onError: () => navigation.navigate("SignIn.Iqama"),
          onSuccess: () => {
            auth.authenticate(auth.userId!);
          },
          varient: "modal",
        });
      }
    }
  };

  const handleNavigate = () => {
    try {
      otpFlow.handle({
        action: {
          to: "SignIn.Passcode",
          params: {},
        },
        otpChallengeParams: {
          PhoneNumber: user?.MobileNumber || "",
        },
        otpVerifyMethod: "login",
        onOtpRequest: () => {
          return useSendLoginOtpAsync.mutateAsync("login");
        },
        onFinish: (status: string) => {
          if (status === "cancel") {
            return;
          } else if (status === "success") {
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

  const handleBioMetrics = async () => {
    biometricsService
      .initiate({
        promptMessage: t("Settings.BiometricScreen.confirmBiometrics"),
        cancelButtonText: t("Settings.BiometricScreen.cancelText"),
        requestFrom: Platform.OS,
      })
      .then(_resultObject => {
        handleSuccess();
      })
      .catch(error => {
        warn("biometrics", `biometrics failed ${error}`);
      });
  };

  const handleSuccess = () => {
    handleUserLogin(SIGN_IN_METHOD.BIOMETRICS);
  };

  const handleOnClose = () => {
    setIsSignOutModalVisible(false);
  };

  const handleOnCloseError = () => {
    setIsSignOutModalVisible(false);
    delayTransition(() => {
      setErrorModalVisible(true);
    });
  };

  const handleOnNavigateToPanicMode = () => {
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
  const isRegisteredDevice = deviceStatus === deviceStatusEnum.REGISTERED;
  const isRegisteredWithDifferentUser = deviceStatus === deviceStatusEnum.REGISTERED_WITH_USER;

  return (
    <Page>
      <NavHeader
        withBackButton={!user || (user && isPanicMode)}
        end={
          isRegisteredDevice && !isPanicMode ? (
            <Pressable onPress={() => setIsPanicModalVisible(true)}>
              <PanicIcon color={panicIconColor} width={34} height={34} />
            </Pressable>
          ) : undefined
        }
      />
      <View style={styles.containerStyle}>
        <PasscodeInput
          isPanicMode={isPanicMode}
          user={isRegisteredDevice ? user : null}
          title={
            !isRegisteredDevice || (isRegisteredDevice && isPanicMode)
              ? t("SignIn.PasscodeScreen.title")
              : t("SignIn.PasscodeScreen.userTitle", { username: user?.CustomerName?.split(" ")[0] })
          }
          errorMessage={errorMessages}
          isError={isError}
          subTitle={user || !(user && isPanicMode) ? t("SignIn.PasscodeScreen.subTitle") : ""}
          length={6}
          passcode={passCode}
        />
        <NumberPad
          handleBiometric={handleBioMetrics}
          isBiometric={user && isRegisteredDevice && isSensorAvailable && biometricsKeyExist}
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
        isRegisteredDevice ? (
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
        isVisible={isErrorModalVisible}
        onClose={() => setErrorModalVisible(false)}
      />
      <NotificationModal
        variant="warning"
        title={
          !isRegisteredWithDifferentUser
            ? t("SignIn.PasscodeScreen.signInModal.title")
            : t("SignIn.PasscodeScreen.signInModal.deviceLinkageTitle")
        }
        message={
          !isRegisteredWithDifferentUser
            ? t("SignIn.PasscodeScreen.signInModal.registerNewDevice")
            : t("SignIn.PasscodeScreen.signInModal.deviceLinkageMessage")
        }
        isVisible={showSignInModal}
        onClose={handleCancelButton}
        buttons={{
          primary: (
            <Button onPress={handleSignin}>
              {!isRegisteredWithDifferentUser
                ? t("SignIn.PasscodeScreen.signInModal.registerDevice")
                : t("SignIn.PasscodeScreen.signInModal.switchDeviceButton")}
            </Button>
          ),
          secondary: <Button onPress={handleOneTimeUse}>{t("SignIn.PasscodeScreen.signInModal.oneTimeUse")}</Button>,
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
            <Button testID="SignIn.IqamaInputScreen:ProceedButton" onPress={handleOnNavigateToPanicMode}>
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
