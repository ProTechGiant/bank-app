import Clipboard from "@react-native-clipboard/clipboard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Share, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DismissibleBanner from "@/components/DismissibleBanner";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { TableListCard, TableListCardGroup } from "@/components/TableList";
import Typography from "@/components/Typography";
import { useGlobalContext } from "@/contexts/GlobalContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function HubScreen() {
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

    setTimeout(() => setShowToast(false), 4000);
  };

  const handleOnSharePress = () => {
    const url = referralLink;
    Share.share(Platform.OS === "ios" ? { url } : { message: url });
  };

  useEffect(() => {
    if (referralPageViewed === false) navigation.navigate("Referral.InstructionsScreen");
  }, [navigation]);

  const handleOnTermsAndConditionsPress = () => {
    navigation.navigate("Referral.TermsAndConditions");
  };

  const subtitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  const headerTextWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["8p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <DismissibleBanner visible={showToast} message={t("Referral.HubScreen.linkCopied")} />
      <NavHeader />
      <ContentContainer isScrollView style={styles.container}>
        <View>
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
          <Stack align="stretch" direction="vertical" gap="24p">
            <View>
              <Typography.Text size="title3" weight="semiBold" style={headerTextWrapperStyle}>
                {t("Referral.HubScreen.recommendations")}
              </Typography.Text>
              <TableListCardGroup>
                <TableListCard
                  label={t("Referral.HubScreen.completed")}
                  end={<TableListCard.Label>{completed}</TableListCard.Label>}
                />
                <TableListCard
                  label={t("Referral.HubScreen.earnt")}
                  end={<TableListCard.Label>{earnt}</TableListCard.Label>}
                />
              </TableListCardGroup>
            </View>
            <TableListCard label={referralLink} end={<TableListCard.Copy onPress={handleOnCopyCodePress} />} />
          </Stack>
        </View>
        <Button variant="primary" color="light" onPress={handleOnSharePress}>
          {t("Referral.HubScreen.share")}
        </Button>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});
