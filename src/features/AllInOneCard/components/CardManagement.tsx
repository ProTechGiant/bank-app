import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { AppleWalletIcon, AppleWalletIconAr, GiftIcon, TopSlantBorder } from "../assets/icons";
import CardSettings from "./CardSettings";

export default function CardManagement() {
  const { t } = useTranslation();

  const dividerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing["4p"],
    backgroundColor: theme.palette["neutralBase-40"],
    width: "100%",
    marginVertical: theme.spacing["12p"],
  }));
  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["20p"],
    marginTop: -theme.spacing["8p"],
  }));
  const getCardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    marginVertical: theme.spacing["12p"],
  }));
  const appleWalletBtnContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.hightTriangle}>
        <TopSlantBorder />
      </View>
      <ScrollView style={contentContainerStyle}>
        <View style={styles.content}>
          <View style={appleWalletBtnContainerStyle}>
            <Pressable>
              {I18nManager.isRTL ? <AppleWalletIconAr width="100%" /> : <AppleWalletIcon width="100%" />}
            </Pressable>
          </View>
          <View style={dividerStyle} />
          <Stack direction="horizontal" justify="space-between" align="center" style={getCardContainerStyle}>
            <Stack direction="horizontal" align="center" gap="16p">
              <GiftIcon />
              <Typography.Text weight="medium" size="callout">
                {t("AllInOneCard.CardControlScreen.getCard")}
              </Typography.Text>
            </Stack>
            <View style={styles.transformArrow}>
              <ChevronRightIcon color="#ACABBA" />
            </View>
          </Stack>
          <View style={dividerStyle} />
          <CardSettings />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: "#fff",
    flex: 1,
  },
  hightTriangle: {
    height: 44,
  },
  transformArrow: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
