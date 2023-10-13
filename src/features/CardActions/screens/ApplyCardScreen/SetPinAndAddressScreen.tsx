/* eslint-disable react-native/no-inline-styles */
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

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import PincodeInput from "@/components/PincodeInput";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import encryptValue from "@/utils/encrypt-value";
import { isValidPincode } from "@/utils/is-valid-pin";
import westernArabicNumerals from "@/utils/western-arabic-numerals";

import { useApplyCardsContext } from "../../context/ApplyCardsContext";
import CardDeliveryDetails from "./CardDeliveryDetailsScreen";

interface SetPinAndAddressScreenProps {
  isSubmitting: boolean;
  onBack: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  variant: "apply" | "renew";
}

export default function SetPinAndAddressScreen({
  isSubmitting,
  onBack,
  onCancel,
  onSubmit,
  variant,
}: SetPinAndAddressScreenProps) {
  const dimensions = useWindowDimensions();
  const { t } = useTranslation();

  const applyCardsContext = useApplyCardsContext();
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

      pagerViewRef.current?.scrollTo({ x: dimensions.width });
      enterPinCodeRef.current?.blur();
      confirmPinCodeRef.current?.focus();
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
        applyCardsContext.setValue("EncryptedPincode", encryptValue(convertedInput));
        handleOnTransitionStep();
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
      enterPinCodeRef.current?.focus();

      return;
    }

    onBack();
  };

  const inputContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginVertical: theme.spacing["16p"],
    rowGap: theme.spacing["12p"],
    width: "100%",
  }));

  return (
    <>
      <NavHeader
        title={
          variant === "apply"
            ? t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.navTitle")
            : t("CardActions.ApplyCardScreen.CardRenewalScreen.title")
        }
        onBackPress={handleBack}
        end={<NavHeader.CloseEndButton onPress={onCancel} />}
        testID="CardActions.ApplyCardScreen:NavHeader">
        <ProgressIndicator currentStep={mode === "input" ? 1 : mode === "confirm" ? 2 : 3} totalStep={3} />
      </NavHeader>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView ref={pagerViewRef} horizontal scrollEnabled={false}>
          {/* Enter a PIN-code */}
          <ContentContainer style={{ width: dimensions.width }}>
            <Stack align="center" direction="vertical" justify="space-between" flex={1}>
              <Stack align="center" direction="vertical" gap="16p">
                <Typography.Text color="neutralBase+30" size="large" weight="semiBold">
                  {t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.SetPin.title")}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                  {t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.SetPin.instruction", {
                    count: PIN_INPUT_LENGTH,
                  })}
                </Typography.Text>
                <View style={inputContainerStyle}>
                  <PincodeInput
                    ref={enterPinCodeRef}
                    autoFocus
                    onChangeText={handleOnChangeText}
                    length={PIN_INPUT_LENGTH}
                    value={currentValue}
                    testID="CardActions.ApplyCardScreen:EnterPinCodeInput"
                  />
                  {isErrorVisible ? (
                    <Alert
                      message={t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.SetPin.errorPinTooEasy")}
                      variant="error"
                      testID="CardActions.ApplyCardScreen:PinCodeTooEasyAlert"
                    />
                  ) : null}
                </View>
              </Stack>
              <Alert
                variant="default"
                message={t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.SetPin.avoidSimplePin")}
              />
            </Stack>
          </ContentContainer>
          {/* Confirm PIN-code */}
          <ContentContainer style={{ width: dimensions.width }}>
            <Stack align="center" direction="vertical" justify="space-between" flex={1}>
              <Stack align="center" direction="vertical" gap="16p">
                <Typography.Text color="neutralBase+30" size="large" weight="semiBold">
                  {t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.ConfirmPin.title")}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                  {t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.ConfirmPin.instruction", {
                    count: PIN_INPUT_LENGTH,
                  })}
                </Typography.Text>
                <View style={inputContainerStyle}>
                  <PincodeInput
                    ref={confirmPinCodeRef}
                    onChangeText={handleOnChangeText}
                    length={PIN_INPUT_LENGTH}
                    value={currentValue}
                    testID="CardActions.ApplyCardScreen:ConfirmPinCodeInput"
                  />
                  {isErrorVisible && remainingAttempts > 0 ? (
                    <Alert
                      message={t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.ConfirmPin.pinNotMatch", {
                        count: remainingAttempts,
                      })}
                      variant="error"
                      testID="CardActions.ApplyCardScreen:PinCodeDoesNotMatchAlert"
                    />
                  ) : null}
                </View>
              </Stack>
            </Stack>
          </ContentContainer>
          <ContentContainer style={{ width: dimensions.width }}>
            <CardDeliveryDetails isSubmitting={isSubmitting} onCancel={onCancel} onSubmit={onSubmit} />
          </ContentContainer>
        </ScrollView>
      </KeyboardAvoidingView>
      <NotificationModal
        buttons={{
          primary: (
            <Button onPress={() => handleBack()}>
              {t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.errorModalActionButton")}
            </Button>
          ),
        }}
        title={t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.errorModalTitle")}
        message={t("CardActions.ApplyCardScreen.SetPinAndAddressScreen.errorModalMessage")}
        isVisible={isErrorVisible && remainingAttempts === 0}
        variant="error"
      />
    </>
  );
}

const PIN_INPUT_LENGTH = 4;
const PIN_MAX_TRIES = 3;
