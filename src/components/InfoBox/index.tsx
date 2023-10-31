import { cloneElement } from "react";
import { TextStyle, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import { WithShadow } from "@/components";
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
      borderColor:
        variant === "compliment"
          ? theme.palette.complimentBase
          : variant === "success"
          ? theme.palette.successBase
          : variant === "error"
          ? theme.palette.errorBase
          : theme.palette["primaryBase-40"],
      borderStartWidth: borderPosition === "start" ? 4 : undefined,
      borderEndWidth: borderPosition === "end" ? 4 : undefined,
      borderRadius: theme.radii.extraSmall,
      width: "100%",
    }),
    [borderPosition, variant]
  );

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: theme.spacing["8p"],
    padding: theme.spacing["16p"],
  }));

  const titleStyle = useThemeStyles<TextStyle>(theme => ({
    marginHorizontal: theme.spacing["4p"],
  }));

  return (
    <View style={container}>
      <WithShadow backgroundColor="neutralBase-50" borderRadius="extraSmall" elevation={6}>
        {title && (
          <View style={titleContainerStyle}>
            {icon ? cloneElement(icon) : null}
            <Typography.Text size="footnote" weight="semiBold" style={titleStyle}>
              {title}
            </Typography.Text>
          </View>
        )}
        {children && <Typography.Text size="caption1">{children}</Typography.Text>}
      </WithShadow>
    </View>
  );
}
