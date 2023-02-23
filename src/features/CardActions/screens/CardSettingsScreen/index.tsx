import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, View, ViewStyle } from "react-native";

import { CardIcon, GlobeIcon, LockIcon } from "@/assets/icons";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ToastBanner from "@/components/ToastBanner";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import LinkCard from "../../components/LinkCard";
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
  const { t } = useTranslation();

  const { control } = useForm<CardSettings>({
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

  const handleChangePin = () => {
    Alert.alert("Change Pin is coming.");
  };

  const globeIconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.globe, []);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
  }));

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const subTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-30"],
  }));

  const toastBannerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <Page backgroundColor="neutralBase-50">
      <NavHeader end={false} />
      <ScrollView>
        <View style={containerStyle}>
          <Typography.Text size="title1" weight="semiBold" style={titleStyle}>
            {t("CardActions.CardSettingsScreen.title")}
          </Typography.Text>
          <Typography.Text size="title3" weight="semiBold" style={subTitleStyle}>
            {t("CardActions.CardSettingsScreen.subTitle1")}
          </Typography.Text>
          <LinkCard
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
        </View>

        <View style={separatorStyle} />

        <View style={containerStyle}>
          <Typography.Text size="title3" weight="semiBold" style={subTitleStyle}>
            {t("CardActions.CardSettingsScreen.subTitle2")}
          </Typography.Text>
          <View style={toastBannerStyle}>
            <ToastBanner
              title={t("CardActions.CardSettingsScreen.onTheWay.title")}
              message={t("CardActions.CardSettingsScreen.onTheWay.paragraph")}
            />
          </View>
          <SettingsToggle
            name="IsSwipePaymentsActive"
            label={t("CardActions.CardSettingsScreen.swipePayments.label")}
            helperText={t("CardActions.CardSettingsScreen.swipePayments.helperText")}
            control={control}
            disabled
          />
          <SettingsToggle
            name="IsContactlessPaymentsActive"
            label={t("CardActions.CardSettingsScreen.contactlessPayments.label")}
            helperText={t("CardActions.CardSettingsScreen.contactlessPayments.helperText")}
            control={control}
            disabled
          />
          <SettingsToggle
            name="IsAllowChipWithoutPinActive"
            label={t("CardActions.CardSettingsScreen.allowChipWithoutPin.label")}
            helperText={t("CardActions.CardSettingsScreen.allowChipWithoutPin.helperText")}
            control={control}
            disabled
          />
          <SettingsToggle
            name="IsAtmWithdrawalsActive"
            label={t("CardActions.CardSettingsScreen.atmWithdrawals.label")}
            helperText={t("CardActions.CardSettingsScreen.atmWithdrawals.helperText")}
            control={control}
            disabled
          />
        </View>
      </ScrollView>
    </Page>
  );
}
