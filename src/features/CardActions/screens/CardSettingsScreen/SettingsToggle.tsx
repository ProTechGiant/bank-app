import { Control, FieldValues, Path, useController } from "react-hook-form";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface SettingsToggleProps<T extends FieldValues> {
  control: Control<T>;
  icon?: React.ReactElement<SvgProps | IconProps>;
  name: Path<T>;
  label: string;
  helperText: string;
  disabled?: boolean;
}

export default function SettingsToggle<T extends FieldValues>({
  control,
  icon,
  helperText,
  label,
  name,
  disabled,
}: SettingsToggleProps<T>) {
  const { field } = useController({ control, name });

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    alignContent: "center",
    flexDirection: "row",
    paddingVertical: theme.spacing["16p"],
    height: 73,
  }));

  const helperTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
  }));

  return (
    <View style={containerStyles}>
      {icon !== undefined && <View style={styles.iconContainer}>{icon}</View>}
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
        <Toggle disabled={disabled} onPress={() => field.onChange(!field.value)} value={field.value} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  iconContainer: {
    justifyContent: "center",
    marginRight: 18,
  },
  switch: {
    alignSelf: "center",
  },
});
