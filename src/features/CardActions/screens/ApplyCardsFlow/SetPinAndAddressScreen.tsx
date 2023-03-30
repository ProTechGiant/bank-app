import { RouteProp, useRoute } from "@react-navigation/native";
import * as React from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import { ErrorFilledCircleIcon, InfoIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import InlineBanner from "@/components/InlineBanner";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import PincodeInput from "@/components/PincodeInput";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import encryptPincode from "@/utils/encrypt-pincode";
import isValidPincode from "@/utils/is-valid-pincode";
import westernArabicNumerals from "@/utils/western-arabic-numerals";

import { CardActionsStackParams } from "../../CardActionsStack";
import { useOrderCardContext } from "../../context/OrderCardContext";
import CardDeliveryDetails from "./CardDeliveryDetails";

export default function SetPinAndAddressScreen() {
  const dimensions = useWindowDimensions();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.PickCardType">>();

  const { orderCardValues, setOrderCardValues } = useOrderCardContext();
  const navigation = useNavigation();

  const pagerViewRef = useRef<ScrollView>(null);
  const enterPinCodeRef = useRef<React.ElementRef<typeof PincodeInput>>(null);
  const confirmPinCodeRef = useRef<React.ElementRef<typeof PincodeInput>>(null);

  const [mode, setMode] = useState<"input" | "confirm" | "address">("input");
  const [currentValue, setCurrentValue] = useState("");
  const [selectedPincode, setSelectedPincode] = useState<string | undefined>();

  const [remainingAttempts, setRemainingAttempts] = useState(PIN_MAX_TRIES);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const handleOnTransitionStep = () => {
    setCurrentValue("");
    setIsErrorVisible(false);

    if (mode === "input") {
      setMode("confirm");
      pagerViewRef.current?.scrollTo({ x: dimensions.width * 1 });
      setTimeout(() => confirmPinCodeRef.current?.focus(), TEXTINPUT_FOCUS_WAIT_MS);
    }

    if (mode === "confirm") {
      setMode("address");
      pagerViewRef.current?.scrollTo({ x: dimensions.width * 2 });
      Keyboard.dismiss();
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
        setTimeout(handleOnTransitionStep, TRANSITION_STEP_MS);
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
        setOrderCardValues({
          ...orderCardValues,
          formValues: {
            ...orderCardValues.formValues,
            Pin: encryptPincode(convertedInput),
          },
        });

        setTimeout(handleOnTransitionStep, TRANSITION_STEP_MS);
      }
    }
  };

  const handleBack = () => {
    // allow user to re-enter pincode
    if (mode === "address" || mode === "confirm") {
      setMode("input");
      setIsErrorVisible(false);
      setRemainingAttempts(PIN_MAX_TRIES);
      setCurrentValue("");
      setSelectedPincode(undefined);

      pagerViewRef.current?.scrollTo({ x: 0 });
      setTimeout(() => enterPinCodeRef.current?.focus(), TEXTINPUT_FOCUS_WAIT_MS);
      return;
    }

    navigation.goBack();
  };

  const handleOnCancel = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  const inputContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginVertical: theme.spacing["16p"],
    rowGap: theme.spacing["10p"],
    width: "100%",
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={
            route.params?.cardId ? t("CardActions.CardRenewal.title") : t("ApplyCards.SetPinAndAddressScreen.navTitle")
          }
          onBackPress={handleBack}
          end="close">
          <ProgressIndicator currentStep={mode === "input" ? 1 : mode === "confirm" ? 2 : 3} totalStep={3} />
        </NavHeader>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView ref={pagerViewRef} horizontal scrollEnabled={false}>
            {/* Enter a PIN-code */}
            <ContentContainer style={{ width: dimensions.width }}>
              <Stack align="center" direction="vertical" justify="space-between" flex={1}>
                <Stack align="center" direction="vertical" gap="16p">
                  <Typography.Text color="neutralBase+30" size="large" weight="semiBold">
                    {t("ApplyCards.SetPinAndAddressScreen.SetPin.title")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                    {t("ApplyCards.SetPinAndAddressScreen.SetPin.instruction", { count: PIN_INPUT_LENGTH })}
                  </Typography.Text>
                  <View style={inputContainerStyle}>
                    <PincodeInput
                      ref={enterPinCodeRef}
                      autoFocus
                      onChangeText={handleOnChangeText}
                      length={PIN_INPUT_LENGTH}
                      value={currentValue}
                    />
                    {isErrorVisible ? (
                      <InlineBanner
                        icon={<ErrorFilledCircleIcon />}
                        text={t("ApplyCards.SetPinAndAddressScreen.SetPin.errorPinTooEasy")}
                        variant="error"
                      />
                    ) : null}
                  </View>
                </Stack>
                <InlineBanner icon={<InfoIcon />} text={t("ApplyCards.SetPinAndAddressScreen.SetPin.avoidSimplePin")} />
              </Stack>
            </ContentContainer>
            {/* Confirm PIN-code */}
            <ContentContainer style={{ width: dimensions.width }}>
              <Stack align="center" direction="vertical" justify="space-between" flex={1}>
                <Stack align="center" direction="vertical" gap="16p">
                  <Typography.Text color="neutralBase+30" size="large" weight="semiBold">
                    {t("ApplyCards.SetPinAndAddressScreen.ConfirmPin.title")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                    {t("ApplyCards.SetPinAndAddressScreen.ConfirmPin.instruction", { count: PIN_INPUT_LENGTH })}
                  </Typography.Text>
                  <View style={inputContainerStyle}>
                    <PincodeInput
                      ref={confirmPinCodeRef}
                      onChangeText={handleOnChangeText}
                      length={PIN_INPUT_LENGTH}
                      value={currentValue}
                    />
                    {isErrorVisible && remainingAttempts > 0 ? (
                      <InlineBanner
                        icon={<ErrorFilledCircleIcon />}
                        text={t("ApplyCards.SetPinAndAddressScreen.ConfirmPin.pinNotMatch", {
                          count: remainingAttempts,
                        })}
                        variant="error"
                      />
                    ) : null}
                  </View>
                </Stack>
              </Stack>
            </ContentContainer>
            <View style={{ width: dimensions.width }}>
              <CardDeliveryDetails onCancel={handleOnCancel} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Page>
      <NotificationModal
        buttons={{
          primary: (
            <Button onPress={() => handleBack()}>{t("CardActions.ResetPincodeScreen.errorModalActionButton")}</Button>
          ),
        }}
        title={t("CardActions.ResetPincodeScreen.errorModalTitle")}
        message={t("CardActions.ResetPincodeScreen.errorModalMessage")}
        isVisible={isErrorVisible && remainingAttempts === 0}
        variant="error"
      />
    </>
  );
}

const TRANSITION_STEP_MS = 250;
const TEXTINPUT_FOCUS_WAIT_MS = 500;
const PIN_INPUT_LENGTH = 4;
const PIN_MAX_TRIES = 3;
