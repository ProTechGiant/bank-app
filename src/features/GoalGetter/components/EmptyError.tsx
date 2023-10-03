import { cloneElement } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { CancelCircleFilledIcon, IconProps, WarningFilledCircleIcon } from "@/assets/icons";
import { ButtonProps } from "@/components/Button";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface EmptyErrorProps {
  buttons?:
    | {
        primary?: React.ReactElement<ButtonProps>;
      }
    | false;
  message?: string;
  isVisible: boolean;
  title: string;
  variant: "error" | "warning";
  icon?: React.ReactElement<SvgProps | IconProps>;
}

const VARIANT_ICONS = {
  error: <CancelCircleFilledIcon />,
  warning: <WarningFilledCircleIcon />,
};

export default function EmptyError({ buttons, message, isVisible, title, variant, icon }: EmptyErrorProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginTop: theme.spacing["16p"],
    marginHorizontal: theme.spacing["48p"],
    width: "100%",
  }));

  const variantIconStyles = useThemeStyles<IconProps>(
    ({ palette }) => ({
      ...styles.iconStyles,
      color: palette.errorBase,
    }),
    [variant]
  );

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    width: "80%",
  }));

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    width: "100%",
  }));

  return isVisible ? (
    <View style={containerStyle}>
      <View>{cloneElement(VARIANT_ICONS[variant], variantIconStyles)}</View>
      {icon !== undefined ? <View>{cloneElement(icon)}</View> : null}
      <Stack direction="vertical" gap="16p" align="center" style={contentStyle}>
        <Typography.Text color="neutralBase+30" weight="bold" size="title1" align="center">
          {title}
        </Typography.Text>
        {message !== undefined ? (
          <Typography.Text color="neutralBase+10" weight="regular" size="callout" align="center">
            {message}
          </Typography.Text>
        ) : null}
      </Stack>
      {buttons !== undefined && buttons !== false ? (
        <Stack align="center" direction="vertical" style={buttonsContainerStyle}>
          {buttons.primary !== undefined ? cloneElement(buttons.primary) : null}
        </Stack>
      ) : null}
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  iconStyles: {
    height: 78,
    width: 81,
  },
});
