import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import ApiError from "@/api/ApiError";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { OTP_BLOCKED_TIME } from "@/constants";
import { useAuthContext } from "@/contexts/AuthContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useBlockedUserFlow from "@/hooks/use-blocked-user-handler";
import { useSearchUserByNationalId } from "@/hooks/use-search-user-by-national-id";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import biometricsService from "@/services/biometrics/biometricService";
import { useThemeStyles } from "@/theme";
import { generateRandomId, getUniqueDeviceId } from "@/utils";
import delayTransition from "@/utils/delay-transition";
import {
  getItemFromEncryptedStorage,
  hasItemInStorage,
  removeItemFromEncryptedStorage,
  setItemInEncryptedStorage,
} from "@/utils/encrypted-storage";

import { ArtWorkIcon } from "../assets/icons";
import { MobileAndNationalIdForm } from "../components";
import { deviceStatusEnum } from "../constants";
import { useSignInContext } from "../contexts/SignInContext";
import { useErrorMessages } from "../hooks";
import { useCheckCustomerStatus, usePanicMode, useSendLoginOTP } from "../hooks/query-hooks";
import { IqamaInputs, StatusTypes, UserType } from "../types";

export default function PanicModeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const otpFlow = useOtpFlow();
  const auth = useAuthContext();

  const useSendLoginOtpAsync = useSendLoginOTP();
  const blockedUserFlow = useBlockedUserFlow();
  const { mutateAsync, error, reset } = useSearchUserByNationalId();
  const { mutateAsync: checkCustomerStatus } = useCheckCustomerStatus();
  const { mutateAsync: editPanicMode } = usePanicMode();

  const iqamaError = error as ApiError;
  const { errorMessages } = useErrorMessages(iqamaError);
  const { setSignInCorrelationId, setNationalId, setIsPanicMode, userData } = useSignInContext();
  const [notMatchRecord, setNotMatchRecord] = useState<boolean>(false);
  const [isDeceased, setIsDeceased] = useState<boolean>(false);
  const [isDeactivePaincModeVisible, setIsDeactivePaincModeVisible] = useState<boolean>(false);
  const [submittedMobileNumber, setSubmittedMobileNumber] = useState<string>("");
  const [errorModal, setErrorModal] = useState(false);
  const [isHideDoneButton, setIsHideDoneButton] = useState(true);
  const [user, setUser] = useState<UserType | null>(userData);
  const [deviceStatus, setDeviceStatus] = useState<string>(deviceStatusEnum.NEW);

  const [_biometricsKeyExist, setBiometricsKeyExist] = useState<boolean>(false);
  const [isBiometricFailsModal, setIsBiometricFailsModal] = useState<boolean>(false);
  const [isActiveModalVisible, setIsActiveModalVisible] = useState<boolean>(false);

  const isRegisteredDevice = deviceStatus === deviceStatusEnum.REGISTERED;

  useEffect(() => {
    (async () => {
      const userDataInStorage = await getItemFromEncryptedStorage("user");
      if (userDataInStorage) {
        setUser(JSON.parse(userDataInStorage));
      }
    })();
  }, []);

  useEffect(() => {
    const checkDeviceRegistration = async () => {
      const deviceId = await getUniqueDeviceId();
      try {
        if (!user) return;

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

  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        const { keysExist } = await biometricsService.biometricKeysExist();
        setBiometricsKeyExist(keysExist);
        if (keysExist) {
          handleBioMetrics();
        }
      } catch (error) {
        warn("Error checking biometrics:", JSON.stringify(error));
      }
    };
    if (isRegisteredDevice) checkBiometrics();
  }, [deviceStatus]);

  const handleOnActivePanicMode = async () => {
    try {
      await editPanicMode({
        isPanic: true,
        nationalId: user.NationalId,
        mobileNumber: user.MobileNumber,
        token: auth.authToken,
      });
      removeItemFromEncryptedStorage("user");

      setIsActiveModalVisible(false);
      setIsPanicMode(false);
    } catch (error) {}
  };

  const handleBioMetrics = async () => {
    biometricsService
      .initiate({
        promptMessage: t("Settings.BiometricScreen.confirmBiometrics"),
        cancelButtonText: t("Settings.BiometricScreen.cancelText"),
        requestFrom: Platform.OS,
      })
      .then(_resultObject => {
        setIsActiveModalVisible(true);
      })
      .catch(_error => {
        setIsBiometricFailsModal(true);
      });
  };

  const checkUserAccountStatus = async (CustomerId: string) => {
    try {
      const response = await checkCustomerStatus(CustomerId);
      if (response) {
        if (response.StatusId === StatusTypes.PANIC_MODE) {
          setIsDeactivePaincModeVisible(true);
        } else {
          setIsPanicMode(true);
          navigation.navigate("SignIn.Passcode");
        }
      }
    } catch (err) {
      warn("checkUserStatus", "Could check user status. Error: ", JSON.stringify(err));
    }
  };

  useEffect(() => {
    const _correlationId = generateRandomId();
    setSignInCorrelationId(_correlationId);
  }, []);

  useEffect(() => {
    if (
      iqamaError &&
      iqamaError.errorContent &&
      iqamaError.errorContent.Errors &&
      iqamaError.errorContent.Errors.some(({ ErrorId }: { ErrorId: string }) => ErrorId === "0061")
    ) {
      reset();
    }
  }, [iqamaError, reset]);

  const storeUserToLocalStorage = (user: UserType) => {
    setItemInEncryptedStorage("user", JSON.stringify(user));
  };

  const handleOTP = (mobileNumber: string) => {
    otpFlow.handle({
      action: {
        to: "SignIn.PanicModeScreen",
      },
      otpChallengeParams: {
        mobileNumber,
      },
      onOtpRequest: async () => {
        return useSendLoginOtpAsync.mutateAsync("reset-passcode");
      },
      // TODO here maybe will add new otp reason
      otpVerifyMethod: "reset-passcode",
      onFinish: (status: string) => {
        if (status === "success") {
          navigation.navigate("SignIn.CardPin");
        }
      },
      onUserBlocked: () => {
        blockedUserFlow.handle("otp", OTP_BLOCKED_TIME);
      },
    });
  };

  const handleOnSubmit = async (values: IqamaInputs) => {
    try {
      const { NationalId, MobileNumber } = values;
      const response = await mutateAsync({ NationalId, MobileNumber });
      setSubmittedMobileNumber(MobileNumber);
      if (response.TotalRecords === 1) {
        setNationalId(NationalId);
        storeUserToLocalStorage(response);
        await checkUserAccountStatus(response.CustomerId);
      } else if (response.TotalRecords === 0) {
        setNotMatchRecord(true);
      }
    } catch (err) {
      setNotMatchRecord(false);
      if (!(iqamaError && iqamaError.errorContent && iqamaError.errorContent.Errors) && err) {
        setErrorModal(true);
      }
      warn("signIn", "Could not process iqama input. Error: ", JSON.stringify(err));
    }
  };

  const handleOnCloseUnauthorizedModal = () => {
    setIsDeceased(false);
  };

  const artWorkStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    paddingTop: theme.spacing["64p"],
  }));

  const cancelButtonView = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  return (
    <Page testID="SignIn.PanicModeScreen:PanicScreen" backgroundColor="neutralBase-60">
      <KeyboardAvoidingView behavior="height" style={styles.component}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.contentContainer}
          automaticallyAdjustKeyboardInsets={true}>
          <NavHeader
            testID="SignIn.PanicModeScreen:NavHeader"
            withBackButton
            title={t("SignIn.PanicModeScreen.title")}
          />
          <View style={artWorkStyle}>
            <ArtWorkIcon />
          </View>

          <MobileAndNationalIdForm
            isHideDoneButton={isHideDoneButton}
            doneButtonOnFocus={() => {
              setIsHideDoneButton(false);
            }}
            doneButtonOnBlur={() => {
              setIsHideDoneButton(true);
            }}
            isPanicMode={true}
            onSubmit={handleOnSubmit}
            errorMessages={errorMessages}
            notMatchRecord={notMatchRecord}
            title={t("SignIn.PanicModeScreen.form.title")}
            subTitle={t("SignIn.PanicModeScreen.form.subTitle")}
            buttonText={t("SignIn.PanicModeScreen.buttons.proceed")}
          />
          <View style={cancelButtonView}>
            <Button
              variant="tertiary"
              testID="SignIn.IqamaInputScreen:CancelButton"
              onPress={async () => {
                if (await hasItemInStorage("user")) {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: "SignIn.Passcode",
                      },
                    ],
                  });
                } else {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: "SignIn.SignInStack",
                        params: {
                          screen: "SignIn.Iqama",
                        },
                      },
                    ],
                  });
                }
              }}>
              {t("SignIn.IqamaInputScreen.cancel")}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <NotificationModal
        testID="SignIn.PanicModeScreen:ErrorModal"
        variant="error"
        title={t("SignIn.Modal.title")}
        message={t("SignIn.Modal.subTitle")}
        isVisible={isDeceased}
        onClose={handleOnCloseUnauthorizedModal}
      />
      <NotificationModal
        testID="SignIn.PanicModeScreen:ErrorModal"
        variant="error"
        title={t("SignIn.Modal.error.title")}
        message={t("SignIn.Modal.error.subTitle")}
        isVisible={errorModal}
        onClose={() => setErrorModal(false)}
      />
      <NotificationModal
        testID="SignIn.PanicModeScreen:DeactivePanicModal"
        variant="warning"
        title={t("SignIn.PanicModeScreen.modal.deactiveTitle")}
        message={t("SignIn.PanicModeScreen.modal.deactiveMessage")}
        isVisible={isDeactivePaincModeVisible}
        onClose={() => setIsDeactivePaincModeVisible(false)}
        buttons={{
          primary: (
            <Button
              testID="SignIn.PanicModeScreen:ProceedButton"
              onPress={() => {
                setIsDeactivePaincModeVisible(false);
                delayTransition(() => {
                  handleOTP(submittedMobileNumber);
                });
              }}>
              {t("SignIn.IqamaInputScreen.proceed")}
            </Button>
          ),
          secondary: (
            <Button testID="SignIn.PanicModeScreen:CancelButton" onPress={() => setIsDeactivePaincModeVisible(false)}>
              {t("SignIn.IqamaInputScreen.cancel")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        testID="SignIn.PanicModeScreen:DeactivePanicModal"
        variant="error"
        title={t("SignIn.PanicModeScreen.modal.biometricFail")}
        message={t("SignIn.PanicModeScreen.modal.biometricFailSubTitle")}
        isVisible={isBiometricFailsModal}
        onClose={() => setIsBiometricFailsModal(false)}
        buttons={{
          primary: (
            <Button testID="SignIn.PanicModeScreen:ProceedButton" onPress={handleBioMetrics}>
              {t("SignIn.PanicModeScreen.modal.biometricFailTryAgain")}
            </Button>
          ),
          secondary: (
            <Button testID="SignIn.PanicModeScreen:CancelButton" onPress={() => setIsBiometricFailsModal(false)}>
              {t("SignIn.IqamaInputScreen.cancel")}
            </Button>
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
                  setIsActiveModalVisible(false);
                  setIsPanicMode(false);
                }
              }}>
              {t("SignIn.PasscodeScreen.signInModal.cancelButton")}
            </Button>
          ),
        }}
      />
    </Page>
  );
}
const styles = StyleSheet.create({
  component: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
