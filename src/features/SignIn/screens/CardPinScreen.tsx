import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import Typography from "@/components/Typography";
import { NI_ROOT_URL } from "@/features/CardActions/constants";
import { useVerifyPin } from "@/features/CardActions/hooks/niHooks/use-verify-pin";
import { useGetToken } from "@/features/CardActions/hooks/query-hooks";
import { NIInputInterface } from "@/features/CardActions/types";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { hasItemInStorage, setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import { PINCODE_LENGTH } from "../constants";
import { useSignInContext } from "../contexts/SignInContext";

export default function CardPinScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isPanicMode } = useSignInContext();

  const [showModel, setShowModel] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>("");
  const [isSubmitErrorVisible, setIsSubmitErrorVisible] = useState<boolean>(false);
  const [remainingAttempts, setRemainingAttempts] = useState(PIN_MAX_TRIES);
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);
  const [isActiveModalVisible, setIsActiveModalVisible] = useState<boolean>(false);

  const { result: verifyPinResult, onVerifyPin, error: verifyPinError } = useVerifyPin();
  const { mutateAsync } = useGetToken();

  useEffect(() => {
    if (verifyPinResult !== null && verifyPinResult === "OK") {
      if (isPanicMode) {
        setIsActiveModalVisible(true);
      } else {
        navigation.navigate("SignIn.CreatePasscode");
      }
    }
  }, [verifyPinResult]);

  useEffect(() => {
    handleOnChange();
  }, [pinCode]);

  const handleOnChange = () => {
    if (pinCode.length === PINCODE_LENGTH) {
      handleSubmit();
      setPinCode("");
    }
  };

  useEffect(() => {
    if (verifyPinError !== null) {
      setIsErrorVisible(true);
      setRemainingAttempts(current => current - 1);
    }
  }, [verifyPinError]);

  const handleOnVerifyPin = async (pin: string) => {
    try {
      const response = await mutateAsync();
      if (response) {
        const niInput: NIInputInterface = {
          cardIdentifierType: "EXID",
          cardIdentifierId: "1234", /// here need to use useCards() to get cardID
          bankCode: "CROAT",
          connectionProperties: {
            rootUrl: NI_ROOT_URL,
            token: response.AccessToken,
          },
        };
        onVerifyPin(pin, niInput);
      }
    } catch (error) {
      setIsSubmitErrorVisible(true);
      warn("CARD-ACTIONS", `Error while getting token: ${JSON.stringify(error)}`);
    }
  };

  const handleSubmit = async () => {
    try {
      await handleOnVerifyPin(pinCode);
      handleNavigate();
    } catch (error: any) {
      const errorId = error?.errorContent?.Errors[0]?.ErrorId;
      if (errorId === "0032") handleBlocked();
      setPinCode("");
    }
  };

  const handleOnActivePanicMode = async () => {
    //TODO: when API is ready and navigate to sign in and remove the user
    //TODO: in error open modal
    // on success
    setIsActiveModalVisible(false);

    // navigation.navigate("SignIn.SignInStack", {
    //   screen: "SignIn.Iqama",
    // });
  };

  const handleBlocked = async () => {
    setShowModel(true);
    const userBlockTime = new Date().getTime() + 30 * 60 * 1000;
    await setItemInEncryptedStorage("UserBlockedPIN", JSON.stringify(userBlockTime));
  };

  const handleNavigate = async () => {
    if (isPanicMode) {
      setIsActiveModalVisible(true);
    } else {
      try {
        navigation.navigate("SignIn.CreatePasscode");
      } catch (responseError) {
        warn("login-action", "Could not send login OTP: ", JSON.stringify(responseError));
      }
    }
  };

  const handleBlockedNavigate = async () => {
    setShowModel(false);
    if (await hasItemInStorage("user")) {
      navigation.navigate("SignIn.Passcode");
    } else {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Onboarding.OnboardingStack",
            params: {
              screen: "Onboarding.SplashScreen",
            },
          },
          {
            name: "SignIn.SignInStack",
            params: {
              screen: "SignIn.Iqama",
            },
          },
        ],
      });
    }
  };

  const bannerStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "flex-end",
    paddingHorizontal: theme.spacing["20p"],
  }));

  const forgotPinTextStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: theme.spacing["64p"],
    width: "100%",
    textAlign: "center",
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton={true} />
        <View style={styles.containerStyle}>
          <PasscodeInput
            title={t("SignIn.CardPinScreen.title")}
            errorMessage={[]}
            isError={!!verifyPinError}
            showModel={showModel}
            subTitle={t("SignIn.CardPinScreen.subTitle")}
            resetError={handleBlockedNavigate}
            length={4}
            passcode={pinCode}
          />
          {!verifyPinError && remainingAttempts === 3 ? (
            <View style={bannerStyle}>
              <Alert variant="default" message={t("SignIn.CardPinScreen.needHelpInfo")} />
            </View>
          ) : null}

          {verifyPinError && remainingAttempts === 2 ? (
            <View style={bannerStyle}>
              <Alert variant="error" message={t("SignIn.CardPinScreen.twoAttemptsLeft")} />
            </View>
          ) : null}
          {verifyPinError && remainingAttempts === 1 ? (
            <View style={bannerStyle}>
              <View style={bannerStyle}>
                <Alert variant="error" message={t("SignIn.CardPinScreen.oneAttemptLeft")} />
              </View>
            </View>
          ) : null}

          <NumberPad passcode={pinCode} setPasscode={setPinCode} />
          <Pressable style={forgotPinTextStyle} onPress={() => navigation.navigate("SignIn.NafathAuthScreen")}>
            <Typography.Text
              color="primaryBase-30"
              align="center"
              weight="medium"
              size="footnote"
              style={styles.underline}>
              {t("SignIn.CardPinScreen.forgotCardPin")}
            </Typography.Text>
          </Pressable>
        </View>

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
                onPress={async () => {
                  if (await hasItemInStorage("user")) {
                    navigation.navigate("SignIn.SignInStack", {
                      screen: "SignIn.Passcode",
                    });
                    setIsActiveModalVisible(false);
                  } else {
                    navigation.navigate("SignIn.SignInStack", {
                      screen: "SignIn.Iqama",
                    });
                  }
                }}>
                {t("SignIn.PasscodeScreen.signInModal.cancelButton")}
              </Button>
            ),
          }}
        />
        <NotificationModal
          buttons={{
            primary: (
              <Button
                onPress={async () => {
                  if (await hasItemInStorage("user")) {
                    navigation.navigate("SignIn.SignInStack", {
                      screen: "SignIn.Passcode",
                    });
                    setIsActiveModalVisible(false);
                  } else {
                    navigation.navigate("SignIn.SignInStack", {
                      screen: "SignIn.Iqama",
                    });
                  }
                }}
                testID="CardActions.VerifyPinScreen:ErrorModalOkButton">
                {t("CardActions.VerifyPinScreen.errorModal.errorModalActionButton")}
              </Button>
            ),
          }}
          onClose={async () => {
            if (await hasItemInStorage("user")) {
              navigation.navigate("SignIn.SignInStack", {
                screen: "SignIn.Passcode",
              });
              setIsActiveModalVisible(false);
            } else {
              navigation.navigate("SignIn.SignInStack", {
                screen: "SignIn.Iqama",
              });
            }
          }}
          title={t("CardActions.VerifyPinScreen.errorModal.title")}
          message="You’ve entered the wrong PIN too many times. Please wait 30 min and try again"
          isVisible={isErrorVisible && remainingAttempts === 0}
          variant="error"
          testID="CardActions.VerifyPinScreen:ErrorModal"
        />
        <NotificationModal
          variant="error"
          title={t("errors.generic.title")}
          message={t("errors.generic.message")}
          isVisible={isSubmitErrorVisible}
          onClose={() => setIsSubmitErrorVisible(false)}
        />
      </Page>
    </>
  );
}

const PIN_MAX_TRIES = 3;

const styles = StyleSheet.create({
  containerStyle: {
    height: "100%",
  },
  underline: {
    textDecorationLine: "underline",
  },
});
