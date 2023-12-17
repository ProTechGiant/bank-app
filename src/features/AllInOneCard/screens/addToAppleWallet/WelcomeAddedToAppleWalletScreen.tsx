import { StackActions } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TextStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AddToAppleWalletIllustrationIcon } from "../../assets/icons";

export default function WelcomeAddedToAppleWalletScreen() {
  const { t } = useTranslation();
  const { setOtherAioCardProperties } = useAuthContext();
  const navigation = useNavigation();

  useEffect(() => {
    setOtherAioCardProperties({ isConnectedToAppleWallet: true });
  }, []);

  const containerStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["64p"],
  }));

  const iconStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const handleShowCard = () => {
    navigation.dispatch(StackActions.pop(5));
    navigation.navigate("Home.HomeTabs", { screen: "Cards" });
  };

  return (
    <Page backgroundColor="neutralBase+30" testID="AllInOneCard.WelcomeAddedToAppleWalletScreen:Page">
      <ContentContainer testID="AllInOneCard.WelcomeAddedToAppleWalletScreen:ContentContainer">
        <View style={styles.container}>
          <Stack flex={1} direction="vertical">
            <Stack direction="vertical" align="center">
              <View style={iconStyle}>
                <AddToAppleWalletIllustrationIcon />
              </View>
              <Stack direction="vertical" align="center" gap="24p" justify="space-between" style={containerStyle}>
                <Typography.Header size="large" weight="bold" align="center" color="neutralBase-60">
                  {t("AllInOneCard.AddedToAppleWallet.title")}
                </Typography.Header>
                <Typography.Text size="callout" weight="regular" align="center" color="neutralBase-60">
                  {t("AllInOneCard.AddedToAppleWallet.subtitle")}
                </Typography.Text>
              </Stack>
            </Stack>
          </Stack>
          <Button onPress={handleShowCard} testID="AllInOneCard.WelcomeAddedToAppleWalletScreen:ButtonFinish">
            {" "}
            {t("AllInOneCard.AddedToAppleWallet.buttonFinish")}
          </Button>
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
