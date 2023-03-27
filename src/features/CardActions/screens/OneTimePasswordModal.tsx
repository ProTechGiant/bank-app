import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorFilledCircleIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import InlineBanner from "@/components/InlineBanner";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import PincodeInput from "@/components/PincodeInput";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import maskPhoneNumber from "@/utils/mask-phone-number";

import { Countdown } from "../components";
import { useOtpValidation } from "../hooks/query-hooks";

export default function OneTimePasswordModal<ParamsT extends object, OutputT extends object>() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<MainStackParams, "CardActions.OneTimePasswordModal">>();

  const otpValidationAsync = useOtpValidation<ParamsT, OutputT>();
  const [otpParams, setOtpParams] = useState<(typeof params)["otpChallengeParams"]>(params.otpChallengeParams);
  const otpResetCountSecondsIntervalRef = useRef<NodeJS.Timer | undefined>(undefined);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isOtpCodeInvalidErrorVisible, setIsOtpCodeInvalidErrorVisible] = useState(false);
  const [otpAttemptsRemaining, setOtpAttemptsRemaining] = useState(OTP_MAX_ATTEMPTS);
  const [otpResetCountSeconds, setOtpResetCountSeconds] = useState(0);
  const [otpResendsRequested, setOtpResendsRequested] = useState(0);
  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => setOtpResetCountSeconds(s => Math.min(s + 1, OTP_RESET_TIMEOUT_S)), 1000);
    otpResetCountSecondsIntervalRef.current = intervalId;

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    Alert.alert(`OTP-code is: ${otpParams.OtpCode}`);
  }, [otpParams]);

  const handleOnCancel = () => {
    // @ts-expect-error unable to properly add types for this call
    navigation.navigate(params.action.to, {
      ...params.action.params,
      otpResponseStatus: "cancel",
    });
  };

  const handleOnRequestResendPress = async () => {
    if (otpResetCountSeconds < OTP_RESET_TIMEOUT_S) return;
    if (otpResendsRequested >= OTP_MAX_RESENDS) return;

    try {
      const response = await params.onOtpRequestResend();

      setOtpParams(response);
      setIsErrorVisible(false);
      setIsOtpCodeInvalidErrorVisible(false);
      setOtpAttemptsRemaining(OTP_MAX_ATTEMPTS);
      setOtpResetCountSeconds(0);
      setCurrentValue("");
    } catch (error) {
      warn("card-actions", "Could not re-request OTP-code: ", JSON.stringify(error));
      setIsErrorVisible(true);
    } finally {
      setOtpResendsRequested(current => current + 1);
    }
  };

  const handleOnRequestResendErrorClose = () => {
    setIsErrorVisible(false);
    setTimeout(() => {
      navigation.navigate(params.action.to, {
        ...params.action.params,
        otpResponseStatus: "fail",
      });
    }, 500);
  };

  const handleOnChangeText = (value: string) => {
    if (otpAttemptsRemaining < 1) return;

    setCurrentValue(value);
    setIsOtpCodeInvalidErrorVisible(false);

    if (value.length === OTP_CODE_LENGTH) {
      handleOnSubmit(value);
    }
  };

  const handleOnSubmit = async (otpCode: string) => {
    try {
      const { IsOtpValid, NumOfAttempts, ...restProps } = await otpValidationAsync.mutateAsync({
        OtpId: otpParams.OtpId,
        OtpCode: otpCode,
        correlationId: otpParams.correlationId,
        optionalParams: params.otpOptionalParams as ParamsT,
      });

      if (!IsOtpValid) {
        setOtpAttemptsRemaining(OTP_MAX_ATTEMPTS - NumOfAttempts);
        setIsOtpCodeInvalidErrorVisible(true);
        setCurrentValue("");

        return;
      }

      // @ts-expect-error unable to properly add types for this call
      navigation.navigate(params.action.to, {
        ...params.action.params,
        otpResponseStatus: "success",
        otpResponsePayload: restProps,
      });
    } catch (error) {
      navigation.navigate(params.action.to, {
        ...params.action.params,
        otpResponseStatus: "fail",
      });
      warn("card-actions", "Could not validate OTP-code with backend: ", JSON.stringify(error));
    }
  };

  const otpContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    rowGap: theme.spacing["16p"],
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["20p"],
    width: "100%",
  }));

  const phoneNumber = `${maskPhoneNumber(otpParams.PhoneNumber)} ${otpParams.PhoneNumber.slice(-2)}`;
  const isReachedMaxAttempts = otpAttemptsRemaining === 0;

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={handleOnCancel} />} />
        <ContentContainer>
          <Stack direction="vertical" gap="16p">
            <Typography.Text size="title1" weight="semiBold">
              {t("CardActions.OneTimePasswordModal.title")}
            </Typography.Text>
            <Typography.Text size="callout">
              {t("CardActions.OneTimePasswordModal.message", { phoneNumber })}
            </Typography.Text>
            <View style={otpContainerStyle}>
              <PincodeInput
                autoComplete="one-time-code"
                autoFocus
                isEditable={!isReachedMaxAttempts}
                isError={isReachedMaxAttempts}
                onChangeText={handleOnChangeText}
                length={OTP_CODE_LENGTH}
                value={currentValue}
              />
              {isOtpCodeInvalidErrorVisible ? (
                <InlineBanner
                  variant="error"
                  icon={<ErrorFilledCircleIcon />}
                  text={
                    isReachedMaxAttempts
                      ? t("CardActions.OneTimePasswordModal.errors.reachedMaxAttempts")
                      : t("CardActions.OneTimePasswordModal.errors.invalidPassword")
                  }
                />
              ) : null}
              {!isReachedMaxAttempts && otpResendsRequested < OTP_MAX_RESENDS ? (
                <Countdown
                  onPress={handleOnRequestResendPress}
                  startInSeconds={OTP_RESET_TIMEOUT_S}
                  text={t("CardActions.OneTimePasswordModal.resendCode")}
                  value={otpResetCountSeconds}
                />
              ) : null}
            </View>
          </Stack>
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorVisible}
        onClose={handleOnRequestResendErrorClose}
      />
    </SafeAreaProvider>
  );
}

const OTP_CODE_LENGTH = 4;
const OTP_RESET_TIMEOUT_S = 120;
const OTP_MAX_ATTEMPTS = 3;
const OTP_MAX_RESENDS = 3;
