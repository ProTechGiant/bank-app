import { cloneElement } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { CloseIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface InlineBannerProps {
  icon?: React.ReactElement<SvgProps>;
  text: string;
  testID?: string;
  onClose?: () => void;
  variant?: "default" | "error" | "info";
}

export default function InlineBanner({ icon, text, testID, onClose, variant = "default" }: InlineBannerProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "flex-start",
      backgroundColor: variant === "error" ? theme.palette["errorBase-30"] : theme.palette["neutralBase-40"],
      borderRadius: theme.radii.small,
      justifyContent: "center",
      flexDirection: "row",
      padding: theme.spacing["20p"],
      width: "100%",
    }),
    [variant]
  );

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingRight: theme.spacing["16p"],
  }));

  const textStyle = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing["85%"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <View style={containerStyles} testID={testID}>
      {icon !== undefined && <View style={iconContainerStyle}>{cloneElement(icon, { color: iconColor })}</View>}
      <Typography.Text
        color={variant === "info" ? "neutralBase+10" : "neutralBase+30"}
        size="footnote"
        weight="regular"
        style={textStyle}>
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
