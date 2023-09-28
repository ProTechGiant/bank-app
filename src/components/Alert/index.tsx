import { cloneElement, isValidElement } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { FilledCircleTickIcon, InfoFilledCircleIcon, SyncIcon } from "@/assets/icons";
import { useThemeStyles } from "@/theme";

import Typography from "../Typography";
import CloseEndButton, { CloseEndButtonProps } from "./CloseEndButton";
import ExpandEndButton, { ExpandEndButtonProps } from "./ExpandEndButton";

export type AlertVariantType = "success" | "error" | "refresh" | "warning" | "default";

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
          : theme.palette["warningBase-30"],
      borderRadius: theme.radii.small,
      paddingHorizontal: theme.spacing["16p"],
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
        ? theme.palette["errorBase-10"]
        : variant === "default"
        ? theme.palette["neutralBase+10"]
        : theme.palette.warningBase,
    [variant]
  );

  const Icon =
    variant === "success" ? <FilledCircleTickIcon /> : variant === "refresh" ? <SyncIcon /> : <InfoFilledCircleIcon />;

  return (
    <View style={container} testID={testID}>
      {cloneElement(Icon, {
        height: 20,
        width: 20,
        color: iconColor,
      })}
      <View style={styles.messageStyle}>
        <Typography.Text color={variant === "default" ? "neutralBase+10" : "neutralBase+30"} size="footnote">
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
