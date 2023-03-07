import Clipboard from "@react-native-clipboard/clipboard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, ScrollView, Share, View, ViewStyle } from "react-native";

import { CopyIcon } from "@/assets/icons";
import Button from "@/components/Button";
import DismissibleBanner from "@/components/DismissibleBanner";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useGlobalContext } from "@/contexts/GlobalContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function HubScreen() {
  const container = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const subtitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["16p"],
  }));

  const headerTextWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["8p"],
  }));

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["8p"],
    shadowOffset: {
      width: 8,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  }));

  const cardContainerInnerStyle = useThemeStyles<ViewStyle>(theme => ({
    minHeight: 54,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: theme.palette["neutralBase-50"],
    paddingHorizontal: theme.spacing["16p"],
  }));

  const bottomBorderStyle = useThemeStyles<ViewStyle>(theme => ({
    borderBottomColor: theme.palette["neutralBase-40"],
    borderBottomWidth: 1,
  }));

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["primaryBase-12%"],
    padding: 10,
    borderRadius: 18,
    width: 36,
    height: 36,
  }));

  const borderRadius = useThemeStyles<number>(theme => theme.radii.extraSmall);
  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.referralCopy);

  const completed = 1;
  const earnt = 15;
  const referralLink = "apps.apple.com/croatia";

  const [showToast, setShowToast] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { referralPageViewed } = useGlobalContext();

  const handleOnCopyCodePress = () => {
    Clipboard.setString(referralLink);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleOnSharePress = () => {
    const url = referralLink;
    return Share.share(Platform.OS === "ios" ? { url } : { message: url });
  };

  useEffect(() => {
    if (referralPageViewed === false) {
      navigation.navigate("Referral.InstructionsScreen");
    }
  }, []);

  const handleOnTermsAndConditionsPress = () => {
    navigation.navigate("Referral.TermsAndConditions");
  };

  return (
    <Page backgroundColor="neutralBase-50">
      <DismissibleBanner visible={showToast} message={t("Referral.HubScreen.linkCopied")} />
      <NavHeader />
      <ScrollView showsVerticalScrollIndicator={false} alwaysBounceVertical={false} contentContainerStyle={container}>
        <Typography.Text weight="semiBold" size="title1">
          {t("Referral.HubScreen.title")}
        </Typography.Text>
        <Typography.Text color="neutralBase" weight="regular" size="callout" style={subtitleStyle}>
          {t("Referral.HubScreen.subtitle")}
          <Typography.Text
            color="primaryBase"
            weight="regular"
            size="callout"
            onPress={handleOnTermsAndConditionsPress}>
            {t("Referral.HubScreen.termsAndConditions")}
          </Typography.Text>
          <Typography.Text color="neutralBase" weight="regular" size="callout">
            {t("Referral.HubScreen.fullStop")}
          </Typography.Text>
        </Typography.Text>
        <Typography.Text size="title3" weight="semiBold" style={headerTextWrapperStyle}>
          {t("Referral.HubScreen.recommendations")}
        </Typography.Text>
        <View style={cardContainerStyle}>
          <View
            style={[
              cardContainerInnerStyle,
              bottomBorderStyle,
              { borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius },
            ]}>
            <Typography.Text>{t("Referral.HubScreen.completed")}</Typography.Text>
            <Typography.Text size="callout" weight="semiBold" color="primaryBase">
              {completed}
            </Typography.Text>
          </View>
          <View
            style={[
              cardContainerInnerStyle,
              { borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius },
            ]}>
            <Typography.Text>{t("Referral.HubScreen.earnt")}</Typography.Text>
            <Typography.Text size="callout" weight="semiBold" color="primaryBase">
              {earnt}
            </Typography.Text>
          </View>
        </View>
        <Pressable
          style={[cardContainerStyle, headerTextWrapperStyle, cardContainerInnerStyle, { borderRadius }]}
          onPress={handleOnCopyCodePress}>
          <Typography.Text>{referralLink}</Typography.Text>
          <View style={iconStyle}>
            <CopyIcon height={iconDimensions} width={iconDimensions} color="#080E53" />
          </View>
        </Pressable>
      </ScrollView>
      <View style={buttonStyle}>
        <Button variant="primary" color="light" onPress={handleOnSharePress}>
          {t("Referral.HubScreen.share")}
        </Button>
      </View>
    </Page>
  );
}
