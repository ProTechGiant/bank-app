import { useState } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ToggleCardsProps {
  label: string;
  helperText: string;
  hasInfoIcon?: boolean;
  toggleValue: boolean;
  infoIconOnPress?: () => void;
  onPress: (value: boolean) => void;
}

export default function ToggleCards({
  label,
  helperText,
  hasInfoIcon = false,
  toggleValue = false,
  infoIconOnPress,
  onPress,
}: ToggleCardsProps) {
  const switchContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      paddingVertical: theme.spacing.medium,
      justifyContent: "space-between",
      alignContent: "center",
    }),
    []
  );
  const infoIconStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing.xsmall,
    }),
    []
  );
  const helperTextStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing.xsmall,
    }),
    []
  );

  const infoDimensions = useThemeStyles<number>(theme => theme.iconDimensions.createGoal.info, []);
  const infoColor = useThemeStyles<string>(theme => theme.palette["neutralBase-10"], []);

  return (
    <View style={switchContainerStyle}>
      <View style={{ flex: 1 }}>
        <View style={styles.labelContainer}>
          <Typography.Text color="neutralBase+30" size="callout">
            {label}
          </Typography.Text>
          {hasInfoIcon && (
            <Pressable onPress={infoIconOnPress} style={infoIconStyle}>
              <InfoCircleIcon color={infoColor} width={infoDimensions} height={infoDimensions} />
            </Pressable>
          )}
        </View>
        <View style={helperTextStyle}>
          <Typography.Text color="neutralBase" size="footnote">
            {helperText}
          </Typography.Text>
        </View>
      </View>
      <View style={styles.switch}>
        <Toggle value={toggleValue} onPress={onPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
  },
  switch: {
    alignSelf: "center",
  },
});
