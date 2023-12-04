import { cloneElement, isValidElement } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { FilledCircleTickIcon, InfoCircleIcon, SyncIcon } from "@/assets/icons";
import { InfoRectangleIcon } from "@/assets/icons/InfoRectangleIcon";
import { useThemeStyles } from "@/theme";

import Typography from "../Typography";
import CloseEndButton, { CloseEndButtonProps } from "./CloseEndButton";
import ExpandEndButton, { ExpandEndButtonProps } from "./ExpandEndButton";

export type AlertVariantType = "success" | "error" | "refresh" | "warning" | "default" | "refresh-dark";

export interface AlertProps {
  variant: AlertVariantType;
  message: string;
  end?: React.ReactElement<ExpandEndButtonProps> | React.ReactElement<CloseEndButtonProps>;
  endTestId?: string;
  isExpanded?: boolean;
  children?: React.ReactNode;
  testID?: string;
}

function Alert({ variant, message, end, endTestId, isExpanded, children, testID }: AlertProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      backgroundColor:
        variant === "success"
          ? theme.palette["successBase-30"]
          : variant === "error"
          ? theme.palette["errorBase-30"]
          : variant === "default"
          ? theme.palette["neutralBase-40"]
          : variant === "refresh-dark"
          ? theme.palette.primaryBase
          : theme.palette["warningBase-30"],
      borderRadius: theme.radii.regular,
      paddingHorizontal: theme.spacing["12p"],
      paddingVertical: theme.spacing["16p"],
      gap: theme.spacing["12p"],
      justifyContent: "center",
    }),
    [variant]
  );

  const iconColor = useThemeStyles<string>(
    theme =>
      variant === "success"
        ? theme.palette.successBase
        : variant === "error"
        ? theme.palette["neutralBase+30"]
        : variant === "refresh-dark"
        ? theme.palette["warningBase-10"]
        : variant === "default"
        ? theme.palette["neutralBase+10"]
        : theme.palette["neutralBase+30"],
    [variant]
  );

  const Icon =
    variant === "success" ? (
      <FilledCircleTickIcon />
    ) : variant === "refresh" || variant === "refresh-dark" ? (
      <SyncIcon />
    ) : variant === "warning" ? (
      <InfoRectangleIcon />
    ) : (
      <InfoCircleIcon />
    );

  return (
    <View style={container} testID={testID}>
      {cloneElement(Icon, {
        height: 20,
        width: 20,
        color: iconColor,
      })}
      <View style={styles.messageStyle}>
        <Typography.Text
          color={
            variant === "default" ? "neutralBase+10" : variant === "refresh-dark" ? "neutralBase-60" : "neutralBase+30"
          }
          size="footnote"
          weight="regular">
          {message}
        </Typography.Text>
        {isExpanded ? children : null}
      </View>
      {end && isValidElement(end) ? cloneElement(end, { testID: endTestId }) : null}
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

export default Alert;
