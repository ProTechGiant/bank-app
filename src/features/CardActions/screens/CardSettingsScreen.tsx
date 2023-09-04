import { RouteProp, useRoute } from "@react-navigation/native";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, View, ViewStyle } from "react-native";

import { CardIcon, GlobeIcon, LockIcon, PointOfSaleIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useToasts } from "@/contexts/ToastsContext";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import { useOtpFlow } from "../../OneTimePassword/hooks/query-hooks";
import { ListItemLink, ListSection, SettingsToggle } from "../components";
import { useCard, useCardSettings, useUpdateCardSettings } from "../hooks/query-hooks";
import { CardSettingsInput } from "../types";

export default function CardSettingsScreen() {
  const route = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.CardSettingsScreen">>();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const otpFlow = useOtpFlow<AuthenticatedStackParams>();
  const updateCardSettingsAsync = useUpdateCardSettings();
  const settings = useCardSettings(route.params.cardId);
  const card = useCard(route.params.cardId);
  const addToast = useToasts();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const isUpdatingRef = useRef(false);

  otpFlow.useOtpResponseEffect<{ ResetPinMessage: string }>((status, payload) => {
    if (status === "success" && "ResetPinMessage" in payload) {
      addToast({ variant: "confirm", message: t("CardActions.CardSettingsScreen.toast") });
    } else if (status === "fail") {
      delayTransition(() => setIsErrorModalVisible(true));
    }
  });

  const handleOnChangePinCodePress = () => {
    navigation.navigate("CardActions.ResetPincodeScreen", {
      cardId: route.params.cardId,
    });
  };

  const handleOnPOSTransactiionLimitPress = () => {
    //TODO: replace with navigation of screen once its developed.
    Alert.alert("POS Transaction Limit Pressed");
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
                  disabled={card.data.Status !== "unfreeze"}
                />
                <SettingsToggle
                  icon={<CardIcon />}
                  label={t("CardActions.CardSettingsScreen.onlinePayment.label")}
                  helperText={t("CardActions.CardSettingsScreen.onlinePayment.helperText")}
                  onPress={() => handleOnChangeSettings("OnlinePayments")}
                  value={settings.data.OnlinePayments}
                  disabled={!["unfreeze", "pending-activation"].includes(card.data.Status)}
                />
                <SettingsToggle
                  icon={<GlobeIcon />}
                  label={t("CardActions.CardSettingsScreen.internationalPayment.label")}
                  helperText={t("CardActions.CardSettingsScreen.internationalPayment.helperText")}
                  onPress={() => handleOnChangeSettings("InternationalPayments")}
                  value={settings.data.InternationalPayments}
                  disabled={card.data.Status !== "unfreeze"}
                />
              </ListSection>
              <View style={separatorStyle} />
              <ListSection title={t("CardActions.CardSettingsScreen.subTitle2")}>
                <ListItemLink
                  icon={<PointOfSaleIcon />}
                  title={t("CardActions.CardSettingsScreen.posTransactionLimit")}
                  onPress={handleOnPOSTransactiionLimitPress}
                  disabled={card.data.Status !== "unfreeze"}
                />
              </ListSection>
              <View style={separatorStyle} />

              <ListSection title={t("CardActions.CardSettingsScreen.subTitle3")}>
                {card.data.Status === "pending-activation" ? (
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
                  disabled={card.data.Status !== "unfreeze"}
                  label={t("CardActions.CardSettingsScreen.swipePayments.label")}
                  helperText={t("CardActions.CardSettingsScreen.swipePayments.helperText")}
                  onPress={() => handleOnChangeSettings("SwipePayments")}
                  value={card.data.Status === "pending-activation" ? false : settings.data.SwipePayments}
                />
                <SettingsToggle
                  disabled={card.data.Status !== "unfreeze"}
                  label={t("CardActions.CardSettingsScreen.contactlessPayments.label")}
                  helperText={t("CardActions.CardSettingsScreen.contactlessPayments.helperText")}
                  onPress={() => handleOnChangeSettings("ContactlessPayments")}
                  value={card.data.Status === "pending-activation" ? false : settings.data.ContactlessPayments}
                />
                <SettingsToggle
                  disabled={card.data.Status !== "unfreeze"}
                  label={t("CardActions.CardSettingsScreen.atmWithdrawals.label")}
                  helperText={t("CardActions.CardSettingsScreen.atmWithdrawals.helperText")}
                  onPress={() => handleOnChangeSettings("AtmWithdrawals")}
                  value={card.data.Status === "pending-activation" ? false : settings.data.AtmWithdrawals}
                />
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
    </>
  );
}
