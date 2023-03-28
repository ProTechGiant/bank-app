import Clipboard from "@react-native-clipboard/clipboard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Platform, ScrollView, Share, StyleSheet, View, ViewStyle } from "react-native";
import appsFlyer from "react-native-appsflyer";

import { CopyIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DismissibleBanner from "@/components/DismissibleBanner";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { TableListCard, TableListCardGroup } from "@/components/TableList";
import Typography from "@/components/Typography";
import { useReferralContext } from "@/contexts/ReferralContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import BackgroundBottomLeftSvg from "./background-bottom-left.svg";
import BackgroundBottomRightSvg from "./background-bottom-right.svg";
import BackgroundTopSvg from "./background-top.svg";

export default function HubScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { referralPageViewStatus, referralLink, setReferralLink } = useReferralContext();
  const [showToast, setShowToast] = useState(false);
  const [isError, setIsError] = useState(false);

  const getReferralLink = () => {
    // @TODO get from the backend when it is ready BC5/6
    const referralCode = "mockedRefer";

    appsFlyer.generateInviteLink(
      {
        channel: "invite_friends",
        userParams: {
          referralCode,
        },
      },
      link => {
        setReferralLink(link);
      },
      () => {
        //   On error referral link remains undefined
      }
    );
  };

  useEffect(() => {
    if (referralLink === undefined && referralPageViewStatus === "finished") {
      setIsError(true);
    }
  }, [referralPageViewStatus, referralLink]);

  useEffect(() => {
    // Navigate to the instructions screen if this is the first time viewing the referral hub
    if (referralPageViewStatus === "unviewed") {
      navigation.navigate("Referral.InstructionsScreen");
    }
  }, [navigation, referralPageViewStatus]);

  useEffect(() => {
    if (referralLink === undefined) {
      getReferralLink();
    }
  }, [referralLink]);

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
    navigation.navigate("Referral.TermsAndConditions");
  };

  const handleOnDismissPress = () => {
    setIsError(false);
  };

  const handleOnRefreshPress = () => {
    getReferralLink();
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
                      end={<TableListCard.Label bold>{COMPLETED_REFERRAL}</TableListCard.Label>}
                    />
                    <TableListCard
                      label={t("Referral.HubScreen.earnt")}
                      end={<TableListCard.Label bold>{EARNT_REFERRAL}</TableListCard.Label>}
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
          {referralLink === undefined && referralPageViewStatus === "finished" ? (
            <NotificationModal
              variant="error"
              title={t("Referral.HubScreen.errorTitle")}
              message={t("Referral.HubScreen.errorMessage")}
              isVisible={isError}
              onClose={handleOnDismissPress}
              buttons={{
                primary: <Button onPress={handleOnRefreshPress}>{t("Referral.HubScreen.refresh")}</Button>,
                secondary: <Button onPress={handleOnDismissPress}>{t("Referral.HubScreen.dismiss")}</Button>,
              }}
            />
          ) : null}
        </ContentContainer>
      </Page>
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

const COMPLETED_REFERRAL = 1;
const EARNT_REFERRAL = 15;
