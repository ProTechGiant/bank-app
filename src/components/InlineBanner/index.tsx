import { cloneElement } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { CloseIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface InlineBannerProps {
  icon?: React.ReactElement<SvgProps>;
  text: string;
  testID?: string;
  onClose?: () => void;
  variant?: "default" | "error";
}

export default function InlineBanner({ icon, text, testID, onClose, variant = "default" }: InlineBannerProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "flex-start",
      backgroundColor: variant === "default" ? theme.palette["neutralBase-40"] : theme.palette["errorBase-30"],
      borderRadius: theme.radii.small,
      columnGap: theme.spacing["12p"],
      flexDirection: "row",
      padding: theme.spacing["20p"],
    }),
    [variant]
  );

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <View style={containerStyles} testID={testID}>
      {icon !== undefined && <View>{cloneElement(icon, { color: iconColor })}</View>}
      <Typography.Text color="neutralBase+30" size="footnote" weight="regular" style={styles.text}>
        {text}
      </Typography.Text>
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
  text: {
    flexShrink: 1,
    flexWrap: "wrap",
  },
});
