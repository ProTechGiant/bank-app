import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import PincodeInput from "@/components/PincodeInput";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { isValidPincode } from "@/utils/is-valid-pin";
import westernArabicNumerals from "@/utils/western-arabic-numerals";

import { CardActionsStackParams } from "../CardActionsStack";
import { NI_ROOT_URL } from "../constants";
import { useSetPin } from "../hooks/niHooks/use-set-pin";
import { useGetToken } from "../hooks/query-hooks";
import { NIInputInterface } from "../types";

export default function SetPinScreen() {
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.SetPinScreen">>();
  const cardId = route.params.cardId;

  const { result: setPinResult, onSetPin, isLoading: setPinLoading, error: setPinError } = useSetPin();
  const { mutateAsync, isLoading: getTokenLoading } = useGetToken();

  const pagerViewRef = useRef<ScrollView>(null);
  const enterPinCodeRef = useRef<React.ElementRef<typeof PincodeInput>>(null);
  const confirmPinCodeRef = useRef<React.ElementRef<typeof PincodeInput>>(null);
  // This needs to be in state because route.params may change during the flow.
  const [mode, setMode] = useState<"input" | "confirm">("input");
  const [isSubmitErrorVisible, setIsSubmitErrorVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState("");
  const [selectedPincode, setSelectedPincode] = useState<string | undefined>();

  const [remainingAttempts, setRemainingAttempts] = useState(PIN_MAX_TRIES);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  useEffect(() => {
    if (setPinResult !== null && setPinResult === "OK") {
      navigation.navigate("CardActions.CardActivatedScreen", { cardId });
    }
  }, [setPinResult]);

  useEffect(() => {
    if (setPinError !== null) {
      setIsSubmitErrorVisible(true);
    }
  }, [setPinError]);

  const handleOnSetPin = async (pin: string) => {
    try {
      const response = await mutateAsync();
      if (response) {
        const niInput: NIInputInterface = {
          cardIdentifierType: "EXID",
          cardIdentifierId: cardId,
          bankCode: "CROAT",
          connectionProperties: {
            rootUrl: NI_ROOT_URL,
            token: response.AccessToken,
          },
        };
        onSetPin(pin, niInput);
      }
    } catch (error) {
      setIsSubmitErrorVisible(true);
      warn("CARD-ACTIONS", `Error while getting token: ${JSON.stringify(error)}`);
    }
  };

  const handleOnTransitionStep = () => {
    setCurrentValue("");
    setIsErrorVisible(false);

    if (mode === "input") {
      setMode("confirm");

      pagerViewRef.current?.scrollTo({ x: dimensions.width });
      enterPinCodeRef.current?.blur();
      confirmPinCodeRef.current?.focus();
    }
  };

  const handleOnChangeText = (input: string) => {
    setCurrentValue(input);
    setIsErrorVisible(false);

    if (PIN_INPUT_LENGTH !== input.length) return;
    const convertedInput = westernArabicNumerals(input);

    // if entering pincode, validate according to requirements
    if (mode === "input") {
      if (isValidPincode(convertedInput)) {
        setSelectedPincode(convertedInput);
        handleOnTransitionStep();
      } else {
        setIsErrorVisible(true);
        setCurrentValue("");
      }

      return;
    }

    if (mode === "confirm") {
      if (convertedInput !== selectedPincode) {
        setIsErrorVisible(true);
        setCurrentValue("");
        setRemainingAttempts(current => current - 1);
      }

      if (convertedInput === selectedPincode) {
        handleIVRActivation();
      }
    }
  };

  const handleIVRActivation = () => {
    navigation.navigate("CardActions.IVRCheckScreen", {
      title: t("CardActions.IVRCheckScreen.ivrCheckTitle"),
      message: t("CardActions.IVRCheckScreen.ivrCheckMessage"),
      onVerificationComplete: () => handleActivationSuccess(),
      cardId,
    });
  };

  const handleActivationSuccess = async () => {
    if (selectedPincode !== undefined) {
      handleOnSetPin(selectedPincode);
    }
  };

  const handleOnCloseError = () => {
    setIsSubmitErrorVisible(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const inputContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginBottom: theme.spacing["16p"],
    marginTop: theme.spacing["48p"],
    rowGap: theme.spacing["12p"],
    width: "100%",
  }));

  const keyboardAvoidingContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    marginTop: theme.spacing["32p"],
  }));

  return (
    <>
      {setPinLoading || getTokenLoading ? (
        <FullScreenLoader />
      ) : (
        <Page backgroundColor="neutralBase-60">
          <NavHeader
            onBackPress={handleBack}
            title={
              <View style={styles.progressIndicator}>
                <ProgressIndicator currentStep={mode === "input" ? 1 : 2} totalStep={2} />
              </View>
            }
            testID="CardActions.SetPinScreen:NavHeader"
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={keyboardAvoidingContainerStyle}>
            <ScrollView ref={pagerViewRef} horizontal scrollEnabled={false}>
              {/* Enter a PIN-code */}
              <ContentContainer style={{ width: dimensions.width }}>
                <Stack direction="vertical" gap="12p">
                  <Typography.Text color="neutralBase+30" size="title1" weight="medium">
                    {t("CardActions.ApplyCardScreen.SetPinScreen.SetPin.title")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="title3" weight="regular">
                    {t("CardActions.ApplyCardScreen.SetPinScreen.SetPin.instruction", {
                      count: PIN_INPUT_LENGTH,
                    })}
                  </Typography.Text>
                </Stack>
                <View style={inputContainerStyle}>
                  <PincodeInput
                    ref={enterPinCodeRef}
                    autoFocus
                    onChangeText={handleOnChangeText}
                    length={PIN_INPUT_LENGTH}
                    value={currentValue}
                    testID="CardActions.SetPinScreen:EnterPinCodeInput"
                  />
                  {isErrorVisible ? (
                    <Alert
                      message={t("CardActions.ApplyCardScreen.SetPinScreen.SetPin.errorPinTooEasy")}
                      variant="error"
                      testID="CardActions.SetPinScreen:PinCodeTooEasyAlert"
                    />
                  ) : null}
                </View>
              </ContentContainer>
              {/* Confirm PIN-code */}
              <ContentContainer style={{ width: dimensions.width }}>
                <Stack direction="vertical" gap="12p">
                  <Typography.Text color="neutralBase+30" size="large" weight="semiBold">
                    {t("CardActions.ApplyCardScreen.SetPinScreen.ConfirmPin.title")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                    {t("CardActions.ApplyCardScreen.SetPinScreen.ConfirmPin.instruction", {
                      count: PIN_INPUT_LENGTH,
                    })}
                  </Typography.Text>
                </Stack>
                <View style={inputContainerStyle}>
                  <PincodeInput
                    ref={confirmPinCodeRef}
                    onChangeText={handleOnChangeText}
                    length={PIN_INPUT_LENGTH}
                    value={currentValue}
                    testID="CardActions.SetPinScreen:ConfirmPinCodeInput"
                  />
                  {isErrorVisible && remainingAttempts > 0 ? (
                    <Alert
                      message={t("CardActions.ApplyCardScreen.SetPinScreen.ConfirmPin.pinNotMatch", {
                        count: remainingAttempts,
                      })}
                      variant="error"
                      testID="CardActions.SetPinScreen:PinCodeDoesNotMatchAlert"
                    />
                  ) : null}
                </View>
              </ContentContainer>
            </ScrollView>
          </KeyboardAvoidingView>
          <NotificationModal
            buttons={{
              primary: (
                <Button onPress={() => handleBack()} testID="CardActions.SetPinScreen:ErrorModalBackButton">
                  {t("CardActions.ApplyCardScreen.SetPinScreen.ConfirmPin.errorModalActionButton")}
                </Button>
              ),
            }}
            title={t("CardActions.ApplyCardScreen.SetPinScreen.ConfirmPin.errorModalTitle")}
            message={t("CardActions.ApplyCardScreen.SetPinScreen.ConfirmPin.errorModalMessage")}
            isVisible={isErrorVisible && remainingAttempts === 0}
            variant="error"
            testID="CardActions.SetPinScreen:ErrorModal"
          />
        </Page>
      )}
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isSubmitErrorVisible}
        onClose={handleOnCloseError}
      />
    </>
  );
}

const PIN_INPUT_LENGTH = 4;
const PIN_MAX_TRIES = 3;

const styles = StyleSheet.create({
  progressIndicator: { width: "80%" },
});
