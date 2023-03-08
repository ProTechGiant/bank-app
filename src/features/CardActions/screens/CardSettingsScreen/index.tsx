import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, View, ViewStyle } from "react-native";

import { CardIcon, GlobeIcon, LockIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ToastBanner from "@/components/ToastBanner";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CardActionsStackParams } from "../../CardActionsStack";
import ListItemLink from "../../components/ListItemLink";
import ListSection from "../../components/ListSection";
import SettingsToggle from "./SettingsToggle";

interface CardSettings {
  IsOnlinePaymentsActive: boolean;
  IsInternationalPaymentActive: boolean;
  IsSwipePaymentsActive: boolean;
  IsContactlessPaymentsActive: boolean;
  IsAllowChipWithoutPinActive: boolean;
  IsAtmWithdrawalsActive: boolean;
}

export default function CardSettingsScreen() {
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.CardSettingsScreen">>();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { control, watch } = useForm<CardSettings>({
    mode: "onBlur",
    defaultValues: {
      IsOnlinePaymentsActive: false,
      IsInternationalPaymentActive: false,
      IsSwipePaymentsActive: false,
      IsContactlessPaymentsActive: false,
      IsAllowChipWithoutPinActive: false,
      IsAtmWithdrawalsActive: false,
    },
  });

  const cardStatus = route.params.cardStatus;

  const isOnlinePaymentsActive = watch("IsOnlinePaymentsActive");

  useEffect(() => {
    if (isOnlinePaymentsActive) {
      navigation.navigate("CardActions.OneTimePasswordModal", {
        redirect: "CardActions.CardSettingsScreen",
        action: "activate-online-payment",
      });
      // TODO: BE integration
    }
  }, [isOnlinePaymentsActive]);

  const handleChangePin = () => {
    Alert.alert("Change Pin is coming.");
  };

  const globeIconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.globe, []);

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
    <Page backgroundColor="neutralBase-60">
      <NavHeader end={false} />
      <ContentContainer isScrollView>
        <Typography.Header color="neutralBase+30" size="large" weight="semiBold" style={titleStyle}>
          {t("CardActions.CardSettingsScreen.title")}
        </Typography.Header>
        <ListSection title={t("CardActions.CardSettingsScreen.subTitle1")}>
          <ListItemLink
            icon={<LockIcon />}
            title={t("CardActions.CardSettingsScreen.changePin")}
            onPress={handleChangePin}
          />
          <SettingsToggle
            name="IsOnlinePaymentsActive"
            icon={<CardIcon />}
            label={t("CardActions.CardSettingsScreen.onlinePayment.label")}
            helperText={t("CardActions.CardSettingsScreen.onlinePayment.helperText")}
            control={control}
          />
          <SettingsToggle
            name="IsInternationalPaymentActive"
            icon={<GlobeIcon width={globeIconDimensions} height={globeIconDimensions} />}
            label={t("CardActions.CardSettingsScreen.internationalPayment.label")}
            helperText={t("CardActions.CardSettingsScreen.internationalPayment.helperText")}
            control={control}
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
            name="IsSwipePaymentsActive"
            label={t("CardActions.CardSettingsScreen.swipePayments.label")}
            helperText={t("CardActions.CardSettingsScreen.swipePayments.helperText")}
            control={control}
            disabled={cardStatus === "inactive" ? true : false}
          />
          <SettingsToggle
            name="IsContactlessPaymentsActive"
            label={t("CardActions.CardSettingsScreen.contactlessPayments.label")}
            helperText={t("CardActions.CardSettingsScreen.contactlessPayments.helperText")}
            control={control}
            disabled={cardStatus === "inactive" ? true : false}
          />
          <SettingsToggle
            name="IsAllowChipWithoutPinActive"
            label={t("CardActions.CardSettingsScreen.allowChipWithoutPin.label")}
            helperText={t("CardActions.CardSettingsScreen.allowChipWithoutPin.helperText")}
            control={control}
            disabled={cardStatus === "inactive" ? true : false}
          />
          <SettingsToggle
            name="IsAtmWithdrawalsActive"
            label={t("CardActions.CardSettingsScreen.atmWithdrawals.label")}
            helperText={t("CardActions.CardSettingsScreen.atmWithdrawals.helperText")}
            control={control}
            disabled={cardStatus === "inactive" ? true : false}
          />
        </ListSection>
      </ContentContainer>
    </Page>
  );
}
