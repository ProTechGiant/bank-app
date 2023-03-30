import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface CardBannerProps {
  title: string;
  subtitle: string;
  actionTitle?: string;
  icon?: React.ReactElement<SvgProps | IconProps>;
  onClose?: () => void;
  onActionPress?: () => void;
}

export default function CardBanner({ title, subtitle, actionTitle, icon, onClose, onActionPress }: CardBannerProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.spacing["8p"],
    padding: theme.spacing["20p"],
    gap: theme.spacing["8p"],
    margin: theme.spacing["20p"],
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
              {title}
            </Typography.Text>

            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {subtitle}
            </Typography.Text>

            {actionTitle !== undefined ? (
              <Pressable onPress={onActionPress} style={buttonContainerStyles}>
                <Typography.Text color="neutralBase+30" size="footnote" weight="medium">
                  {actionTitle}
                </Typography.Text>
              </Pressable>
            ) : null}
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
