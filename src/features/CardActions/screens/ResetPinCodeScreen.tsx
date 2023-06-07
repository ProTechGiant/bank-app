import { RouteProp, useRoute } from "@react-navigation/native";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions, View, ViewStyle } from "react-native";

import { ErrorFilledCircleIcon, InfoFilledIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import InlineBanner from "@/components/InlineBanner";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import PincodeInput from "@/components/PincodeInput";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import encryptValue from "@/utils/encrypt-value";
import { isValidPincode } from "@/utils/is-valid-pin";
import westernArabicNumerals from "@/utils/western-arabic-numerals";

import { useOtpFlow } from "../../OneTimePassword/hooks/query-hooks";
import { useResetPincode } from "../hooks/query-hooks";

export default function ResetPinCodeScreen() {
  const { t } = useTranslation();
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.ResetPincodeScreen">>();
  const cardId = route.params.cardId;

  const resetPincodeAsync = useResetPincode();
  const otpFlow = useOtpFlow();

  const pagerViewRef = useRef<ScrollView>(null);
  const enterPinCodeRef = useRef<React.ElementRef<typeof PincodeInput>>(null);
  const confirmPinCodeRef = useRef<React.ElementRef<typeof PincodeInput>>(null);
  const [currentValue, setCurrentValue] = useState("");
  const [selectedPincode, setSelectedPincode] = useState<string | undefined>();
  const [remainingAttempts, setRemainingAttempts] = useState(NUMBER_OF_RETRIES);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const handleOnBackPress = () => {
    if (selectedPincode === undefined) return navigation.goBack();

    setCurrentValue("");
    setSelectedPincode(undefined);
    setRemainingAttempts(NUMBER_OF_RETRIES);
    setIsErrorVisible(false);

    pagerViewRef.current?.scrollTo({ x: 0 });
    enterPinCodeRef.current?.focus();
  };

  const handleOnTransitionStep = () => {
    setCurrentValue("");
    setIsErrorVisible(false);

    pagerViewRef.current?.scrollTo({ x: dimensions.width });
    confirmPinCodeRef.current?.focus();
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
        handleOnTransitionStep();
        setSelectedPincode(normalizedValue);
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
        to: "CardActions.CardSettingsScreen",
        params: {
          cardId,
        },
      },
      otpOptionalParams: {
        CardId: cardId,
        Pin: encryptValue(selectedPincode),
      },
      otpVerifyMethod: "card-actions",
      onOtpRequest: () => {
        return resetPincodeAsync.mutateAsync({ cardId });
      },
    });
  };

  const inputContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    paddingVertical: theme.spacing["16p"],
    rowGap: theme.spacing["10p"],
    width: "100%",
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader onBackPress={handleOnBackPress} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView ref={pagerViewRef} horizontal scrollEnabled={false} showsHorizontalScrollIndicator={false}>
            {/* Enter a new PIN-code */}
            <ContentContainer style={{ width: dimensions.width }}>
              <Stack align="center" direction="vertical" justify="space-between" flex={1}>
                <Stack align="center" direction="vertical" gap="16p">
                  <Typography.Text color="neutralBase+30" size="large" weight="semiBold">
                    {t("CardActions.ResetPincodeScreen.setPin")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                    {t("CardActions.ResetPincodeScreen.enterNumbers", { count: INPUT_SIZE })}
                  </Typography.Text>
                  <View style={inputContainerStyle}>
                    <PincodeInput
                      ref={enterPinCodeRef}
                      autoFocus
                      onChangeText={handleOnChangeText}
                      length={INPUT_SIZE}
                      value={currentValue}
                    />
                    {isErrorVisible ? (
                      <InlineBanner
                        icon={<ErrorFilledCircleIcon />}
                        text={t("CardActions.ResetPincodeScreen.errorPincodeTooEasy")}
                        variant="error"
                      />
                    ) : null}
                  </View>
                </Stack>
                <InlineBanner icon={<InfoFilledIcon />} text={t("CardActions.ResetPincodeScreen.avoidTooEasyPin")} />
              </Stack>
            </ContentContainer>

            {/* Confirm new PIN-code */}
            <ContentContainer style={{ width: dimensions.width }}>
              <Stack align="center" direction="vertical" gap="16p">
                <Typography.Text color="neutralBase+30" size="large" weight="semiBold">
                  {t("CardActions.ResetPincodeScreen.confirmPin")}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                  {t("CardActions.ResetPincodeScreen.reEnterPincode", { count: INPUT_SIZE })}
                </Typography.Text>
                <View style={inputContainerStyle}>
                  <PincodeInput
                    ref={confirmPinCodeRef}
                    onChangeText={handleOnChangeText}
                    length={INPUT_SIZE}
                    value={currentValue}
                  />
                  {isErrorVisible && remainingAttempts > 0 ? (
                    <InlineBanner
                      icon={<ErrorFilledCircleIcon />}
                      text={t("CardActions.ResetPincodeScreen.errorPinDoesntMatch", { count: remainingAttempts })}
                      variant="error"
                    />
                  ) : null}
                </View>
              </Stack>
            </ContentContainer>
          </ScrollView>
        </KeyboardAvoidingView>
      </Page>
      <NotificationModal
        buttons={{
          primary: (
            <Button onPress={() => handleOnBackPress()}>
              {t("CardActions.ResetPincodeScreen.errorModalActionButton")}
            </Button>
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

const INPUT_SIZE = 4;
const NUMBER_OF_RETRIES = 3;
