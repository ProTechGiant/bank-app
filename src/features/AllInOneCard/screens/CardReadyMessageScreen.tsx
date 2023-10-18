import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";
import { TextStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import CardReadyMessage from "../assets/images/CardReadyMessage.png";

export default function CardReadyMessageScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const containerStyle = useThemeStyles<TextStyle>(theme => ({
    marginVertical: theme.spacing["32p"],
  }));

  const handleActivateCard = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.CreatePINScreen" });
  };
  const handleOnClose = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.Dashboard" });
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader end={<NavHeader.CloseEndButton onPress={handleOnClose} />} withBackButton={false} />
      <ContentContainer>
        <View style={styles.container}>
          <Stack flex={1} direction="vertical">
            <Stack direction="vertical" align="center">
              <Image resizeMode="contain" source={CardReadyMessage} />
              <Stack direction="vertical" align="center" gap="24p" justify="space-between" style={containerStyle}>
                <Typography.Header size="large" weight="bold" align="center" color="neutralBase+30">
                  {t("AllInOneCard.CardReadyMessageScreen.title")}
                </Typography.Header>
                <Typography.Text size="callout" weight="regular" align="center" color="neutralBase">
                  {t("AllInOneCard.CardReadyMessageScreen.description")}
                </Typography.Text>
              </Stack>
            </Stack>
          </Stack>
          <Button onPress={handleActivateCard}>{t("AllInOneCard.CardReadyMessageScreen.activateCardButton")}</Button>
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
