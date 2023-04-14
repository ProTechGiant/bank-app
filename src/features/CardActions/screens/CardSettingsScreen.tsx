import { RouteProp, useRoute } from "@react-navigation/native";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View, ViewStyle } from "react-native";

import { CardIcon, GlobeIcon, LockIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import DismissibleBanner from "@/components/DismissibleBanner";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CardActionsStackParams } from "../CardActionsStack";
import { ListItemLink, ListSection, SettingsToggle } from "../components";
import { useCard, useCardSettings, useUpdateCardSettings } from "../hooks/query-hooks";
import useOtpFlow from "../hooks/use-otp";
import { CardSettingsInput } from "../types";

export default function CardSettingsScreen() {
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.CardSettingsScreen">>();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const otpFlow = useOtpFlow<"CardActions.CardSettingsScreen">();
  const updateCardSettingsAsync = useUpdateCardSettings();
  const settings = useCardSettings(route.params.cardId);
  const card = useCard(route.params.cardId);

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [isPinUpdatedBannerVisible, setIsPinUpdatedBannerVisible] = useState(false);
  const isUpdatingRef = useRef(false);

  otpFlow.useOtpResponseEffect<{ ResetPinMessage: string }>((status, payload) => {
    if (status === "success" && "ResetPinMessage" in payload) {
      setIsPinUpdatedBannerVisible(true);
      setTimeout(() => setIsPinUpdatedBannerVisible(false), 3000);
    } else if (status === "fail") {
      setTimeout(() => setIsErrorModalVisible(true), 500);
    }
  });

  const handleOnChangePinCodePress = () => {
    navigation.navigate("CardActions.ResetPincodeScreen", {
      cardId: route.params.cardId,
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
            correlationId: response.correlationId,
            OtpCode: response.OtpCode,
            OtpId: response.OtpId,
            PhoneNumber: response.PhoneNumber,
          },
          onOtpRequestResend: async () => {
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
    backgroundColor: theme.palette["neutralBase-30"],
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
      <DismissibleBanner message="Card PIN has been updated" variant="success" visible={isPinUpdatedBannerVisible} />
      <Page backgroundColor="neutralBase-60">
        <NavHeader end={false} />
        <ContentContainer isScrollView>
          <Typography.Header color="neutralBase+30" size="large" weight="semiBold" style={titleStyle}>
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
                  value={settings.data.SwipePayments}
                />
                <SettingsToggle
                  disabled={card.data.Status !== "unfreeze"}
                  label={t("CardActions.CardSettingsScreen.contactlessPayments.label")}
                  helperText={t("CardActions.CardSettingsScreen.contactlessPayments.helperText")}
                  onPress={() => handleOnChangeSettings("ContactlessPayments")}
                  value={settings.data.ContactlessPayments}
                />
                <SettingsToggle
                  disabled={card.data.Status !== "unfreeze"}
                  label={t("CardActions.CardSettingsScreen.atmWithdrawals.label")}
                  helperText={t("CardActions.CardSettingsScreen.atmWithdrawals.helperText")}
                  onPress={() => handleOnChangeSettings("AtmWithdrawals")}
                  value={settings.data.AtmWithdrawals}
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
