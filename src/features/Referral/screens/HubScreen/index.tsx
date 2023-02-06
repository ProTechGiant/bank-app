import Clipboard from "@react-native-clipboard/clipboard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, ScrollView, Share, View, ViewStyle } from "react-native";

import { FriendIcon, ShareCopyIcon } from "@/assets/icons";
import Button from "@/components/Button";
import DismissibleBanner from "@/components/DismissibleBanner";
import NavHeader from "@/components/NavHeader";
import SectionHeader from "@/components/SectionHeader";
import Typography from "@/components/Typography";
import { useGlobalContext } from "@/contexts/GlobalContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import CopyCodeCard from "./CopyCodeCard";
import RecommendationCards from "./RecommendationCards";

export default function HubScreen() {
  const buttonStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginHorizontal: theme.spacing["16p"],
      marginTop: theme.spacing["16p"],
    }),
    []
  );
  const captionTextWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "flex-end",
      flexDirection: "row",
      justifyContent: "center",
      marginTop: theme.spacing["8p"],
      marginBottom: theme.spacing["32p"],
    }),
    []
  );
  const headerContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["primaryBase"],
      paddingTop: Platform.OS === "android" ? theme.spacing["8p"] : theme.spacing["24p"],
      paddingBottom: theme.spacing["24p"] * 2,
    }),
    []
  );
  const headerTextWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing["24p"],
      marginHorizontal: theme.spacing["24p"],
      alignItems: "center",
    }),
    []
  );
  const IconWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing["20p"],
      alignItems: "center",
      justifyContent: "center",
    }),
    []
  );
  const subTextStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing["8p"],
    }),
    []
  );
  const cardContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginVertical: theme.spacing["8p"],
      marginHorizontal: theme.spacing["16p"],
    }),
    []
  );

  const friendIconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.friendIcon, []);

  const inProgress = 1;
  const completed = 1;
  const earnt = 15;
  const currency = "SAR";
  const referralLink = "https://www.croatia.com/invite";

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

  return (
    <View style={{ flex: 1 }}>
      <DismissibleBanner visible={showToast} message={t("Referral.HubScreen.linkCopied")} />
      <ScrollView showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
        <View style={headerContainerStyle}>
          <NavHeader color="white" />
          <View style={IconWrapperStyle}>
            <FriendIcon height={friendIconDimensions} width={friendIconDimensions} />
          </View>
          <View style={headerTextWrapperStyle}>
            <Typography.Text color="neutralBase-50" weight="semiBold" size="title1">
              {t("Referral.HubScreen.title")}
            </Typography.Text>
            <View style={subTextStyle}>
              <Typography.Text color="neutralBase-20" weight="regular" size="callout" style={{ textAlign: "center" }}>
                {t("Referral.HubScreen.subtitle")}
              </Typography.Text>
            </View>
          </View>
        </View>
        <SectionHeader title={t("Referral.HubScreen.recommendations")} />
        <RecommendationCards inProgress={inProgress} completed={completed} earnt={earnt} currency={currency} />
        <SectionHeader title={t("Referral.HubScreen.copy")} />
        <View style={cardContainerStyle}>
          <CopyCodeCard
            backgroundColor="neutralBase-50"
            leftText={referralLink}
            rightIcon={<ShareCopyIcon />}
            onPress={handleOnCopyCodePress}
          />
        </View>
      </ScrollView>
      <View style={buttonStyle}>
        <Button variant="primary" color="alt" onPress={handleOnSharePress}>
          <Typography.Text color="neutralBase-50" weight="semiBold" size="callout">
            {t("Referral.share")}
          </Typography.Text>
        </Button>
        <View style={captionTextWrapperStyle}>
          <Typography.Text size="caption2" color="neutralBase" weight="medium">
            {t("Referral.read")}
          </Typography.Text>
          <Pressable>
            <Typography.Text size="caption2" color="interactionBase" weight="medium">
              {t("Referral.termsAndConditions")}
            </Typography.Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
