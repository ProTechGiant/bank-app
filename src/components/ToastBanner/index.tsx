import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { CloseIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ToastBannerProps {
  icon?: React.ReactElement<SvgProps>;
  title: string;
  message: string;
  testID?: string;
  onClose?: () => void;
}

export default function ToastBanner({ icon, title, message, testID, onClose }: ToastBannerProps) {
  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.extraSmall,
    flexDirection: "row",
    padding: theme.spacing["20p"],
    position: "relative",
  }));

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"], []);

  return (
    <View style={containerStyles} testID={testID}>
      {icon !== undefined && <View style={styles.iconContainer}>{icon}</View>}
      <View style={{ flex: 1 }}>
        <Typography.Text color="neutralBase+30" size="callout" weight="medium" style={titleStyle}>
          {title}
        </Typography.Text>
        <Typography.Text color="neutralBase" size="footnote" weight="regular">
          {message}
        </Typography.Text>
      </View>
      {onClose !== undefined && (
        <View>
          <Pressable onPress={onClose} testID={undefined !== testID ? `${testID}-->CloseButton` : undefined}>
            <CloseIcon color={iconColor} />
          </Pressable>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  iconContainer: {
    marginTop: 2,
    width: 32,
  },
});
