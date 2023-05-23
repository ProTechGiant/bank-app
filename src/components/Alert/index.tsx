import { cloneElement, isValidElement } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import { useThemeStyles } from "@/theme";

import Typography from "../Typography";
import CloseEndButton, { CloseEndButtonProps } from "./CloseEndButton";
import ExpandEndButton, { ExpandEndButtonProps } from "./ExpandEndButton";

export type AlertColorType = "successBase-30" | "errorBase-30" | "warningBase-30" | "neutralBase-40";

export interface AlertProps {
  color: AlertColorType;
  icon: React.ReactElement<SvgProps | IconProps>;
  message: string;
  end?: React.ReactElement<ExpandEndButtonProps> | React.ReactElement<CloseEndButtonProps> | false;
  endTestId?: string;
}

export default function Alert({ color, icon: Icon, message, end, endTestId }: AlertProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      backgroundColor:
        color === "successBase-30"
          ? theme.palette["successBase-30"]
          : color === "errorBase-30"
          ? theme.palette["errorBase-30"]
          : color === "warningBase-30"
          ? theme.palette["warningBase-30"]
          : theme.palette["neutralBase-40"],
      borderRadius: theme.radii.extraSmall,
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["8p"],
    }),
    [color]
  );

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing["16p"],
  }));

  const endStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing["16p"],
  }));

  const iconColor = useThemeStyles<string>(
    theme =>
      color === "successBase-30"
        ? theme.palette.successBase
        : color === "errorBase-30"
        ? theme.palette["errorBase-10"]
        : color === "warningBase-30"
        ? theme.palette.warningBase
        : theme.palette["neutralBase+10"],
    [color]
  );

  return (
    <View style={container}>
      <View style={iconStyle}>
        {cloneElement(Icon, {
          height: 24,
          width: 24,
          color: iconColor,
        })}
      </View>
      <View style={styles.messageStyle}>
        <Typography.Text size="callout">{message}</Typography.Text>
      </View>
      {end && (
        <View style={endStyle}>{end && isValidElement(end) ? cloneElement(end, { testID: endTestId }) : null}</View>
      )}
    </View>
  );
}

Alert.CloseEndButton = CloseEndButton;
Alert.ExpandEndButton = ExpandEndButton;

const styles = StyleSheet.create({
  messageStyle: {
    flex: 1,
  },
});
