import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface CardExpiryBannerProps {
  icon?: React.ReactElement<SvgProps | IconProps>;
  onClose?: () => void;
}

export default function CardExpiryBanner({ icon, onClose }: CardExpiryBannerProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.spacing["8p"],
    padding: theme.spacing["20p"],
    gap: theme.spacing["8p"],
  }));

  const buttonContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.radii.medium,
    paddingVertical: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["16p"],
  }));

  return (
    <View style={containerStyle}>
      <Stack direction="horizontal">
        <View style={styles.contentContainer}>
          <Stack direction="vertical" gap="10p">
            <Typography.Text size="callout" weight="medium" color="neutralBase+30">
              {t("CardActions.CardExpiryNotification.title")}
            </Typography.Text>

            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("CardActions.CardExpiryNotification.content")}
            </Typography.Text>

            <Pressable style={buttonContainerStyles}>
              <Typography.Text color="neutralBase+30" size="footnote" weight="medium">
                {t("CardActions.CardExpiryNotification.button")}
              </Typography.Text>
            </Pressable>
          </Stack>
        </View>

        {icon !== undefined && <Pressable onPress={onClose}>{icon}</Pressable>}
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
