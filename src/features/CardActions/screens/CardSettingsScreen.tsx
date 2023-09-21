import { RouteProp, useRoute } from "@react-navigation/native";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View, ViewStyle } from "react-native";

import {
  CardIcon,
  GlobeIcon,
  LockIcon,
  OnlineTransactionLimitIcon,
  PointOfSaleIcon,
  SwipeIcon,
  WifiIcon,
} from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useToasts } from "@/contexts/ToastsContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import { ListItemLink, ListSection, SettingsToggle } from "../components";
import { useCard, useCardSettings, useChangeCardStatus, useUpdateCardSettings } from "../hooks/query-hooks";
import { CardSettingsInput } from "../types";

export default function CardSettingsScreen() {
  const route = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.CardSettingsScreen">>();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const otpFlow = useOtpFlow<AuthenticatedStackParams>();
  const updateCardSettingsAsync = useUpdateCardSettings();
  const changeCardStatus = useChangeCardStatus();
  const settings = useCardSettings(route.params.cardId);
  const card = useCard(route.params.cardId);

  const addToast = useToasts();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [showCancelCardSuccessAlert, setShowCancelCardSuccessAlert] = useState(false);
  const isUpdatingRef = useRef(false);

  otpFlow.useOtpResponseEffect<{ ResetPinMessage: string }>((status, payload) => {
    if (status === "success" && "ResetPinMessage" in payload) {
      addToast({ variant: "confirm", message: t("CardActions.CardSettingsScreen.toast") });
    } else if (status === "fail") {
      delayTransition(() => setIsErrorModalVisible(true));
    } else if (status === "success") {
      delayTransition(() => setShowCancelCardSuccessAlert(true));
    }
  });

  const handleOnChangePinCodePress = () => {
    navigation.navigate("CardActions.ResetPincodeScreen", {
      cardId: route.params.cardId,
    });
  };

  const handleOnPOSTransactionLimitPress = () => {
    navigation.navigate("CardActions.POSLimitScreen", {
      cardId: route.params.cardId,
    });
  };

  const handleOnOnlineTransactionlimitPress = () => {
    // TODO: to handle online transaction limit press...
  };

  const handleOnConfirmPress = async () => {
    setIsConfirmationModalVisible(false);
    try {
      const response = await changeCardStatus.mutateAsync({
        cardId: route.params.cardId,
        status: "CANCELLED",
      });

      if (response.IsOtpRequired) {
        otpFlow.handle({
          action: {
            to: "CardActions.CardSettingsScreen",
            params: {
              cardId: route.params.cardId,
            },
          },
          otpOptionalParams: {
            CardId: route.params.cardId,
          },
          otpChallengeParams: {
            OtpId: response.OtpId,
            PhoneNumber: response.PhoneNumber,
          },
          otpVerifyMethod: "card-actions",
          onOtpRequest: async () => {
            const resendResponse = await changeCardStatus.mutateAsync({
              cardId: route.params.cardId,
              status: "CANCELLED",
            });

            return resendResponse;
          },
          onFinish: status => {
            if (status === "cancel") {
              return;
            }
            if (status === "fail") {
              settings.refetch();
            }
          },
        });
      }
    } catch (error) {
      setIsErrorModalVisible(true);
    }
  };

  const handleOnCancelCardPress = () => {
    setIsConfirmationModalVisible(true);
  };

  const handleSuccessOkPress = () => {
    navigation.navigate("CardActions.CardActionsStack", {
      screen: "CardActions.HomeScreen",
    });
  };

  const handleOnChangeSettings = async (setting: keyof CardSettingsInput) => {
    if (settings.data === undefined || isUpdatingRef.current) return;
    isUpdatingRef.current = true; // to prevent tapping multiple toggles too soon

    try {
      const updatedSettings = {
        ...settings.data,
        [setting]: !settings.data[setting],
      };

      const response = await updateCardSettingsAsync.mutateAsync({
        cardId: route.params.cardId,
        settings: updatedSettings,
      });

      if (response.IsOtpRequired) {
        otpFlow.handle({
          action: {
            to: "CardActions.CardSettingsScreen",
            params: {
              cardId: route.params.cardId,
            },
          },
          otpOptionalParams: {
            CardId: route.params.cardId,
          },
          otpChallengeParams: {
            OtpCode: response.OtpCode,
            OtpId: response.OtpId,
            PhoneNumber: response.PhoneNumber,
          },
          otpVerifyMethod: "card-actions",
          onOtpRequest: async () => {
            const response_ = await updateCardSettingsAsync.mutateAsync({
              cardId: route.params.cardId,
              settings: updatedSettings,
            });

            if (!response_.IsOtpRequired) {
              throw new Error("OTP challenge no longer required for changing settings after re-requesting");
            }

            return response_;
          },
          onFinish: status => {
            if (status === "fail") {
              settings.refetch();
            }
          },
        });
      }
    } catch (error) {
      setIsErrorModalVisible(true);
      warn("card-settings", "Could not update card settings: ", JSON.stringify(error));
    } finally {
      isUpdatingRef.current = false;
    }
  };

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-40"],
    marginHorizontal: -theme.spacing["20p"],
    marginVertical: theme.spacing["20p"],
  }));

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const cardInTransitBannerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.small,
    padding: theme.spacing["20p"],
    marginBottom: theme.spacing["16p"],
  }));

  const cancelCardButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["48p"],
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader />
        <ContentContainer isScrollView>
          <Typography.Header color="neutralBase+30" size="medium" weight="regular" style={titleStyle}>
            {t("CardActions.CardSettingsScreen.title")}
          </Typography.Header>
          {settings.data !== undefined && card.data !== undefined ? (
            <View>
              <ListSection title={t("CardActions.CardSettingsScreen.subTitle1")}>
                <ListItemLink
                  icon={<LockIcon />}
                  title={t("CardActions.CardSettingsScreen.changePin")}
                  onPress={handleOnChangePinCodePress}
                  disabled={card.data.Status !== "UNLOCK"}
                />
                <SettingsToggle
                  icon={<PointOfSaleIcon />}
                  label={t("CardActions.CardSettingsScreen.posTransactions.label")}
                  helperText={t("CardActions.CardSettingsScreen.posTransactions.helperText")}
                  onPress={() => handleOnChangeSettings("POSTransaction")}
                  value={settings.data.POSTransaction ?? true}
                  disabled={!["unfreeze", "pending-activation"].includes(card.data.Status)}
                />
                <SettingsToggle
                  icon={<CardIcon />}
                  label={t("CardActions.CardSettingsScreen.onlinePayment.label")}
                  helperText={t("CardActions.CardSettingsScreen.onlinePayment.helperText")}
                  onPress={() => handleOnChangeSettings("OnlinePayments")}
                  value={settings.data.OnlinePayments ?? true}
                  disabled={!["unfreeze", "pending-activation"].includes(card.data.Status)}
                />
                <SettingsToggle
                  icon={<GlobeIcon />}
                  label={t("CardActions.CardSettingsScreen.internationalPayment.label")}
                  helperText={t("CardActions.CardSettingsScreen.internationalPayment.helperText")}
                  onPress={() => handleOnChangeSettings("InternationalPayments")}
                  value={settings.data.InternationalPayments ?? false}
                  disabled={card.data.Status !== "UNLOCK"}
                />

                <SettingsToggle
                  icon={<SwipeIcon />}
                  disabled={card.data.Status !== "UNLOCK"}
                  label={t("CardActions.CardSettingsScreen.swipePayments.label")}
                  helperText={t("CardActions.CardSettingsScreen.swipePayments.helperText")}
                  onPress={() => handleOnChangeSettings("SwipePayments")}
                  value={card.data.Status === "PENDING-ACTIVATION" ? false : settings.data.SwipePayments ?? false}
                />
                <SettingsToggle
                  icon={<WifiIcon />}
                  disabled={card.data.Status !== "UNLOCK"}
                  label={t("CardActions.CardSettingsScreen.contactlessPayments.label")}
                  helperText={t("CardActions.CardSettingsScreen.contactlessPayments.helperText")}
                  onPress={() => handleOnChangeSettings("ContactlessPayments")}
                  value={card.data.Status === "PENDING-ACTIVATION" ? false : settings.data.ContactlessPayments ?? false}
                />
              </ListSection>
              <View style={separatorStyle} />
              <ListSection title={t("CardActions.CardSettingsScreen.subTitle2")}>
                <ListItemLink
                  icon={<PointOfSaleIcon />}
                  title={t("CardActions.CardSettingsScreen.posTransactionLimit")}
                  onPress={handleOnPOSTransactionLimitPress}
                  disabled={card.data.Status !== "UNLOCK"}
                />
                <ListItemLink
                  icon={<OnlineTransactionLimitIcon />}
                  title={t("CardActions.CardSettingsScreen.onlineTransactionLimit")}
                  onPress={handleOnOnlineTransactionlimitPress}
                  disabled={card.data.Status !== "UNLOCK"}
                />
              </ListSection>
              <View style={separatorStyle} />

              <ListSection title={t("CardActions.CardSettingsScreen.subTitle3")}>
                {card.data.Status === "PENDING-ACTIVATION" ? (
                  <View style={cardInTransitBannerStyle}>
                    <Stack direction="vertical" gap="8p">
                      <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                        {t("CardActions.CardSettingsScreen.onTheWay.title")}
                      </Typography.Text>
                      <Typography.Text color="neutralBase" size="footnote" weight="regular">
                        {t("CardActions.CardSettingsScreen.onTheWay.paragraph")}
                      </Typography.Text>
                    </Stack>
                  </View>
                ) : null}

                <SettingsToggle
                  disabled={card.data.Status !== "UNLOCK"}
                  label={t("CardActions.CardSettingsScreen.atmWithdrawals.label")}
                  helperText={t("CardActions.CardSettingsScreen.atmWithdrawals.helperText")}
                  onPress={() => handleOnChangeSettings("AtmWithdrawals")}
                  value={card.data.Status === "PENDING-ACTIVATION" ? false : settings.data.AtmWithdrawals ?? false}
                />
                <View style={cancelCardButtonContainerStyle}>
                  <Button
                    onPress={handleOnCancelCardPress}
                    disabled={card.data.Status === "PENDING-ACTIVATION"}
                    variant="secondary">
                    {t("CardActions.CardSettingsScreen.cancelCardAlert.cancelCard")}
                  </Button>
                </View>
              </ListSection>
            </View>
          ) : (
            <ActivityIndicator />
          )}
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />

      <NotificationModal
        variant="warning"
        title={t("CardActions.CardSettingsScreen.cancelCardAlert.cancelCard")}
        message={t("CardActions.CardSettingsScreen.cancelCardAlert.cancelCardDescription")}
        isVisible={isConfirmationModalVisible}
        buttons={{
          primary: (
            <Button onPress={handleOnConfirmPress}>
              {t("CardActions.CardSettingsScreen.cancelCardAlert.cancelCardTitle")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => setIsConfirmationModalVisible(false)}>
              {t("CardActions.CardSettingsScreen.cancelCardAlert.cancel")}
            </Button>
          ),
        }}
      />

      <NotificationModal
        variant="success"
        title={t("CardActions.CardSettingsScreen.cancelCardAlert.cancelCardSuccessMessage")}
        message=""
        isVisible={showCancelCardSuccessAlert}
        buttons={{
          primary: (
            <Button onPress={handleSuccessOkPress}>{t("CardActions.CardSettingsScreen.cancelCardAlert.Ok")}</Button>
          ),
        }}
      />
    </>
  );
}
