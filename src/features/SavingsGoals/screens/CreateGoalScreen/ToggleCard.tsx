import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface ToggleCardProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  helperText: string;
  onInfoPress?: () => void;
  position?: "alone" | "first" | "last" | "middle";
}

export default function ToggleCard<T extends FieldValues>({
  control,
  helperText,
  label,
  name,
  onInfoPress,
  position = "alone",
}: ToggleCardProps<T>) {
  const { field } = useController({ control, name });

  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignContent: "center",
      backgroundColor: theme.palette["neutralBase-50"],
      borderTopStartRadius: position === "alone" || position === "first" ? theme.radii.small : undefined,
      borderTopEndRadius: position === "alone" || position === "first" ? theme.radii.small : undefined,
      borderBottomStartRadius: position === "alone" || position === "last" ? theme.radii.small : undefined,
      borderBottomEndRadius: position === "alone" || position === "last" ? theme.radii.small : undefined,
      flexDirection: "row",
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["16p"],
      justifyContent: "space-between",
    }),
    [position]
  );

  const infoIconStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["4p"],
  }));

  const helperTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
  }));

  const infoDimensions = useThemeStyles(theme => theme.iconDimensions.createGoal.info);
  const infoColor = useThemeStyles(theme => theme.palette["neutralBase-10"]);

  return (
    <View style={containerStyle}>
      <View style={styles.container}>
        <View style={styles.label}>
          <Typography.Text color="neutralBase+30" size="callout">
            {label}
          </Typography.Text>
          {undefined !== onInfoPress && (
            <Pressable onPress={onInfoPress} style={infoIconStyle}>
              <InfoCircleIcon color={infoColor} width={infoDimensions} height={infoDimensions} />
            </Pressable>
          )}
        </View>
        {!!helperText && (
          <View style={helperTextStyle}>
            <Typography.Text color="neutralBase" size="footnote">
              {helperText}
            </Typography.Text>
          </View>
        )}
      </View>
      <View style={styles.switch}>
        <Toggle onPress={() => field.onChange(!field.value)} value={field.value} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.75,
  },
  label: {
    flexDirection: "row",
  },
  switch: {
    alignSelf: "center",
  },
});
