import React from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon, UserIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

interface WorkGuideCardProps {
  onPress: () => void;
}

export default function WorkGuideCard({ onPress }: WorkGuideCardProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    gap: theme.spacing["20p"],
    alignItems: "flex-start",
    width: "100%",
  }));

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    top: theme.spacing["4p"],
  }));

  const centerTextContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "space-between",
    gap: theme.spacing["4p"],
  }));

  return (
    <Pressable style={containerStyle} onPress={onPress}>
      <View style={iconContainerStyle}>
        <UserIcon width={16} height={16} color={palette.complimentBase} />
      </View>
      <View style={centerTextContainerStyle}>
        <Typography.Text size="callout">{t("Onboarding.LandingScreen.pending.workGuide")}</Typography.Text>
        <Typography.Text size="footnote" color="neutralBase">
          {t("Onboarding.LandingScreen.pending.finishLater")}
        </Typography.Text>
      </View>
      <View style={styles.chevronRightIconContainer}>
        <ChevronRightIcon color={palette["neutralBase-30"]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chevronRightIconContainer: {
    alignSelf: "center",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
