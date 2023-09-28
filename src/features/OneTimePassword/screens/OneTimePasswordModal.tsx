import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Keyboard, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import PincodeInput from "@/components/PincodeInput";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";
import maskPhoneNumber from "@/utils/mask-phone-number";

import { useOtpValidation } from "../hooks/query-hooks";
import { OtpChallengeParams } from "../types";

export default function OneTimePasswordModal<ParamsT extends object, OutputT extends object>() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<AuthenticatedStackParams, "OneTimePassword.OneTimePasswordModal">>();
  const otpValidationAsync = useOtpValidation<ParamsT, OutputT>(params.otpVerifyMethod);
  const { phoneNumber } = useAuthContext();

  const [otpParams, setOtpParams] = useState<OtpChallengeParams | undefined>(params.otpChallengeParams);
  const [isGenericErrorVisible, setIsGenericErrorVisible] = useState(false);
  const [isOtpCodeInvalidErrorVisible, setIsOtpCodeInvalidErrorVisible] = useState(false);
  const [otpResetCountSeconds, setOtpResetCountSeconds] = useState(OTP_RESET_COUNT_SECONDS);
  const [otpResendsRequested, setOtpResendsRequested] = useState(0);
  const [isBalanceErrorVisible, setIsBalanceErrorVisible] = useState(false);
  const [genericErrorMessage, setGenericErrorMessage] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const isOtpExpired = otpResetCountSeconds <= 0;
  const isReachedMaxAttempts = otpResendsRequested === OTP_MAX_RESENDS && isOtpExpired;
  const resolvedPhoneNumber = phoneNumber ?? otpParams?.PhoneNumber;

  const isLoginFlow =
    params?.otpVerifyMethod === "login" ||
    params?.otpVerifyMethod === "reset-passcode" ||
    params?.otpVerifyMethod === "change-passcode" ||
    params?.otpVerifyMethod === "create-passcode" ||
    params?.otpVerifyMethod === "register-email" ||
    params?.otpVerifyMethod === "link-proxy-alias" ||
    params?.otpVerifyMethod === "optout-proxy-alias";

  const isUpdateCustomerProfileFlow = params?.otpVerifyMethod === "customers/communication-details";
  const isGoalGetterFlow = params?.otpVerifyMethod === "goals/submit";

  // these were added to fix PC-11791 error issues.
  const [numberOfAttemptsForOTP, setNumberOfAttemptsForOTP] = useState(0);
  const isOTPVerifyMaxAttemptsReached = numberOfAttemptsForOTP > OTP_MAX_ATTEMPTS;

  useEffect(() => {
    if (otpResetCountSeconds <= 0) return;

    const timeoutId = setTimeout(() => {
      if (otpResetCountSeconds > 0) {
        setOtpResetCountSeconds(current => current - 1);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [otpResetCountSeconds]);

  // TODO: Remove on screen alert once the OTP service is ready (can be sent to the registered mobile phone)
  useEffect(() => {
    async function main() {
      try {
        const response = await params.onOtpRequest();
        // adding this to have initial object and new response.
        setOtpParams({ ...response, ...otpParams });
      } catch (error) {
        const errorCode = JSON.parse(JSON.stringify(error)).errorContent;

        if (errorCode.Errors[0].ErrorId === "0083") {
          setIsBalanceErrorVisible(true);
        } else if (errorCode.Errors[0].ErrorId === "0306") {
          setGenericErrorMessage("SadadBillPayments.EnterAccountNoScreen.genericError.globalLimitMessage");
          setIsGenericErrorVisible(true);
        } else {
          setGenericErrorMessage("errors.generic.message");
          setIsGenericErrorVisible(true);
        }

        warn("one-time-password", "Could not request OTP parameters: ", JSON.stringify(error));
      }
    }

    main();
  }, [params]);

  useEffect(() => {
    if (isGenericErrorVisible || isReachedMaxAttempts) Keyboard.dismiss();
  }, [isGenericErrorVisible, isReachedMaxAttempts]);

  const handleOnCancel = (errorId?: string) => {
    // @ts-expect-error unable to properly add types for this call
    navigation.navigate(params.action.to, {
      ...params.action.params,
      otpResponseStatus: "cancel",
      otpResponseErrorId: errorId,
    });
  };

  const handleOnRequestResendPress = async () => {
    if (otpResendsRequested >= OTP_MAX_RESENDS) {
      return;
    }

    try {
      const response = await params.onOtpRequest();
      // to handle cases of PC-11791
      setNumberOfAttemptsForOTP(0);

      setOtpParams({ ...response, ...otpParams });
      setIsGenericErrorVisible(false);
      setIsOtpCodeInvalidErrorVisible(false);
      setOtpResetCountSeconds(OTP_RESET_COUNT_SECONDS);
      setCurrentValue("");
    } catch (error) {
      warn("one-time-password", "Could not re-request OTP-code: ", JSON.stringify(error));
      setIsGenericErrorVisible(true);
    } finally {
      setOtpResendsRequested(current => current + 1);
    }
  };

  const handleOnRequestBlockUserErrorClose = () => {
    // on (login flow | updating customer Profile mobile number | Goal Getter Flow) we blocked the user otherwise we navigate the user with fail status and then navigate back to first stack.
    if (isReachedMaxAttempts && (isLoginFlow || isUpdateCustomerProfileFlow || isGoalGetterFlow)) {
      params.onUserBlocked?.();
    } else {
      // @ts-expect-error unable to properly add types for this call
      navigation.navigate(params.action.to, {
        ...params.action.params,
        otpResponseStatus: "fail",
      });
    }
  };

  const handleOnRequestResendErrorClose = () => {
    setIsGenericErrorVisible(false);
    delayTransition(() => {
      // @ts-expect-error cannot type navigate call
      navigation.navigate(params.action.to, {
        ...params.action.params,
        otpResponseStatus: "fail",
      });
    });
  };

  const handleOnAddTopup = () => {
    //TODO - Implementation is not in scope for BC8, will be implemented in upcoming BC
  };

  const handleOnChangeText = (value: string) => {
    // isOTPVerifyMaxAttemptsReached added to disable keyboard when max attempts reached till user tap resend code. PC-11791
    if (isReachedMaxAttempts || isOTPVerifyMaxAttemptsReached) return;

    setCurrentValue(value);
    setIsOtpCodeInvalidErrorVisible(false);

    if (value.length === OTP_CODE_LENGTH) {
      handleOnSubmit(value);
    }
  };

  const handleOnSubmit = async (otpCode: string) => {
    if (otpParams === undefined) {
      return;
    }

    try {
      const { Status, IsOtpValid, data, NumOfAttempts, ...restProps } = await otpValidationAsync.mutateAsync({
        OtpId: otpParams.OtpId,
        OtpCode: otpCode,
        optionalParams: params.otpOptionalParams as ParamsT,
      });

      if (Status === "OTP_MATCH_SUCCESS" || IsOtpValid || data?.IsOtpValid) {
        // @ts-expect-error unable to properly add types for this call
        navigation.navigate(params.action.to, {
          ...params.action.params,
          otpResponseStatus: "success",
          otpResponsePayload: restProps,
        });
      } else {
        setIsOtpCodeInvalidErrorVisible(true);
        setCurrentValue("");
        // to handle cases of PC-11791
        setNumberOfAttemptsForOTP(NumOfAttempts);

        return;
      }
    } catch (error) {
      if (error.errorContent?.Errors[0]?.ErrorId === "0125") {
        handleOnCancel("0125");
      } else {
        setIsOtpCodeInvalidErrorVisible(true);
        setCurrentValue("");
        warn("one-time-password", "Could not validate OTP-code with backend: ", JSON.stringify(error));
      }
    }
  };

  const otpContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    rowGap: theme.spacing["16p"],
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["20p"],
    width: "100%",
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={handleOnCancel} />} />
        {undefined !== otpParams ? (
          <ContentContainer>
            <Stack direction="vertical" gap="16p">
              <Typography.Text size="title1" weight="semiBold">
                {t("OneTimePasswordModal.title")}
              </Typography.Text>
              {otpParams.Email ? (
                <Typography.Text size="callout">
                  {t("OneTimePasswordModal.emailMessage", {
                    email: otpParams.Email,
                  })}
                </Typography.Text>
              ) : (
                <Typography.Text size="callout">
                  {t("OneTimePasswordModal.phoneNumberMessage", {
                    phoneNumber: resolvedPhoneNumber ? maskPhoneNumber(resolvedPhoneNumber, 4) : null,
                  })}
                </Typography.Text>
              )}

              <View style={otpContainerStyle}>
                <PincodeInput
                  autoComplete="one-time-code"
                  autoFocus
                  isEditable={!isReachedMaxAttempts}
                  isError={isReachedMaxAttempts || isOtpCodeInvalidErrorVisible}
                  onChangeText={handleOnChangeText}
                  length={OTP_CODE_LENGTH}
                  value={currentValue}
                />
                {isOtpCodeInvalidErrorVisible ? (
                  <>
                    {/* to handle cases of PC-11791 regarding error */}
                    {isOTPVerifyMaxAttemptsReached ? (
                      <Alert
                        variant="error"
                        message={t("OneTimePasswordModal.errors.maxAttemptsInvalidPasswordReached")}
                      />
                    ) : (
                      <Alert variant="error" message={t("OneTimePasswordModal.errors.invalidPassword")} />
                    )}
                  </>
                ) : null}
                {isOtpExpired ? (
                  <>
                    {otpResendsRequested === 0 ? (
                      <Alert variant="error" message={t("OneTimePasswordModal.errors.twoAttemptsLeft")} />
                    ) : otpResendsRequested === 1 ? (
                      <Alert variant="error" message={t("OneTimePasswordModal.errors.oneAttemptLeft")} />
                    ) : null}
                  </>
                ) : null}
                {otpResendsRequested <= OTP_MAX_RESENDS ? (
                  <Typography.Text
                    size="callout"
                    color={isOtpExpired ? "primaryBase" : "neutralBase"}
                    onPress={() => handleOnRequestResendPress()}
                    disabled={!isOtpExpired}>
                    {isOtpExpired
                      ? t("OneTimePasswordModal.resendCodeEnabled")
                      : t("OneTimePasswordModal.resendCodeDisabled", {
                          minutes: Math.floor(otpResetCountSeconds / 60),
                          seconds: String(otpResetCountSeconds % 60).padStart(2, "0"),
                        })}
                  </Typography.Text>
                ) : null}
              </View>
            </Stack>
          </ContentContainer>
        ) : (
          <View style={styles.indicatorContainerStyle}>
            <ActivityIndicator />
          </View>
        )}
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t(genericErrorMessage)}
        isVisible={isGenericErrorVisible}
        onClose={handleOnRequestResendErrorClose}
      />
      <NotificationModal
        variant="error"
        title={t("OneTimePasswordModal.errors.noAttemptsLeftTitle")}
        message={t("OneTimePasswordModal.errors.noAttemptsLeftMessage")}
        isVisible={isReachedMaxAttempts}
        buttons={{
          primary: (
            <Button onPress={handleOnRequestBlockUserErrorClose}>{t("OneTimePasswordModal.errors.button")}</Button>
          ),
        }}
      />
      <NotificationModal
        variant="error"
        title={t("SadadBillPayments.EnterAccountNoScreen.insufficientBalanceError.title")}
        message={t("SadadBillPayments.EnterAccountNoScreen.insufficientBalanceError.message")}
        isVisible={isBalanceErrorVisible}
        buttons={{
          primary: (
            <Button onPress={handleOnAddTopup}>
              {t("SadadBillPayments.EnterAccountNoScreen.insufficientBalanceError.primaryButtonText")}
            </Button>
          ),
          secondary: (
            <Button onPress={handleOnRequestBlockUserErrorClose}>
              {t("SadadBillPayments.EnterAccountNoScreen.insufficientBalanceError.secondaryButtonText")}
            </Button>
          ),
        }}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  indicatorContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
});

const OTP_CODE_LENGTH = 4;
const OTP_MAX_RESENDS = 2;
const OTP_MAX_ATTEMPTS = 2;
const OTP_RESET_COUNT_SECONDS = 120;
