import { cloneElement } from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface InfoBoxProps {
  borderPosition?: "start" | "end";
  children?: React.ReactNode;
  title?: string;
  variant: "compliment" | "success" | "error" | "primary";
  icon?: React.ReactElement<SvgProps | IconProps>;
}

export default function InfoBox({ borderPosition = "start", title, children, variant, icon }: InfoBoxProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: variant === "primary" ? theme.palette["supportBase-20"] : theme.palette.transparent,
      borderColor:
        variant === "compliment"
          ? theme.palette.complimentBase
          : variant === "success"
          ? theme.palette["primaryBase-70"]
          : variant === "error"
          ? theme.palette.errorBase
          : theme.palette["primaryBase-70"],
      padding: theme.spacing["16p"],
      borderStartWidth: borderPosition === "start" ? 4 : undefined,
      borderEndWidth: borderPosition === "end" ? 4 : undefined,
      borderRadius: theme.radii.regular,
      width: "100%",
    }),
    [borderPosition, variant]
  );

  const titleStyle = useThemeStyles<TextStyle>(theme => ({
    marginHorizontal: theme.spacing["4p"],
  }));

  return (
    <View style={container}>
      {title && (
        <View style={styles.titleContainerStyle}>
          {icon ? cloneElement(icon) : null}
          <Typography.Text size="caption2" color="neutralBase+20" weight="regular" style={titleStyle}>
            {title}
          </Typography.Text>
        </View>
      )}
      {children && <Typography.Text size="caption2">{children}</Typography.Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainerStyle: { alignItems: "center", flexDirection: "row", justifyContent: "flex-start" },
});
