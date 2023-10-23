import { StackActions } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";
import { TextStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import welcomeImage from "../assets/images/WelcomeImage.png";
import { useAllInOneCardContext } from "../contexts/AllInOneCardContext";

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const { setAllInOneCardStatus } = useAuthContext();
  const navigation = useNavigation();
  const { cardType } = useAllInOneCardContext();

  const title =
    cardType === undefined || cardType === "neraPlus"
      ? t("AllInOneCard.WelcomeScreen.neraPlusTitle")
      : t("AllInOneCard.WelcomeScreen.neraTitle");

  const description =
    cardType === undefined || cardType === "neraPlus"
      ? t("AllInOneCard.WelcomeScreen.neraPlusDescription")
      : t("AllInOneCard.WelcomeScreen.neraDescription");

  useEffect(() => {
    setAllInOneCardStatus("active");
  }, []);

  const containerStyle = useThemeStyles<TextStyle>(theme => ({
    marginVertical: theme.spacing["32p"],
  }));

  const handleShowCard = () => {
    navigation.dispatch(StackActions.pop(5));
    navigation.navigate("Home.HomeTabs", { screen: "Cards" });
  };
  return (
    <Page backgroundColor="neutralBase-60">
      <ContentContainer>
        <View style={styles.container}>
          <Stack flex={1} direction="vertical">
            <Stack direction="vertical" align="center">
              <Image resizeMode="contain" source={welcomeImage} />
              <Stack direction="vertical" align="center" gap="24p" justify="space-between" style={containerStyle}>
                <Typography.Header size="large" weight="bold" align="center" color="neutralBase+30">
                  {title}
                </Typography.Header>
                <Typography.Text size="callout" weight="regular" align="center" color="neutralBase+10">
                  {description}
                </Typography.Text>
              </Stack>
            </Stack>
          </Stack>
          <Button onPress={handleShowCard}>{t("AllInOneCard.WelcomeScreen.viewCardButton")}</Button>
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
