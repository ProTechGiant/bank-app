import { cloneElement } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { CloseIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import InlineBannerButton, { InlineBannerButtonProps } from "./InlineBannerButton";

interface InlineBannerProps {
  action?: React.ReactElement<InlineBannerButtonProps>;
  icon?: React.ReactElement<SvgProps>;
  text: string;
  title?: string;
  testID?: string;
  onClose?: () => void;
  variant?: "default" | "error" | "info";
}

InlineBanner.Button = InlineBannerButton;
function InlineBanner({ action, icon, text, title, testID, onClose, variant = "default" }: InlineBannerProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "flex-start",
      backgroundColor: variant === "error" ? theme.palette["errorBase-40"] : theme.palette["neutralBase-40"],
      borderRadius: theme.radii.small,
      columnGap: theme.spacing["12p"],
      justifyContent: "space-between",
      flexDirection: "row",
      padding: theme.spacing["20p"],
      width: "100%",
    }),
    [variant]
  );

  const textColor = variant === "info" ? "neutralBase+10" : title !== undefined ? "neutralBase" : "neutralBase+30";
  const iconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <View style={containerStyles} testID={testID}>
      {icon !== undefined ? <View>{cloneElement(icon, { color: iconColor })}</View> : null}
      <Stack align="stretch" direction="vertical" gap="8p" style={styles.text}>
        {title !== undefined ? (
          <Typography.Text color="neutralBase+30" size="callout" weight="medium">
            {title}
          </Typography.Text>
        ) : null}
        <Typography.Text color={textColor} size="footnote" weight="regular">
          {text}
        </Typography.Text>
        {action}
      </Stack>
      {onClose !== undefined ? (
        <Pressable onPress={onClose} testID={undefined !== testID ? `${testID}-CloseButton` : undefined}>
          <CloseIcon color={iconColor} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    flexShrink: 1,
  },
});

export default InlineBanner;
