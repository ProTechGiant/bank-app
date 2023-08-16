import Clipboard from "@react-native-clipboard/clipboard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Share, View, ViewStyle } from "react-native";

import { CopyIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import List from "@/components/List";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useReferralContext } from "@/contexts/ReferralContext";
import { useToasts } from "@/contexts/ToastsContext";
import useAppsFlyer from "@/hooks/use-appsflyer";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import ReferralsDashboard from "../assets/ReferralsDashboard";
import { useCustomersReferrals } from "../hooks/query-hooks";

export default function HubScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const customerReferrals = useCustomersReferrals();
  const appsFlyer = useAppsFlyer();
  const addToast = useToasts();

  const { referralPageViewStatus, referralLink, setReferralLink } = useReferralContext();
  const [isError, setIsError] = useState(false);

  const moneyEarned =
    customerReferrals.data?.MoneyEarned !== undefined ? parseInt(customerReferrals.data?.MoneyEarned, 10) : undefined;
  const numberOfCompletedReferrals = customerReferrals.data?.NumberOfCompletedReferrals;
  const referralCode = customerReferrals.data?.ReferralCode;

  useEffect(() => {
    if (
      (referralLink === undefined || numberOfCompletedReferrals === undefined || moneyEarned === undefined) &&
      referralPageViewStatus === "finished"
    ) {
      setIsError(true);
    }
  }, [referralPageViewStatus, referralLink, numberOfCompletedReferrals, moneyEarned]);

  useEffect(() => {
    // Navigate to the instructions screen if this is the first time viewing the referral hub
    if (referralPageViewStatus === "unviewed") {
      navigation.navigate("Referral.InstructionsScreen");
    }
  }, [navigation, referralPageViewStatus]);

  useEffect(() => {
    async function generateReferralLink(code: string) {
      try {
        const link = await appsFlyer.createLink("InviteFriends", {
          referralCode: code,
        });
        setReferralLink(link);
      } catch (error) {
        warn("appsflyer-sdk", "Could not generate invite fiends link", JSON.stringify(error));
      }
    }
    if (referralLink === undefined && referralCode !== undefined) {
      generateReferralLink(referralCode);
    }
  }, [referralLink, referralCode, setReferralLink, appsFlyer]);

  const handleOnCopyPress = () => {
    if (referralLink) {
      Clipboard.setString(referralLink);
      addToast({ variant: "confirm", message: t("Referral.HubScreen.linkCopied") });
    }
  };

  const handleOnSharePress = () => {
    if (referralLink) {
      return Share.share(Platform.OS === "ios" ? { url: referralLink } : { message: referralLink });
    }
  };

  const handleOnTermsAndConditionsPress = () => {
    navigation.navigate("Referral.TermsAndConditionsScreen");
  };

  const handleOnDismissPress = () => {
    setIsError(false);
  };

  const handleOnRefreshPress = () => {
    customerReferrals.refetch();
    handleOnDismissPress();
  };

  const subtitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  const headerTextWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["8p"],
  }));

  const linkCardStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["20p"],
    marginTop: theme.spacing["24p"],
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.radii.small,
  }));

  const inactiveIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-30"]);

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "flex-start",
    marginBottom: theme.spacing["16p"],
  }));

  const tableCardStyles = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["16p"],
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60" insets={["left", "right"]}>
        <NavHeader variant="angled">
          <View style={iconContainerStyle}>
            <ReferralsDashboard />
          </View>
          <Typography.Text weight="semiBold" size="title1" color="neutralBase+30">
            {t("Referral.HubScreen.title")}
          </Typography.Text>
          <Typography.Text color="neutralBase+30" weight="regular" size="callout" style={subtitleStyle}>
            {t("Referral.HubScreen.subtitle")}
            <Typography.Text
              color="neutralBase+30"
              weight="regular"
              size="callout"
              onPress={handleOnTermsAndConditionsPress}>
              {t("Referral.HubScreen.termsAndConditions")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" weight="regular" size="callout">
              {t("Referral.HubScreen.fullStop")}
            </Typography.Text>
          </Typography.Text>
          <View style={linkCardStyle}>
            <List isBordered>
              {referralLink !== undefined ? (
                <List.Item.Information
                  label={referralLink}
                  onPress={handleOnCopyPress}
                  end={<List.End.Copy onPress={handleOnCopyPress} />}
                />
              ) : (
                <List.Item.Information
                  label={t("Referral.HubScreen.noLink")}
                  disabled={true}
                  end={<CopyIcon color={inactiveIconColor} height={16} width={16} />}
                />
              )}
            </List>
          </View>
        </NavHeader>
        <ContentContainer isScrollView>
          <Typography.Text size="title3" weight="semiBold" style={headerTextWrapperStyle}>
            {t("Referral.HubScreen.recommendations")}
          </Typography.Text>
          <View style={tableCardStyles}>
            <List isBordered>
              <List.Item.Table
                label={t("Referral.HubScreen.earnt")}
                end={
                  moneyEarned !== undefined ? (
                    <List.End.Label bold>{moneyEarned}</List.End.Label>
                  ) : (
                    <List.End.Label>{t("Referral.HubScreen.noData")}</List.End.Label>
                  )
                }
              />
              <List.Item.Table
                label={t("Referral.HubScreen.completed")}
                end={
                  numberOfCompletedReferrals !== undefined ? (
                    <List.End.Label bold>{numberOfCompletedReferrals}</List.End.Label>
                  ) : (
                    <List.End.Label>{t("Referral.HubScreen.noData")}</List.End.Label>
                  )
                }
              />
            </List>
          </View>
          <Button
            variant="primary"
            color="light"
            onPress={handleOnSharePress}
            disabled={referralLink === undefined && referralPageViewStatus === "finished"}>
            {t("Referral.HubScreen.share")}
          </Button>
        </ContentContainer>
      </Page>
      {(referralLink === undefined || numberOfCompletedReferrals === undefined || moneyEarned === undefined) &&
      referralPageViewStatus === "finished" ? (
        <LoadingErrorNotification isVisible={isError} onClose={handleOnDismissPress} onRefresh={handleOnRefreshPress} />
      ) : null}
    </>
  );
}
