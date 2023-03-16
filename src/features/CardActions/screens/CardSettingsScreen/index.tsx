import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, View, ViewStyle } from "react-native";

import { CardIcon, LockIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import ToastBanner from "@/components/ToastBanner";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";

import { CardActionsStackParams } from "../../CardActionsStack";
import ListItemLink from "../../components/ListItemLink";
import ListSection from "../../components/ListSection";
import { useCardSettings, useUpdateCardSettings } from "../../query-hooks";
import { CardSettingsInput } from "../../types";
import SettingsToggle from "./SettingsToggle";

export default function CardSettingsScreen() {
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.CardSettingsScreen">>();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const updateCardSettingsAsync = useUpdateCardSettings();
  const cardSettings = useCardSettings(route.params.cardId);

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const cardStatus = route.params.cardStatus;

  // trigger a refetch of card settings after the OTP modal is closed
  // user may have cancelled OTP so we need to refetch
  useEffect(() => {
    const listener = navigation.addListener("focus", () => {
      cardSettings.refetch();
    });

    return () => listener();
  }, [navigation]);

  const handleOnUpdatePin = () => {
    Alert.alert("Updating PIN is not implemented yet");
  };

  const handleOnChangeSettings = async (setting: keyof CardSettingsInput) => {
    if (cardSettings.data === undefined) return;

    try {
      const correlationId = generateRandomId();

      const updatedSettings = {
        ...cardSettings.data,
        [setting]: !cardSettings.data[setting],
      };

      const response = await updateCardSettingsAsync.mutateAsync({
        correlationId,
        cardId: route.params.cardId,
        settings: updatedSettings,
      });

      if (response.IsOtpRequired) {
        navigation.navigate("CardActions.OneTimePasswordModal", {
          correlationId,
          action: "update-settings",
          redirect: "CardActions.CardSettingsScreen",
          cardId: route.params.cardId,
          cardSettings: updatedSettings,
          otp: {
            otpCode: response.OtpCode,
            otpId: response.OtpId,
            phoneNumber: response.PhoneNumber,
          },
        });
      }
    } catch (error) {
      setIsErrorModalVisible(true);
      warn("card-settings", "Could not update card settings: ", JSON.stringify(error));
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

  const toastBannerContainer = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader end={false} />
        <ContentContainer isScrollView>
          <Typography.Header color="neutralBase+30" size="large" weight="semiBold" style={titleStyle}>
            {t("CardActions.CardSettingsScreen.title")}
          </Typography.Header>
          {cardSettings.data !== undefined ? (
            <View>
              <ListSection title={t("CardActions.CardSettingsScreen.subTitle1")}>
                <ListItemLink
                  icon={<LockIcon />}
                  title={t("CardActions.CardSettingsScreen.changePin")}
                  onPress={handleOnUpdatePin}
                />
                <SettingsToggle
                  icon={<CardIcon />}
                  label={t("CardActions.CardSettingsScreen.onlinePayment.label")}
                  helperText={t("CardActions.CardSettingsScreen.onlinePayment.helperText")}
                  onPress={() => handleOnChangeSettings("OnlinePayments")}
                  value={cardSettings.data.OnlinePayments}
                />
              </ListSection>
              <View style={separatorStyle} />
              <ListSection title={t("CardActions.CardSettingsScreen.subTitle2")}>
                {cardStatus === "inactive" && (
                  <View style={toastBannerContainer}>
                    <ToastBanner
                      title={t("CardActions.CardSettingsScreen.onTheWay.title")}
                      message={t("CardActions.CardSettingsScreen.onTheWay.paragraph")}
                    />
                  </View>
                )}
                <SettingsToggle
                  disabled={cardStatus !== "unfreeze"}
                  label={t("CardActions.CardSettingsScreen.swipePayments.label")}
                  helperText={t("CardActions.CardSettingsScreen.swipePayments.helperText")}
                  onPress={() => handleOnChangeSettings("SwipePayments")}
                  value={cardSettings.data.SwipePayments}
                />
                <SettingsToggle
                  disabled={cardStatus !== "unfreeze"}
                  label={t("CardActions.CardSettingsScreen.contactlessPayments.label")}
                  helperText={t("CardActions.CardSettingsScreen.contactlessPayments.helperText")}
                  onPress={() => handleOnChangeSettings("ContactlessPayments")}
                  value={cardSettings.data.ContactlessPayments}
                />
                <SettingsToggle
                  disabled={cardStatus !== "unfreeze"}
                  label={t("CardActions.CardSettingsScreen.atmWithdrawals.label")}
                  helperText={t("CardActions.CardSettingsScreen.atmWithdrawals.helperText")}
                  onPress={() => handleOnChangeSettings("AtmWithdrawals")}
                  value={cardSettings.data.AtmWithdrawals}
                />
              </ListSection>
            </View>
          ) : null}
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
