import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import { TickCircleOutlineIcon } from "@/assets/icons";
import { ProgressIndicator } from "@/components";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import PincodeInput from "@/components/PincodeInput";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useToasts } from "@/contexts/ToastsContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { useSetPin } from "@/hooks/niSDK/niHooks/use-set-pin";
import { useGetToken } from "@/hooks/use-token";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";
import { hasConsecutiveNumbers, isSequential, isValidPincode, maxRepeatThresholdMet } from "@/utils/is-valid-pin";
import westernArabicNumerals from "@/utils/western-arabic-numerals";

import { NI_ROOT_URL } from "../constants";
import { useChangePinCode } from "../hooks/query-hooks";
import { NIInputInterface } from "../types";

export default function ResetPinCodeScreen() {
  const { t } = useTranslation();
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.ResetPincodeScreen">>();
  const cardId = route.params.cardId;
  const cardIdType = route.params.cardIdType;

  const { result: setPinResult, onSetPin, isLoading: setPinLoading, error: setPinError } = useSetPin();
  const { mutateAsync, isLoading: getTokenLoading } = useGetToken();

  const pagerViewRef = useRef<ScrollView>(null);
  const enterPinCodeRef = useRef<React.ElementRef<typeof PincodeInput>>(null);
  const confirmPinCodeRef = useRef<React.ElementRef<typeof PincodeInput>>(null);
  const [currentValue, setCurrentValue] = useState("");
  const [selectedPincode, setSelectedPincode] = useState<string | undefined>();
  const [remainingAttempts, setRemainingAttempts] = useState(NUMBER_OF_RETRIES);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitErrorVisible, setIsSubmitErrorVisible] = useState(false);
  const otpFlow = useOtpFlow<AuthenticatedStackParams>();
  const changePin = useChangePinCode();
  const addToast = useToasts();

  const tickIconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  useEffect(() => {
    if (setPinResult !== null && (setPinResult === "Pin set successfully!" || setPinResult === "OK")) {
      addToast({
        icon: <TickCircleOutlineIcon color={tickIconColor} />,
        variant: "success",
        message: t("CardActions.ResetPincodeScreen.PinChangeSuccessMessage"),
        closable: true,
      });
      navigation.goBack();
    }
  }, [setPinResult, navigation]);

  useEffect(() => {
    if (setPinError !== null) {
      setIsSubmitErrorVisible(true);
    }
  }, [setPinError]);

  const handleOnBackPress = () => {
    if (selectedPincode === undefined) return navigation.goBack();

    setCurrentValue("");
    setSelectedPincode(undefined);
    setRemainingAttempts(NUMBER_OF_RETRIES);
    setIsErrorVisible(false);

    I18nManager.isRTL
      ? pagerViewRef.current?.scrollToEnd({ animated: true })
      : pagerViewRef.current?.scrollTo({ x: 0 });

    enterPinCodeRef.current?.focus();
    setCurrentStep(1);
  };

  const handleOnTransitionStep = () => {
    setCurrentValue("");
    setIsErrorVisible(false);
    setCurrentStep(2);

    delayTransition(() => {
      I18nManager.isRTL
        ? pagerViewRef.current?.scrollTo({ x: 0 })
        : pagerViewRef.current?.scrollToEnd({ animated: true });
      confirmPinCodeRef.current?.focus();
    });
  };

  const handleOnChangeText = (value: string) => {
    if (remainingAttempts < 1) return;
    const normalizedValue = westernArabicNumerals(value);

    setIsErrorVisible(false);
    setCurrentValue(normalizedValue);

    if (normalizedValue.length !== INPUT_SIZE) return;

    // Move to confirm screen
    if (selectedPincode === undefined) {
      if (isValidPincode(normalizedValue)) {
        if (
          maxRepeatThresholdMet(normalizedValue) ||
          (normalizedValue.length === INPUT_SIZE && isSequential(normalizedValue)) ||
          hasConsecutiveNumbers(normalizedValue)
        ) {
          setIsErrorVisible(true);
          setCurrentValue("");
          return;
        }

        handleOnTransitionStep();
        setSelectedPincode(normalizedValue);
        setCurrentStep(2);
      } else {
        setCurrentValue("");
        setIsErrorVisible(true);
      }

      return;
    }

    // Check that input matches prior input
    if (normalizedValue !== selectedPincode) {
      setRemainingAttempts(current => current - 1);
      setIsErrorVisible(true);
      setCurrentValue("");
    }

    if (normalizedValue === selectedPincode) {
      handleOnUpdatePincode();
    }
  };

  const handleOnUpdatePincode = async () => {
    if (undefined === selectedPincode) return;

    otpFlow.handle({
      action: {
        to: "CardActions.ResetPincodeScreen",
        params: {
          cardId: cardId,
        },
      },
      otpOptionalParams: {
        CardId: cardId,
      },
      otpVerifyMethod: "card-actions",
      onOtpRequest: async () => {
        const changePinResponse = await changePin.mutateAsync({
          cardId: cardId,
          cardIdType: cardIdType ?? "",
        });

        return changePinResponse;
      },
      onFinish: status => {
        if (status === "cancel") {
          return;
        }
        if (status === "fail") {
          setIsSubmitErrorVisible(true);
        } else {
          handleOnSetPin(selectedPincode, cardId);
        }
      },
    });
  };

  const handleOnSetPin = async (pin: string, cardID: string) => {
    try {
      const response = await mutateAsync();
      if (response) {
        const niInput: NIInputInterface = {
          cardIdentifierType: "EXID",
          cardIdentifierId: cardID,
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

  const handleOnCloseError = () => {
    setIsSubmitErrorVisible(false);
  };

  const inputContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    paddingVertical: theme.spacing["48p"],
    rowGap: theme.spacing["12p"],
    width: "100%",
  }));

  const scrollViewStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["48p"],
  }));

  return (
    <>
      {setPinLoading || getTokenLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Page backgroundColor="neutralBase-60">
            <NavHeader
              onBackPress={handleOnBackPress}
              testID="CardActions.ResetPinCodeScreen:NavHeader"
              title={
                <View style={styles.progressIndicator}>
                  <ProgressIndicator currentStep={currentStep} totalStep={2} />
                </View>
              }
            />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
              <ScrollView
                style={scrollViewStyle}
                ref={pagerViewRef}
                horizontal
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}>
                {/* Enter a new PIN-code */}
                <ContentContainer style={{ width: dimensions.width }}>
                  <Stack direction="vertical" gap="16p">
                    <Typography.Text color="neutralBase+30" size="title1" weight="medium">
                      {t("CardActions.ResetPincodeScreen.setPin")}
                    </Typography.Text>
                    <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                      {t("CardActions.ResetPincodeScreen.description", { count: INPUT_SIZE })}
                    </Typography.Text>
                    <View style={inputContainerStyle}>
                      <PincodeInput
                        ref={enterPinCodeRef}
                        autoFocus
                        onChangeText={handleOnChangeText}
                        length={INPUT_SIZE}
                        value={currentValue}
                        testID="CardActions.ResetPinCodeScreen:PincodeInput"
                      />
                      {isErrorVisible ? (
                        <Alert
                          message={t("CardActions.ResetPincodeScreen.errorPincodeTooEasy")}
                          variant="error"
                          testID="CardActions.ResetPinCodeScreen:PincodeTooEasyAlert"
                        />
                      ) : null}
                    </View>
                  </Stack>
                </ContentContainer>

                {/* Confirm new PIN-code */}
                <ContentContainer style={{ width: dimensions.width }}>
                  <Stack direction="vertical" gap="16p">
                    <Typography.Text color="neutralBase+30" size="title1" weight="medium">
                      {t("CardActions.ResetPincodeScreen.confirmPin")}
                    </Typography.Text>
                    <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                      {t("CardActions.ResetPincodeScreen.confirmPinInstruction", { count: INPUT_SIZE })}
                    </Typography.Text>
                    <View style={inputContainerStyle}>
                      <PincodeInput
                        ref={confirmPinCodeRef}
                        onChangeText={handleOnChangeText}
                        length={INPUT_SIZE}
                        value={currentValue}
                        isError={isErrorVisible && remainingAttempts > 0}
                        testID="CardActions.ResetPinCodeScreen:ConfirmPincodeInput"
                      />
                      {isErrorVisible && remainingAttempts > 0 ? (
                        <Alert
                          message={t("CardActions.ResetPincodeScreen.errorPinDoesntMatch_one", {
                            count: remainingAttempts,
                          })}
                          variant="error"
                          testID="CardActions.ResetPinCodeScreen:PincodeDoesNotMatchAlert"
                        />
                      ) : null}
                    </View>
                  </Stack>
                </ContentContainer>
              </ScrollView>
            </KeyboardAvoidingView>
          </Page>

          <NotificationModal
            variant="error"
            title={t("errors.generic.title")}
            message={t("CardActions.ResetPincodeScreen.resetPinFailed")}
            isVisible={isSubmitErrorVisible}
            onClose={handleOnCloseError}
          />
          <NotificationModal
            buttons={{
              primary: (
                <Button
                  onPress={() => handleOnBackPress()}
                  testID="CardActions.ResetPinCodeScreen:ErrorModalBackButton">
                  {t("CardActions.ResetPincodeScreen.errorModalActionButton")}
                </Button>
              ),
            }}
            title={t("CardActions.ResetPincodeScreen.errorModalTitle")}
            message={t("CardActions.ResetPincodeScreen.errorModalMessage")}
            isVisible={isErrorVisible && remainingAttempts === 0}
            variant="error"
            testID="CardActions.ResetPinCodeScreen:ErrorModal"
          />
        </>
      )}
    </>
  );
}
const INPUT_SIZE = 4;
const NUMBER_OF_RETRIES = 3;

const styles = StyleSheet.create({
  progressIndicator: { alignSelf: "center", width: "80%" },
});
