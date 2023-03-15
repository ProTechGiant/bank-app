import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View, ViewStyle } from "react-native";

import { ErrorIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { SINGLE_USE_CARD_TYPE, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import useSubmitOrderCard from "@/hooks/use-submit-order-card";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { OrderCardFormValues } from "@/types/Address";
import { generateRandomId } from "@/utils";

import { CardActionsStackParams } from "../../CardActionsStack";
import { useGetCard, useOtpValidation, useRequestViewPinOtp, useUnfreezeCard } from "../../query-hooks";
import CountdownLink from "./CountdownLink";
import maskPhoneNumber from "./mask-phone-number";
import PinInput from "./PinInput";

export default function OneTimePasswordModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.OneTimePasswordModal">>();

  const requestViewPinOtpAsync = useRequestViewPinOtp();
  const otpValidationAsync = useOtpValidation();
  const submitOrderCard = useSubmitOrderCard();
  const requestGetCardAsync = useGetCard();
  const unfreezeCardAsync = useUnfreezeCard();

  const [countdownRestart, setCountdownRestart] = useState(true);
  // @TODO: use setIsPinFocus to hide keyboard if error returns
  const [isPinFocus, setIsPinFocus] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [otpId, setOtpId] = useState(route.params.otp?.otpId);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [isReachedMaxAttempts, setIsReachedMaxAttempts] = useState(false);
  const [correlationId, setCorrelatedId] = useState(route.params.correlationId);

  const phoneNumber = route.params.otp?.phoneNumber;

  useEffect(() => {
    // TODO: For testers. To be removed
    Alert.alert(`OTP: ${route.params.otp.otpCode}`);
  }, [route.params]);

  const requestViewPinOtp = async () => {
    if (undefined === route.params.cardId) return;
    const newCorrelationId = generateRandomId();

    try {
      const response = await requestViewPinOtpAsync.mutateAsync({
        cardId: route.params.cardId,
        correlationId: newCorrelationId,
      });

      setCorrelatedId(newCorrelationId);
      setOtpId(response.OtpId);
      setCountdownRestart(true);

      // TODO: For testers. To be removed
      Alert.alert(`OTP: ${response.OtpCode}`);
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not request view pin OTP: ", JSON.stringify(error));
    }
  };

  const requestUnfreezeOtp = async () => {
    if (undefined === route.params.cardId) return;
    const newCorrelationId = generateRandomId();

    try {
      const response = await unfreezeCardAsync.mutateAsync({
        cardId: route.params.cardId,
        correlationId: newCorrelationId,
      });

      if (response.OtpCode !== undefined && response.OtpId !== undefined) {
        // TODO: For testers. To be removed
        Alert.alert(`OTP: ${response.OtpCode}`);

        setCorrelatedId(newCorrelationId);
        setOtpId(response.OtpId);
        setCountdownRestart(true);
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not unfreeze card: ", JSON.stringify(error));
    }
  };

  const handleOnClosePress = () => {
    navigation.goBack();
  };

  const handleOnResendPress = async () => {
    // TODO: request new otp for other actions
    if (route.params.action === "view-pin") {
      requestViewPinOtp();
    } else if (route.params.action === "generate-single-use-card") {
      requestCardCreation();
    } else if (route.params.action === "show-details") {
      requestGetCardDetails();
    } else if (route.params.action === "unfreeze") {
      requestUnfreezeOtp();
    }

    setIsError(false);
    setIsInvalidPassword(false);
    setIsReachedMaxAttempts(false);
    setIsPinFocus(true);
  };

  const requestCardCreation = async () => {
    const orderCardRequest: OrderCardFormValues = {
      CardType: Number(SINGLE_USE_CARD_TYPE),
      CardProductId: Number(STANDARD_CARD_PRODUCT_ID),
    };

    try {
      const response = await submitOrderCard.mutateAsync({
        values: orderCardRequest,
        correlationId: generateRandomId(),
      });

      if (!response.OtpId) {
        setShowErrorModal(true);
      }
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not create SUC card: ", JSON.stringify(error));
    }
  };

  const requestGetCardDetails = async () => {
    if (undefined === route.params.cardId) return;

    try {
      const response = await requestGetCardAsync.mutateAsync({
        cardId: route.params.cardId,
        correlationId: generateRandomId(),
      });

      if (response.OtpCode !== undefined && response.OtpId !== undefined) {
        setOtpId(response.OtpId);
        setCountdownRestart(true);
        // TODO: For testers. To be removed
        Alert.alert(`OTP: ${response.OtpCode}`);
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not get card details: ", JSON.stringify(error));
    }
  };

  const handleOnPinBoxesPress = () => {
    setIsPinFocus(true);
    // reset pin boxes styles and remove error message
    setIsError(false);
    setIsInvalidPassword(false);
    setIsReachedMaxAttempts(false);
  };

  const handleOnSubmit = async (input: string) => {
    try {
      const response = await otpValidationAsync.mutateAsync({
        CardId: route.params.cardId,
        OtpCode: input,
        OtpId: otpId,
        correlationId: correlationId,
      });

      if (response.IsOtpValid) {
        if (route.params.action === "generate-single-use-card") {
          // case card creation --> let loading screen handles the response
          navigation.goBack();

          return navigation.navigate("CardActions.LoadingSingleCardScreen", {
            cardCreateResponse: response.CardCreateResponse,
          });
        }

        navigation.navigate(
          route.params.redirect,
          route.params.redirect === "CardActions.HomeScreen"
            ? {
                action: route.params.action,
                pin: response.Pin,
              }
            : {
                action: route.params.action,
                pin: response.Pin,
                cardId: route.params.cardId,
                cardType: route.params.cardType,
                detailedCardResponse: response.DetailedCardResponse,
              }
        );
      } else {
        setIsError(true);
        setIsReachedMaxAttempts(response.NumOfAttempts >= 3);
        setIsInvalidPassword(true);
        setIsPinFocus(false);
      }
    } catch (error) {
      // case card creation --> let loading screen handles the response
      if (route.params.action === "generate-single-use-card") {
        navigation.goBack();

        setTimeout(() => {
          navigation.navigate("CardActions.LoadingSingleCardScreen", {
            cardCreateResponse: undefined,
          });
        }, 500);
      } else {
        setShowErrorModal(true);
      }

      warn("card-actions", "Could not validate OTP: ", JSON.stringify(error));
    }
  };

  const handleOnErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const passwordContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["20p"],
    width: "100%",
  }));

  const errorContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: theme.palette["errorBase-40"],
    borderRadius: theme.radii.small,
    padding: theme.spacing["16p"],
    marginBottom: theme.spacing["12p"],
  }));

  return (
    <>
      <Page insets={["bottom"]} backgroundColor="neutralBase-60">
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={handleOnClosePress} />} />
        <ContentContainer>
          <Stack direction="vertical" gap="16p">
            <Typography.Text size="title1" weight="semiBold">
              {t("CardActions.OneTimePasswordModal.title")}
            </Typography.Text>
            {phoneNumber !== undefined ? (
              <Typography.Text size="callout">
                {t("CardActions.OneTimePasswordModal.message", {
                  hiddenNumber: maskPhoneNumber(phoneNumber),
                  phoneNumber: phoneNumber.slice(-2),
                })}
              </Typography.Text>
            ) : null}
            <View style={passwordContainerStyle}>
              <PinInput
                pinLength={4}
                isError={isError}
                isFocus={isPinFocus}
                onSubmit={handleOnSubmit}
                onPress={handleOnPinBoxesPress}
              />
            </View>

            {isInvalidPassword || isReachedMaxAttempts ? (
              <View style={errorContainerStyle}>
                <ErrorIcon height={20} width={20} />
                <Typography.Text size="footnote" color="errorBase" style={styles.errorMessage}>
                  {isReachedMaxAttempts
                    ? t("CardActions.OneTimePasswordModal.errors.reachedMaxAttempts")
                    : t("CardActions.OneTimePasswordModal.errors.invalidPassword")}
                </Typography.Text>
              </View>
            ) : null}
          </Stack>

          {!isReachedMaxAttempts ? (
            <View style={styles.counterContainer}>
              <CountdownLink
                restart={countdownRestart}
                timeInSecond={120}
                link={t("CardActions.OneTimePasswordModal.resendCode")}
                onPress={handleOnResendPress}
              />
            </View>
          ) : null}
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={showErrorModal}
        onClose={handleOnErrorModalClose}
      />
    </>
  );
}

const styles = StyleSheet.create({
  counterContainer: {
    marginVertical: 12,
  },
  errorMessage: {
    flex: 1,
    marginLeft: 14,
  },
});
