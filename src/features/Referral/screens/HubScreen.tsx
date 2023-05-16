import Clipboard from "@react-native-clipboard/clipboard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Platform, ScrollView, Share, StyleSheet, View, ViewStyle } from "react-native";

import { CopyIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DismissibleBanner from "@/components/DismissibleBanner";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { TableListCard, TableListCardGroup } from "@/components/TableList";
import Typography from "@/components/Typography";
import { useReferralContext } from "@/contexts/ReferralContext";
import useAppsFlyer from "@/hooks/use-appsflyer";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import BackgroundBottomLeftSvg from "../assets/background-bottom-left.svg";
import BackgroundBottomRightSvg from "../assets/background-bottom-right.svg";
import BackgroundTopSvg from "../assets/background-top.svg";
import { useCustomersReferrals } from "../hooks/query-hooks";

export default function HubScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const customerReferrals = useCustomersReferrals();
  const appsFlyer = useAppsFlyer();

  const { referralPageViewStatus, referralLink, setReferralLink } = useReferralContext();
  const [showToast, setShowToast] = useState(false);
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
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
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
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.radii.extraSmall,
  }));

  const inactiveIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-30"]);

  return (
    <>
      <DismissibleBanner visible={showToast} message={t("Referral.HubScreen.linkCopied")} />
      <Page backgroundColor="neutralBase-60">
        <View style={styles.backgroundBottomRight}>
          <BackgroundBottomRightSvg />
        </View>
        <View style={styles.backgroundBottomLeft}>
          <BackgroundBottomLeftSvg />
        </View>
        <View style={styles.backgroundTopStart}>
          <BackgroundTopSvg />
        </View>
        <NavHeader />
        <ContentContainer isScrollView style={styles.container}>
          <ScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false}>
            <View>
              <Typography.Text weight="semiBold" size="title1">
                {t("Referral.HubScreen.title")}
              </Typography.Text>
              <Typography.Text color="neutralBase" weight="regular" size="callout" style={subtitleStyle}>
                {t("Referral.HubScreen.subtitle")}
                <Typography.Text
                  color="complimentBase"
                  weight="regular"
                  size="callout"
                  onPress={handleOnTermsAndConditionsPress}>
                  {t("Referral.HubScreen.termsAndConditions")}
                </Typography.Text>
                <Typography.Text color="neutralBase" weight="regular" size="callout">
                  {t("Referral.HubScreen.fullStop")}
                </Typography.Text>
              </Typography.Text>
              <Stack align="stretch" direction="vertical" gap="24p">
                <View>
                  <Typography.Text size="title3" weight="semiBold" style={headerTextWrapperStyle}>
                    {t("Referral.HubScreen.recommendations")}
                  </Typography.Text>
                  <TableListCardGroup>
                    <TableListCard
                      label={t("Referral.HubScreen.completed")}
                      end={
                        numberOfCompletedReferrals !== undefined ? (
                          <TableListCard.Label bold>{numberOfCompletedReferrals}</TableListCard.Label>
                        ) : (
                          <TableListCard.Label>{t("Referral.HubScreen.noData")}</TableListCard.Label>
                        )
                      }
                    />
                    <TableListCard
                      label={t("Referral.HubScreen.earnt")}
                      end={
                        moneyEarned !== undefined ? (
                          <TableListCard.Label bold>{moneyEarned}</TableListCard.Label>
                        ) : (
                          <TableListCard.Label>{t("Referral.HubScreen.noData")}</TableListCard.Label>
                        )
                      }
                    />
                  </TableListCardGroup>
                </View>
                <View style={linkCardStyle}>
                  {referralLink !== undefined ? (
                    <TableListCard
                      label={referralLink}
                      onPress={handleOnCopyPress}
                      end={<TableListCard.Copy onPress={handleOnCopyPress} />}
                    />
                  ) : (
                    <TableListCard
                      label={t("Referral.HubScreen.noLink")}
                      isInactive={true}
                      end={<CopyIcon color={inactiveIconColor} height={16} width={16} />}
                    />
                  )}
                </View>
              </Stack>
            </View>
          </ScrollView>
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

const styles = StyleSheet.create({
  backgroundBottomLeft: {
    bottom: 0,
    left: 0,
    position: "absolute",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  backgroundBottomRight: {
    bottom: 0,
    position: "absolute",
    right: 0,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  backgroundTopStart: {
    position: "absolute",
    start: 0,
    top: 0,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});
