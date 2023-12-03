import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions, View, ViewStyle } from "react-native";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import InfoBox from "@/components/InfoBox";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import PincodeInput from "@/components/PincodeInput";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import westernArabicNumerals from "@/utils/western-arabic-numerals";

import { CardActionsStackParams } from "../CardActionsStack";
import { NI_ROOT_URL } from "../constants";
import { useVerifyPin } from "../hooks/niHooks/use-verify-pin";
import { useGetToken } from "../hooks/query-hooks";
import { NIInputInterface } from "../types";

export default function VerifyPinScreen() {
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.VerifyPinScreen">>();
  const params = route.params;
  const cardId = params.cardId;
  const handleVerification = route.params.onVerificationComplete;

  const { result: verifyPinResult, onVerifyPin, isLoading: verifyPinLoading, error: verifyPinError } = useVerifyPin();
  const { mutateAsync, isLoading: getTokenLoading } = useGetToken();

  const pagerViewRef = useRef<ScrollView>(null);
  const enterPinCodeRef = useRef<React.ElementRef<typeof PincodeInput>>(null);
  // This needs to be in state because route.params may change during the flow.
  const [isSubmitErrorVisible, setIsSubmitErrorVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState("");

  const [remainingAttempts, setRemainingAttempts] = useState(PIN_MAX_TRIES);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  useEffect(() => {
    if (verifyPinResult !== null && verifyPinResult === "OK") {
      handleVerification();
      navigation.goBack();
    }
  }, [verifyPinResult]);

  useEffect(() => {
    if (verifyPinError !== null) {
      setIsErrorVisible(true);
    }
  }, [verifyPinError]);

  const handleOnVerifyPin = async (pin: string) => {
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
        onVerifyPin(pin, niInput);
      }
    } catch (error) {
      setIsSubmitErrorVisible(true);
      warn("CARD-ACTIONS", `Error while getting token: ${JSON.stringify(error)}`);
    }
  };

  const handleOnChangeText = (input: string) => {
    setCurrentValue(input);
    setIsErrorVisible(false);

    if (PIN_INPUT_LENGTH !== input.length) return;
    const convertedInput = westernArabicNumerals(input);

    handleOnVerifyPin(convertedInput);
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
    marginTop: theme.spacing["64p"] + theme.spacing["12p"],
    rowGap: theme.spacing["12p"],
    width: "100%",
  }));

  const keyboardAvoidingContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    marginTop: theme.spacing["32p"],
  }));

  return (
    <>
      {verifyPinLoading || getTokenLoading ? (
        <FullScreenLoader />
      ) : (
        <Page backgroundColor="neutralBase-60">
          <NavHeader onBackPress={handleBack} testID="CardActions.VerifyPinScreen:NavHeader" />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={keyboardAvoidingContainerStyle}>
            <ScrollView ref={pagerViewRef} horizontal scrollEnabled={false}>
              {/* Enter a PIN-code */}
              <ContentContainer style={{ width: dimensions.width }}>
                <Stack direction="vertical" gap="12p">
                  <Typography.Text color="neutralBase+30" size="title1" weight="medium">
                    {params.title}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                    {params.message}
                  </Typography.Text>
                  <InfoBox
                    borderPosition="start"
                    title={t("CardActions.VerifyPinScreen.cardLockInfo")}
                    variant="success"
                  />
                </Stack>
                <View style={inputContainerStyle}>
                  <PincodeInput
                    ref={enterPinCodeRef}
                    autoFocus
                    onChangeText={handleOnChangeText}
                    length={PIN_INPUT_LENGTH}
                    value={currentValue}
                    isError={isErrorVisible}
                    testID="CardActions.VerifyPinScreen:EnterPinCodeInput"
                  />
                  {isErrorVisible ? (
                    <Alert
                      message={t("CardActions.VerifyPinScreen.pinInvalidMessage")}
                      variant="error"
                      testID="CardActions.VerifyPinScreen:PinInvalidAlert"
                    />
                  ) : null}
                </View>
              </ContentContainer>
            </ScrollView>
          </KeyboardAvoidingView>
          <NotificationModal
            buttons={{
              primary: (
                <Button onPress={() => handleBack()} testID="CardActions.VerifyPinScreen:ErrorModalOkButton">
                  {t("CardActions.VerifyPinScreen.errorModal.errorModalActionButton")}
                </Button>
              ),
            }}
            title={t("CardActions.VerifyPinScreen.errorModal.title")}
            message={t("CardActions.VerifyPinScreen.errorModal.content")}
            isVisible={isErrorVisible && remainingAttempts === 0}
            variant="error"
            testID="CardActions.VerifyPinScreen:ErrorModal"
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
