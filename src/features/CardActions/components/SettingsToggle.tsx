import { cloneElement } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface SettingsToggleProps {
  icon?: React.ReactElement<SvgProps | IconProps>;
  label: string;
  helperText: string;
  onPress: () => void;
  disabled?: boolean;
  value: boolean;
}

export default function SettingsToggle({ icon, helperText, onPress, label, disabled, value }: SettingsToggleProps) {
  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    alignContent: "center",
    flexDirection: "row",
    paddingVertical: theme.spacing["16p"],
    width: "100%",
  }));

  const helperTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
  }));

  const disabledIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);
  const iconColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  return (
    <View style={containerStyles}>
      {icon !== undefined && (
        <View style={styles.iconContainer}>
          {cloneElement(icon, { color: disabled ? disabledIconColor : iconColor, height: 24, width: 24 })}
        </View>
      )}
      <View style={styles.container}>
        <Typography.Text color={disabled ? "neutralBase-30" : "neutralBase+30"} size="callout" weight="medium">
          {label}
        </Typography.Text>
        {undefined !== helperText && (
          <View style={helperTextStyle}>
            <Typography.Text color={disabled ? "neutralBase-30" : "neutralBase+30"} size="footnote">
              {helperText}
            </Typography.Text>
          </View>
        )}
      </View>
      <View style={styles.switch}>
        <Toggle disabled={disabled} onPress={onPress} value={value} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    justifyContent: "center",
    marginRight: 18,
  },
  switch: {
    alignSelf: "center",
  },
});
