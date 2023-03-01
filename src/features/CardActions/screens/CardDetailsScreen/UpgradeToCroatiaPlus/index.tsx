import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import BackgroundSvg from "./background-overlay.svg";

interface UpgradeToCroatiaPlusProps {
  onPress: () => void;
}

export default function UpgradeToCroatiaPlus({ onPress }: UpgradeToCroatiaPlusProps) {
  const { t } = useTranslation();

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#00000066",
    borderRadius: 24,
    paddingVertical: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["16p"],
  }));

  const contentStyles = useThemeStyles<ViewStyle>(theme => ({
    ...StyleSheet.absoluteFillObject,
    height: IMAGE_HEIGHT,
    width: IMAGE_WIDTH,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: theme.spacing["20p"],
  }));

  return (
    <View style={{ height: IMAGE_HEIGHT, width: IMAGE_WIDTH }}>
      <BackgroundSvg />
      <View style={contentStyles}>
        <Stack align="stretch" direction="vertical" gap="8p">
          <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold" style={styles.header}>
            {t("CardActions.CardDetailsScreen.upgradeToCroatiaPlus.breadcrumb")}
          </Typography.Text>
          <Typography.Text color="neutralBase-50" size="title2" weight="semiBold">
            {t("CardActions.CardDetailsScreen.upgradeToCroatiaPlus.header")}
          </Typography.Text>
          <Typography.Text color="neutralBase-50" size="footnote" weight="regular">
            {t("CardActions.CardDetailsScreen.upgradeToCroatiaPlus.content")}
          </Typography.Text>
        </Stack>
        <Pressable onPress={onPress} style={buttonStyle}>
          <Typography.Text size="footnote" weight="medium" color="neutralBase-50">
            {t("CardActions.CardDetailsScreen.upgradeToCroatiaPlus.button")}
          </Typography.Text>
        </Pressable>
      </View>
    </View>
  );
}

const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 196;

const styles = StyleSheet.create({
  header: {
    letterSpacing: 1.8,
    opacity: 0.6,
    textTransform: "uppercase",
  },
});
